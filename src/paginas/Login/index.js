import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/sgp_logo_vertical.png";
import './login.css';
import { autenticar } from "../../servicos/usuarios";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState(null);
  const [carregando, setCarregando] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCarregando(true);
    setErro(null);

    const dados = { email, senha };
    console.log("📤 Enviando:", dados);

    try {
      const res = await autenticar(email, senha);
      console.log("✅ Usuário autenticado:", res.data);

      // Salva o usuário no localStorage (você pode usar isso pra manter login)
      localStorage.setItem("usuario", JSON.stringify(res.data));

      // Redireciona para o dashboard
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
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <div id="emailHelp" className="form-text">Nunca compartilhe suas credenciais.</div>
          </div>

          <div className="mb-3">
            <label htmlFor="senha" className="form-label">Senha</label>
            <input
              type="password"
              className="form-control"
              id="senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
            />
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