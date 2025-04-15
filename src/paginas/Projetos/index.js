import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "../../componentes/Modal";
import Cabecalho from "../../componentes/Cabecalho";
import Rodape from "../../componentes/Rodape";
import { listarProjetos, excluirProjeto } from "../../servicos/projetos";
import { listarTarefas } from "../../servicos/tarefas";
import logo from "../../assets/sgp_logo_horizontal.png";
import jsPDF from "jspdf";
import { FaFilePdf } from "react-icons/fa";
import autoTable from "jspdf-autotable";


function ListarProjetos() {
  const navigate = useNavigate();
  const [projetos, setProjetos] = useState([]);
  const [tarefas, setTarefas] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [projetoSelecionado, setProjetoSelecionado] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);

  useEffect(() => {
    async function carregarDados() {
      try {
        const resProjetos = await listarProjetos();
        const resTarefas = await listarTarefas();

        const listaProjetos = resProjetos.data.content || resProjetos.data || [];
        const listaTarefas = resTarefas.data.content || resTarefas.data || [];

        setProjetos(listaProjetos);
        setTarefas(listaTarefas);
      } catch (erro) {
        console.error("Erro ao carregar dados:", erro);
        alert("Erro ao carregar projetos ou tarefas.");
      } finally {
        setCarregando(false);
      }
    }

    carregarDados();
  }, []);

  const handleEditar = (id) => navigate(`/projetos/${id}/editar`);
  const handleAbrirModalExcluir = (id) => {
    setProjetoSelecionado(id);
    setMostrarModal(true);
  };

  const handleConfirmarExclusao = async () => {
    try {
      await excluirProjeto(projetoSelecionado);
      setProjetos((prev) => prev.filter((p) => p.id !== projetoSelecionado));
      setMostrarModal(false);
    } catch (erro) {
      console.error("Erro ao excluir projeto:", erro);
      alert("Erro ao excluir projeto.");
    }
  };

  const buscarTarefasDoProjeto = (projetoId) => {
    return tarefas.filter((t) => t.projeto?.id === projetoId);
  };

  const handleExportarPdf = () => {
    if (projetos.length === 0) {
      alert("Nenhum projeto para exportar.");
      return;
    }
  
    const doc = new jsPDF("p", "mm", "a4");
    const dataAtual = new Date().toLocaleString("pt-BR");
    const paginaLargura = doc.internal.pageSize.getWidth();
    const paginaAltura = doc.internal.pageSize.getHeight();
  
    // Logomarca
    doc.addImage(logo, "PNG", 10, 10, 25, 25);
  
    // Título
    doc.setFontSize(18);
    doc.setTextColor(13, 27, 42);
    doc.text("RELATÓRIO DE PROJETOS", paginaLargura / 2, 20, { align: "center" });
  
    doc.setFontSize(12);
    doc.setTextColor(80);
    doc.text("Sistema de Gerenciamento", paginaLargura / 2, 28, { align: "center" });
  
    let startY = 40;
  
    projetos.forEach((projeto, index) => {
      const tarefasDoProjeto = tarefas.filter((t) => t.projeto?.id === projeto.id);
  
      doc.setFontSize(12);
      doc.setTextColor(0);
      doc.text(`Projeto: ${projeto.nome}`, 14, startY);
      doc.setFontSize(10);
      doc.text(`Descrição: ${projeto.descricao || "-"}`, 14, startY + 6);
      doc.text(`Responsável: ${projeto.responsavel?.nome || "-"}`, 14, startY + 12);
  
      startY += 20;
  
      autoTable(doc, {
        startY: startY,
        head: [[
          "ID",
          "Título",
          "Descrição",
          "Responsável",
          "Criação",
          "Status"
        ]],
        body: tarefasDoProjeto.map((t) => [
          t.id,
          t.titulo,
          t.descricao || "-",
          t.usuario?.nome || "-",
          t.dataCriacao || "-",
          t.status || "-"
        ]),
        styles: {
          fontSize: 9,
          cellPadding: 3,
          valign: "middle",
        },
        headStyles: {
          fillColor: [13, 27, 42],
          textColor: 255,
          fontStyle: "bold",
        },
        alternateRowStyles: {
          fillColor: [240, 240, 240],
        },
        margin: { left: 14, right: 14 },
        didDrawPage: (data) => {
          const pageNumber = doc.internal.getCurrentPageInfo().pageNumber;
          doc.setFontSize(9);
          doc.setTextColor(100);
          doc.text(`Página ${pageNumber}`, paginaLargura / 2, paginaAltura - 10, { align: "center" });
          doc.text(`Exportado em: ${dataAtual}`, paginaLargura - 10, paginaAltura - 10, { align: "right" });
        },
        willDrawCell: function (data) {
          // Add spacing between tables
          if (data.row.index === tarefasDoProjeto.length - 1) {
            startY = data.cursor.y + 10;
          }
        },
      });
    });
  
    doc.save("relatorio_projetos.pdf");
  };

  return (
    <>
      <Cabecalho />
      <div style={{ backgroundColor: "#0d1b2a", minHeight: "100vh" }}>
        <section className="container py-5">
          <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
            <h2 className="text-white fw-bold mb-0">Projetos Cadastrados</h2>

            <div className="d-flex gap-2">
              <button
                className="btn btn-outline-light btn-sm d-flex align-items-center gap-1"
                onClick={handleExportarPdf}
              >
                <FaFilePdf />
                Exportar PDF
              </button>
              <button className="btn btn-success btn-sm" onClick={() => navigate("/projetos/novo")}>
                + Novo Projeto
              </button>
            </div>
          </div>

          {carregando ? (
            <p className="text-white">Carregando projetos...</p>
          ) : projetos.length === 0 ? (
            <p className="text-white">Nenhum projeto encontrado.</p>
          ) : (
            <div className="row">
              {projetos.map((projeto) => {
                const tarefasDoProjeto = buscarTarefasDoProjeto(projeto.id);

                return (
                  <div key={projeto.id} className="col-12 mb-4">
                    <div className="card shadow border-0 p-4 rounded" style={{ backgroundColor: "#f8f9fa" }}>
                      <h4 className="text-primary fw-bold mb-2">{projeto.nome}</h4>
                      <p><strong>Descrição:</strong> {projeto.descricao}</p>
                      <p><strong>Responsável:</strong> {projeto.responsavel?.nome || "-"}</p>

                      <div className="mt-4">
                        <strong className="text-dark">Tarefas:</strong>
                        {tarefasDoProjeto.length > 0 ? (
                          <div className="table-responsive mt-2">
                            <table className="table table-bordered table-striped table-hover align-middle">
                              <thead className="table-dark text-center">
                                <tr>
                                  <th>ID</th>
                                  <th>Título</th>
                                  <th>Descrição</th>
                                  <th>Responsável</th>
                                  <th>Data de Criação</th>
                                  <th>Status</th>
                                  <th>Ações</th>
                                </tr>
                              </thead>
                              <tbody>
                                {tarefasDoProjeto.map((tarefa) => (
                                  <tr key={tarefa.id} className="text-center">
                                    <td>{tarefa.id}</td>
                                    <td className="text-start">{tarefa.titulo}</td>
                                    <td className="text-start">{tarefa.descricao || "-"}</td>
                                    <td>{tarefa.usuario?.nome || "-"}</td>
                                    <td>{tarefa.dataCriacao}</td>
                                    <td>
                                      <span className={`badge px-3 py-2 fs-6 ${tarefa.status === "FINALIZADA"
                                        ? "bg-success"
                                        : tarefa.status === "FAZENDO"
                                          ? "bg-warning text-dark"
                                          : "bg-secondary"
                                        }`}>
                                        {tarefa.status}
                                      </span>
                                    </td>
                                    <td>
                                      <button
                                        className="btn btn-sm btn-outline-primary me-1"
                                        onClick={() => navigate(`/tarefas/${tarefa.id}/editar`)}
                                      >
                                        Editar
                                      </button>
                                      <button
                                        className="btn btn-sm btn-outline-danger"
                                        onClick={() => alert(`Excluir tarefa ${tarefa.id}`)}
                                      >
                                        Excluir
                                      </button>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        ) : (
                          <p className="mt-2">Nenhuma tarefa cadastrada.</p>
                        )}
                      </div>

                      <div className="d-flex justify-content-end gap-3 mt-4">
                        <button className="btn btn-outline-primary" onClick={() => handleEditar(projeto.id)}>
                          Editar Projeto
                        </button>
                        <button className="btn btn-outline-danger" onClick={() => handleAbrirModalExcluir(projeto.id)}>
                          Excluir Projeto
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>

      <Rodape />

      {mostrarModal && (
        <Modal
          titulo="Confirmar Exclusão"
          texto="Tem certeza que deseja excluir este projeto?"
          txtBtn1="Excluir"
          txtBtn2="Cancelar"
          onClickBtn1={handleConfirmarExclusao}
          onClickBtn2={() => setMostrarModal(false)}
          onClickBtnClose={() => setMostrarModal(false)}
        />
      )}
    </>
  );
}

export default ListarProjetos;