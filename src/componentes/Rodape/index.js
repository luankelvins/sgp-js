import { useState } from "react";
import { Link } from "react-router-dom";
import miniatura from '../../assets/treina_recife_miniatura.png';
import EasterEgg from "../EasterEgg";

function Rodape() {
  const [ativarEasterEgg, setAtivarEasterEgg] = useState(false);

  const handleClickEasterEgg = () => {
    setAtivarEasterEgg(true);
  };

  return (
    <div className="container">
      <footer className="d-flex flex-wrap justify-content-between align-items-center py-3 my-4 border-top">
        <p
          className="col-md-4 mb-0 text-body-secondary"
          style={{ cursor: "pointer" }}
          onClick={handleClickEasterEgg}
          title="Clique aqui... se você ousar 🕵️‍♂️"
        >
          Treina Recife &copy; {new Date().getFullYear()}
        </p>

        <Link
          to="/dashboard"
          className="col-md-4 d-flex align-items-center justify-content-center mb-3 mb-md-0 me-md-auto link-body-emphasis text-decoration-none"
        >
          <img src={miniatura} alt="Treina Recife" width="50px" />
        </Link>

        <ul className="nav col-md-4 justify-content-end">
          <li className="nav-item">
            <Link className="nav-link px-2 text-body-secondary" to="/dashboard">
              Dashboard
            </Link>
          </li>
        </ul>
      </footer>

      <EasterEgg ativar={ativarEasterEgg} />
    </div>
  );
}

export default Rodape;