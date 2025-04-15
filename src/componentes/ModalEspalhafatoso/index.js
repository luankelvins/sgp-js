import "./ModalEspalhafatoso.css";
import brownie from "../../assets/brownie.gif"; // troque pelo seu brownie divertido

function ModalEspalhafatoso({ onClose }) {
  return (
    <div className="easter-overlay">
      <div className="easter-modal-border">
        <div className="easter-modal-content">
          <img src={brownie} alt="Brownie Mágico" className="brownie-img" />

          <h2 className="easter-mensagem">
            🧙‍♂️ Você é um mago curioso!
            <br />
            🍫 Parabéns, você ganhou um brownie mágico!
          </h2>

          <button className="easter-btn" onClick={onClose}>Fechar</button>
        </div>
      </div>
    </div>
  );
}

export default ModalEspalhafatoso;