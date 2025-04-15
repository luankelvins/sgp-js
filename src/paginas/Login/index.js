import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/sgp_logo_vertical.png";
import './login.css';
import { autenticar } from "../../servicos/usuarios";
import { AuthContext } from "../../context/AuthContext";

function Login() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [erro, setErro] = useState(null);
  const [carregando, setCarregando] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCarregando(true);
    setErro(null);

    try {
      const res = await autenticar(email, senha);
      console.log("✅ Usuário autenticado:", res.data);

      login(res.data);
      navigate("/dashboard");
    } catch (erro) {
      console.error("❌ Erro de login:", erro);
      setErro("Email ou senha inválidos.");
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="bg-container">
      <div className="login-container">
        <div className="d-flex justify-content-center">
          <img src={logo} alt="Sistema de Gerenciamento de Projetos" width={"200px"} />
        </div>

        <form className="container" onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">E-mail</label>
            <input
              type="email"
              className="form-control"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value.toLowerCase())}
              style={{ textTransform: "lowercase" }}
              required
            />
            <div id="emailHelp" className="form-text">Nunca compartilhe suas credenciais.</div>
          </div>

          <div className="mb-3">
            <label htmlFor="senha" className="form-label">Senha</label>
            <div className="input-group">
              <input
                type={mostrarSenha ? "text" : "password"}
                className="form-control"
                id="senha"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required
              />
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => setMostrarSenha(!mostrarSenha)}
                tabIndex={-1}
              >
                {mostrarSenha ? "Ocultar" : "Mostrar"}
              </button>
            </div>
          </div>

          <div className="mb-3 form-check">
            <input type="checkbox" className="form-check-input" id="manterConectado" />
            <label className="form-check-label" htmlFor="manterConectado">Mantenha-me conectado</label>
          </div>

          {erro && <div className="alert alert-danger">{erro}</div>}

          <button type="submit" className="btn btn-primary w-100" disabled={carregando}>
            {carregando ? "Acessando..." : "Acessar"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;