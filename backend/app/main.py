from fastapi import FastAPI
from sqlalchemy import text

from app.database import engine

app = FastAPI(
    title="Inventory Management API",
    version="1.0.0",
)


@app.get("/")
def home():
    return {
        "message": "Inventory Management API",
        "status": "running",
    }


@app.get("/health")
def health():
    try:
        with engine.connect() as connection:
            connection.execute(text("SELECT 1"))

        return {
            "status": "healthy",
            "database": "connected",
        }

    except Exception as e:
        return {
            "status": "unhealthy",
            "database": str(e),
        }