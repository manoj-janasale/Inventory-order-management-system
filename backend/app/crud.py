from sqlalchemy.exc import IntegrityError
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.models import Product
from app.models import Customer
from app.models import Order

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
    if has_orders:
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

    product = db.query(Product).filter(Product.id == order.product_id).first()
    if not product:
        raise LookupError("Product not found")

    if product.quantity < order.quantity:
        raise ValueError(
            f"Insufficient inventory. Available stock for {product.name} is {product.quantity}"
        )

    unit_price = float(product.price)
    total_amount = round(unit_price * order.quantity, 2)
    product.quantity -= order.quantity

    obj = Order(
        customer_id=order.customer_id,
        product_id=order.product_id,
        quantity=order.quantity,
        unit_price=unit_price,
        total_amount=total_amount,
        status="Processed",
    )

    db.add(obj)
    db.commit()
    db.refresh(obj)

    return obj


def get_orders(db: Session):
    return db.query(Order).order_by(Order.id.desc()).limit(100).all()


def serialize_order(order: Order):
    return {
        "id": order.id,
        "customer_id": order.customer_id,
        "customer_name": order.customer.name if order.customer else "Unknown",
        "product_id": order.product_id,
        "product_name": order.product.name if order.product else "Unknown",
        "product_sku": order.product.sku if order.product else "Unknown",
        "quantity": order.quantity,
        "unit_price": order.unit_price,
        "total_amount": order.total_amount,
        "status": order.status,
    }


def delete_order(db: Session, order_id: int):

    obj = db.query(Order).filter(Order.id == order_id).first()

    if not obj:
        return "not_found"

    product = db.query(Product).filter(Product.id == obj.product_id).first()
    if product:
        product.quantity += obj.quantity

    db.delete(obj)
    db.commit()

    return "deleted"


def order_count(db: Session):
    return db.query(Order).count()
