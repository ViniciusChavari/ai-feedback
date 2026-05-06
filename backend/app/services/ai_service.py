from groq import Groq
import os

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

def gerar_feedback(nome, score, dados_avaliacao):
    nivel = "excepcional, acima da meta estabelecida" if score > 100 else "dentro da meta" if score >= 85 else "abaixo da meta"
    
    prompt = f"""
    Você é um gestor experiente e respeitoso de uma grande empresa.

    Funcionário: {nome}
    Score geral: {score} ({nivel})
    {dados_avaliacao}

    Gere um feedback profissional e humano seguindo exatamente esse formato, sem usar asteriscos ou markdown:

    Avaliação e Feedback

    [Parágrafo introdutório personalizado sobre o desempenho geral]

    Ponto Positivo:
    [Descreva o principal ponto forte com base nos dados]

    Ponto de Melhoria:
    [Descreva o principal ponto a melhorar, mesmo que o desempenho seja excepcional]

    Sugestão Prática:
    [Dê uma sugestão concreta e acionável]

    [Parágrafo de encerramento motivador]

    Use linguagem profissional, direta e respeitosa. Nunca use asteriscos, hashtags ou qualquer formatação markdown.
    """

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.7
    )

    return response.choices[0].message.content