import Alerta from "../../componentes/Alerta";
import Cabecalho from "../../componentes/Cabecalho";
import Rodape from "../../componentes/Rodape";
import robot from "../../assets/robo_404.png";

function Pagina404() {
    return (
        <>
            <Cabecalho />

            <section className="container mt-3" id="pagina-nao-encontrada"
             style={{ backgroundColor: "#0d1b2a", minHeight: "100vh" }}>
                <div className="text-center">
                    <Alerta texto="Erro 404: essa pagina nao existe!" />

                    <img src={robot} alt="Erro 404" width={"30%"} />
                </div>
            </section>

            <Rodape />
        </>
    );
}

export default Pagina404;