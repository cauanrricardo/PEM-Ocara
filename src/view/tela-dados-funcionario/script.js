const STORAGE_KEY = 'usuarioLogado';
const SIDEBAR_TYPE_KEY = 'sidebarType';
const FUNCIONARIO_SELECIONADO_KEY = 'funcionarioSelecionado';
const PASSWORD_MASK = '••••••••';

function formatarCargoDisplay(cargo) {
    if (!cargo) return '--';
    const mapa = {
        ADMINISTRADOR: 'Administrador',
        ASSISTENCIA_SOCIAL: 'Assistente Social',
        JURIDICO: 'Jurídico',
        COORDENACAO: 'Coordenação'
    };

    const chave = typeof cargo === 'string' ? cargo.toUpperCase() : cargo;
    return mapa[chave] || cargo;
}

let usuarioAtual = null;
let funcionarioAtual = null;
let successModalManager = null;
let nameModalManager = null;
let cargoModalManager = null;
let emailModalManager = null;
let passwordModalManager = null;
let deleteModalManager = null;

class PasswordValidator {
    validate(novaSenha, confirmarSenha) {
        if (novaSenha === '' || confirmarSenha === '') {
            return 'Por favor, preencha todos os campos.';
        }

        if (novaSenha.length < 8) {
            return 'A nova senha deve ter pelo menos 8 caracteres.';
        }
        if (!/[A-Z]/.test(novaSenha)) {
            return 'A nova senha deve conter pelo menos uma letra maiúscula.';
        }
        if (!/[a-z]/.test(novaSenha)) {
            return 'A nova senha deve conter pelo menos uma letra minúscula.';
        }
        if (!/[^A-Za-z0-9]/.test(novaSenha)) {
            return 'A nova senha deve conter pelo menos um caractere especial (ex: !@#$%).';
        }
        if (novaSenha !== confirmarSenha) {
            return 'As senhas não coincidem. Tente novamente.';
        }
        return null;
    }
}

class NameValidator {
    validate(novoNome) {
        if (novoNome.trim() === '') {
            return 'Por favor, preencha o campo de nome.';
        }
        if (novoNome.trim().length < 3) {
            return 'O nome deve ter pelo menos 3 caracteres.';
        }
        return null;
    }
}

class EmailValidator {
    validate(novoEmail) {
        const email = novoEmail.trim();

        if (email === '') {
            return 'Por favor, preencha o campo de e-mail.';
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return 'Por favor, insira um formato de e-mail válido.';
        }
        return null;
    }
}

class JobValidator {
    validate(novoCargo, cargoAtual) {
        if (!novoCargo || novoCargo === '') {
            return 'Por favor, selecione um cargo.';
        }
        if (novoCargo === cargoAtual) {
            return 'O novo cargo deve ser diferente do atual.';
        }
        return null;
    }
}

/* --- FUNÇÕES UTILITÁRIAS --- */

function togglePassword(iconElement) {
    const inputWrapper = iconElement.parentElement;
    const input = inputWrapper.querySelector('input');

    if (input.type === 'password') {
        input.type = 'text';
        iconElement.textContent = 'visibility_off';
    } else {
        input.type = 'password';
        iconElement.textContent = 'visibility';
    }
}

function initializePasswordIcons() {
    document.querySelectorAll('.password-toggle-icon').forEach((icon) => {
        icon.textContent = 'visibility';
        icon.classList.add('material-symbols-outlined');
    });
}

function getUsuarioLogado() {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    try {
        return JSON.parse(raw);
    } catch (error) {
        console.error('Erro ao recuperar usuário logado:', error);
        sessionStorage.removeItem(STORAGE_KEY);
        return null;
    }
}

function salvarUsuarioLogado(usuario) {
    if (!usuario) return;
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(usuario));
}

