const btnAbrir = document.getElementById("btnAbrirModalRede");
const btnFechar = document.getElementById("fecharModalRede");
const modal = document.getElementById("modalRedeApoio");
const popupConfirmacao = document.getElementById("popupConfirmacao");
const popupBtnOk = document.getElementById("popupBtnOk");
const popupMensagem = document.getElementById("popupMensagem");
const btnCadastrar = document.querySelector(".btn-atualizar");

// SÓ UM elemento de erro
const redeError = document.getElementById("redeError");

// Classes de Validação (mantidas iguais)
class NameValidator {
  validate(novoNome) {
    if (novoNome.trim() === "") {
      return "Por favor, preencha o campo de nome.";
    }
    if (novoNome.trim().length < 3) {
      return "O nome deve ter pelo menos 3 caracteres.";
    }
    return null;
  }
}

class EmailValidator {
  validate(novoEmail) {
    const email = novoEmail.trim();

    if (email === "") {
      return "Por favor, preencha o campo de e-mail.";
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return "Por favor, insira um formato de e-mail válido.";
    }
    return null;
  }
}

const nameValidator = new NameValidator();
const emailValidator = new EmailValidator();

// Função para limpar o formulário
const limparFormulario = () => {
  document.getElementById("nomeRede").value = "";
  document.getElementById("emailRede").value = "";
  limparErro();
};

// Funções do Modal
const abrirModal = () => {
  modal.classList.add("visible");
  limparErro();
};

const fecharModal = () => {
  modal.classList.remove("visible");
  // LIMPA O FORMULÁRIO ao fechar o modal
  limparFormulario();
};

// Funções do Popup
const abrirPopup = () => {
  popupConfirmacao.classList.add("visible");
};

const fecharPopup = () => {
  popupConfirmacao.classList.remove("visible");
};

// Funções de erro (agora só uma)
const mostrarErro = (mensagem) => {
  redeError.textContent = mensagem;
  redeError.style.display = "block";
};

const limparErro = () => {
  redeError.textContent = "";
  redeError.style.display = "none";
};

// Event Listeners
btnAbrir.addEventListener("click", abrirModal);
btnFechar.addEventListener("click", fecharModal);
popupBtnOk.addEventListener("click", fecharPopup);

// Fechar modal e popup clicando fora
modal.addEventListener("click", (e) => {
  if (e.target === modal) {
    fecharModal();
  }
});

popupConfirmacao.addEventListener("click", (e) => {
  if (e.target === popupConfirmacao) {
    fecharPopup();
  }
});

// Cadastrar rede
btnCadastrar.addEventListener("click", () => {
  const nomeRede = document.getElementById("nomeRede").value;
  const emailRede = document.getElementById("emailRede").value;

  // Limpar erro anterior
  limparErro();

  // Validação do nome (primeira prioridade)
  const erroNome = nameValidator.validate(nomeRede);
  if (erroNome) {
    mostrarErro(erroNome);
    return;
  }

  // Validação do email (segunda prioridade)
  const erroEmail = emailValidator.validate(emailRede);
  if (erroEmail) {
    mostrarErro(erroEmail);
    return;
  }

  // Sucesso - se passou por todas as validações
  fecharModal();
  popupMensagem.textContent = "Rede cadastrada com sucesso!";
  abrirPopup();

  // Limpar formulário (já é feito no fecharModal, mas por segurança)
  limparFormulario();
});

// Limpar erro quando usuário começar a digitar em qualquer campo
document.getElementById("nomeRede").addEventListener("input", limparErro);
document.getElementById("emailRede").addEventListener("input", limparErro);
