import { UserController } from './controllers/UserController';

// Instanciar o controller
const userController = new UserController();

// Aguardar o DOM carregar
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('userForm') as HTMLFormElement;
  const resultDiv = document.getElementById('result') as HTMLDivElement;

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    // Capturar valores do formulário
    const nameInput = document.getElementById('name') as HTMLInputElement;
    const emailInput = document.getElementById('email') as HTMLInputElement;

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();

    // Chamar o controller (seguindo o fluxo: View -> Controller -> Service -> Model)
    const result = userController.handleCreateUser(name, email);

    // Exibir resultado
    if (result.success && result.user) {
      resultDiv.className = 'result success';
      resultDiv.innerHTML = `
        <h2>✅ Usuário Criado com Sucesso!</h2>
        <div class="user-info">
          <p><strong>Nome:</strong> ${result.user.getName()}</p>
          <p><strong>E-mail:</strong> ${result.user.getEmail()}</p>
          <p><strong>ID:</strong> ${result.user.getId()}</p>
        </div>
      `;

      // Limpar formulário
      form.reset();
    } else {
      resultDiv.className = 'result error';
      resultDiv.innerHTML = `
        <h2>❌ Erro ao Criar Usuário</h2>
        <p>${result.error || 'Erro desconhecido'}</p>
      `;
    }

    // Scroll suave até o resultado
    resultDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });
});