function getFuncionarioSelecionado() {
    const raw = sessionStorage.getItem(FUNCIONARIO_SELECIONADO_KEY);
    if (!raw) return null;
    try {
        return JSON.parse(raw);
    } catch (error) {
        console.error('Erro ao recuperar funcionário selecionado:', error);
        sessionStorage.removeItem(FUNCIONARIO_SELECIONADO_KEY);
        return null;
    }
}

function salvarFuncionarioSelecionado(funcionario) {
    if (!funcionario) return;
    sessionStorage.setItem(FUNCIONARIO_SELECIONADO_KEY, JSON.stringify(funcionario));
}

function limparFuncionarioSelecionado() {
    sessionStorage.removeItem(FUNCIONARIO_SELECIONADO_KEY);
}

function isAdminUser(usuario) {
    return (usuario?.cargo ?? '').toUpperCase() === 'ADMINISTRADOR';
}

function resolveSidebarType(usuarioAtual) {
    const saved = sessionStorage.getItem(SIDEBAR_TYPE_KEY);
    if (saved === 'admin' || saved === 'normal') {
        return saved;
    }

    const derived = isAdminUser(usuarioAtual) ? 'admin' : 'normal';
    sessionStorage.setItem(SIDEBAR_TYPE_KEY, derived);
    return derived;
}

function configureSidebarNavigation(sidebarType) {
    const navConfig = [
        {
            selector: '#listarFuncionarios',
            targets: { admin: 'telaListarFuncionarios', normal: 'telaListarFuncionarios' }
        },
        {
            selector: '#navRede',
            targets: { admin: 'telaRedeApoioAdm', normal: 'telaRedeApoio' }
        },
        {
            selector: '#navInicial',
            targets: { admin: 'telaInicialAdm', normal: 'telaInicial' }
        },
        {
            selector: '#navEstatisticas',
            targets: { admin: 'telaEstatisticasAdm', normal: 'telaEstatisticas' }
        },
        {
            selector: '#navConta',
            targets: { admin: 'telaContaAdm', normal: 'telaConfiguracoesConta' }
        }
    ];

    navConfig.forEach(({ selector, targets }) => {
        const element = document.querySelector(selector);
        if (!element) {
            return;
        }

        element.addEventListener('click', (event) => {
            event.preventDefault();
            const windowName = targets[sidebarType] || targets.admin;
            if (windowName) {
                window.api.openWindow(windowName);
            }
        });
    });
}

function configurarBotaoFecharPagina() {
    const botaoFechar = document.querySelector('.btn-fechar-pagina');
    if (!botaoFechar) return;
    botaoFechar.addEventListener('click', (event) => {
        event.preventDefault();
        redirecionarParaLista();
    });
}

function redirecionarParaLista() {
    window.api.openWindow('telaListarFuncionarios');
}

function atualizarInformacoesBasicas() {
    const nomeTitulo = document.getElementById('nome-funcionario');
    const valorNome = document.getElementById('valorNome');
    const valorCargo = document.getElementById('valorCargo');
    const valorEmail = document.getElementById('valorEmail');
    const valorSenha = document.getElementById('valorSenha');

    if (nomeTitulo) nomeTitulo.textContent = funcionarioAtual?.nome ?? '';
    if (valorNome) valorNome.textContent = '';
    if (valorCargo) valorCargo.textContent = '';
    if (valorEmail) valorEmail.textContent = '';
    if (valorSenha) valorSenha.textContent = '';
}

function atualizarCamposModais() {
    const nomeAtual = document.getElementById('nomeAtual');
    const cargoAtual = document.getElementById('cargoAtual');
    const emailAtual = document.getElementById('emailAtual');

    if (nomeAtual) nomeAtual.value = funcionarioAtual?.nome ?? '';
    if (cargoAtual) {
        const cargoValor = funcionarioAtual?.cargo ?? '';
        cargoAtual.dataset.rawValue = cargoValor;
        cargoAtual.value = formatarCargoDisplay(cargoValor);
    }
    if (emailAtual) emailAtual.value = funcionarioAtual?.email ?? '';
}

