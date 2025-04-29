const diasContainer = document.getElementById("dias");
const mesAno = document.getElementById("mesAno");
const btnAnterior = document.getElementById("mesAnterior");
const btnProximo = document.getElementById("mesProximo");

const modal = document.getElementById("modal");
const dataSelecionada = document.getElementById("dataSelecionada");
const anotacaoTextarea = document.getElementById("anotacao");
const btnSalvar = document.getElementById("salvar");
const btnFechar = document.getElementById("fechar");

let dataAtual = new Date();
let dataClique = null;

function formatarData(data) {
  const dia = String(data.getDate()).padStart(2, '0');
  const mes = String(data.getMonth() + 1).padStart(2, '0');
  const ano = data.getFullYear();
  return `${ano}-${mes}-${dia}`;
}

function abrirModal(data) {
  dataClique = new Date(data);
  const dataStr = formatarData(dataClique);
  dataSelecionada.textContent = `Anotação para ${dataClique.toLocaleDateString('pt-BR')}`;
  anotacaoTextarea.value = localStorage.getItem(dataStr) || "";
  modal.classList.remove("hidden");
}

function fecharModal() {
  modal.classList.add("hidden");
}

function salvarAnotacao() {
  if (dataClique) {
    const dataStr = formatarData(dataClique);
    const texto = anotacaoTextarea.value.trim();
    if (texto) {
      localStorage.setItem(dataStr, texto);
    } else {
      localStorage.removeItem(dataStr);
    }
    renderizarCalendario(dataAtual);
    fecharModal();
  }
}

function renderizarCalendario(data) {
  const ano = data.getFullYear();
  const mes = data.getMonth();

  const primeiroDia = new Date(ano, mes, 1);
  const ultimoDia = new Date(ano, mes + 1, 0);
  const diaSemanaInicio = primeiroDia.getDay();
  const totalDias = ultimoDia.getDate();

  const nomesMeses = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
  ];

  mesAno.textContent = `${nomesMeses[mes]} ${ano}`;
  diasContainer.innerHTML = "";

  for (let i = 0; i < diaSemanaInicio; i++) {
    diasContainer.innerHTML += `<div></div>`;
  }

  for (let dia = 1; dia <= totalDias; dia++) {
    const dataTemp = new Date(ano, mes, dia);
    const dataStr = formatarData(dataTemp);
    const hoje = new Date();
    const isHoje = dataTemp.toDateString() === hoje.toDateString();
    const temAnotacao = localStorage.getItem(dataStr);

    const classe = `
      ${isHoje ? "hoje" : ""}
      ${temAnotacao ? "com-anotacao" : ""}
    `.trim();

    const div = document.createElement("div");
    div.textContent = dia;
    div.className = classe;
    div.addEventListener("click", () => abrirModal(dataTemp));
    diasContainer.appendChild(div);
  }
}

// Navegação
btnAnterior.addEventListener("click", () => {
  dataAtual.setMonth(dataAtual.getMonth() - 1);
  renderizarCalendario(dataAtual);
});

btnProximo.addEventListener("click", () => {
  dataAtual.setMonth(dataAtual.getMonth() + 1);
  renderizarCalendario(dataAtual);
});

btnFechar.addEventListener("click", fecharModal);
btnSalvar.addEventListener("click", salvarAnotacao);

// Inicial
renderizarCalendario(dataAtual);
