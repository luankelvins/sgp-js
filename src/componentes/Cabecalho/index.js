import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from '../../assets/sgp_logo_horizontal.png';
import Modal from "../Modal";

function Cabecalho() {
  const navigate = useNavigate();
  const [mostrarModalLogout, setMostrarModalLogout] = useState(false);
  const [usuarioLogado, setUsuarioLogado] = useState(null);

  useEffect(() => {
    const usuarioSalvo = localStorage.getItem("usuario");
    if (usuarioSalvo) {
      setUsuarioLogado(JSON.parse(usuarioSalvo));
    }
  }, []);

  const handleLogout = () => {
    setMostrarModalLogout(true);
  };

  const confirmarLogout = () => {
    localStorage.removeItem("usuario"); n
    navigate("/");
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg bg-body-tertiary shadow-sm">
        <div className="container">
          <Link className="navbar-brand" to="/dashboard">
            <img src={logo} alt="Treina Recife" width="250px" />
          </Link>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse justify-content-between" id="navbarNav">
            <ul className="navbar-nav">
              <li className="nav-item">
                <Link className="nav-link" to="/dashboard">Dashboard</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/tarefas">Tarefas</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/projetos">Projetos</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/usuarios">Usuários</Link>
              </li>
            </ul>

            <div className="d-flex align-items-center gap-3">
              {usuarioLogado && (
                <div className="dropdown">
                  <button
                    className="btn dropdown-toggle p-0 border-0 bg-transparent"
                    type="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <img
                      src={usuarioLogado.foto || logo}
                      alt="Perfil"
                      className="rounded-circle"
                      width="40"
                      height="40"
                    />
                  </button>
                  <ul
                    className="dropdown-menu dropdown-menu-end shadow"
                    style={{
                      minWidth: "180px",
                      borderRadius: "0.5rem",
                      padding: "0.5rem 0",
                    }}
                  >
                    <li>
                      <Link className="dropdown-item py-2 px-3" to="/perfil">
                        Perfil
                      </Link>
                    </li>
                    <li>
                      <Link className="dropdown-item py-2 px-3" to="/seguranca">
                        Segurança
                      </Link>
                    </li>
                    <li><hr className="dropdown-divider my-1" /></li>
                    <li>
                      <button className="dropdown-item py-2 px-3" onClick={handleLogout}>
                        Logout
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {mostrarModalLogout && (
        <Modal
          titulo="Sair do sistema"
          texto="Tem certeza que deseja sair?"
          txtBtn1="OK"
          txtBtn2="Cancelar"
          onClickBtn1={confirmarLogout}
          onClickBtn2={() => setMostrarModalLogout(false)}
          onClickBtnClose={() => setMostrarModalLogout(false)}
        />
      )}
    </>
  );
}

export default Cabecalho;