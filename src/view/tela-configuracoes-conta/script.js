class PasswordValidator {
    validate(senhaAtual, novaSenha, confirmarSenha) {
        if (senhaAtual === '' || novaSenha === '' || confirmarSenha === '') {
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

function togglePassword(iconElement) {
    const inputWrapper = iconElement.parentElement;
    const input = inputWrapper.querySelector('input');

    if (input.type === "password") {
        input.type = "text";
        iconElement.textContent = "visibility_off";
    } else {
        input.type = "password";
        iconElement.textContent = "visibility";
    }
}

function setupModal(modalId, triggerId) {
    const modal = document.getElementById(modalId);
    const trigger = document.getElementById(triggerId);

    if (!modal || !trigger) {
        console.warn(`Modal ou Gatilho não encontrado: ${modalId}, ${triggerId}`);
        return;
    }

    const closeBtn = modal.querySelector('.modal-close');

    if (!closeBtn) {
        console.warn(`Botão de fechar não encontrado no modal: ${modalId}`);
        return;
    }
    const closeModal = () => {
        modal.classList.remove('visible');

        const inputs = modal.querySelectorAll('input');
        inputs.forEach(input => {
            if (input.type === 'text' || input.type === 'password') {
                input.value = '';
            }
        });

        const senhaError = modal.querySelector('#senhaError');
        if (senhaError) {
            senhaError.textContent = '';
            senhaError.style.display = 'none';
        }        
    };

    trigger.addEventListener('click', () => {
        modal.classList.add('visible');
    });

    closeBtn.addEventListener('click', closeModal);

    window.addEventListener('click', (evento) => {
        if (evento.target === modal) {
            closeModal();
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const passwordValidator = new PasswordValidator();

    setupModal('modalNome', 'itemNome');
    setupModal('modalCargo', 'itemCargo');
    setupModal('modalEmail', 'itemEmail');
    setupModal('modalSenha', 'itemSenha');

    const icons = document.querySelectorAll('.password-toggle-icon');
    icons.forEach(icon => {
        icon.textContent = "visibility";
        icon.classList.add('material-symbols-outlined');
    });

    const modalSenha = document.getElementById('modalSenha');

    if (modalSenha) {
        const btnAtualizarSenha = modalSenha.querySelector('.btn-atualizar');
        const senhaAtualInput = document.getElementById('senhaAtual');
        const novaSenhaInput = document.getElementById('novaSenha');
        const confirmarSenhaInput = document.getElementById('confirmarSenha');
        const senhaError = document.getElementById('senhaError');

        btnAtualizarSenha.addEventListener('click', () => {

            const senhaAtual = senhaAtualInput.value;
            const novaSenha = novaSenhaInput.value;
            const confirmarSenha = confirmarSenhaInput.value;
            senhaError.textContent = '';
            senhaError.style.display = 'none';
            const errorMessage = passwordValidator.validate(senhaAtual, novaSenha, confirmarSenha);

            if (errorMessage) {
                senhaError.textContent = errorMessage;
                senhaError.style.display = 'block';
                return;
            }
            alert('Senha atualizada com sucesso! (Isso é uma simulação)');

            novaSenhaInput.value = '';
            confirmarSenhaInput.value = '';
            
            modalSenha.classList.remove('visible');
        });
    }

});