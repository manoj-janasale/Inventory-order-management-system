from pydantic import BaseModel
from pydantic import ConfigDict


class ProductCreate(BaseModel):
    name: str
    sku: str
    price: float
    stock: int


class ProductResponse(ProductCreate):
    id: int

    model_config = ConfigDict(from_attributes=True)