/// <reference path="../types/windown.d.ts" />

export {}

const telaInicialBtn = document.getElementById('telaInicial') as HTMLLIElement;
const cadastroAssistidaBtn = document.getElementById('telaCadastroAssistida') as HTMLButtonElement;

telaInicialBtn.addEventListener('click', async (event) => {
    const mudarTela = await window.api.openWindow("telaInicial");
})

cadastroAssistidaBtn.addEventListener('click', async (event) => {
    const mudarTela = await window.api.openWindow("telaCadastroAssistida");
})

document.addEventListener('DOMContentLoaded', async () => {
    await carregarAssistidas();
});

async function carregarAssistidas() {
    try {
        const resultado = await window.api.listarAssistidas();
        console.log('Assistidas carregadas:', resultado);
        
        if (resultado.success && resultado.assistidas && resultado.assistidas.length > 0) {
            exibirAssistidas(resultado.assistidas);
        } else {
            const containerCards = document.querySelector('.row.gy-4.gx-5');
            if (containerCards) {
                containerCards.innerHTML = '<div class="col-12"><p class="text-center text-muted">Nenhuma assistida cadastrada.</p></div>';
            }
        }
    } catch (error) {
        console.error('Erro ao carregar assistidas:', error);
    }
}

function exibirAssistidas(assistidas: any[]) {
    const containerCards = document.querySelector('.row.gy-4.gx-5');
    
    if (!containerCards) return;

    const cardsExistentes = containerCards.querySelectorAll('.col-md-6');
    cardsExistentes.forEach((card, index) => {
        if (index > 0) card.remove();
    });

    assistidas.forEach((assistida: any) => {
        const cardDiv = document.createElement('div');
        cardDiv.className = 'col-md-6';
        cardDiv.innerHTML = `
            <div class="text-center card-paciente" style="cursor: pointer; transition: transform 0.2s;" data-protocolo="${assistida.protocolo}">
                <h3 class="mb-2" style="color: #63468c; font-weight: bold;">ID: ${assistida.protocolo || 'N/A'}</h3>
                <p style="font-size: 1.1rem; font-weight: 600; color: #333;"><strong>${assistida.nome || 'N/A'}</strong></p>
                <p class="mb-0" style="font-size: 0.9rem; color: #666;">
                    ${assistida.idade || 'N/A'} anos | ${assistida.profissao || 'N/A'}
                </p>
            </div>
        `;
    
        const cardElement = cardDiv.querySelector('.card-paciente') as HTMLElement;
        if (cardElement) {
            cardElement.addEventListener('mouseover', () => {
                cardElement.style.transform = 'scale(1.05)';
            });
            cardElement.addEventListener('mouseout', () => {
                cardElement.style.transform = 'scale(1)';
            });
            cardElement.addEventListener('click', () => {
                console.log('Assistida clicada:', assistida.protocolo, assistida);
            });
        }
        
        containerCards.appendChild(cardDiv);
    });
}