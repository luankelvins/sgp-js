import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import Cabecalho from "../../componentes/Cabecalho";
import Rodape from "../../componentes/Rodape";
import fotoPadrao from "../../assets/treina_recife_miniatura.png";
import { AuthContext } from "../../context/AuthContext";
import { calcularIdade } from "../../utils/idade";

function PerfilUsuario() {
  const navigate = useNavigate();
  const { usuario } = useContext(AuthContext);

  const handleEditarPerfil = () => {
    navigate("/perfil/editar");
  };

  if (!usuario) {
    return (
      <>
        <Cabecalho />
        <div className="container text-white text-center mt-5">
          <h4>Carregando dados do perfil...</h4>
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
        <div className="container col-md-6 bg-white text-dark p-4 rounded shadow text-center">
          <img
            src={usuario.foto || fotoPadrao}
            alt="Foto do usuário"
            className="rounded-circle mb-3"
            width="100"
          />
          <h3 className="mb-3">{usuario.nome}</h3>

          <p><strong>E-mail:</strong> {usuario.email}</p>
          <p><strong>CPF:</strong> {usuario.cpf}</p>
          <p><strong>Idade:</strong> {calcularIdade(usuario.dataNascimento)}</p>
          <p><strong>Status:</strong> {usuario.status}</p>

          <div className="d-grid gap-2 mt-4">
            <button
              className="btn btn-outline-primary"
              onClick={handleEditarPerfil}
            >
              Editar Perfil
            </button>
          </div>
        </div>
      </section>
      <Rodape />
    </>
  );
}

export default PerfilUsuario;