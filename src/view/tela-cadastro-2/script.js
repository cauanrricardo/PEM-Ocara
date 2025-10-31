// Controle de exibição condicional da seção de filhos
document.addEventListener('DOMContentLoaded', function() {
    const secaoFilhos = document.getElementById('se-tem-filhos');
    
    const todasPerguntas = document.querySelectorAll('.pergunta-selecao');
    let pergunta16 = null;
    
    todasPerguntas.forEach(pergunta => {
        const label = pergunta.querySelector('.titulo-pergunta label');
        if (label && label.textContent.includes('Você tem filho(s)?')) {
            pergunta16 = pergunta;
        }
    });
    
    if (!pergunta16 || !secaoFilhos) {
        console.error('Elementos não encontrados');
        return;
    }
    const checkboxes = pergunta16.querySelectorAll('.opcao input[type="checkbox"]');

    secaoFilhos.style.display = 'none';
    
    function atualizarVisibilidade() {
        const temFilhos = checkboxes[0].checked || checkboxes[1].checked;
        
        if (temFilhos) {
            secaoFilhos.style.display = 'flex';
        } else {
            secaoFilhos.style.display = 'none';
        }
    }
    
    // Lógica para a opção "Não" ser exclusiva
    const checkboxNao = checkboxes[2]; // Terceiro checkbox é o "Não"
    const checkboxesSimAgressor = checkboxes[0]; // Primeiro checkbox "Sim, com agressor"
    const checkboxesSimOutro = checkboxes[1]; // Segundo checkbox "Sim, de outro relacionamento"
    
    // Quando marcar "Não", desmarcar as outras opções
    checkboxNao.addEventListener('change', function() {
        if (this.checked) {
            checkboxesSimAgressor.checked = false;
            checkboxesSimOutro.checked = false;
        }
        atualizarVisibilidade();
    });
    
    // Quando marcar qualquer opção "Sim", desmarcar "Não"
    checkboxesSimAgressor.addEventListener('change', function() {
        if (this.checked) {
            checkboxNao.checked = false;
        }
        atualizarVisibilidade();
    });
    
    checkboxesSimOutro.addEventListener('change', function() {
        if (this.checked) {
            checkboxNao.checked = false;
        }
        atualizarVisibilidade();
    });

    // Funcionalidade: Enter para próxima pergunta 
    const titulosSessao = document.querySelectorAll('.titulo-sessao');
    let secaoAgressor = null;
    
    titulosSessao.forEach(titulo => {
        const h4 = titulo.querySelector('h4');
        if (h4 && h4.textContent.includes('Identificação do Agressor(a)')) {
            secaoAgressor = titulo.nextElementSibling;
        }
    });
    
    if (secaoAgressor) {
        const inputsAgressor = secaoAgressor.querySelectorAll('.pergunta input[type="text"], .pergunta input[type="number"], .pergunta input[type="date"]');
        
        inputsAgressor.forEach((input, index) => {
            input.addEventListener('keydown', function(event) {
                if (event.key === 'Enter') {
                    event.preventDefault(); 
                    
                    const proximoInput = inputsAgressor[index + 1];
                    
                    if (proximoInput) {
                        proximoInput.focus();
                        
                        if (proximoInput.type === 'date') {
                            proximoInput.showPicker && proximoInput.showPicker();
                        }
                    }
                }
            });
        });
    }
});
