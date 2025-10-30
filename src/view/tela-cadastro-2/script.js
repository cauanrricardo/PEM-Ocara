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

    // Funcionalidade: Enter para próxima pergunta (apenas na seção "Identificação do Agressor(a)")
    // Encontra a seção de Identificação do Agressor
    const titulosSessao = document.querySelectorAll('.titulo-sessao');
    let secaoAgressor = null;
    
    titulosSessao.forEach(titulo => {
        const h4 = titulo.querySelector('h4');
        if (h4 && h4.textContent.includes('Identificação do Agressor(a)')) {
            // Pega o próximo elemento .perguntas após este título
            secaoAgressor = titulo.nextElementSibling;
        }
    });
    
    if (secaoAgressor) {
        // Seleciona apenas os inputs da seção de Identificação do Agressor
        const inputsAgressor = secaoAgressor.querySelectorAll('.pergunta input[type="text"], .pergunta input[type="number"], .pergunta input[type="date"]');
        
        inputsAgressor.forEach((input, index) => {
            input.addEventListener('keydown', function(event) {
                // Verifica se a tecla pressionada é Enter
                if (event.key === 'Enter') {
                    event.preventDefault(); // Previne o comportamento padrão
                    
                    // Encontra o próximo input
                    const proximoInput = inputsAgressor[index + 1];
                    
                    if (proximoInput) {
                        // Move o foco para o próximo input
                        proximoInput.focus();
                        
                        // Se for um input date, abre o calendário
                        if (proximoInput.type === 'date') {
                            proximoInput.showPicker && proximoInput.showPicker();
                        }
                    }
                }
            });
        });
    }
});
