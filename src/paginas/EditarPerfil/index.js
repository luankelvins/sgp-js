import React, { useState, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Cabecalho from "../../componentes/Cabecalho";
import Rodape from "../../componentes/Rodape";
import Modal from "../../componentes/Modal";
import { AuthContext } from "../../context/AuthContext";
import { atualizarUsuario } from "../../servicos/usuarios";
import { formatarDataParaInput } from "../../utils/data";
import fotoPadrao from "../../assets/treina_recife_miniatura.png";

function EditarPerfilUsuario() {
  const navigate = useNavigate();
  const { usuario, login } = useContext(AuthContext);
  const [usuarioEditado, setUsuarioEditado] = useState({ ...usuario });
  const [mostrarModal, setMostrarModal] = useState(null);
  const inputFileRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUsuarioEditado((prev) => ({ ...prev, [name]: value }));
  };

  const handleFotoClick = () => {
    inputFileRef.current.click();
  };

  const handleFotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUsuarioEditado((prev) => ({ ...prev, foto: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const { idade, ...dadosLimpos } = usuarioEditado;
  
    const usuarioParaEnviar = {
      ...dadosLimpos,
      dataNascimento: formatarData(usuarioEditado.dataNascimento) // envia como dd/MM/yyyy
    };
  
    console.log("📤 Enviando para o backend:", usuarioParaEnviar);
  
    try {
      const resposta = await atualizarUsuario(usuarioParaEnviar.id, usuarioParaEnviar);
      login(resposta.data);
      setMostrarModal("sucesso");
    } catch (erro) {
      console.error("Erro ao atualizar o perfil:", erro);
      if (erro.response?.data?.message) {
        alert("Erro ao salvar: " + erro.response.data.message);
      } else {
        alert("Erro ao salvar perfil.");
      }
    }
  };

  return (
    <>
      <Cabecalho />
      <section
        className="container-fluid py-5"
        style={{ backgroundColor: "#0d1b2a", minHeight: "100vh" }}
      >
        <div className="container col-md-6 bg-white p-4 rounded shadow text-dark">
          <h2 className="text-center mb-4">Editar Perfil</h2>

          <form onSubmit={handleSubmit}>
            <div className="text-center mb-4">
              <img
                src={usuarioEditado.foto || fotoPadrao}
                alt="Foto do usuário"
                className="rounded-circle mb-3"
                width="100"
                style={{ cursor: "pointer" }}
                onClick={handleFotoClick}
                title="Clique para trocar a foto"
              />
              <input
                type="file"
                ref={inputFileRef}
                accept="image/*"
                onChange={handleFotoChange}
                style={{ display: "none" }}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Nome</label>
              <input
                type="text"
                className="form-control"
                name="nome"
                value={usuarioEditado.nome}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">CPF</label>
              <input
                type="text"
                className="form-control"
                name="cpf"
                value={usuarioEditado.cpf}
                readOnly
              />
            </div>

            <div className="mb-3">
              <label className="form-label">E-mail</label>
              <input
                type="email"
                className="form-control"
                name="email"
                value={usuarioEditado.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-4">
              <label className="form-label">Data de Nascimento</label>
              <input
                type="date"
                className="form-control"
                name="dataNascimento"
                value={formatarDataParaInput(usuarioEditado.dataNascimento)}
                onChange={handleChange}
              />
            </div>

            <hr className="my-4" />

            <div className="d-grid gap-2">
              <button type="submit" className="btn btn-success">
                Salvar
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => navigate("/perfil")}
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </section>

      <Rodape />

      {mostrarModal === "sucesso" && (
        <Modal
          titulo="Perfil Atualizado"
          texto="Seus dados foram atualizados com sucesso!"
          txtBtn1="OK"
          onClickBtn1={() => navigate("/perfil")}
        />
      )}
    </>
  );
}

export default EditarPerfilUsuario;