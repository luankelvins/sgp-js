import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Cabecalho from "../../componentes/Cabecalho";
import Rodape from "../../componentes/Rodape";
import Modal from "../../componentes/Modal";
import { editarUsuario, buscarUsuarioPorId } from "../../servicos/usuarios";
import { formatarData, formatarDataParaInput } from "../../utils/data";

function EditarUsuario() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [usuario, setUsuario] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [mostrarModal, setMostrarModal] = useState(null); // "cancelar" | "sucesso"

  useEffect(() => {
    async function carregarUsuario() {
      try {
        const resposta = await buscarUsuarioPorId(id);
        const usuarioFormatado = {
          ...resposta.data,
          dataNascimento: formatarDataParaInput(resposta.data.dataNascimento),
        };
        setUsuario(usuarioFormatado);
      } catch (erro) {
        console.error("Erro ao carregar o usuário:", erro);
        alert("Erro ao carregar os dados do usuário.");
        navigate("/usuarios");
      } finally {
        setCarregando(false);
      }
    }

    carregarUsuario();
  }, [id, navigate]);

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
      const payload = {
        ...usuario,
        dataNascimento: formatarData(usuario.dataNascimento),
      };

      await editarUsuario(usuario.id, payload);
      setMostrarModal("sucesso");
    } catch (error) {
      console.error("Erro ao atualizar o usuário:", error);
      alert("Erro ao atualizar o usuário.");
    }
  };

  const handleCancelar = () => setMostrarModal("cancelar");
  const confirmarCancelamento = () => navigate("/usuarios");
  const confirmarSucesso = () => navigate("/usuarios");

  if (carregando) {
    return (
      <div className="text-center text-white mt-5">
        <h4>Carregando dados do usuário...</h4>
      </div>
    );
  }

  if (!usuario) {
    return (
      <>
        <Cabecalho />
        <div className="container text-center mt-5 text-white">
          <h4>Usuário não encontrado.</h4>
        </div>
        <Rodape />
      </>
    );
  }

  return (
    <>
      <Cabecalho />
      <section
        className="container-fluid py-5"
        style={{ backgroundColor: "#0d1b2a", minHeight: "100vh" }}
      >
        <div className="container col-md-6 bg-white text-dark p-4 rounded shadow">
          <h2 className="mb-4 text-center">Editar Usuário</h2>

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
                id="email"
                type="email"
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

            <div className="mb-4">
              <label htmlFor="status" className="form-label">Status</label>
              <select
                id="status"
                className="form-control"
                name="status"
                value={usuario.status}
                onChange={handleChange}
                required
              >
                <option value="ATIVO">ATIVO</option>
                <option value="INATIVO">INATIVO</option>
              </select>
            </div>

            <button type="submit" className="btn btn-success w-100 mb-2">
              Salvar Alterações
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

      {mostrarModal === "cancelar" && (
        <Modal
          titulo="Cancelar Edição"
          texto="Deseja cancelar a edição do usuário?"
          txtBtn1="Sim, cancelar"
          txtBtn2="Continuar editando"
          onClickBtn1={confirmarCancelamento}
          onClickBtn2={() => setMostrarModal(null)}
          onClickBtnClose={() => setMostrarModal(null)}
        />
      )}

      {mostrarModal === "sucesso" && (
        <Modal
          titulo="Usuário Atualizado"
          texto="As alterações foram salvas com sucesso!"
          txtBtn1="OK"
          onClickBtn1={confirmarSucesso}
        />
      )}
    </>
  );
}

export default EditarUsuario;