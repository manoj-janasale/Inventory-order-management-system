from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app import crud
from app import schemas

router = APIRouter(prefix="/customers", tags=["Customers"])


@router.get("/")
def get_customers(db: Session = Depends(get_db)):
    return crud.get_customers(db)


@router.get("/count")
def count(db: Session = Depends(get_db)):
    return {"count": crud.customer_count(db)}


@router.post("/", response_model=schemas.CustomerResponse, status_code=status.HTTP_201_CREATED)
def create(customer: schemas.CustomerCreate, db: Session = Depends(get_db)):
    try:
        return crud.create_customer(db, customer)
    except ValueError as exc:
        raise HTTPException(status.HTTP_409_CONFLICT, str(exc)) from exc


@router.delete("/{customer_id}")
def delete(customer_id: int, db: Session = Depends(get_db)):
    result = crud.delete_customer(db, customer_id)
    if result == "not_found":
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Customer not found")
    if result == "in_use":
        raise HTTPException(
            status.HTTP_409_CONFLICT,
            "Customer cannot be deleted because they are linked to existing orders",
        )

    return {"message": "Deleted"}
