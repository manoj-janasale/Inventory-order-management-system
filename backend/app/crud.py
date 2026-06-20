from sqlalchemy.exc import IntegrityError
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.models import Product
from app.models import Customer
from app.models import Order
from app.models import OrderItem

######################################################
# PRODUCTS
######################################################

def create_product(db: Session, product):
    data = product.model_dump()
    data["sku"] = data["sku"].strip()
    obj = Product(**data)

    db.add(obj)
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise ValueError("Product SKU must be unique")
    db.refresh(obj)

    return obj


def get_products(db: Session):
    return db.query(Product).order_by(Product.id.desc()).limit(100).all()


def delete_product(db: Session, product_id: int):

    obj = db.query(Product).filter(Product.id == product_id).first()
    return delete_product_obj(db, obj)


def delete_product_by_sku(db: Session, sku: str):
    normalized_sku = sku.strip().lower()
    obj = (
        db.query(Product)
        .filter(func.lower(func.trim(Product.sku)) == normalized_sku)
        .first()
    )
    return delete_product_obj(db, obj)


def delete_product_obj(db: Session, obj):
    if not obj:
        return "not_found"

    has_orders = db.query(Order).filter(Order.product_id == obj.id).first()
    has_order_items = db.query(OrderItem).filter(OrderItem.product_id == obj.id).first()
    if has_orders or has_order_items:
        return "in_use"

    db.delete(obj)
    db.commit()

    return "deleted"


def product_count(db: Session):
    return db.query(Product).count()


######################################################
# CUSTOMERS
######################################################

def create_customer(db: Session, customer):
    data = customer.model_dump()
    data["email"] = data["email"].strip().lower()
    obj = Customer(**data)

    db.add(obj)
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise ValueError("Customer email must be unique")
    db.refresh(obj)

    return obj


def get_customers(db: Session):
    return db.query(Customer).order_by(Customer.id.desc()).limit(100).all()


def delete_customer(db: Session, customer_id: int):

    obj = db.query(Customer).filter(Customer.id == customer_id).first()

    if not obj:
        return "not_found"

    has_orders = db.query(Order).filter(Order.customer_id == customer_id).first()
    if has_orders:
        return "in_use"

    db.delete(obj)
    db.commit()

    return "deleted"


def customer_count(db: Session):
    return db.query(Customer).count()


######################################################
# ORDERS
######################################################

def create_order(db: Session, order):
    customer = db.query(Customer).filter(Customer.id == order.customer_id).first()
    if not customer:
        raise LookupError("Customer not found")

    requested_quantities = {}
    for item in order.items:
        requested_quantities[item.product_id] = (
            requested_quantities.get(item.product_id, 0) + item.quantity
        )

    product_ids = list(requested_quantities.keys())
    products = db.query(Product).filter(Product.id.in_(product_ids)).all()
    products_by_id = {product.id: product for product in products}

    missing_product_ids = [product_id for product_id in product_ids if product_id not in products_by_id]
    if missing_product_ids:
        raise LookupError(f"Product not found: {missing_product_ids[0]}")

    for product_id, requested_quantity in requested_quantities.items():
        product = products_by_id[product_id]
        if product.quantity < requested_quantity:
            raise ValueError(
                f"Insufficient inventory. Available stock for {product.name} is {product.quantity}"
            )

    first_product = products_by_id[product_ids[0]]
    total_quantity = sum(requested_quantities.values())
    total_amount = round(
        sum(float(products_by_id[product_id].price) * quantity for product_id, quantity in requested_quantities.items()),
        2,
    )

    for product_id, requested_quantity in requested_quantities.items():
        products_by_id[product_id].quantity -= requested_quantity

    obj = Order(
        customer_id=order.customer_id,
        product_id=first_product.id,
        quantity=total_quantity,
        unit_price=float(first_product.price),
        total_amount=total_amount,
        status="Processed",
    )

    db.add(obj)
    db.flush()

    for product_id, requested_quantity in requested_quantities.items():
        product = products_by_id[product_id]
        unit_price = float(product.price)
        db.add(
            OrderItem(
                order_id=obj.id,
                product_id=product_id,
                quantity=requested_quantity,
                unit_price=unit_price,
                line_total=round(unit_price * requested_quantity, 2),
            )
        )

    db.commit()
    db.refresh(obj)

    return obj


def get_orders(db: Session):
    return db.query(Order).order_by(Order.id.desc()).limit(100).all()


def serialize_order(order: Order):
    items = [
        {
            "product_id": item.product_id,
            "product_name": item.product.name if item.product else "Unknown",
            "product_sku": item.product.sku if item.product else "Unknown",
            "quantity": item.quantity,
            "unit_price": item.unit_price,
            "line_total": item.line_total,
        }
        for item in order.items
    ]

    if not items:
        items = [
            {
                "product_id": order.product_id,
                "product_name": order.product.name if order.product else "Unknown",
                "product_sku": order.product.sku if order.product else "Unknown",
                "quantity": order.quantity,
                "unit_price": order.unit_price,
                "line_total": order.total_amount,
            }
        ]

    return {
        "id": order.id,
        "customer_id": order.customer_id,
        "customer_name": order.customer.name if order.customer else "Unknown",
        "product_id": order.product_id,
        "product_name": items[0]["product_name"] if len(items) == 1 else "Multiple products",
        "product_sku": items[0]["product_sku"] if len(items) == 1 else ", ".join(item["product_sku"] for item in items),
        "quantity": order.quantity,
        "unit_price": order.unit_price,
        "total_amount": order.total_amount,
        "status": order.status,
        "items": items,
    }


def delete_order(db: Session, order_id: int):

    obj = db.query(Order).filter(Order.id == order_id).first()

    if not obj:
        return "not_found"

    if obj.items:
        for item in obj.items:
            product = db.query(Product).filter(Product.id == item.product_id).first()
            if product:
                product.quantity += item.quantity
    else:
        product = db.query(Product).filter(Product.id == obj.product_id).first()
        if product:
            product.quantity += obj.quantity

    db.delete(obj)
    db.commit()

    return "deleted"


def order_count(db: Session):
    return db.query(Order).count()
