import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cabecalho from "../../componentes/Cabecalho";
import Rodape from "../../componentes/Rodape";
import Modal from "../../componentes/Modal";
import { listarUsuarios } from "../../servicos/usuarios";
import { salvarProjeto } from "../../servicos/projetos";

const AdicionarProjeto = () => {
  const navigate = useNavigate();
  const [mostrarModal, setMostrarModal] = useState(null);
  const [usuarios, setUsuarios] = useState([]);

  const [projeto, setProjeto] = useState({
    nome: "",
    descricao: "",
    responsavel: null,
  });

  useEffect(() => {
    async function carregarUsuarios() {
      try {
        const resposta = await listarUsuarios();
        const lista = Array.isArray(resposta.data)
          ? resposta.data
          : resposta.data?.content || [];
        setUsuarios(lista);
      } catch (erro) {
        console.error("Erro ao carregar usuários:", erro);
        alert("Erro ao buscar responsáveis.");
      }
    }

    carregarUsuarios();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "responsavelId") {
      const usuarioSelecionado = usuarios.find((u) => u.id === parseInt(value));
      setProjeto((prev) => ({
        ...prev,
        responsavel: usuarioSelecionado,
      }));
    } else {
      setProjeto((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!projeto.responsavel) {
      alert("Selecione um responsável.");
      return;
    }

    const payload = {
      nome: projeto.nome,
      descricao: projeto.descricao,
      responsavel: {
        id: projeto.responsavel.id,
        nome: projeto.responsavel.nome,
      },
    };

    try {
      const resposta = await salvarProjeto(payload);
      console.log("Projeto salvo com sucesso:", resposta);
      setMostrarModal(true);
    } catch (erro) {
      console.error("Erro ao tentar salvar o projeto:", erro);
      alert("Erro ao salvar projeto.");
    }
  };

  const confirmarAdicao = () => navigate("/projetos");
  const handleCancelar = () => setMostrarModal("cancelar");
  const confirmarCancelamento = () => navigate("/projetos");

  return (
    <>
      <Cabecalho />

      <section className="container-fluid py-5" style={{ backgroundColor: "#0d1b2a", minHeight: "100vh" }}>
        <div className="container col-md-6 bg-white text-dark p-4 rounded shadow">
          <h2 className="mb-4 text-center fw-bold text-primary">Adicionar Novo Projeto</h2>

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="nome" className="form-label">Nome do Projeto</label>
              <input
                type="text"
                id="nome"
                className="form-control"
                name="nome"
                placeholder="Digite o nome do projeto"
                value={projeto.nome}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="descricao" className="form-label">Descrição</label>
              <textarea
                id="descricao"
                className="form-control"
                name="descricao"
                placeholder="Descreva brevemente o projeto"
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
                className="form-select"
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

            <button type="submit" className="btn btn-success w-100 mb-2">
              Adicionar Projeto
            </button>
            <button type="button" className="btn btn-outline-danger w-100" onClick={handleCancelar}>
              Cancelar
            </button>
          </form>
        </div>
      </section>

      <Rodape />

      {mostrarModal === true && (
        <Modal
          titulo="Projeto Adicionado"
          texto="O projeto foi adicionado com sucesso!"
          txtBtn1="OK"
          onClickBtn1={confirmarAdicao}
        />
      )}

      {mostrarModal === "cancelar" && (
        <Modal
          titulo="Cancelar Cadastro"
          texto="Deseja cancelar o cadastro do projeto?"
          txtBtn1="Sim, cancelar"
          txtBtn2="Continuar"
          onClickBtn1={confirmarCancelamento}
          onClickBtn2={() => setMostrarModal(null)}
          onClickBtnClose={() => setMostrarModal(null)}
        />
      )}
    </>
  );
};

export default AdicionarProjeto;