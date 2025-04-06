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
    return <p>Carregando dados do perfil...</p>;
  }

  return (
    <>
      <Cabecalho />
      <section
        className="container-fluid py-5"
        style={{ backgroundColor: "#0d1b2a", minHeight: "100vh", color: "white" }}
      >
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-6 text-center bg-white text-dark p-4 rounded shadow">
              <img
                src={fotoPadrao}
                alt="Foto do usuário"
                className="rounded-circle mb-3"
                width="100"
              />
              <h3>{usuario.nome}</h3>
              <p><strong>E-mail:</strong> {usuario.email}</p>
              <p><strong>CPF:</strong> {usuario.cpf}</p>
              <p><strong>Idade:</strong> {calcularIdade(usuario.dataNascimento)}</p>

              <button
                className="btn btn-outline-primary mt-3"
                onClick={handleEditarPerfil}
              >
                Editar Perfil
              </button>
            </div>
          </div>
        </div>
      </section>
      <Rodape />
    </>
  );
}

export default PerfilUsuario;