function sincronizarUsuarioCasoSejaMesmo(emailAnterior) {
    if (!usuarioAtual || !funcionarioAtual) {
        return;
    }

    if (usuarioAtual.email !== emailAnterior) {
        return;
    }

    usuarioAtual = {
        ...usuarioAtual,
        nome: funcionarioAtual.nome,
        cargo: funcionarioAtual.cargo,
        email: funcionarioAtual.email
    };

    salvarUsuarioLogado(usuarioAtual);
    const sidebarType = isAdminUser(usuarioAtual) ? 'admin' : 'normal';
    sessionStorage.setItem(SIDEBAR_TYPE_KEY, sidebarType);
}

async function atualizarFuncionarioNoBackend(dadosAtualizados) {
    if (!funcionarioAtual?.email) {
        throw new Error('Funcionário inválido.');
    }

    const emailAnterior = funcionarioAtual.email;
    const resposta = await window.api.atualizarFuncionario(emailAnterior, dadosAtualizados);

    if (!resposta?.success || !resposta.funcionario) {
        throw new Error(resposta?.error || 'Não foi possível atualizar os dados.');
    }

    funcionarioAtual = resposta.funcionario;
    salvarFuncionarioSelecionado(funcionarioAtual);
    sincronizarUsuarioCasoSejaMesmo(emailAnterior);
    atualizarInformacoesBasicas();
    atualizarCamposModais();
    return funcionarioAtual;
}

async function processarExclusaoFuncionario(senhaConfirmacao) {
    if (!usuarioAtual?.email) {
        throw new Error('Sessão expirada. Faça login novamente.');
    }

    const autenticacao = await window.api.autenticar(usuarioAtual.email, senhaConfirmacao);
    if (!autenticacao?.success || !autenticacao.funcionario) {
        throw new Error(autenticacao?.error || 'Senha inválida.');
    }

    usuarioAtual = autenticacao.funcionario;
    salvarUsuarioLogado(usuarioAtual);
    sessionStorage.setItem(SIDEBAR_TYPE_KEY, isAdminUser(usuarioAtual) ? 'admin' : 'normal');

    if (!funcionarioAtual?.email) {
        throw new Error('Funcionário inválido.');
    }

    const emailRemovido = funcionarioAtual.email;
    const resposta = await window.api.deletarFuncionario(emailRemovido);
    if (!resposta?.success) {
        throw new Error(resposta?.error || 'Não foi possível apagar o funcionário.');
    }

    const deletouASiMesmo = emailRemovido === usuarioAtual.email;
    limparFuncionarioSelecionado();

    if (deletouASiMesmo) {
        await window.api.logout();
        sessionStorage.removeItem(STORAGE_KEY);
        sessionStorage.removeItem(SIDEBAR_TYPE_KEY);
        return {
            message: 'Sua conta foi removida. Faça login novamente.',
            afterSuccess: () => {
                setTimeout(() => window.api.openWindow('telaLogin'), 1200);
            }
        };
    }

    return {
        message: 'Funcionário removido com sucesso!',
        afterSuccess: () => {
            setTimeout(() => redirecionarParaLista(), 1200);
        }
    };
}

function configurarEstadoAdministrativo(isAdmin) {
    const editables = ['itemNome', 'itemCargo', 'itemEmail', 'itemSenha'];
    editables.forEach((id) => {
        const element = document.getElementById(id);
        if (!element) return;
        element.classList.toggle('info-item-disabled', !isAdmin);
        element.style.cursor = isAdmin ? 'pointer' : 'default';
    });

    const btnApagar = document.getElementById('btnOpenApagar');
    if (btnApagar) {
        btnApagar.style.display = isAdmin ? 'block' : 'none';
    }
}

function exibirPopupMensagem(mensagem) {
    if (!successModalManager) return;
    successModalManager.setMessage(mensagem);
    successModalManager.open();
}

