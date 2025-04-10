import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import {
  FaEye,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";

import Cabecalho from "../../componentes/Cabecalho";
import Rodape from "../../componentes/Rodape";
import { listarProjetos } from "../../servicos/projetos";
import { listarTarefas } from "../../servicos/tarefas";
import { listarUsuarios } from "../../servicos/usuarios";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

function Dashboard() {
  const navigate = useNavigate();

  const [tarefas, setTarefas] = useState([]);
  const [projetos, setProjetos] = useState([]);
  const [usuarios, setUsuarios] = useState([]);

  const [mostrarPendentes, setMostrarPendentes] = useState(false);
  const [mostrarFazendo, setMostrarFazendo] = useState(false);
  const [mostrarFinalizadas, setMostrarFinalizadas] = useState(false);

  useEffect(() => {
    async function carregarDados() {
      try {
        const resTarefas = await listarTarefas();
        const resProjetos = await listarProjetos();
        const resUsuarios = await listarUsuarios();

        const listaTarefas = resTarefas.data?.content || resTarefas.data;
        const listaProjetos = resProjetos.data?.content || resProjetos.data;
        const listaUsuarios = resUsuarios.data?.content || resUsuarios.data;

        setTarefas(listaTarefas);
        setProjetos(listaProjetos);
        setUsuarios(listaUsuarios);
      } catch (erro) {
        console.error("Erro ao carregar dados do dashboard:", erro);
      }
    }

    carregarDados();
  }, []);

  const pendentes = tarefas.filter((t) => t.status === "PENDENTE");
  const fazendo = tarefas.filter((t) => t.status === "FAZENDO");
  const finalizadas = tarefas.filter((t) => t.status === "FINALIZADA");

  const labels = projetos.map((p) => p.nome);

  const dataVerticalBar = {
    labels,
    datasets: [
      {
        label: "PENDENTE",
        data: labels.map((nome) =>
          tarefas.filter((t) => t.status === "PENDENTE" && t.projeto?.nome === nome).length
        ),
        backgroundColor: "rgba(255, 193, 7, 0.85)",
      },
      {
        label: "FAZENDO",
        data: labels.map((nome) =>
          tarefas.filter((t) => t.status === "FAZENDO" && t.projeto?.nome === nome).length
        ),
        backgroundColor: "rgba(0, 123, 255, 0.85)",
      },
      {
        label: "FINALIZADA",
        data: labels.map((nome) =>
          tarefas.filter((t) => t.status === "FINALIZADA" && t.projeto?.nome === nome).length
        ),
        backgroundColor: "rgba(40, 167, 69, 0.85)",
      },
    ],
  };

  const dataHorizontalBar = {
    labels,
    datasets: [
      {
        label: "ALTA",
        data: labels.map((nome) =>
          tarefas.filter((t) => t.prioridade === "ALTA" && t.projeto?.nome === nome).length
        ),
        backgroundColor: "rgba(220, 53, 69, 0.85)",
      },
      {
        label: "MEDIA",
        data: labels.map((nome) =>
          tarefas.filter((t) => t.prioridade === "MEDIA" && t.projeto?.nome === nome).length
        ),
        backgroundColor: "rgba(0, 123, 255, 0.85)",
      },
      {
        label: "BAIXA",
        data: labels.map((nome) =>
          tarefas.filter((t) => t.prioridade === "BAIXA" && t.projeto?.nome === nome).length
        ),
        backgroundColor: "rgba(40, 167, 69, 0.85)",
      },
    ],
  };

  const dataPieChart = {
    labels: ["ATIVO", "INATIVO"],
    datasets: [
      {
        label: "Usuários",
        data: [
          usuarios.filter((u) => u.status === "ATIVO").length,
          usuarios.filter((u) => u.status === "INATIVO").length,
        ],
        backgroundColor: ["rgba(40, 167, 69, 0.85)", "rgba(220, 53, 69, 0.85)"],
      },
    ],
  };

  return (
    <>
      <Cabecalho />
      <div style={{ backgroundColor: "#0d1b2a", minHeight: "100vh" }}>
        <section className="container py-5 text-white">
          <h2 className="text-center mb-4 fw-bold">Painel Geral</h2>

          <div className="row gy-4 mb-5">
            <div className="col-md-6">
              <div className="p-3 border rounded bg-white shadow-sm" style={{ height: 400 }}>
                <Bar data={dataVerticalBar} options={{ responsive: true, maintainAspectRatio: false }} />
              </div>
            </div>
            <div className="col-md-6">
              <div className="p-3 border rounded bg-white shadow-sm" style={{ height: 400 }}>
                <Bar data={dataHorizontalBar} options={{ indexAxis: "y", responsive: true, maintainAspectRatio: false }} />
              </div>
            </div>
          </div>

          <div className="row text-center mb-5">
            {[
              { status: "PENDENTE", cor: "bg-warning", tarefas: pendentes, toggle: mostrarPendentes, set: setMostrarPendentes },
              { status: "FAZENDO", cor: "bg-primary", tarefas: fazendo, toggle: mostrarFazendo, set: setMostrarFazendo },
              { status: "FINALIZADA", cor: "bg-success", tarefas: finalizadas, toggle: mostrarFinalizadas, set: setMostrarFinalizadas }
            ].map(({ status, cor, tarefas, toggle, set }) => (
              <div className="col-md-4" key={status}>
                <div
                  className={`${cor} text-white p-3 rounded shadow-sm fw-bold`}
                  onClick={() => set(!toggle)}
                  style={{ cursor: "pointer" }}
                >
                  <h5 className="mb-0">{status} ({tarefas.length}) {toggle ? <FaChevronUp /> : <FaChevronDown />}</h5>
                </div>
                {toggle && (
                  <ul className="list-group mt-2">
                    {tarefas.map((t) => (
                      <li key={t.id} className="list-group-item d-flex justify-content-between align-items-center">
                        {t.titulo}
                        <button className="btn btn-outline-secondary btn-sm" onClick={() => navigate(`/tarefas/${t.id}`)}>
                          <FaEye />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>

          <div className="row justify-content-center">
            <div className="col-md-6">
              <div className="p-3 border rounded bg-white shadow-sm" style={{ height: 300 }}>
                <Pie
                  data={dataPieChart}
                  options={{
                    maintainAspectRatio: false,
                    plugins: {
                      legend: { position: "bottom" },
                      title: { display: true, text: "Usuários Ativos vs Inativos" },
                    },
                  }}
                />
              </div>
            </div>
          </div>
        </section>
      </div>
      <Rodape />
    </>
  );
}

export default Dashboard;