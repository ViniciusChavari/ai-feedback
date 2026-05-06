"use client";
import { useState, useEffect } from "react";
import axios from "axios";

const api = axios.create({ baseURL: "https://ai-feedback-production.up.railway.app" });

const criterioInicial = () => ({ metas: "", prazos: "", qualidade: "", trabalho_equipe: "", observacoes: "" });

export default function Home() {
  const [funcionarios, setFuncionarios] = useState([]);
  const [nome, setNome] = useState("");
  const [cargo, setCargo] = useState("");
  const [criterios, setCriterios] = useState({});
  const [resultado, setResultado] = useState(null);
  const [loading, setLoading] = useState(false);

  const carregarFuncionarios = async () => {
    const res = await api.get("/funcionarios");
    setFuncionarios(res.data);
  };

  useEffect(() => {
    carregarFuncionarios();
  }, []);

  const criarFuncionario = async () => {
    if (!nome || !cargo) return;
    await api.post("/funcionarios", { nome, cargo });
    await carregarFuncionarios();
    setNome("");
    setCargo("");
  };

  const excluirFuncionario = async (id) => {
    if (!confirm("Tem certeza que deseja excluir este funcionário?")) return;
    await api.delete(`/funcionarios/${id}`);
    await carregarFuncionarios();
    if (resultado?.funcionario_id === id) setResultado(null);
  };

  const setCriterio = (id, campo, valor) => {
    setCriterios((prev) => ({
      ...prev,
      [id]: { ...criterioInicial(), ...prev[id], [campo]: valor },
    }));
  };

  const gerarFeedback = async (id) => {
    const c = criterios[id] || {};
    if (!c.metas || !c.prazos || !c.qualidade || !c.trabalho_equipe) {
      alert("Preencha todos os critérios antes de gerar o feedback.");
      return;
    }
    setLoading(true);
    setResultado(null);
    const res = await api.post("/avaliacoes", {
      funcionario_id: id,
      metas: parseFloat(c.metas),
      prazos: parseFloat(c.prazos),
      qualidade: parseFloat(c.qualidade),
      trabalho_equipe: parseFloat(c.trabalho_equipe),
      observacoes: c.observacoes || "",
    });
    setResultado(res.data);
    setLoading(false);
  };

  const corFluxo = {
    automatico: "bg-emerald-500",
    revisao: "bg-amber-500",
    critico: "bg-red-500",
  };

  const inputClass = "bg-slate-600 border border-slate-500 text-white placeholder-slate-400 rounded-lg p-2 w-full focus:outline-none focus:border-indigo-500 text-sm";

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-4 sm:p-8">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">AI Feedback Manager</h1>
          <p className="text-slate-400 mt-2 text-base sm:text-lg">Avaliação de desempenho com inteligência artificial</p>
        </div>

        {/* Cadastrar funcionário */}
        <div className="bg-slate-800 rounded-2xl p-4 sm:p-6 mb-6 border border-slate-700">
          <h2 className="text-lg font-semibold text-white mb-4">➕ Novo Funcionário</h2>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              className="bg-slate-700 border border-slate-600 text-white placeholder-slate-400 rounded-xl p-3 w-full focus:outline-none focus:border-indigo-500"
              placeholder="Nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
            />
            <input
              className="bg-slate-700 border border-slate-600 text-white placeholder-slate-400 rounded-xl p-3 w-full focus:outline-none focus:border-indigo-500"
              placeholder="Cargo"
              value={cargo}
              onChange={(e) => setCargo(e.target.value)}
            />
            <button
              onClick={criarFuncionario}
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-6 py-3 rounded-xl transition whitespace-nowrap"
            >
              Adicionar
            </button>
          </div>
        </div>

        {/* Lista de funcionários */}
        <div className="bg-slate-800 rounded-2xl p-4 sm:p-6 mb-6 border border-slate-700">
          <h2 className="text-lg font-semibold text-white mb-4">👥 Equipe</h2>
          <div className="space-y-4">
            {funcionarios.length === 0 && (
              <p className="text-slate-400 text-sm">Nenhum funcionário cadastrado ainda.</p>
            )}
            {funcionarios.map((f) => (
              <div key={f.id} className="bg-slate-700 rounded-xl p-4 sm:p-5 border border-slate-600">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <span className="text-white font-semibold text-base">{f.nome}</span>
                    <span className="text-slate-400 text-sm ml-2">— {f.cargo}</span>
                  </div>
                  <button
                    onClick={() => excluirFuncionario(f.id)}
                    className="text-red-400 hover:text-red-300 text-xs border border-red-400 hover:border-red-300 px-3 py-1 rounded-lg transition"
                  >
                    Excluir
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                  <div>
                    <label className="text-slate-400 text-xs mb-1 block">🎯 Metas atingidas (%)</label>
                    <input className={inputClass} placeholder="0 - 100" value={criterios[f.id]?.metas || ""} onChange={(e) => setCriterio(f.id, "metas", e.target.value)} />
                  </div>
                  <div>
                    <label className="text-slate-400 text-xs mb-1 block">⏰ Prazos cumpridos (%)</label>
                    <input className={inputClass} placeholder="0 - 100" value={criterios[f.id]?.prazos || ""} onChange={(e) => setCriterio(f.id, "prazos", e.target.value)} />
                  </div>
                  <div>
                    <label className="text-slate-400 text-xs mb-1 block">⭐ Qualidade (%)</label>
                    <input className={inputClass} placeholder="0 - 100" value={criterios[f.id]?.qualidade || ""} onChange={(e) => setCriterio(f.id, "qualidade", e.target.value)} />
                  </div>
                  <div>
                    <label className="text-slate-400 text-xs mb-1 block">🤝 Trabalho em equipe (%)</label>
                    <input className={inputClass} placeholder="0 - 100" value={criterios[f.id]?.trabalho_equipe || ""} onChange={(e) => setCriterio(f.id, "trabalho_equipe", e.target.value)} />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="text-slate-400 text-xs mb-1 block">📝 Observações</label>
                  <input className={inputClass} placeholder="Comentários adicionais sobre o desempenho..." value={criterios[f.id]?.observacoes || ""} onChange={(e) => setCriterio(f.id, "observacoes", e.target.value)} />
                </div>

                <button
                  onClick={() => gerarFeedback(f.id)}
                  className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 rounded-lg transition"
                >
                  Gerar Feedback com IA
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700 text-center">
            <p className="text-slate-400 text-lg animate-pulse">⏳ Analisando desempenho e gerando feedback...</p>
          </div>
        )}

        {/* Resultado */}
        {resultado && (
          <div className="bg-slate-800 rounded-2xl p-4 sm:p-6 border border-slate-700">
            <h2 className="text-lg font-semibold text-white mb-1">💬 Feedback — {resultado.funcionario}</h2>
            <p className="text-slate-400 text-sm mb-4">Score geral: <span className="text-white font-bold">{resultado.score}</span>/100</p>
            <div className="flex flex-wrap gap-3 mb-4 items-center">
              <span className={`${corFluxo[resultado.fluxo]} text-white text-xs font-bold px-3 py-1 rounded-full uppercase`}>
                {resultado.fluxo}
              </span>
              <span className="text-slate-400 text-sm">Classificação: <span className="text-slate-200">{resultado.classificacao}</span></span>
            </div>
            <div className="bg-slate-700 rounded-xl p-4 sm:p-5 border border-slate-600">
              <p className="text-slate-200 leading-relaxed whitespace-pre-line">{resultado.feedback}</p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}