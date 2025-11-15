const modalNome = document.getElementById('modalNome');
const botaoNome = document.getElementById('itemNome');
const botaoFechar = document.querySelector('.modal-close');

botaoNome.addEventListener('click', () => {
    modalNome.classList.add('visible');
});

botaoFechar.addEventListener('click', () => {
    modalNome.classList.remove('visible');
});

window.addEventListener('click', (evento) => {
    if (evento.target === modalNome) {
        modalNome.classList.remove('visible');
    }
});
