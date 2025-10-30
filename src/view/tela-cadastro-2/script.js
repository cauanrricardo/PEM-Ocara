// Controle de exibição condicional da seção de filhos
document.addEventListener('DOMContentLoaded', function() {
    // Seleciona a seção que deve ser exibida/ocultada
    const secaoFilhos = document.getElementById('se-tem-filhos');
    
    // Seleciona todos os checkboxes da pergunta 16
    // Busca pela pergunta que contém "Você tem filho(s)?"
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
    
    // Seleciona os checkboxes da pergunta 16
    const checkboxes = pergunta16.querySelectorAll('.opcao input[type="checkbox"]');
    
    // Esconde a seção inicialmente
    secaoFilhos.style.display = 'none';
    
    // Função para verificar e atualizar a visibilidade
    function atualizarVisibilidade() {
        // Verifica se algum dos dois primeiros checkboxes está marcado (as opções "Sim")
        const temFilhos = checkboxes[0].checked || checkboxes[1].checked;
        
        if (temFilhos) {
            secaoFilhos.style.display = 'flex';
        } else {
            secaoFilhos.style.display = 'none';
        }
    }
    
    // Adiciona eventos de mudança para cada checkbox
    checkboxes.forEach((checkbox, index) => {
        checkbox.addEventListener('change', function() {
            if (this.checked) {
                // Desmarca os outros checkboxes
                checkboxes.forEach((cb, i) => {
                    if (i !== index) {
                        cb.checked = false;
                    }
                });
            }
            atualizarVisibilidade();
        });
    });
});
