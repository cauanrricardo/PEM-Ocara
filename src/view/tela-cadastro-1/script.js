// Função para verificar se todas as perguntas obrigatórias estão preenchidas
function verificarCamposObrigatorios() {
    const btnProximo = document.getElementById('proximo');
    
    // Seleciona todos os labels que contêm span (campos obrigatórios)
    const labelsObrigatorios = document.querySelectorAll('.pergunta label span, #pergunta-marcar > label span');
    
    let todosPreenchidos = true;
    
    labelsObrigatorios.forEach(span => {
        const label = span.parentElement;
        // Obtém o id do input associado ao label
        const inputId = label.getAttribute('for');
        
        if (inputId) {
            const input = document.getElementById(inputId);
            
            if (input) {
                // Verifica se é input de texto
                if (input.type === 'text' && input.value.trim() === '') {
                    todosPreenchidos = false;
                }
            }
        }
    });
    
    // Verifica se há pergunta-marcar obrigatória (com span)
    const perguntaMarcar = document.getElementById('pergunta-marcar');
    if (perguntaMarcar) {
        const spanObrigatorio = perguntaMarcar.querySelector('label > span');
        if (spanObrigatorio) {
            const radios = perguntaMarcar.querySelectorAll('input[type="radio"]');
            let algumSelecionado = false;
            radios.forEach(radio => {
                if (radio.checked) {
                    algumSelecionado = true;
                }
            });
            if (!algumSelecionado) {
                todosPreenchidos = false;
            }
        }
    }
    
    // Habilita ou desabilita o botão baseado no preenchimento
    btnProximo.disabled = !todosPreenchidos;
}

// Adiciona eventos de input/change em todos os campos do formulário
document.addEventListener('DOMContentLoaded', function() {
    const inputs = document.querySelectorAll('.pergunta input, #pergunta-marcar input');
    
    inputs.forEach(input => {
        if (input.type === 'radio') {
            input.addEventListener('change', verificarCamposObrigatorios);
        } else {
            input.addEventListener('input', verificarCamposObrigatorios);
        }
    });
    
    // Verifica inicialmente
    verificarCamposObrigatorios();
});
