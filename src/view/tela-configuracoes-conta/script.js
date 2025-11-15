const modalNome = document.getElementById('modalNome');
const botaoNome = document.querySelector('.info-section:first-of-type .info-item:first-child');
const botaoFechar = document.querySelector('.close-button');

botaoNome.addEventListener('click', () => {
    modalNome.style.display = 'flex';
});

botaoFechar.addEventListener('click', () => {
    modalNome.style.display = 'none';
});

window.addEventListener('click', (evento) => {
    if (evento.target === modalNome) {
        modalNome.style.display = 'none';
    }
});
