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
                  <div key={projeto.id} className="col-md-6 col-lg-4 mb-4">
                    <div className="card h-100 p-3 shadow-sm rounded">
                      <h5 className="card-title">{projeto.nome}</h5>
                      <p><strong>Descrição:</strong> {projeto.descricao}</p>
                      <p><strong>Responsável:</strong> {projeto.responsavel?.nome || "-"}</p>
                      <div>
                        <strong>Tarefas:</strong>
                        {tarefasDoProjeto.length > 0 ? (
                          <div className="table-responsive mt-2">
                            <table className="table table-sm table-bordered">
                              <thead className="table-light">
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
                                    <td>{tarefa.id}</td>
                                    <td>{tarefa.titulo}</td>
                                    <td>{tarefa.descricao || "-"}</td>
                                    <td>{tarefa.usuario?.nome || "-"}</td>
                                    <td>{tarefa.dataCriacao}</td>
                                    <td>{tarefa.status}</td>
                                    <td>
                                      <button
                                        className="btn btn-sm btn-primary me-1"
                                        onClick={() => navigate(`/tarefas/${tarefa.id}/editar`)}
                                      >
                                        Editar
                                      </button>
                                      <button
                                        className="btn btn-sm btn-danger"
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
                          <p>-</p>
                        )}
                      </div>
                      <div className="d-flex justify-content-end gap-2 mt-auto">
                        <button className="btn btn-sm btn-primary" onClick={() => handleEditar(projeto.id)}>Editar</button>
                        <button className="btn btn-sm btn-danger" onClick={() => handleAbrirModalExcluir(projeto.id)}>Excluir</button>
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