def calcular_score(metas, prazos, qualidade, trabalho_equipe):
    return (metas * 0.4) + (prazos * 0.2) + (qualidade * 0.2) + (trabalho_equipe * 0.2)

def classificar(score):
    if score >= 85:
        return "positivo"
    elif score >= 65:
        return "neutro"
    else:
        return "negativo"

def decidir_fluxo(classificacao):
    if classificacao == "positivo":
        return "automatico"
    elif classificacao == "neutro":
        return "revisao"
    else:
        return "critico"