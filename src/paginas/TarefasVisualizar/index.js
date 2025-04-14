import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Cabecalho from "../../componentes/Cabecalho";
import Rodape from "../../componentes/Rodape";
import Modal from "../../componentes/Modal";
import { listarProjetos } from "../../servicos/projetos";
import { listarTarefas, excluirTarefa } from "../../servicos/tarefas";
import { FaFilePdf } from "react-icons/fa";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import logo from "../../assets/sgp_logo_horizontal.png";

const ListaTarefas = () => {
  const navigate = useNavigate();

  const [tarefas, setTarefas] = useState([]);
  const [tarefasOriginais, setTarefasOriginais] = useState([]);
  const [projetos, setProjetos] = useState([]);
  const [filtroStatus, setFiltroStatus] = useState("");
  const [filtroProjeto, setFiltroProjeto] = useState("");
  const [filtroPrioridade, setFiltroPrioridade] = useState("");
  const [tarefaSelecionada, setTarefaSelecionada] = useState(null);
  const [mostrarModalConfirmacao, setMostrarModalConfirmacao] = useState(false);
  const [mostrarModalSucesso, setMostrarModalSucesso] = useState(false);

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
    setMostrarModalConfirmacao(true);
  };

  const confirmarExclusao = async () => {
    try {
      await excluirTarefa(tarefaSelecionada);
      const novaLista = tarefas.filter((t) => t.id !== tarefaSelecionada);
      setTarefas(novaLista);
      setTarefasOriginais(novaLista);
      setMostrarModalConfirmacao(false);
      setMostrarModalSucesso(true);
    } catch (erro) {
      console.error("Erro ao excluir tarefa:", erro);
      alert("Erro ao excluir a tarefa.");
    }
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

  const handleExportarPdf = () => {
    const doc = new jsPDF();
  
    const dataAtual = new Date().toLocaleString();
  
    // Adiciona a logomarca (ajuste se necessário)
    const img = new Image();
    img.src = logo;
    img.onload = () => {
      doc.addImage(img, "PNG", 10, 10, 30, 30);
  
      doc.setFontSize(18);
      doc.text("Relatório de Tarefas", 105, 20, { align: "center" });
  
      doc.setFontSize(10);
      doc.text(`Exportado em: ${dataAtual}`, 200, 10, { align: "right" });
  
      const colunas = [
        "Título",
        "Status",
        "Prioridade",
        "Projeto",
        "Responsável",
        "Criação",
        "Conclusão",
      ];
  
      const linhas = tarefas.map((t) => [
        t.titulo,
        t.status,
        t.prioridade,
        t.projeto?.nome || "-",
        t.usuario?.nome || "-",
        t.dataCriacao || "-",
        t.dataConclusao || "-",
      ]);
  
      autoTable(doc, {
        head: [colunas],
        body: linhas,
        startY: 50,
        styles: { fontSize: 9 },
        didDrawPage: (data) => {
          const pageCount = doc.internal.getNumberOfPages();
          doc.setFontSize(8);
          doc.text(`Página ${doc.internal.getCurrentPageInfo().pageNumber} de ${pageCount}`, data.settings.margin.left, doc.internal.pageSize.height - 10);
        },
      });
  
      doc.save("relatorio_tarefas.pdf");
    };
  };

  return (
    <>
      <Cabecalho />
      <section style={{ backgroundColor: "#0d1b2a", minHeight: "100vh" }}>
        <div className="container py-5">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="text-white fw-bold">Lista de Tarefas</h2>
            <button className="btn btn-outline-secondary btn-sm" onClick={handleExportarPdf}>
              <FaFilePdf />
            </button>
            <button className="btn btn-success btn-lg" onClick={handleAdicionarTarefa}>
              + Nova Tarefa
            </button>
          </div>

          <div className="row g-3 mb-4 text-white">
            <div className="col-md-4">
              <label>Status</label>
              <select className="form-select form-select-sm" value={filtroStatus} onChange={(e) => setFiltroStatus(e.target.value)}>
                <option value="">Todos</option>
                <option value="PENDENTE">PENDENTE</option>
                <option value="FAZENDO">FAZENDO</option>
                <option value="FINALIZADA">FINALIZADA</option>
              </select>
            </div>
            <div className="col-md-4">
              <label>Projeto</label>
              <select className="form-select form-select-sm" value={filtroProjeto} onChange={(e) => setFiltroProjeto(e.target.value)}>
                <option value="">Todos</option>
                {projetos.map((projeto) => (
                  <option key={projeto.id} value={projeto.nome}>{projeto.nome}</option>
                ))}
              </select>
            </div>
            <div className="col-md-4">
              <label>Prioridade</label>
              <select className="form-select form-select-sm" value={filtroPrioridade} onChange={(e) => setFiltroPrioridade(e.target.value)}>
                <option value="">Todas</option>
                <option value="ALTA">ALTA</option>
                <option value="MEDIA">MEDIA</option>
                <option value="BAIXA">BAIXA</option>
              </select>
            </div>
          </div>

          <div className="d-flex flex-wrap justify-content-end gap-2 mb-4">
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
                <div key={tarefa.id} className="card mb-4 shadow-sm border-0">
                  <div className="card-body">
                    <h5 className="card-title text-primary fw-bold">{tarefa.titulo}</h5>
                    <p className="text-muted mb-2">{tarefa.descricao || "Sem descrição."}</p>
                    <p><strong>Prioridade:</strong> {tarefa.prioridade}</p>
                    <p><strong>Status:</strong> {tarefa.status}</p>
                    <p><strong>Data de Criação:</strong> {tarefa.dataCriacao}</p>
                    <p><strong>Data de Conclusão:</strong> {tarefa.dataConclusao || "-"}</p>
                    <p><strong>Projeto:</strong> {tarefa.projeto?.nome || "-"}</p>
                    <p><strong>Responsável:</strong> {tarefa.usuario?.nome || "-"}</p>
                    {tempoGasto && <p><strong>Tempo Gasto:</strong> {tempoGasto}</p>}

                    <div className="d-flex justify-content-end gap-2 mt-3">
                      <button className="btn btn-sm btn-outline-primary" onClick={() => handleEditar(tarefa.id)}>Editar</button>
                      <button className="btn btn-sm btn-outline-danger" onClick={() => handleExcluir(tarefa.id)}>Excluir</button>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-white text-center">Nenhuma tarefa encontrada.</p>
          )}
        </div>
      </section>

      <Rodape />

      {mostrarModalConfirmacao && (
        <Modal
          titulo="Confirmar Exclusão"
          texto="Deseja realmente excluir esta tarefa?"
          txtBtn1="Sim, excluir"
          txtBtn2="Cancelar"
          onClickBtn1={confirmarExclusao}
          onClickBtn2={() => setMostrarModalConfirmacao(false)}
          onClickBtnClose={() => setMostrarModalConfirmacao(false)}
        />
      )}

      {mostrarModalSucesso && (
        <Modal
          titulo="Tarefa Excluída"
          texto="A tarefa foi excluída com sucesso!"
          txtBtn1="OK"
          onClickBtn1={() => setMostrarModalSucesso(false)}
        />
      )}
    </>
  );
};

export default ListaTarefas;