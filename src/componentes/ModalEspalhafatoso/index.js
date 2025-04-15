import { useNavigate } from "react-router-dom";
import "../ModalEspalhafatoso/modalespalhafatoso.css";

function ModalEspalhafatoso() {
  const navigate = useNavigate();

  const handleFechar = () => {
    navigate(-1); // volta para a página anterior
  };

  return (
    <div className="easter-overlay">
      <div className="easter-modal-border">
        <div className="easter-modal-content">
          <h2 className="easter-mensagem">
            🧙‍♂️ Você é um mago curioso!
          </h2>
          <p className="easter-subtexto">
            Parabéns! Você desbloqueou um segredo escondido no sistema.
          </p>

          <button className="easter-btn" onClick={handleFechar}>
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}

export default ModalEspalhafatoso;