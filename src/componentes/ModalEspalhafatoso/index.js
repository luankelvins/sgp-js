import "../ModalEspalhafatoso/modalespalhafatoso.css";

function ModalEspalhafatoso({ onClose }) {
  return (
    <div className="easter-overlay">
      <div className="easter-modal-border">
        <div className="easter-modal-content">
          <h2 className="easter-mensagem">🧙‍♂️ Você é um mago curioso!</h2>
          <p className="easter-subtexto">
            Parabéns! Você desbloqueou um segredo escondido no sistema.
          </p>

          <button className="easter-btn" onClick={onClose}>
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}

export default ModalEspalhafatoso;