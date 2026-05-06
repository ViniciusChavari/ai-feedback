from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.models import Performance, Feedback, Funcionario
from app.services.performance_service import calcular_score, classificar, decidir_fluxo
from app.services.ai_service import gerar_feedback

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/avaliacoes")
def criar_avaliacao(data: dict, db: Session = Depends(get_db)):
    funcionario = db.query(Funcionario).filter(Funcionario.id == data["funcionario_id"]).first()

    if not funcionario:
        return {"erro": "Funcionário não encontrado"}

    metas = data.get("metas", 0)
    prazos = data.get("prazos", 0)
    qualidade = data.get("qualidade", 0)
    trabalho_equipe = data.get("trabalho_equipe", 0)
    observacoes = data.get("observacoes", "")

    score = calcular_score(metas, prazos, qualidade, trabalho_equipe)

    performance = Performance(
        funcionario_id=funcionario.id,
        score=score,
        observacoes=observacoes
    )
    db.add(performance)
    db.commit()
    db.refresh(performance)

    classificacao = classificar(score)
    fluxo = decidir_fluxo(classificacao)

    dados_avaliacao = f"""
    Metas atingidas: {metas}%
    Prazos cumpridos: {prazos}%
    Qualidade: {qualidade}%
    Trabalho em equipe: {trabalho_equipe}%
    Score geral: {score:.1f}
    Observações: {observacoes}
    """

    texto_ia = gerar_feedback(funcionario.nome, score, dados_avaliacao)

    status = "enviado" if fluxo == "automatico" else "pendente"

    feedback = Feedback(
        funcionario_id=funcionario.id,
        performance_id=performance.id,
        classificacao=classificacao,
        fluxo=fluxo,
        texto_ia=texto_ia,
        texto_final=texto_ia if fluxo == "automatico" else None,
        status=status
    )
    db.add(feedback)
    db.commit()
    db.refresh(feedback)

    return {
        "funcionario": funcionario.nome,
        "score": round(score, 1),
        "classificacao": classificacao,
        "fluxo": fluxo,
        "status": status,
        "feedback": texto_ia
    }