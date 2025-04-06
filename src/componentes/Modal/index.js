import { useEffect } from "react";

function Modal({
  titulo,
  texto,
  txtBtn1 = "Salvar",
  txtBtn2 = "Cancelar",
  onClickBtn1,
  onClickBtn2,
  onClickBtnClose,
}) {
  
  useEffect(() => {
    document.body.classList.add("modal-open");

    return () => {
      document.body.classList.remove("modal-open");
    };
  }, []);

  return (
    <div
      className="modal fade show d-block"
      tabIndex="-1"
      role="dialog"
      aria-modal="true"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">

          <div className="modal-header">
            <h5 className="modal-title">{titulo}</h5>
            {onClickBtnClose && (
              <button
                type="button"
                className="btn-close"
                aria-label="Fechar"
                onClick={onClickBtnClose}
              ></button>
            )}
          </div>

          <div className="modal-body">
            <p>{texto}</p>
          </div>

          <div className="modal-footer">
            {onClickBtn2 && (
              <button type="button" className="btn btn-secondary" onClick={onClickBtn2}>
                {txtBtn2}
              </button>
            )}
            {onClickBtn1 && (
              <button type="button" className="btn btn-primary" onClick={onClickBtn1}>
                {txtBtn1}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Modal; 