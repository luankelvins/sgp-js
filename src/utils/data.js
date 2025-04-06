// yyyy-MM-dd -> dd/MM/yyyy
export function formatarData(data) {
  if (!data || !data.includes("-")) return null;
  const [ano, mes, dia] = data.split("-");
  return `${dia}/${mes}/${ano}`;
}

// dd/MM/yyyy -> yyyy-MM-dd
export function desformatarData(data) {
  if (!data || !data.includes("/")) return null;
  const [dia, mes, ano] = data.split("/");
  return `${ano}-${mes}-${dia}`;
}

export function calcularTempoGasto(dataCriacao, dataConclusao) {
  if (!dataCriacao || !dataConclusao) return "-";

  const inicio = new Date(dataCriacao);
  const fim = new Date(dataConclusao);

  if (isNaN(inicio) || isNaN(fim)) return "-";

  const diffMs = fim - inicio;
  if (diffMs <= 0) return "-";

  const horas = Math.floor(diffMs / (1000 * 60 * 60));
  const minutos = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

  return `${horas}h ${minutos}min`;
}

export function formatarDataParaInput(data) {
  if (!data) return "";

  // Se já for ISO, parse direto
  if (/^\d{4}-\d{2}-\d{2}$/.test(data)) {
    return data;
  }

  // Se for formato brasileiro: dd/MM/yyyy
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(data)) {
    const [dia, mes, ano] = data.split("/");
    return `${ano}-${mes}-${dia}`;
  }

  // Se cair aqui, tenta parsear mesmo assim
  const d = new Date(data);
  const ano = d.getFullYear();
  const mes = String(d.getMonth() + 1).padStart(2, "0");
  const dia = String(d.getDate()).padStart(2, "0");
  return `${ano}-${mes}-${dia}`;
} 