async function carregarFuncionarioAtual(email) {
    const resposta = await window.api.buscarFuncionarioPorEmail(email);
    if (!resposta?.success || !resposta.funcionario) {
        throw new Error(resposta?.error || 'Não foi possível carregar o funcionário.');
    }

    funcionarioAtual = resposta.funcionario;
    salvarFuncionarioSelecionado(funcionarioAtual);
    atualizarInformacoesBasicas();
    atualizarCamposModais();
}

function inicializarModais(isAdmin) {
    if (!isAdmin) {
        return;
    }

    nameModalManager = new ModalManager('modalNome', 'itemNome');
    cargoModalManager = new ModalManager('modalCargo', 'itemCargo');
    emailModalManager = new ModalManager('modalEmail', 'itemEmail');
    passwordModalManager = new ModalManager('modalSenha', 'itemSenha');
    deleteModalManager = new ModalManager('modalApagar', 'btnOpenApagar');

    const applySnapshot = () => {
        atualizarCamposModais();
    };

    [nameModalManager, cargoModalManager, emailModalManager].forEach((manager) => {
        if (manager && typeof manager.setOnOpenCallback === 'function') {
            manager.setOnOpenCallback(applySnapshot);
        }
    });
}

function instanciarControladores(isAdmin) {
    if (!isAdmin) {
        return;
    }

    const passwordValidator = new PasswordValidator();
    const emailValidator = new EmailValidator();
    const nameValidator = new NameValidator();
    const jobValidator = new JobValidator();

    new PasswordController(
        passwordValidator,
        passwordModalManager,
        successModalManager,
        async (novaSenha) => {
            await atualizarFuncionarioNoBackend({ senha: novaSenha });
        }
    );

    new EmailController(
        emailValidator,
        emailModalManager,
        successModalManager,
        async (novoEmail) => {
            await atualizarFuncionarioNoBackend({ email: novoEmail.trim() });
        }
    );

    new NameController(
        nameValidator,
        nameModalManager,
        successModalManager,
        async (novoNome) => {
            await atualizarFuncionarioNoBackend({ nome: novoNome.trim() });
        }
    );

    new JobController(
        jobValidator,
        cargoModalManager,
        successModalManager,
        async (novoCargo) => {
            await atualizarFuncionarioNoBackend({ cargo: novoCargo });
        }
    );

    new DeleteController(
        deleteModalManager,
        successModalManager,
        async (senhaConfirmacao) => processarExclusaoFuncionario(senhaConfirmacao)
    );
}

async function inicializarTela() {
    initializePasswordIcons();
    successModalManager = new ModalManager('popupConfirmacao');
    configurarBotaoFecharPagina();

    usuarioAtual = getUsuarioLogado();
    if (!usuarioAtual) {
        await window.api.logout();
        window.api.openWindow('telaLogin');
        return;
    }

    const sidebarType = resolveSidebarType(usuarioAtual);
    configureSidebarNavigation(sidebarType);

    const selecionado = getFuncionarioSelecionado();
    if (!selecionado?.email) {
        exibirPopupMensagem('Selecione um funcionário antes de acessar os detalhes.');
        setTimeout(() => redirecionarParaLista(), 1500);
        return;
    }

    try {
        await carregarFuncionarioAtual(selecionado.email);
    } catch (error) {
        console.error('Erro ao carregar funcionário:', error);
        exibirPopupMensagem('Não foi possível carregar os dados do funcionário.');
        setTimeout(() => redirecionarParaLista(), 1500);
        return;
    }

    const isAdmin = isAdminUser(usuarioAtual);
    configurarEstadoAdministrativo(isAdmin);
    inicializarModais(isAdmin);
    instanciarControladores(isAdmin);
}

/* --- GERENCIADOR DE MODAIS --- */

class ModalManager {
    constructor(modalId, triggerId) {
        this.modal = document.getElementById(modalId);
        this.trigger = triggerId ? document.getElementById(triggerId) : null;
        this.onOpenCallback = null;

        if (!this.modal) {
            console.warn(`Modal não encontrado: ${modalId}`);
            return;
        }

        this.closeBtn = this.modal.querySelector('.modal-close, #popupBtnOk');
        this.inputs = this.modal.querySelectorAll('input, select');
        this.errorDisplay = this.modal.querySelector('.error-message');

        if (!this.closeBtn && modalId !== 'modalCargo') {
            console.warn(`Botão de fechar/OK não encontrado no modal: ${modalId}`);
        }

        this.setupListeners();
    }

