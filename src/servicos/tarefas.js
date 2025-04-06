import { api } from "./api";

// Lista todas as tarefas
export async function listarTarefas() {
  return await api.get("/tarefas");
}

// Busca uma tarefa pelo ID
export async function buscarTarefaPorId(id) {
  return await api.get(`/tarefas/${id}`);
}

// Cadastra uma nova tarefa
export async function salvarTarefa(dadosTarefa) {
  try {
    const resposta = await api.post("/tarefas", dadosTarefa);
    return resposta;
  } catch (erro) {
    console.error("Erro ao cadastrar tarefa:", erro);
    throw erro;
  }
}

// Atualiza uma tarefa existente
export async function editarTarefa(id, dadosTarefa) {
  try {
    const resposta = await api.put(`/tarefas/${id}`, dadosTarefa);
    return resposta;
  } catch (erro) {
    console.error("Erro ao editar tarefa:", erro);
    throw erro;
  }
}

// Exclui uma tarefa
export async function excluirTarefa(id) {
  try {
    const resposta = await api.delete(`/tarefas/${id}`);
    return resposta;
  } catch (erro) {
    console.error("Erro ao excluir tarefa:", erro);
    throw erro;
  }
}