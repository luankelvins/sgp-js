import { api } from "./api";

export async function listarUsuarios() {
  return await api.get("/usuarios");
}

export async function buscarUsuarioPorId(id) {
  return await api.get(`/usuarios/${id}`);
}

export async function salvarUsuario(dadosUsuario, setMostrarModal) {
  try {
    const resposta = await api.post("/usuarios", dadosUsuario);
    if (resposta.status === 201) {
      setMostrarModal(true);
    }
  } catch (erro) {
    alert("Erro ao cadastrar usuário");
    console.error("Erro ao cadastrar usuário", erro);
  }
}

export async function editarUsuario(id, dadosUsuario, setMostrarModal) {
  try {
    const resposta = await api.put(`/usuarios/${id}`, dadosUsuario);
    if (resposta.status === 200) {
      setMostrarModal("sucesso");
    }
  } catch (erro) {
    alert("Erro ao editar usuário");
    console.error("Erro ao editar usuário", erro);
  }
}

export async function excluirUsuario(id) {
  return await api.delete(`/usuarios/${id}`);
}

export async function autenticar(email, senha) {
  return await api.post("/usuarios/login", { email, senha });
}

export async function atualizarUsuario(id, dados) {
  return await api.put(`/usuarios/${id}`, dados);
}


export function trocarSenha(id, senhaAtual, novaSenha) {
  return api.put(`/usuarios/${id}/senha`, {
    senhaAtual,
    novaSenha
  });
}
