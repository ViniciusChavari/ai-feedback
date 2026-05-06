from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.models import Funcionario

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/funcionarios")
def criar_funcionario(data: dict, db: Session = Depends(get_db)):
    funcionario = Funcionario(
        nome=data["nome"],
        cargo=data["cargo"]
    )
    db.add(funcionario)
    db.commit()
    db.refresh(funcionario)
    return {"id": funcionario.id, "nome": funcionario.nome, "cargo": funcionario.cargo}

@router.get("/funcionarios")
def listar_funcionarios(db: Session = Depends(get_db)):
    return db.query(Funcionario).all()

@router.delete("/funcionarios/{funcionario_id}")
def excluir_funcionario(funcionario_id: int, db: Session = Depends(get_db)):
    funcionario = db.query(Funcionario).filter(Funcionario.id == funcionario_id).first()
    if not funcionario:
        return {"erro": "Funcionário não encontrado"}
    db.delete(funcionario)
    db.commit()
    return {"msg": "Funcionário excluído"}