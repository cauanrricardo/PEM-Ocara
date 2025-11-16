const modalNome = document.getElementById('modalNome');
const botaoNome = document.getElementById('itemNome');
const botaoFechar = document.querySelector('.modal-close');

const modalCargo = document.getElementById('modalCargo');
const botaoCargo = document.getElementById('itemCargo');
const botaoFecharCargo = document.querySelectorAll('.modal-close')[1];

botaoNome.addEventListener('click', () => {
    modalNome.classList.add('visible');
});

botaoFechar.addEventListener('click', () => {
    modalNome.classList.remove('visible');
});

botaoCargo.addEventListener('click', () => {
    modalCargo.classList.add('visible');
});

botaoFecharCargo.addEventListener('click', () => {
    modalCargo.classList.remove('visible');
});

window.addEventListener('click', (evento) => {
    if (evento.target === modalNome) {
        modalNome.classList.remove('visible');
    }
    if (evento.target === modalCargo) {
        modalCargo.classList.remove('visible');
    }
});