    setupListeners() {
        if (this.trigger) {
            this.trigger.addEventListener('click', (event) => {
                if (this.trigger.classList.contains('info-item-disabled')) {
                    return;
                }
                event.preventDefault();
                this.open();
            });
        }
        if (this.closeBtn) {
            this.closeBtn.addEventListener('click', () => this.close());
        }
        window.addEventListener('click', (evento) => {
            if (evento.target === this.modal) {
                this.close();
            }
        });
    }

    setOnOpenCallback(callback) {
        this.onOpenCallback = callback;
    }

    open() {
        if (this.onOpenCallback) {
            this.onOpenCallback();
        }
        this.modal.classList.add('visible');
    }

    close() {
        this.modal.classList.remove('visible');

        if (this.inputs && this.inputs.length > 0) {
            this.inputs.forEach((input) => {
                if ((input.type === 'text' || input.type === 'password' || input.tagName === 'SELECT') && !input.readOnly) {
                    input.value = '';
                }
            });
        }

        if (this.errorDisplay) {
            this.errorDisplay.textContent = '';
            this.errorDisplay.style.display = 'none';
        }
    }

    setMessage(message) {
        const messageElement = this.modal.querySelector('#popupMensagem');
        if (messageElement) {
            messageElement.textContent = message;
        }
    }
}

/* --- CONTROLADORES --- */

function setButtonLoading(button, isLoading, loadingText = 'Processando...') {
    if (!button) return;
    if (!button.dataset.originalText) {
        button.dataset.originalText = button.textContent?.trim() || '';
    }
    button.disabled = isLoading;
    button.textContent = isLoading ? loadingText : button.dataset.originalText;
}

class PasswordController {
    constructor(passwordValidator, passwordModalManager, successModalManager, onSubmit) {
        this.validator = passwordValidator;
        this.modalManager = passwordModalManager;
        this.successModalManager = successModalManager;
        this.onSubmit = onSubmit;
        this.btnAtualizar = document.querySelector('#modalSenha .btn-atualizar');
        this.novaSenhaInput = document.getElementById('novaSenha');
        this.confirmarSenhaInput = document.getElementById('confirmarSenha');
        this.errorDisplay = document.getElementById('senhaError');
        this.setupListener();
    }

    setupListener() {
        if (!this.btnAtualizar) {
            console.warn('Botão de atualizar senha não encontrado.');
            return;
        }
        this.btnAtualizar.addEventListener('click', () => this.handleUpdatePassword());
    }

    async handleUpdatePassword() {
        const novaSenha = this.novaSenhaInput.value;
        const confirmarSenha = this.confirmarSenhaInput.value;

        this.hideError();

        const errorMessage = this.validator.validate(novaSenha, confirmarSenha);

        if (errorMessage) {
            this.showError(errorMessage);
            return;
        }

        if (typeof this.onSubmit === 'function') {
            try {
                setButtonLoading(this.btnAtualizar, true, 'Atualizando...');
                await this.onSubmit(novaSenha);
            } catch (error) {
                this.showError(error.message || 'Não foi possível atualizar a senha.');
                return;
            } finally {
                setButtonLoading(this.btnAtualizar, false);
            }
        }

        this.showSuccess('Senha atualizada com sucesso!');
    }

    showError(message) {
        this.errorDisplay.textContent = message;
        this.errorDisplay.style.display = 'block';
    }

    hideError() {
        this.errorDisplay.textContent = '';
        this.errorDisplay.style.display = 'none';
    }

    showSuccess(message) {
        this.modalManager.close();
        this.successModalManager.setMessage(message);
        this.successModalManager.open();
    }
}

