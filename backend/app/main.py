from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base
from app.models import Funcionario, Performance, Feedback
from app.routes import funcionarios, avaliacoes

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)

app.include_router(funcionarios.router)
app.include_router(avaliacoes.router)

@app.get("/")
def home():
    return {"msg": "API rodando 🚀"}