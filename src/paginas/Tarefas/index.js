import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Rodape from "../../componentes/Rodape";
import Cabecalho from "../../componentes/Cabecalho";
import Modal from "../../componentes/Modal";
import { formatarData } from "../../utils/data";
import { listarProjetos } from "../../servicos/projetos";
import { salvarTarefa } from "../../servicos/tarefas";

function Tarefas() {
  const navigate = useNavigate();

  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [dataCriacao, setDataCriacao] = useState("");
  const [dataConclusao, setDataConclusao] = useState("");
  const [prioridade, setPrioridade] = useState("");
  const [status, setStatus] = useState("");
  const [usuarioId, setUsuarioId] = useState("");
  const [projetoId, setProjetoId] = useState("");

  const [projetos, setProjetos] = useState([]);
  const [usuarioNome, setUsuarioNome] = useState("");

  const [lembreteAtivado, setLembreteAtivado] = useState(false);
  const [tempoAntes, setTempoAntes] = useState("");
  const [mostrarModal, setMostrarModal] = useState(false);
  const [mostrarModalSucesso, setMostrarModalSucesso] = useState(false);

  useEffect(() => {
    const carregarDados = async () => {
      try {
        const resProjetos = await listarProjetos();
        const listaProjetos = Array.isArray(resProjetos.data)
          ? resProjetos.data
          : resProjetos.data.content || [];

        setProjetos(listaProjetos);
      } catch (error) {
        alert("Erro ao carregar projetos: " + error.message);
      }
    };

    carregarDados();
  }, []);

  // Quando o projeto muda, define o responsável automaticamente
  const handleProjetoChange = (e) => {
    const id = e.target.value;
    setProjetoId(id);

    const projetoSelecionado = projetos.find((p) => p.id === parseInt(id));
    if (projetoSelecionado && projetoSelecionado.responsavel) {
      setUsuarioId(projetoSelecionado.responsavel.id);
      setUsuarioNome(projetoSelecionado.responsavel.nome);
    } else {
      setUsuarioId("");
      setUsuarioNome("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const novaTarefa = {
      titulo,
      descricao,
      dataCriacao: formatarData(dataCriacao),
      dataConclusao: formatarData(dataConclusao),
      prioridade,
      status,
      usuario: { id: parseInt(usuarioId) },
      projeto: { id: parseInt(projetoId) }
    };

    try {
      await salvarTarefa(novaTarefa);
      setMostrarModalSucesso(true);
    } catch (error) {
      alert("Erro ao cadastrar tarefa: " + error.message);
    }
  };

  const handleCancelar = () => setMostrarModal(true);
  const confirmarCancelamento = () => navigate("/tarefas");
  const confirmarSucesso = () => navigate("/tarefas");

  return (
    <>
      <Cabecalho />
      <section className="container-fluid py-5" style={{ backgroundColor: "#0d1b2a", minHeight: "100vh" }}>
        <div className="container col-md-6 bg-white text-dark p-4 rounded shadow">
          <h2 className="mb-4 text-center">Adicionar Nova Tarefa</h2>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="titulo" className="form-label">Título:</label>
              <input
                id="titulo"
                type="text"
                className="form-control"
                placeholder="Digite o título da tarefa"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="descricao" className="form-label">Descrição:</label>
              <input
                id="descricao"
                type="text"
                className="form-control"
                placeholder="Descreva a tarefa"
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
              />
            </div>

            <div className="row mb-4">
              <div className="col-md-6">
                <label htmlFor="dataCriacao" className="form-label">Data de Criação:</label>
                <input
                  id="dataCriacao"
                  type="date"
                  className="form-control"
                  value={dataCriacao}
                  onChange={(e) => setDataCriacao(e.target.value)}
                  required
                />
              </div>
              <div className="col-md-6">
                <label htmlFor="dataConclusao" className="form-label">Data de Conclusão:</label>
                <input
                  id="dataConclusao"
                  type="date"
                  className="form-control"
                  value={dataConclusao}
                  onChange={(e) => setDataConclusao(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="row mb-4">
              <div className="col-md-6">
                <label htmlFor="prioridade" className="form-label">Prioridade:</label>
                <select
                  id="prioridade"
                  className="form-control"
                  value={prioridade}
                  onChange={(e) => setPrioridade(e.target.value)}
                  required
                >
                  <option value="" disabled>Selecione a prioridade</option>
                  <option value="BAIXA">BAIXA</option>
                  <option value="MEDIA">MÉDIA</option>
                  <option value="ALTA">ALTA</option>
                </select>
              </div>
              <div className="col-md-6">
                <label htmlFor="status" className="form-label">Status:</label>
                <select
                  id="status"
                  className="form-control"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  required
                >
                  <option value="" disabled>Selecione o status</option>
                  <option value="PENDENTE">PENDENTE</option>
                  <option value="FAZENDO">FAZENDO</option>
                  <option value="FINALIZADA">FINALIZADA</option>
                </select>
              </div>
            </div>

            <div className="row mb-4">
              <div className="col-md-6">
                <label className="form-label">Responsável:</label>
                <input
                  type="text"
                  className="form-control"
                  style={{ backgroundColor: "#e9ecef" }}
                  value={usuarioNome}
                  readOnly
                />
              </div>
              <div className="col-md-6">
                <label htmlFor="projeto" className="form-label">Projeto:</label>
                <select
                  id="projeto"
                  className="form-control"
                  value={projetoId}
                  onChange={handleProjetoChange}
                  required
                >
                  <option value="" disabled>Selecione o projeto</option>
                  {projetos.map((p) => (
                    <option key={p.id} value={p.id}>{p.nome}</option>
                  ))}
                </select>
              </div>
            </div>

            {lembreteAtivado && (
              <div className="mb-4">
                <label htmlFor="tempoAntes" className="form-label">Lembrete: Quanto tempo antes?</label>
                <select
                  id="tempoAntes"
                  className="form-control"
                  value={tempoAntes}
                  onChange={(e) => setTempoAntes(e.target.value)}
                >
                  <option value="">Selecione o tempo</option>
                  <option value="5">5 minutos</option>
                  <option value="10">10 minutos</option>
                  <option value="15">15 minutos</option>
                  <option value="30">30 minutos</option>
                  <option value="60">1 hora</option>
                </select>
              </div>
            )}

            <div className="form-check mb-4">
              <input
                type="checkbox"
                className="form-check-input"
                id="lembrete"
                checked={lembreteAtivado}
                onChange={() => setLembreteAtivado(!lembreteAtivado)}
              />
              <label className="form-check-label" htmlFor="lembrete">Ativar lembrete</label>
            </div>

            <button type="submit" className="btn btn-success w-100 mb-2">
              Adicionar Tarefa
            </button>
            <button
              type="button"
              className="btn btn-danger w-100"
              onClick={handleCancelar}
            >
              Cancelar
            </button>
          </form>
        </div>
      </section>

      <Rodape />

      {mostrarModal && (
        <Modal
          titulo="Cancelar Cadastro"
          texto="Deseja realmente cancelar o cadastro da tarefa?"
          txtBtn1="Sim, cancelar"
          txtBtn2="Continuar editando"
          onClickBtn1={confirmarCancelamento}
          onClickBtn2={() => setMostrarModal(false)}
          onClickBtnClose={() => setMostrarModal(false)}
        />
      )}

      {mostrarModalSucesso && (
        <Modal
          titulo="Sucesso"
          texto="Tarefa adicionada com sucesso!"
          txtBtn1="OK"
          onClickBtn1={confirmarSucesso}
        />
      )}
    </>
  );
}

export default Tarefas;