import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "../../componentes/Modal";
import Cabecalho from "../../componentes/Cabecalho";
import Rodape from "../../componentes/Rodape";
import { listarProjetos, excluirProjeto } from "../../servicos/projetos";
import { listarTarefas } from "../../servicos/tarefas";

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

  return (
    <>
      <Cabecalho />

      <div style={{ backgroundColor: "#0d1b2a", minHeight: "100vh" }}>
        <section className="container py-4">
          <div className="d-flex justify-content-end mb-3">
            <button className="btn btn-success" onClick={() => navigate("/projetos/novo")}>
              Adicionar Projeto
            </button>
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
                    <div className="card p-4 shadow rounded" style={{ backgroundColor: "#f8f9fa" }}>
                      <h4 className="text-primary fw-bold">{projeto.nome}</h4>
                      <p><strong>Descrição:</strong> {projeto.descricao}</p>
                      <p><strong>Responsável:</strong> {projeto.responsavel?.nome || "-"}</p>

                      <div className="mt-3">
                        <strong className="text-dark">Tarefas:</strong>
                        {tarefasDoProjeto.length > 0 ? (
                          <div className="table-responsive mt-2">
                            <table className="table table-bordered table-hover align-middle">
                              <thead className="table-primary text-center">
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
                                  <tr key={tarefa.id}>
                                    <td className="text-center">{tarefa.id}</td>
                                    <td>{tarefa.titulo}</td>
                                    <td>{tarefa.descricao || "-"}</td>
                                    <td>{tarefa.usuario?.nome || "-"}</td>
                                    <td className="text-center">{tarefa.dataCriacao}</td>
                                    <td className="text-center">
                                      <span className={`badge ${tarefa.status === "FINALIZADA"
                                        ? "bg-success"
                                        : tarefa.status === "FAZENDO"
                                        ? "bg-warning text-dark"
                                        : "bg-secondary"
                                      }`}>
                                        {tarefa.status}
                                      </span>
                                    </td>
                                    <td className="text-center">
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

                      <div className="d-flex justify-content-end gap-2 mt-4">
                        <button className="btn btn-primary" onClick={() => handleEditar(projeto.id)}>
                          Editar Projeto
                        </button>
                        <button className="btn btn-danger" onClick={() => handleAbrirModalExcluir(projeto.id)}>
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