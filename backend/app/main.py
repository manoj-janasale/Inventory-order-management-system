from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="Inventory Management API",
    version="1.0.0"
)

origins = [
    "http://localhost:5173",
    "https://YOUR-VERCEL-URL.vercel.app"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173",          # local dev
        "https://your-frontend.vercel.app" # add after you deploy frontend],  # We'll tighten this later
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {
        "message": "Inventory Management Backend Running 🚀"
    }

@app.get("/health")
def health():
    return {
        "status": "healthy"
    }