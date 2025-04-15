import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Cabecalho from "../../componentes/Cabecalho";
import Rodape from "../../componentes/Rodape";
import Modal from "../../componentes/Modal";
import { listarUsuarios, excluirUsuario } from "../../servicos/usuarios";
import { calcularIdade } from "../../utils/idade";
import autoTable from "jspdf-autotable";
import jsPDF from "jspdf";
import logo from "../../assets/sgp_logo_horizontal.png";
import { FaFilePdf } from "react-icons/fa";

function Usuarios() {
  const navigate = useNavigate();
  const [usuarios, setUsuarios] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [mostrarModalExcluir, setMostrarModalExcluir] = useState(false);
  const [usuarioParaExcluir, setUsuarioParaExcluir] = useState(null);

  useEffect(() => {
    async function carregarUsuarios() {
      try {
        const resposta = await listarUsuarios();
        if (Array.isArray(resposta.data.content)) {
          const ordenadoPorId = resposta.data.content.sort((a, b) => a.id - b.id);
          setUsuarios(ordenadoPorId);
        } else {
          setUsuarios([]);
        }
      } catch (erro) {
        console.error("Erro ao carregar usuários:", erro);
        setUsuarios([]);
      } finally {
        setCarregando(false);
      }
    }

    carregarUsuarios();
  }, []);

  const handleEditar = (id) => navigate(`/usuarios/${id}/editar`);
  const handleAdicionar = () => navigate("/usuarios/novo");

  const handleExcluir = (id) => {
    setUsuarioParaExcluir(id);
    setMostrarModalExcluir(true);
  };

  const confirmarExclusao = async () => {
    try {
      await excluirUsuario(usuarioParaExcluir);
      setUsuarios((prev) => prev.filter((u) => u.id !== usuarioParaExcluir));
    } catch (erro) {
      alert("Erro ao excluir o usuário.");
    } finally {
      setMostrarModalExcluir(false);
      setUsuarioParaExcluir(null);
    }
  };

  const handleExportarPdf = () => {
    if (usuarios.length === 0) {
      alert("Nenhuma tarefa para exportar.");
      return;
    }

    const doc = new jsPDF("p", "mm", "a4");
    const dataAtual = new Date().toLocaleString("pt-BR");
    const paginaLargura = doc.internal.pageSize.getWidth();
    const paginaAltura = doc.internal.pageSize.getHeight();

    doc.addImage(logo, "PNG", 10, 10, 25, 25);

    doc.setFontSize(18);
    doc.setTextColor(13, 27, 42);
    doc.text("RELATÓRIO DE TAREFAS", paginaLargura / 2, 20, { align: "center" });

    doc.setFontSize(12);
    doc.setTextColor(80);
    doc.text("Sistema de Gerenciamento", paginaLargura / 2, 28, { align: "center" });

    autoTable(doc, {
      startY: 40,
      head: [[
        "ID",
        "Nome",
        "CPF",
        "Email",
        "Idade",
        "Status",
      ]],
      body: usuarios.map((t) => [
        t.id,
        t.nome,
        t.cpf,
        t.email || "-",
        calcularIdade(t.dataNascimento),
        t.status || "-",

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
      didDrawPage: (data) => {
        const pageNumber = doc.internal.getCurrentPageInfo().pageNumber;
        doc.setFontSize(9);
        doc.setTextColor(100);
        doc.text(`Página ${pageNumber}`, paginaLargura / 2, paginaAltura - 10, { align: "center" });
        doc.text(`Exportado em: ${dataAtual}`, paginaLargura - 10, paginaAltura - 10, { align: "right" });
      },
    });

    doc.save("relação de usuários.pdf");
  };

  return (
    <>
      <Cabecalho />
      <div style={{ backgroundColor: "#0d1b2a", minHeight: "100vh" }}>
        <section className="container py-5">
          <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
            <h2 className="text-white fw-bold mb-0">Usuários Cadastrados</h2>

            <div className="d-flex gap-2">
              <button
                className="btn btn-outline-light btn-sm d-flex align-items-center gap-1"
                onClick={handleExportarPdf}
              >
                <FaFilePdf />
                Exportar PDF
              </button>
              <button
                className="btn btn-success btn-sm"
                onClick={handleAdicionar}
              >
                + Novo Usuário
              </button>
            </div>
          </div>

          {/* Tabela para desktop */}
          <div className="bg-white rounded shadow p-3 d-none d-md-block">
            <table className="table table-striped table-hover table-bordered align-middle mb-0">
              <thead className="table-dark text-center">
                <tr>
                  <th>ID</th>
                  <th>NOME</th>
                  <th>CPF</th>
                  <th>E-MAIL</th>
                  <th>IDADE</th>
                  <th>STATUS</th>
                  <th>AÇÕES</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.length > 0 ? (
                  usuarios.map((usuario) => (
                    <tr key={usuario.id} className="text-center">
                      <td>{usuario.id}</td>
                      <td className="text-start">{usuario.nome}</td>
                      <td>{usuario.cpf}</td>
                      <td>{usuario.email}</td>
                      <td>{calcularIdade(usuario.dataNascimento)}</td>
                      <td>
                        <span className={`badge ${usuario.status === "ATIVO" ? "bg-success" : "bg-secondary"}`}>
                          {usuario.status}
                        </span>
                      </td>
                      <td>
                        <button
                          className="btn btn-sm btn-outline-primary me-2"
                          onClick={() => handleEditar(usuario.id)}
                        >
                          Editar
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleExcluir(usuario.id)}
                        >
                          Excluir
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center">Nenhum usuário encontrado.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Cards para mobile */}
          <div className="d-block d-md-none mt-3">
            {usuarios.length > 0 ? (
              usuarios.map((usuario) => (
                <div key={usuario.id} className="card mb-3 shadow-sm border-0">
                  <div className="card-body">
                    <h5 className="card-title fw-bold text-primary">{usuario.nome}</h5>
                    <p><strong>CPF:</strong> {usuario.cpf}</p>
                    <p><strong>Email:</strong> {usuario.email}</p>
                    <p><strong>Idade:</strong> {calcularIdade(usuario.dataNascimento)}</p>
                    <p>
                      <strong>Status:</strong>{" "}
                      <span className={`badge ${usuario.status === "ATIVO" ? "bg-success" : "bg-secondary"}`}>
                        {usuario.status}
                      </span>
                    </p>
                    <div className="d-flex justify-content-end gap-2 mt-3">
                      <button
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => handleEditar(usuario.id)}
                      >
                        Editar
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleExcluir(usuario.id)}
                      >
                        Excluir
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-white">Nenhum usuário encontrado.</p>
            )}
          </div>
        </section>
      </div>

      <Rodape />

      {mostrarModalExcluir && (
        <Modal
          titulo="Excluir Usuário"
          texto="Tem certeza que deseja excluir este usuário?"
          txtBtn1="Sim, excluir"
          txtBtn2="Cancelar"
          onClickBtn1={confirmarExclusao}
          onClickBtn2={() => setMostrarModalExcluir(false)}
          onClickBtnClose={() => setMostrarModalExcluir(false)}
        />
      )}
    </>
  );
}

export default Usuarios;