from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app import crud
from app import schemas

router = APIRouter(prefix="/orders", tags=["Orders"])


@router.get("/", response_model=list[schemas.OrderResponse])
def get_orders(db: Session = Depends(get_db)):
    return [crud.serialize_order(order) for order in crud.get_orders(db)]


@router.get("/count")
def count(db: Session = Depends(get_db)):
    return {"count": crud.order_count(db)}


@router.post("/", response_model=schemas.OrderResponse, status_code=status.HTTP_201_CREATED)
def create(order: schemas.OrderCreate, db: Session = Depends(get_db)):
    try:
        created_order = crud.create_order(db, order)
        return crud.serialize_order(created_order)
    except LookupError as exc:
        raise HTTPException(status.HTTP_404_NOT_FOUND, str(exc)) from exc
    except ValueError as exc:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, str(exc)) from exc


@router.delete("/{order_id}")
def delete(order_id: int, db: Session = Depends(get_db)):
    result = crud.delete_order(db, order_id)
    if result == "not_found":
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Order not found")

    return {"message": "Order cancelled and deleted"}
