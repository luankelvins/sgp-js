import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from '../../assets/sgp_logo_horizontal.png';
import Modal from "../Modal";
import { LISTA_USUARIOS } from "../../mocks/usuarios";

function Cabecalho() {
  const navigate = useNavigate();
  const [mostrarModalLogout, setMostrarModalLogout] = useState(false);

  const handleLogout = () => {
    setMostrarModalLogout(true);
  };

  const confirmarLogout = () => {
    navigate("/");
  };

const usuarioLogado = LISTA_USUARIOS[0];

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
              <form className="d-flex" role="search">
                <input className="form-control me-2" type="search" placeholder="Buscar" aria-label="Buscar" />
                <button className="btn btn-primary" type="submit">Buscar</button>
              </form>

              <div className="dropdown">
                <button
                  className="btn dropdown-toggle p-0 border-0 bg-transparent"
                  type="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <img
                    src={usuarioLogado.foto}
                    alt="Perfil"
                    className="rounded-circle"
                    width="40"
                    height="40"
                  />
                </button>
                <ul className="dropdown-menu dropdown-menu-end">
                  <li><Link className="dropdown-item" to="/perfil">Perfil</Link></li>
                  <li><Link className="dropdown-item" to="/seguranca">Segurança</Link></li>
                  <li><hr className="dropdown-divider" /></li>
                  <li><button className="dropdown-item" onClick={handleLogout}>Logout</button></li>
                </ul>
              </div>
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