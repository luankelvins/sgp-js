import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import Cabecalho from "../../componentes/Cabecalho";
import Rodape from "../../componentes/Rodape";
import Modal from "../../componentes/Modal";
import { listarTarefas } from "../../servicos/tarefas";
import { listarProjetos } from "../../servicos/projetos";

const ListaTarefas = () => {
  const navigate = useNavigate();

  const [tarefas, setTarefas] = useState([]);
  const [tarefasOriginais, setTarefasOriginais] = useState([]);
  const [projetos, setProjetos] = useState([]);
  const [filtroStatus, setFiltroStatus] = useState("");
  const [filtroProjeto, setFiltroProjeto] = useState("");
  const [filtroPrioridade, setFiltroPrioridade] = useState("");
  const [tarefaSelecionada, setTarefaSelecionada] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);

  useEffect(() => {
    async function carregarDados() {
      try {
        const resTarefas = await listarTarefas();
        const listaTarefas = Array.isArray(resTarefas.data)
          ? resTarefas.data
          : resTarefas.data?.content || [];

        setTarefas(listaTarefas);
        setTarefasOriginais(listaTarefas);

        const resProjetos = await listarProjetos();
        const listaProjetos = Array.isArray(resProjetos.data)
          ? resProjetos.data
          : resProjetos.data?.content || [];

        setProjetos(listaProjetos);
      } catch (erro) {
        console.error("Erro ao carregar dados:", erro);
        setTarefas([]);
        setProjetos([]);
      }
    }

    carregarDados();
  }, []);

  const handleAdicionarTarefa = () => navigate("/tarefas/novo");
  const handleEditar = (id) => navigate(`/tarefas/${id}/editar`);
  const handleExcluir = (id) => {
    setTarefaSelecionada(id);
    setMostrarModal(true);
  };

  const confirmarExclusao = () => {
    const novaLista = tarefas.filter((t) => t.id !== tarefaSelecionada);
    setTarefas(novaLista);
    setTarefasOriginais(novaLista);
    setMostrarModal(false);
    setTarefaSelecionada(null);
  };

  const aplicarFiltros = () => {
    let filtradas = [...tarefasOriginais];
    if (filtroStatus) filtradas = filtradas.filter((t) => t.status === filtroStatus);
    if (filtroProjeto) filtradas = filtradas.filter((t) => t.projeto?.nome === filtroProjeto);
    if (filtroPrioridade) filtradas = filtradas.filter((t) => t.prioridade === filtroPrioridade);
    setTarefas(filtradas);
  };

  const limparFiltros = () => {
    setFiltroStatus("");
    setFiltroProjeto("");
    setFiltroPrioridade("");
    setTarefas(tarefasOriginais);
  };

  return (
    <>
      <Cabecalho />
      <section style={{ backgroundColor: "#0d1b2a", minHeight: "100vh" }}>
        <div className="container py-4">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-end mb-3 gap-3">
            <button className="btn btn-success" onClick={handleAdicionarTarefa}>
              Adicionar Tarefa
            </button>

            <div className="row w-100 text-white g-2">
              <div className="col-12 col-md-4 d-flex flex-column flex-md-row align-items-md-center">
                <label className="me-md-2 mb-1 mb-md-0">Status:</label>
                <select className="form-select form-select-sm" value={filtroStatus} onChange={(e) => setFiltroStatus(e.target.value)}>
                  <option value="">Todos</option>
                  <option value="PENDENTE">PENDENTE</option>
                  <option value="FAZENDO">FAZENDO</option>
                  <option value="FINALIZADA">FINALIZADA</option>
                </select>
              </div>

              <div className="col-12 col-md-4 d-flex flex-column flex-md-row align-items-md-center">
                <label className="me-md-2 mb-1 mb-md-0">Projeto:</label>
                <select className="form-select form-select-sm" value={filtroProjeto} onChange={(e) => setFiltroProjeto(e.target.value)}>
                  <option value="">Todos</option>
                  {projetos.map((projeto) => (
                    <option key={projeto.id} value={projeto.nome}>{projeto.nome}</option>
                  ))}
                </select>
              </div>

              <div className="col-12 col-md-4 d-flex flex-column flex-md-row align-items-md-center">
                <label className="me-md-2 mb-1 mb-md-0">Prioridade:</label>
                <select className="form-select form-select-sm" value={filtroPrioridade} onChange={(e) => setFiltroPrioridade(e.target.value)}>
                  <option value="">Todas</option>
                  <option value="ALTA">ALTA</option>
                  <option value="MEDIA">MEDIA</option>
                  <option value="BAIXA">BAIXA</option>
                </select>
              </div>
            </div>
          </div>

          <div className="d-flex flex-column flex-sm-row justify-content-end gap-2 mb-4">
            <button className="btn btn-primary btn-sm" onClick={aplicarFiltros}>Filtrar</button>
            <button className="btn btn-secondary btn-sm" onClick={limparFiltros}>Limpar</button>
          </div>

          {tarefas.length > 0 ? (
            tarefas.map((tarefa) => {
              const tempoGasto = (() => {
                if (tarefa.status === "FINALIZADA" && tarefa.dataCriacao && tarefa.dataConclusao) {
                  const inicio = new Date(tarefa.dataCriacao);
                  const fim = new Date(tarefa.dataConclusao);
                  const diff = fim - inicio;
                  const horas = Math.floor(diff / (1000 * 60 * 60));
                  const minutos = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                  return `${horas}h ${minutos}min`;
                }
                return null;
              })();

              return (
                <div key={tarefa.id} className="card p-3 p-md-4 mb-4 shadow-sm rounded">
                  <h5>{tarefa.titulo}</h5>
                  <p><strong>Prioridade:</strong> {tarefa.prioridade}</p>
                  <p><strong>Status:</strong> {tarefa.status}</p>
                  <p><strong>Data de Criação:</strong> {tarefa.dataCriacao}</p>
                  <p><strong>Data de Conclusão:</strong> {tarefa.dataConclusao || "-"}</p>
                  <p><strong>Projeto:</strong> {tarefa.projeto?.nome || "-"}</p>
                  <p><strong>Responsável:</strong> {tarefa.usuario?.nome || "-"}</p>
                  {tempoGasto && <p><strong>Tempo Gasto:</strong> {tempoGasto}</p>}

                  <div className="d-flex flex-column flex-sm-row justify-content-end gap-2">
                    <button className="btn btn-sm btn-primary" onClick={() => handleEditar(tarefa.id)}>Editar</button>
                    <button className="btn btn-sm btn-danger" onClick={() => handleExcluir(tarefa.id)}>Excluir</button>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-white">Nenhuma tarefa encontrada.</p>
          )}
        </div>
      </section>

      <Rodape />

      {mostrarModal && (
        <Modal
          titulo="Confirmar Exclusão"
          texto="Deseja realmente excluir esta tarefa?"
          txtBtn1="Sim, excluir"
          txtBtn2="Cancelar"
          onClickBtn1={confirmarExclusao}
          onClickBtn2={() => setMostrarModal(false)}
          onClickBtnClose={() => setMostrarModal(false)}
        />
      )}
    </>
  );
};

export default ListaTarefas;
