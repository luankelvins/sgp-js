import Alerta from "../../componentes/Alerta";
import Cabecalho from "../../componentes/Cabecalho";
import Rodape from "../../componentes/Rodape";
import robot from "../../assets/robo_404.png";

function Pagina404() {
  return (
    <>
      <Cabecalho />

      <section
        className="container-fluid py-5 d-flex align-items-center justify-content-center"
        style={{ backgroundColor: "#0d1b2a", minHeight: "100vh" }}
      >
        <div className="container bg-white text-dark p-5 rounded shadow text-center col-md-6">
          <h2 className="mb-4">Página não encontrada</h2>

          <Alerta texto="Erro 404: Esta página não existe!" />

          <img
            src={robot}
            alt="Erro 404"
            className="img-fluid my-4"
            style={{ maxWidth: "250px" }}
          />

          <p className="mb-0">
            A URL que você tentou acessar não está disponível.
          </p>
          <p>Verifique o endereço ou volte para a página inicial.</p>

          <a href="/" className="btn btn-primary mt-3">
            Ir para a Home
          </a>
        </div>
      </section>

      <Rodape />
    </>
  );
}

export default Pagina404;