from sqlalchemy import Column, Integer, String, Float, Text, ForeignKey
from .database import Base

class Funcionario(Base):
    __tablename__ = "funcionarios"

    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String)
    cargo = Column(String)

class Performance(Base):
    __tablename__ = "performances"

    id = Column(Integer, primary_key=True, index=True)
    funcionario_id = Column(Integer, ForeignKey("funcionarios.id"))
    score = Column(Float)
    observacoes = Column(Text)

class Feedback(Base):
    __tablename__ = "feedbacks"

    id = Column(Integer, primary_key=True, index=True)
    funcionario_id = Column(Integer, ForeignKey("funcionarios.id"))
    performance_id = Column(Integer, ForeignKey("performances.id"))
    classificacao = Column(String)
    fluxo = Column(String)
    texto_ia = Column(Text)
    texto_final = Column(Text)
    status = Column(String)