import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LISTA_USUARIOS } from "../../../mocks/usuarios";
import { LISTA_PROJETOS } from "../../../mocks/projetos";
import Rodape from "../../../componentes/Rodape";
import Cabecalho from "../../../componentes/Cabecalho";
import Modal from "../../../componentes/Modal";

const responsaveis = LISTA_USUARIOS.map((usuario) => usuario.nome);
const projetos = LISTA_PROJETOS.map((projeto) => projeto.nome);

function Tarefas() {
  const navigate = useNavigate();
  const [lembreteAtivado, setLembreteAtivado] = useState(false);
  const [tempoAntes, setTempoAntes] = useState("");
  const [mostrarModal, setMostrarModal] = useState(false);
  const [mostrarModalSucesso, setMostrarModalSucesso] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setMostrarModalSucesso(true);
  };

  const handleCancelar = () => {
    setMostrarModal(true);
  };

  const confirmarCancelamento = () => {
    navigate("/tarefas");
  };

  const confirmarSucesso = () => {
    navigate("/tarefas");
  };

  return (
    <>
      <Cabecalho />
      <section
        className="container-fluid py-5"
        style={{ backgroundColor: "#0d1b2a", minHeight: "100vh" }}
      >
        <div className="container col-md-6 bg-white text-dark p-4 rounded shadow">
          <h2 className="mb-4 text-center">Adicionar Nova Tarefa</h2>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="titulo" className="form-label">Título:</label>
              <input
                type="text"
                className="form-control"
                id="titulo"
                placeholder="Digite o título da tarefa:"
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="descricao" className="form-label">Descrição:</label>
              <input
                type="text"
                className="form-control"
                id="descricao"
                placeholder="Descreva a tarefa:"
              />
            </div>

            <div className="row mb-4">
              <div className="col-md-6">
                <label htmlFor="dataHora" className="form-label">Data e Hora:</label>
                <input
                  type="datetime-local"
                  className="form-control"
                  id="dataHora"
                  required
                />
              </div>
              <div className="col-md-6">
                <label htmlFor="status" className="form-label">Status:</label>
                <select
                  id="status"
                  className="form-control"
                  required
                  defaultValue=""
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
                <label htmlFor="responsavel" className="form-label">Responsável:</label>
                <select
                  id="responsavel"
                  className="form-control"
                  required
                  defaultValue=""
                >
                  <option value="" disabled>Selecione o responsável</option>
                  {responsaveis.map((nome, index) => (
                    <option key={index} value={nome}>{nome}</option>
                  ))}
                </select>
              </div>
              <div className="col-md-6">
                <label htmlFor="projeto" className="form-label">Projeto:</label>
                <select
                  id="projeto"
                  className="form-control"
                  required
                  defaultValue=""
                >
                  <option value="" disabled>Selecione o projeto</option>
                  {projetos.map((nomeProjeto, index) => (
                    <option key={index} value={nomeProjeto}>{nomeProjeto}</option>
                  ))}
                </select>
              </div>
            </div>

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

            {lembreteAtivado && (
              <div className="mb-4">
                <label htmlFor="tempoAntes" className="form-label">Quanto tempo antes? (em minutos):</label>
                <select
                  id="tempoAntes"
                  className="form-control"
                  value={tempoAntes}
                  onChange={(e) => setTempoAntes(e.target.value)}
                >
                  <option value="" disabled>Selecione o tempo</option>
                  <option value="5">5 minutos</option>
                  <option value="10">10 minutos</option>
                  <option value="15">15 minutos</option>
                  <option value="30">30 minutos</option>
                  <option value="60">1 hora</option>
                </select>
              </div>
            )}

            <div className="mb-2">
              <button type="submit" className="btn btn-success w-100">
                Adicionar Tarefa
              </button>
            </div>
            <div className="mb-4">
              <button
                type="button"
                className="btn btn-danger w-100"
                onClick={handleCancelar}
              >
                Cancelar
              </button>
            </div>
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