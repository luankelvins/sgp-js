return (
  <>
    <Cabecalho />

    <section style={{ backgroundColor: "#0d1b2a", minHeight: "100vh" }}>
      <div className="container py-5">

        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="text-white fw-bold mb-0">Lista de Tarefas</h2>
          <div className="d-flex gap-2">
            <button
              className="btn btn-outline-light btn-sm d-flex align-items-center gap-1"
              onClick={handleExportarPdf}
            >
              <FaFilePdf />
              Exportar PDF
            </button>
            <button className="btn btn-success btn-sm" onClick={handleAdicionarTarefa}>
              + Nova Tarefa
            </button>
          </div>
        </div>

        <div className="row g-3 mb-4 text-white">
          <div className="col-md-4">
            <label>Status</label>
            <select
              className="form-select form-select-sm"
              value={filtroStatus}
              onChange={(e) => setFiltroStatus(e.target.value)}
            >
              <option value="">Todos</option>
              <option value="PENDENTE">PENDENTE</option>
              <option value="FAZENDO">FAZENDO</option>
              <option value="FINALIZADA">FINALIZADA</option>
            </select>
          </div>
          <div className="col-md-4">
            <label>Projeto</label>
            <select
              className="form-select form-select-sm"
              value={filtroProjeto}
              onChange={(e) => setFiltroProjeto(e.target.value)}
            >
              <option value="">Todos</option>
              {projetos.map((projeto) => (
                <option key={projeto.id} value={projeto.nome}>
                  {projeto.nome}
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-4">
            <label>Prioridade</label>
            <select
              className="form-select form-select-sm"
              value={filtroPrioridade}
              onChange={(e) => setFiltroPrioridade(e.target.value)}
            >
              <option value="">Todas</option>
              <option value="ALTA">ALTA</option>
              <option value="MEDIA">MEDIA</option>
              <option value="BAIXA">BAIXA</option>
            </select>
          </div>
        </div>

        <div className="d-flex flex-wrap justify-content-end gap-2 mb-4">
          <button className="btn btn-primary btn-sm" onClick={aplicarFiltros}>
            Filtrar
          </button>
          <button className="btn btn-secondary btn-sm" onClick={limparFiltros}>
            Limpar
          </button>
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
                    <button className="btn btn-sm btn-outline-primary" onClick={() => handleEditar(tarefa.id)}>
                      Editar
                    </button>
                    <button className="btn btn-sm btn-outline-danger" onClick={() => handleExcluir(tarefa.id)}>
                      Excluir
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-white text-center">Nenhuma tarefa encontrada.</p>
        )}
      </div> {/* <- FECHAMENTO DA DIV "container" */}
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