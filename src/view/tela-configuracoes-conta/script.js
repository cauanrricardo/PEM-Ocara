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

    trigger.addEventListener('click', () => {
        modal.classList.add('visible');
    });

    closeBtn.addEventListener('click', () => {
        modal.classList.remove('visible');
    });

    window.addEventListener('click', (evento) => {
        if (evento.target === modal) {
            modal.classList.remove('visible');
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {

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

            if (senhaAtual === '' || novaSenha === '' || confirmarSenha === '') {
                senhaError.textContent = 'Por favor, preencha todos os campos.';
                senhaError.style.display = 'block';
                return;
            }

            if (novaSenha.length < 8) {
                senhaError.textContent = 'A nova senha deve ter pelo menos 8 caracteres.';
                senhaError.style.display = 'block';
                return;
            }

            if (novaSenha !== confirmarSenha) {
                senhaError.textContent = 'As senhas não coincidem. Tente novamente.';
                senhaError.style.display = 'block';
                return;
            }

            alert('Senha atualizada com sucesso! (Isso é uma simulação)');

            senhaAtualInput.value = '';
            novaSenhaInput.value = '';
            confirmarSenhaInput.value = '';
            modalSenha.classList.remove('visible');
        });
    }

});