from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app import crud
from app import schemas

router = APIRouter(prefix="/products", tags=["Products"])


@router.get("/")
def get_products(db: Session = Depends(get_db)):
    return crud.get_products(db)


@router.get("/count")
def count(db: Session = Depends(get_db)):
    return {"count": crud.product_count(db)}


@router.post("/", response_model=schemas.ProductResponse, status_code=status.HTTP_201_CREATED)
def create(product: schemas.ProductCreate, db: Session = Depends(get_db)):
    try:
        return crud.create_product(db, product)
    except ValueError as exc:
        raise HTTPException(status.HTTP_409_CONFLICT, str(exc)) from exc


@router.delete("/{product_id}")
def delete(product_id: int, db: Session = Depends(get_db)):
    result = crud.delete_product(db, product_id)
    return handle_delete_result(result)


@router.delete("/sku/{sku}")
def delete_by_sku(sku: str, db: Session = Depends(get_db)):
    result = crud.delete_product_by_sku(db, sku)
    return handle_delete_result(result)


def handle_delete_result(result: str):
    if result == "not_found":
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Product not found")
    if result == "in_use":
        raise HTTPException(
            status.HTTP_409_CONFLICT,
            "Product cannot be deleted because it is linked to existing orders",
        )

    return {"message": "Deleted"}
