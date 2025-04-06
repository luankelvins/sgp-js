// src/servicos/projetos.js
import { api } from "./api";

// Lista todos os projetos
export async function listarProjetos() {
  return await api.get("/projetos");
}

// Busca um projeto pelo ID
export async function buscarProjetoPorId(id) {
  return await api.get(`/projetos/${id}`);
}

// Cadastra um novo projeto
export async function salvarProjeto(dadosProjeto) {
  try {
    const resposta = await api.post("/projetos", {
      ...dadosProjeto,
      tarefas: [], // adiciona array vazio de tarefas
    });
    return resposta;
  } catch (erro) {
    console.error("Erro ao cadastrar projeto", erro);
    throw erro; // permite tratar no componente
  }
}

// Atualiza um projeto existente
export async function editarProjeto(id, dadosProjeto) {
  try {
    const resposta = await api.put(`/projetos/${id}`, dadosProjeto);
    return resposta;
  } catch (erro) {
    console.error("Erro ao editar projeto", erro);
    throw erro; // permite tratar no componente
  }
}

// Exclui um projeto
export async function excluirProjeto(id) {
  return await api.delete(`/projetos/${id}`);
}