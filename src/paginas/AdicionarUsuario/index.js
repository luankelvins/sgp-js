import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Cabecalho from "../../componentes/Cabecalho";
import Rodape from "../../componentes/Rodape";
import Modal from "../../componentes/Modal";
import { salvarUsuario } from "../../servicos/usuarios";
import { formatarData } from "../../utils/data";

function AdicionarUsuario() {
  const navigate = useNavigate();

  const [mostrarModal, setMostrarModal] = useState(null);
  const [mostrarSenha, setMostrarSenha] = useState(false);

  const [usuario, setUsuario] = useState({
    nome: "",
    cpf: "",
    email: "",
    dataNascimento: "",
    status: "ATIVO",
    senhaTemporaria: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUsuario((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const usuarioFormatado = {
        ...usuario,
        senha: usuario.senhaTemporaria,
        dataNascimento: formatarData(usuario.dataNascimento),
      };
      delete usuarioFormatado.senhaTemporaria;

      await salvarUsuario(usuarioFormatado, setMostrarModal);
    } catch (error) {
      console.error("Erro ao tentar salvar o usuário:", error);
    }
  };

  const handleCancelar = () => setMostrarModal("cancelar");
  const confirmarAdicao = () => navigate("/usuarios");
  const confirmarCancelamento = () => navigate("/usuarios");

  return (
    <>
      <Cabecalho />
      <section className="container-fluid py-5" style={{ backgroundColor: "#0d1b2a", minHeight: "100vh" }}>
        <div className="container col-md-6 bg-white text-dark p-4 rounded shadow">
          <h2 className="mb-4 text-center fw-bold text-primary">Adicionar Novo Usuário</h2>

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="nome" className="form-label">Nome</label>
              <input
                id="nome"
                type="text"
                className="form-control"
                name="nome"
                value={usuario.nome}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="cpf" className="form-label">CPF</label>
              <input
                id="cpf"
                type="text"
                className="form-control"
                name="cpf"
                value={usuario.cpf}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="email" className="form-label">E-mail</label>
              <input
                type="email"
                id="email"
                className="form-control"
                name="email"
                value={usuario.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="dataNascimento" className="form-label">Data de Nascimento</label>
              <input
                id="dataNascimento"
                type="date"
                className="form-control"
                name="dataNascimento"
                value={usuario.dataNascimento}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="status" className="form-label">Status</label>
              <select
                id="status"
                className="form-select"
                name="status"
                value={usuario.status}
                onChange={handleChange}
                required
              >
                <option value="ATIVO">ATIVO</option>
                <option value="INATIVO">INATIVO</option>
              </select>
            </div>

            <div className="mb-4">
              <label htmlFor="senhaTemporaria" className="form-label">Senha Temporária</label>
              <div className="input-group">
                <input
                  id="senhaTemporaria"
                  type={mostrarSenha ? "text" : "password"}
                  className="form-control"
                  name="senhaTemporaria"
                  value={usuario.senhaTemporaria}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => setMostrarSenha(!mostrarSenha)}
                >
                  {mostrarSenha ? "Ocultar" : "Mostrar"}
                </button>
              </div>
            </div>

            <button type="submit" className="btn btn-success w-100 mb-2">
              Adicionar Novo Usuário
            </button>
            <button
              type="button"
              className="btn btn-outline-danger w-100"
              onClick={handleCancelar}
            >
              Cancelar
            </button>
          </form>
        </div>
      </section>

      <Rodape />

      {mostrarModal === true && (
        <Modal
          titulo="Usuário Adicionado"
          texto="O usuário foi adicionado com sucesso!"
          txtBtn1="OK"
          onClickBtn1={confirmarAdicao}
        />
      )}

      {mostrarModal === "cancelar" && (
        <Modal
          titulo="Cancelar Cadastro"
          texto="Deseja cancelar o cadastro do usuário?"
          txtBtn1="Sim, cancelar"
          txtBtn2="Continuar cadastrando"
          onClickBtn1={confirmarCancelamento}
          onClickBtn2={() => setMostrarModal(null)}
          onClickBtnClose={() => setMostrarModal(null)}
        />
      )}
    </>
  );
}

export default AdicionarUsuario;