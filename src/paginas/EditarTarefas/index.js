import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Cabecalho from "../../componentes/Cabecalho";
import Rodape from "../../componentes/Rodape";
import Modal from "../../componentes/Modal";
import { buscarTarefaPorId, editarTarefa } from "../../servicos/tarefas";
import { listarProjetos } from "../../servicos/projetos";
import { formatarData } from "../../utils/data";

function EditarTarefa() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [tarefa, setTarefa] = useState(null);
  const [projetos, setProjetos] = useState([]);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [mostrarModalSucesso, setMostrarModalSucesso] = useState(false);

  useEffect(() => {
    async function carregarDados() {
      try {
        const resTarefa = await buscarTarefaPorId(id);
        const resProjetos = await listarProjetos();

        const tarefaData = resTarefa.data;
        const listaProjetos = resProjetos.data.content || resProjetos.data;

        const projetoSelecionado = listaProjetos.find(
          (p) => p.id === tarefaData.projeto?.id
        );
        const responsavel = projetoSelecionado?.responsavel || {};

        setProjetos(listaProjetos);
        setTarefa({
          id: tarefaData.id,
          titulo: tarefaData.titulo,
          descricao: tarefaData.descricao || "",
          dataCriacao: tarefaData.dataCriacao,
          dataCriacaoFormatada: formatarData(tarefaData.dataCriacao),
          dataConclusao: tarefaData.dataConclusao || "",
          prioridade: tarefaData.prioridade,
          status: tarefaData.status,
          projetoId: projetoSelecionado?.id || "",
          usuarioId: responsavel.id || "",
          usuarioNome: responsavel.nome || "",
        });
      } catch (erro) {
        alert("Erro ao carregar dados");
        console.error(erro);
      }
    }

    carregarDados();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "projetoId") {
      const projeto = projetos.find((p) => p.id === parseInt(value));
      const responsavel = projeto?.responsavel || {};

      setTarefa((prev) => ({
        ...prev,
        projetoId: parseInt(value),
        usuarioId: responsavel.id || "",
        usuarioNome: responsavel.nome || "",
      }));
    } else {
      setTarefa((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const projetoSelecionado = projetos.find(
      (p) => p.id === tarefa.projetoId
    );
    const responsavel = projetoSelecionado?.responsavel;

    if (!projetoSelecionado || !responsavel) {
      alert("Projeto ou responsável inválido.");
      return;
    }

    const payload = {
      id: tarefa.id,
      titulo: tarefa.titulo,
      descricao: tarefa.descricao || "",
      dataCriacao: tarefa.dataCriacao,
      dataConclusao: tarefa.dataConclusao || null,
      prioridade: tarefa.prioridade,
      status: tarefa.status,
      qtdeDiasTrabalhados: 0,
      usuario:  {
        id: tarefa.projetoId 
      },
      projeto:  {
        id: tarefa.projetoId 
      },
    };

    console.log("📤 Payload enviado para o backend:", payload);

    try {
      await editarTarefa(tarefa.id, payload);
      setMostrarModalSucesso(true);
    } catch (erro) {
      console.error("Erro ao editar tarefa:", erro);
      alert("Erro ao salvar as alterações.");
    }
  };

  const handleCancelar = () => setMostrarModal(true);
  const confirmarCancelamento = () => navigate("/tarefas");
  const confirmarSucesso = () => navigate("/tarefas");

  if (!tarefa) {
    return (
      <>
        <Cabecalho />
        <div className="container text-white text-center mt-5">
          <h4>Carregando tarefa...</h4>
        </div>
        <Rodape />
      </>
    );
  }

  return (
    <>
      <Cabecalho />
      <section className="container-fluid py-5" style={{ backgroundColor: "#0d1b2a", minHeight: "100vh" }}>
        <div className="container col-md-6 bg-white text-dark p-4 rounded shadow">
          <h2 className="mb-4 text-center">Editar Tarefa</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="titulo" className="form-label">Título</label>
              <input
                id="titulo"
                type="text"
                className="form-control"
                name="titulo"
                value={tarefa.titulo}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="descricao" className="form-label">Descrição</label>
              <input
                id="descricao"
                type="text"
                className="form-control"
                name="descricao"
                value={tarefa.descricao}
                onChange={handleChange}
              />
            </div>

            <div className="row mb-4">
              <div className="col-md-6">
                <label className="form-label">Data de Criação</label>
                <input
                  type="text"
                  className="form-control"
                  style={{ backgroundColor: "#e9ecef" }}
                  value={tarefa.dataCriacaoFormatada}
                  readOnly
                />
              </div>
              <div className="col-md-6">
                <label htmlFor="dataConclusao" className="form-label">Data de Conclusão</label>
                <input
                  id="dataConclusao"
                  type="date"
                  className="form-control"
                  name="dataConclusao"
                  value={tarefa.dataConclusao}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="mb-3">
              <label htmlFor="prioridade" className="form-label">Prioridade</label>
              <select
                id="prioridade"
                name="prioridade"
                className="form-control"
                value={tarefa.prioridade}
                onChange={handleChange}
                required
              >
                <option value="ALTA">ALTA</option>
                <option value="MEDIA">MEDIA</option>
                <option value="BAIXA">BAIXA</option>
              </select>
            </div>

            <div className="mb-3">
              <label htmlFor="status" className="form-label">Status</label>
              <select
                id="status"
                name="status"
                className="form-control"
                value={tarefa.status}
                onChange={handleChange}
                required
              >
                <option value="PENDENTE">PENDENTE</option>
                <option value="FAZENDO">FAZENDO</option>
                <option value="FINALIZADA">FINALIZADA</option>
              </select>
            </div>

            <div className="row mb-4">
              <div className="col-md-6">
                <label className="form-label">Responsável</label>
                <input
                  type="text"
                  className="form-control"
                  style={{ backgroundColor: "#e9ecef" }}
                  value={tarefa.usuarioNome}
                  readOnly
                />
              </div>
              <div className="col-md-6">
                <label htmlFor="projetoId" className="form-label">Projeto</label>
                <select
                  id="projetoId"
                  name="projetoId"
                  className="form-control"
                  value={tarefa.projetoId}
                  onChange={handleChange}
                  required
                >
                  <option value="">Selecione</option>
                  {projetos.map((p) => (
                    <option key={p.id} value={p.id}>{p.nome}</option>
                  ))}
                </select>
              </div>
            </div>

            <button type="submit" className="btn btn-success w-100 mb-2">Salvar Alterações</button>
            <button type="button" className="btn btn-danger w-100" onClick={handleCancelar}>Cancelar</button>
          </form>
        </div>
      </section>

      <Rodape />

      {mostrarModal && (
        <Modal
          titulo="Cancelar Edição"
          texto="Deseja cancelar a edição da tarefa?"
          txtBtn1="Sim, cancelar"
          txtBtn2="Continuar editando"
          onClickBtn1={confirmarCancelamento}
          onClickBtn2={() => setMostrarModal(false)}
          onClickBtnClose={() => setMostrarModal(false)}
        />
      )}

      {mostrarModalSucesso && (
        <Modal
          titulo="Tarefa Atualizada"
          texto="As alterações foram salvas com sucesso!"
          txtBtn1="OK"
          onClickBtn1={confirmarSucesso}
        />
      )}
    </>
  );
}

export default EditarTarefa;