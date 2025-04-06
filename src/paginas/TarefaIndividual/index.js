import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Cabecalho from "../../componentes/Cabecalho";
import Rodape from "../../componentes/Rodape";
import Modal from "../../componentes/Modal";
import { buscarTarefaPorId, excluirTarefa } from "../../servicos/tarefas";
import { buscarProjetoPorId } from "../../servicos/projetos";
import { formatarData, calcularTempoGasto } from "../../utils/data";
import { editarTarefa } from "../../servicos/tarefas";

function VisualizarTarefaInd() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [tarefa, setTarefa] = useState(null);
  const [projeto, setProjeto] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);

  useEffect(() => {
    async function carregarDados() {
      try {
        const resTarefa = await buscarTarefaPorId(id);
        const tarefaData = resTarefa.data;
        setTarefa(tarefaData);

        if (tarefaData.projeto?.id) {
          const resProjeto = await buscarProjetoPorId(tarefaData.projeto.id);
          setProjeto(resProjeto.data);
        }
      } catch (erro) {
        console.error("Erro ao carregar dados da tarefa:", erro);
        alert("Erro ao carregar tarefa.");
      }
    }

    carregarDados();
  }, [id]);

  const handleEditar = () => {
    navigate(`/tarefas/${id}/editar`);
  };

  const handleExcluir = () => {
    setMostrarModal(true);
  };

  const confirmarExclusao = async () => {
    try {
      await excluirTarefa(id);
      navigate("/tarefas");
    } catch (erro) {
      console.error("Erro ao excluir tarefa:", erro);
      alert("Erro ao excluir tarefa.");
    }
  };


  const handleConcluirTarefa = async () => {
    try {
      const agora = new Date();
      const dataISO = agora.toISOString().split("T")[0]; // yyyy-MM-dd
      const dataConclusaoFormatada = formatarData(dataISO); // dd/MM/yyyy
  
      const payload = {
        id: tarefa.id,
        titulo: tarefa.titulo,
        dataCriacao: formatarData(tarefa.dataCriacao), // formato correto
        dataConclusao: dataConclusaoFormatada,
        prioridade: tarefa.prioridade,
        status: "FINALIZADA",
        projeto: { id: tarefa.projeto?.id || tarefa.projetoId },
        usuario: { id: tarefa.usuario?.id || tarefa.usuarioId },
      };
  
      console.log("Payload enviado:", payload);
      await editarTarefa(tarefa.id, payload);
  
      setTarefa((prev) => ({
        ...prev,
        status: "FINALIZADA",
        dataConclusao: dataConclusaoFormatada, // Atualiza a exibição
      }));
    } catch (error) {
      console.error("Erro ao concluir tarefa:", error);
      alert("Erro ao concluir a tarefa.");
    }
  };

  if (!tarefa) {
    return (
      <>
        <Cabecalho />
        <div className="container text-center mt-5 text-white">
          <h4>Carregando tarefa...</h4>
        </div>
        <Rodape />
      </>
    );
  }

  const tempoGasto = calcularTempoGasto(tarefa.dataCriacao, tarefa.dataConclusao);

  return (
    <>
      <Cabecalho />
      <section
        style={{ backgroundColor: "#0d1b2a", minHeight: "100vh" }}
        className="py-5"
      >
        <div className="container col-md-8 bg-white text-dark p-4 rounded shadow">
          <h2 className="mb-4">Detalhes da Tarefa</h2>

          <p><strong>Título:</strong> {tarefa.titulo}</p>
          <p><strong>Descrição:</strong> {tarefa.descricao || "-"}</p>
          <p><strong>Data de Criação:</strong> {formatarData(tarefa.dataCriacao)}</p>
          <p><strong>Data de Conclusão:</strong> {tarefa.dataConclusao ? formatarData(tarefa.dataConclusao) : "-"}</p>
          <p><strong>Tempo Gasto:</strong> {tempoGasto}</p>
          <p><strong>Status:</strong> {tarefa.status}</p>
          <p><strong>Prioridade:</strong> {tarefa.prioridade}</p>

          <hr />
          <h5>Informações do Projeto</h5>
          <p><strong>Projeto:</strong> {projeto?.nome || "-"}</p>
          <p><strong>Descrição do Projeto:</strong> {projeto?.descricao || "-"}</p>
          <p><strong>Responsável:</strong> {projeto?.responsavel?.nome || "-"}</p>

          <div className="mt-4 d-flex justify-content-between flex-wrap gap-2">
            <button className="btn btn-secondary" onClick={() => navigate("/tarefas")}>Voltar</button>

            <div className="d-flex gap-2">
              {tarefa.status !== "FINALIZADA" && (
                <button className="btn btn-success" onClick={handleConcluirTarefa}>Concluir Tarefa</button>
              )}
              <button className="btn btn-primary" onClick={handleEditar}>Editar</button>
              <button className="btn btn-danger" onClick={handleExcluir}>Excluir</button>
            </div>
          </div>
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
}

export default VisualizarTarefaInd;