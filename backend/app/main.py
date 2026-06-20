from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import inspect, text

from app.database import Base, engine

from app.routers.products import router as product_router
from app.routers.customers import router as customer_router
from app.routers.orders import router as order_router

Base.metadata.create_all(bind=engine)


def ensure_order_columns():
    inspector = inspect(engine)
    if "orders" not in inspector.get_table_names():
        return

    existing_columns = {column["name"] for column in inspector.get_columns("orders")}
    statements = []

    if "unit_price" not in existing_columns:
        statements.append("ALTER TABLE orders ADD COLUMN unit_price DOUBLE PRECISION NOT NULL DEFAULT 0")
    if "total_amount" not in existing_columns:
        statements.append("ALTER TABLE orders ADD COLUMN total_amount DOUBLE PRECISION NOT NULL DEFAULT 0")

    with engine.begin() as connection:
        for statement in statements:
            connection.execute(text(statement))


ensure_order_columns()

app = FastAPI(title="Inventory Order Management API")

app.add_middleware(

    CORSMiddleware,

    allow_origins=["*"],  # temporary for debugging

    allow_credentials=True,

    allow_methods=["*"],

    allow_headers=["*"],

)

app.include_router(product_router)
app.include_router(customer_router)
app.include_router(order_router)


@app.get("/")
def root():
    return {
        "status": "running",
        "message": "Inventory Order Management API"
    }
