import re

from pydantic import BaseModel, Field, field_validator

##########################
# PRODUCTS
##########################

class ProductCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    sku: str = Field(..., min_length=1, max_length=50)
    price: float = Field(..., gt=0)
    quantity: int = Field(..., ge=0)

    @field_validator("name", "sku")
    @classmethod
    def trim_required_text(cls, value: str):
        value = value.strip()
        if not value:
            raise ValueError("Field cannot be empty")
        return value


class ProductResponse(ProductCreate):
    id: int

    class Config:
        from_attributes = True


##########################
# CUSTOMERS
##########################

class CustomerCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    email: str = Field(..., min_length=3, max_length=255)

    @field_validator("name")
    @classmethod
    def trim_name(cls, value: str):
        value = value.strip()
        if not value:
            raise ValueError("Name cannot be empty")
        return value

    @field_validator("email")
    @classmethod
    def validate_email(cls, value: str):
        value = value.strip().lower()
        if not re.match(r"^[^@\s]+@[^@\s]+\.[^@\s]+$", value):
            raise ValueError("Enter a valid email address")
        return value
    
class CustomerResponse(CustomerCreate):
    id: int

    class Config:
        from_attributes = True


##########################
# ORDERS
##########################

class OrderItemCreate(BaseModel):
    product_id: int = Field(..., gt=0)
    quantity: int = Field(..., gt=0)


class OrderCreate(BaseModel):
    customer_id: int = Field(..., gt=0)
    items: list[OrderItemCreate] = Field(..., min_length=1)


class OrderItemResponse(BaseModel):
    product_id: int
    product_name: str
    product_sku: str
    quantity: int
    unit_price: float
    line_total: float


class OrderResponse(BaseModel):
    id: int
    customer_id: int
    customer_name: str
    product_id: int
    product_name: str
    product_sku: str
    quantity: int
    unit_price: float
    total_amount: float
    status: str
    items: list[OrderItemResponse]

    class Config:
        from_attributes = True