class NameController {
    constructor(nameValidator, nameModalManager, successModalManager, onSubmit) {
        this.validator = nameValidator;
        this.modalManager = nameModalManager;
        this.successModalManager = successModalManager;
        this.onSubmit = onSubmit;
        this.btnAtualizar = document.querySelector('#modalNome .btn-atualizar');
        this.novoNomeInput = document.getElementById('novoNome');
        this.errorDisplay = document.getElementById('nomeError');

        if (!this.btnAtualizar || !this.novoNomeInput || !this.errorDisplay) {
            console.warn('Elementos do modal de nome não encontrados.');
            return;
        }
        this.setupListener();
    }

    setupListener() {
        this.btnAtualizar.addEventListener('click', () => this.handleUpdateName());
    }

    async handleUpdateName() {
        const novoNome = this.novoNomeInput.value;
        this.hideError();

        const errorMessage = this.validator.validate(novoNome);

        if (errorMessage) {
            this.showError(errorMessage);
            return;
        }

        if (typeof this.onSubmit === 'function') {
            try {
                setButtonLoading(this.btnAtualizar, true, 'Atualizando...');
                await this.onSubmit(novoNome);
            } catch (error) {
                this.showError(error.message || 'Não foi possível atualizar o nome.');
                return;
            } finally {
                setButtonLoading(this.btnAtualizar, false);
            }
        }

        this.showSuccess('Nome atualizado com sucesso!');
    }

    showError(message) {
        this.errorDisplay.textContent = message;
        this.errorDisplay.style.display = 'block';
    }

    hideError() {
        this.errorDisplay.textContent = '';
        this.errorDisplay.style.display = 'none';
    }

    showSuccess(message) {
        this.modalManager.close();
        this.successModalManager.setMessage(message);
        this.successModalManager.open();
    }
}

class EmailController {
    constructor(emailValidator, emailModalManager, successModalManager, onSubmit) {
        this.validator = emailValidator;
        this.modalManager = emailModalManager;
        this.successModalManager = successModalManager;
        this.onSubmit = onSubmit;
        this.btnAtualizar = document.querySelector('#modalEmail .btn-atualizar');
        this.novoEmailInput = document.getElementById('novoEmail');
        this.errorDisplay = document.getElementById('emailError');

        if (!this.btnAtualizar || !this.novoEmailInput || !this.errorDisplay) {
            console.warn('Elementos do modal de e-mail não encontrados.');
            return;
        }
        this.setupListener();
    }

    setupListener() {
        this.btnAtualizar.addEventListener('click', () => this.handleUpdateEmail());
    }

    async handleUpdateEmail() {
        const novoEmail = this.novoEmailInput.value;
        this.hideError();

        const errorMessage = this.validator.validate(novoEmail);

        if (errorMessage) {
            this.showError(errorMessage);
            return;
        }

        if (typeof this.onSubmit === 'function') {
            try {
                setButtonLoading(this.btnAtualizar, true, 'Atualizando...');
                await this.onSubmit(novoEmail);
            } catch (error) {
                this.showError(error.message || 'Não foi possível atualizar o e-mail.');
                return;
            } finally {
                setButtonLoading(this.btnAtualizar, false);
            }
        }

        this.showSuccess('E-mail atualizado com sucesso!');
    }

    showError(message) {
        this.errorDisplay.textContent = message;
        this.errorDisplay.style.display = 'block';
    }

    hideError() {
        this.errorDisplay.textContent = '';
        this.errorDisplay.style.display = 'none';
    }

    showSuccess(message) {
        this.modalManager.close();
        this.successModalManager.setMessage(message);
        this.successModalManager.open();
    }
}

class JobController {
    constructor(jobValidator, jobModalManager, successModalManager, onSubmit) {
        this.validator = jobValidator;
        this.modalManager = jobModalManager;
        this.successModalManager = successModalManager;
        this.onSubmit = onSubmit;
        this.btnAtualizar = document.querySelector('#modalCargo .btn-atualizar');
        this.novoCargoInput = document.getElementById('novoCargo');
        this.errorDisplay = document.getElementById('cargoError');

        if (!this.btnAtualizar || !this.novoCargoInput || !this.errorDisplay) {
            console.warn('Elementos do modal de cargo não encontrados.');
            return;
        }
        this.setupListener();
    }

