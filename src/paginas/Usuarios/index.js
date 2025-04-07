import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Cabecalho from "../../componentes/Cabecalho";
import Rodape from "../../componentes/Rodape";
import Modal from "../../componentes/Modal";
import { listarUsuarios, excluirUsuario } from "../../servicos/usuarios";
import { calcularIdade } from "../../utils/idade";

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

  return (
    <>
      <Cabecalho />
      <div style={{ backgroundColor: "#0d1b2a", minHeight: "100vh" }}>
        <section className="container py-5">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h1 className="text-white mb-0">Usuários Cadastrados</h1>
            <button className="btn btn-success" onClick={handleAdicionar}>
              Adicionar Usuário
            </button>
          </div>

          {/* Tabela responsiva para desktop */}
          <div className="bg-white rounded shadow p-3 d-none d-md-block">
            <table className="table table-bordered table-striped text-center mb-0">
              <thead>
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
                    <tr key={usuario.id}>
                      <td>{usuario.id}</td>
                      <td>{usuario.nome}</td>
                      <td>{usuario.cpf}</td>
                      <td>{usuario.email}</td>
                      <td>{calcularIdade(usuario.dataNascimento)}</td>
                      <td>{usuario.status}</td>
                      <td>
                        <button
                          className="btn btn-sm btn-primary me-2"
                          onClick={() => handleEditar(usuario.id)}
                        >
                          Editar
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleExcluir(usuario.id)}
                        >
                          Excluir
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7">Nenhum usuário encontrado.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Layout responsivo para mobile */}
          <div className="d-block d-md-none">
            {usuarios.length > 0 ? (
              usuarios.map((usuario) => (
                <div key={usuario.id} className="card mb-3">
                  <div className="card-body">
                    <h5 className="card-title">{usuario.nome}</h5>
                    <p className="card-text"><strong>CPF:</strong> {usuario.cpf}</p>
                    <p className="card-text"><strong>Email:</strong> {usuario.email}</p>
                    <p className="card-text"><strong>Idade:</strong> {calcularIdade(usuario.dataNascimento)}</p>
                    <p className="card-text"><strong>Status:</strong> {usuario.status}</p>
                    <div className="d-flex justify-content-end gap-2">
                      <button
                        className="btn btn-sm btn-primary"
                        onClick={() => handleEditar(usuario.id)}
                      >
                        Editar
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
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