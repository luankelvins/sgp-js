import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Cabecalho from "../../componentes/Cabecalho";
import Rodape from "../../componentes/Rodape";
import Modal from "../../componentes/Modal";
import { listarUsuarios } from "../../servicos/usuarios";
import { buscarProjetoPorId, editarProjeto } from "../../servicos/projetos";

const EditarProjeto = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [usuarios, setUsuarios] = useState([]);
  const [projeto, setProjeto] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [mostrarModal, setMostrarModal] = useState(null); // "cancelar" | "sucesso"

  useEffect(() => {
    async function carregarDados() {
      try {
        const [resProjeto, resUsuarios] = await Promise.all([
          buscarProjetoPorId(id),
          listarUsuarios(),
        ]);

        setProjeto(resProjeto.data);
        const lista = Array.isArray(resUsuarios.data)
          ? resUsuarios.data
          : resUsuarios.data?.content || [];

        setUsuarios(lista);
      } catch (erro) {
        console.error("Erro ao carregar dados:", erro);
        alert("Erro ao carregar dados do projeto ou responsáveis.");
        navigate("/projetos");
      } finally {
        setCarregando(false);
      }
    }

    carregarDados();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "responsavelId") {
      const usuario = usuarios.find((u) => u.id === parseInt(value));
      setProjeto((prev) => ({ ...prev, responsavel: usuario }));
    } else {
      setProjeto((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        ...projeto,
        responsavel: {
          id: projeto.responsavel.id,
          nome: projeto.responsavel.nome,
        },
      };

      await editarProjeto(projeto.id, payload);
      setMostrarModal("sucesso");
    } catch (erro) {
      console.error("Erro ao atualizar projeto:", erro);
      alert("Erro ao atualizar projeto.");
    }
  };

  const handleCancelar = () => setMostrarModal("cancelar");
  const handleConfirmarCancelar = () => navigate("/projetos");
  const confirmarSucesso = () => navigate("/projetos");

  if (carregando) {
    return (
      <>
        <Cabecalho />
        <div className="container text-white text-center mt-5">
          <h4>Carregando projeto...</h4>
        </div>
        <Rodape />
      </>
    );
  }

  if (!projeto) {
    return (
      <>
        <Cabecalho />
        <div className="container text-white text-center mt-5">
          <h4>Projeto não encontrado.</h4>
        </div>
        <Rodape />
      </>
    );
  }

  return (
    <>
      <Cabecalho />
      <section className="container-fluid py-5" style={{ backgroundColor: "#0d1b2a", minHeight: "100vh" }}>
        <div className="container col-md-6 bg-white text-dark p-4 rounded shadow">
          <h2 className="mb-4 text-center">Editar Projeto</h2>

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="nome" className="form-label">Nome do Projeto</label>
              <input
                type="text"
                id="nome"
                name="nome"
                className="form-control"
                value={projeto.nome}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="descricao" className="form-label">Descrição</label>
              <textarea
                id="descricao"
                name="descricao"
                className="form-control"
                value={projeto.descricao}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="responsavel" className="form-label">Responsável</label>
              <select
                id="responsavel"
                name="responsavelId"
                className="form-control"
                value={projeto.responsavel?.id || ""}
                onChange={handleChange}
                required
              >
                <option value="">Selecione um responsável</option>
                {usuarios.map((usuario) => (
                  <option key={usuario.id} value={usuario.id}>
                    {usuario.nome}
                  </option>
                ))}
              </select>
            </div>

            <button type="submit" className="btn btn-success w-100 mb-2">Salvar Alterações</button>
            <button type="button" className="btn btn-danger w-100" onClick={handleCancelar}>Cancelar</button>
          </form>
        </div>
      </section>
      <Rodape />

      {mostrarModal === "sucesso" && (
        <Modal
          titulo="Projeto Atualizado"
          texto="As informações do projeto foram salvas com sucesso!"
          txtBtn1="OK"
          onClickBtn1={confirmarSucesso}
        />
      )}

      {mostrarModal === "cancelar" && (
        <Modal
          titulo="Cancelar Edição"
          texto="Deseja cancelar a edição do projeto?"
          txtBtn1="Sim, cancelar"
          txtBtn2="Continuar editando"
          onClickBtn1={handleConfirmarCancelar}
          onClickBtn2={() => setMostrarModal(null)}
          onClickBtnClose={() => setMostrarModal(null)}
        />
      )}
    </>
  );
};

export default EditarProjeto;