    setupListener() {
        this.btnAtualizar.addEventListener('click', () => this.handleUpdateJob());
    }

    async handleUpdateJob() {
        const novoCargo = this.novoCargoInput.value;
        const cargoAtualInput = document.getElementById('cargoAtual');
        const cargoAtual = cargoAtualInput ? (cargoAtualInput.dataset.rawValue || cargoAtualInput.value) : '';
        this.hideError();
        const errorMessage = this.validator.validate(novoCargo, cargoAtual);

        if (errorMessage) {
            this.showError(errorMessage);
            return;
        }

        if (typeof this.onSubmit === 'function') {
            try {
                setButtonLoading(this.btnAtualizar, true, 'Atualizando...');
                await this.onSubmit(novoCargo);
            } catch (error) {
                this.showError(error.message || 'Não foi possível atualizar o cargo.');
                return;
            } finally {
                setButtonLoading(this.btnAtualizar, false);
            }
        }

        if (cargoAtualInput) {
            cargoAtualInput.dataset.rawValue = novoCargo;
            cargoAtualInput.value = formatarCargoDisplay(novoCargo);
        }
        this.showSuccess('Cargo atualizado com sucesso!');
    }

    showError(message) {
        this.errorDisplay.textContent = message;
        this.errorDisplay.style.display = 'block';
    }

    hideError() {
        this.errorDisplay.textContent = '';
        this.errorDisplay.style.display = 'none';
    }

    showSuccess(message) {
        this.modalManager.close();
        this.successModalManager.setMessage(message);
        this.successModalManager.open();
    }
}

class DeleteController {
    constructor(modalManager, successModalManager, onConfirm) {
        this.modalManager = modalManager;
        this.successModalManager = successModalManager;
        this.onConfirm = onConfirm;
        this.btnConfirmar = document.querySelector('#modalApagar .btn-confirmar');
        this.senhaInput = document.getElementById('senhaConfirmacao');
        this.errorDisplay = document.getElementById('deleteError');
        this.afterSuccessCallback = null;

        if (!this.btnConfirmar || !this.senhaInput) {
            console.warn('Elementos do modal de apagar não encontrados.');
            return;
        }
        this.setupListener();
    }

    setupListener() {
        this.btnConfirmar.addEventListener('click', () => this.handleDelete());
    }

    async handleDelete() {
        const senha = this.senhaInput.value;
        this.hideError();

        if (!senha || senha.trim() === '') {
            this.showError('Por favor, digite sua senha para confirmar.');
            return;
        }

        let resultadoConfirmacao = null;

        if (typeof this.onConfirm === 'function') {
            try {
                setButtonLoading(this.btnConfirmar, true, 'Confirmando...');
                resultadoConfirmacao = await this.onConfirm(senha.trim());
            } catch (error) {
                this.showError(error.message || 'Não foi possível apagar o funcionário.');
                return;
            } finally {
                setButtonLoading(this.btnConfirmar, false);
            }
        }

        this.afterSuccessCallback = resultadoConfirmacao?.afterSuccess || null;
        const mensagem = resultadoConfirmacao?.message || 'Funcionário apagado com sucesso!';
        this.showSuccess(mensagem);
    }

    showError(message) {
        this.errorDisplay.textContent = message;
        this.errorDisplay.style.display = 'block';
    }

    hideError() {
        this.errorDisplay.textContent = '';
        this.errorDisplay.style.display = 'none';
    }

    showSuccess(message) {
        this.modalManager.close();
        this.successModalManager.setMessage(message);
        this.successModalManager.open();

        if (typeof this.afterSuccessCallback === 'function') {
            this.afterSuccessCallback();
            this.afterSuccessCallback = null;
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    inicializarTela();
});