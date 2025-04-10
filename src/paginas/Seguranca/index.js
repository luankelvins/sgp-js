import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import Cabecalho from "../../componentes/Cabecalho";
import Rodape from "../../componentes/Rodape";
import Modal from "../../componentes/Modal";
import { AuthContext } from "../../context/AuthContext";
import { trocarSenha } from "../../servicos/usuarios";

function TrocarSenha() {
  const navigate = useNavigate();
  const { usuario } = useContext(AuthContext);

  const [senhaAtual, setSenhaAtual] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");

  const [mostrarSenhaAtual, setMostrarSenhaAtual] = useState(false);
  const [mostrarNovaSenha, setMostrarNovaSenha] = useState(false);
  const [mostrarConfirmarSenha, setMostrarConfirmarSenha] = useState(false);

  const [erro, setErro] = useState("");
  const [mostrarModal, setMostrarModal] = useState(null);

  const senhaValida = {
    maiuscula: /[A-Z]/.test(novaSenha),
    minuscula: /[a-z]/.test(novaSenha),
    numero: /\d/.test(novaSenha),
    especial: /[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/.test(novaSenha),
    minimo: novaSenha.length >= 8,
  };

  const todosValidos = Object.values(senhaValida).every(Boolean);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!todosValidos) {
      setErro("A nova senha não atende aos requisitos.");
      return;
    }

    if (novaSenha !== confirmarSenha) {
      setErro("As senhas não coincidem.");
      return;
    }

    try {
      await trocarSenha(usuario.id, senhaAtual, novaSenha);
      setMostrarModal("sucesso");
    } catch (erro) {
      console.error("Erro ao trocar senha:", erro);
      const mensagem = erro.response?.data?.message || "Erro ao trocar a senha.";
      setErro(mensagem);
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
          <h2 className="text-center mb-4">Trocar Senha</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Senha Atual</label>
              <div className="input-group">
                <input
                  type={mostrarSenhaAtual ? "text" : "password"}
                  className="form-control"
                  value={senhaAtual}
                  onChange={(e) => setSenhaAtual(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => setMostrarSenhaAtual(!mostrarSenhaAtual)}
                >
                  {mostrarSenhaAtual ? "Ocultar" : "Mostrar"}
                </button>
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label">Nova Senha</label>
              <div className="input-group">
                <input
                  type={mostrarNovaSenha ? "text" : "password"}
                  className="form-control"
                  value={novaSenha}
                  onChange={(e) => setNovaSenha(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => setMostrarNovaSenha(!mostrarNovaSenha)}
                >
                  {mostrarNovaSenha ? "Ocultar" : "Mostrar"}
                </button>
              </div>
              <div className="form-text">
                Sua senha deve conter:
                <ul className="mb-0 ps-3">
                  <li style={{ color: senhaValida.maiuscula ? "green" : "red" }}>Letra maiúscula</li>
                  <li style={{ color: senhaValida.minuscula ? "green" : "red" }}>Letra minúscula</li>
                  <li style={{ color: senhaValida.numero ? "green" : "red" }}>Número</li>
                  <li style={{ color: senhaValida.especial ? "green" : "red" }}>Caractere especial</li>
                  <li style={{ color: senhaValida.minimo ? "green" : "red" }}>Mínimo 8 caracteres</li>
                </ul>
              </div>
            </div>

            <div className="mb-4">
              <label className="form-label">Confirmar Nova Senha</label>
              <div className="input-group">
                <input
                  type={mostrarConfirmarSenha ? "text" : "password"}
                  className="form-control"
                  value={confirmarSenha}
                  onChange={(e) => setConfirmarSenha(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => setMostrarConfirmarSenha(!mostrarConfirmarSenha)}
                >
                  {mostrarConfirmarSenha ? "Ocultar" : "Mostrar"}
                </button>
              </div>
            </div>

            {erro && <div className="alert alert-danger">{erro}</div>}

            <div className="d-grid gap-2">
              <button type="submit" className="btn btn-primary">Salvar Nova Senha</button>
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
          titulo="Senha Atualizada"
          texto="Sua senha foi alterada com sucesso!"
          txtBtn1="OK"
          onClickBtn1={() => navigate("/perfil")}
        />
      )}
    </>
  );
}

export default TrocarSenha;