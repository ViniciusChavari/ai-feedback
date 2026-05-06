from groq import Groq
from dotenv import load_dotenv
import os

load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), '..', '..', '.env'))

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

def gerar_feedback(nome, score, observacoes):
    prompt = f"""
    Você é um gestor experiente e respeitoso.

    Funcionário: {nome}
    Score: {score}
    Observações: {observacoes}

    Gere um feedback construtivo, profissional e humano com:
    - Um ponto positivo
    - Um ponto de melhoria
    - Uma sugestão prática

    Seja direto e motivador.
    """

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.7
    )

    return response.choices[0].message.content