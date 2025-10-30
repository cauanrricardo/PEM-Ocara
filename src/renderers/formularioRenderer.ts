/// <reference path="../types/windown.d.ts" />

export {}   

const pxmBtn = document.getElementById('proximo') as HTMLButtonElement; 
const voltarBtn = document.getElementById('voltar') as HTMLButtonElement;
const errorModal = document.getElementById('error-modal') as HTMLDivElement;
const modalMessage = document.getElementById('modal-message') as HTMLDivElement;

voltarBtn.addEventListener('click', async (event) => {
    const mudarTela = await window.api.openWindow("telaInicial");
})

pxmBtn.addEventListener('click', async (event) => {

    event.preventDefault();
    try {

        const nomeInput = document.getElementById('nome-completo') as HTMLInputElement;
        const idadeInput = document.getElementById('idade') as HTMLInputElement;
        const enderecoInput = document.getElementById('endereco') as HTMLInputElement;
        const generoInput = document.getElementById('identidade-genero') as HTMLInputElement;
        const nomeSocialInput = document.getElementById('nome-social') as HTMLInputElement;
        const escolaridadeInput = document.getElementById('escolaridade') as HTMLInputElement;
        const religiaoInput = document.getElementById('religiao') as HTMLInputElement;
        const profissaoInput = document.getElementById('profissao') as HTMLInputElement;
        const limitacaoInput = document.getElementById('limitacao') as HTMLInputElement;
        const programaSocialInput = document.getElementById('numero-cadastro') as HTMLInputElement;
        const nacionalidadeInput = document.getElementById('nacionalidade') as HTMLInputElement;
        const dependentesInput = document.getElementById('dependentes') as HTMLInputElement;

        // Validar se todos os elementos foram encontrados
        if (!nomeInput || !idadeInput || !enderecoInput || !generoInput || !nomeSocialInput || 
            !escolaridadeInput || !religiaoInput || !profissaoInput || !limitacaoInput || 
            !programaSocialInput || !nacionalidadeInput || !dependentesInput) {
            throw new Error('Um ou mais campos do formulário não foram encontrados no HTML');
        }

        // Obter zona de habitação do radio button
        const zonaHabitacaoRadios = document.querySelectorAll('input[name="zona_habitacao"]') as NodeListOf<HTMLInputElement>;
        let zonaHabitacao: string = '';
        zonaHabitacaoRadios.forEach(radio => {
            if (radio.checked) {
                zonaHabitacao = radio.value;
            }
        });

        if (!zonaHabitacao) {
            throw new Error('Por favor, selecione uma zona de habitação');
        }

        const nome: string = nomeInput.value.trim();
        const idade: number = parseInt(idadeInput.value.trim(), 10); 
        const identidadeGenero: string = generoInput.value.trim(); 
        const nomeSocial: string = nomeSocialInput.value.trim();
        const endereco: string = enderecoInput.value.trim();
        const escolaridade: string = escolaridadeInput.value.trim();
        const religiao: string = religiaoInput.value.trim();
        const nacionalidade: string = nacionalidadeInput.value.trim();
        const profissao: string = profissaoInput.value.trim();
        const limitacaoFisica: string = limitacaoInput.value.trim();
        const numeroCadastroSocial: string = programaSocialInput.value.trim();
        const quantidadeDependentes: number = parseInt(dependentesInput.value.trim(), 10);
        const temDependentes: boolean = quantidadeDependentes > 0;

        
        const result = await window.api.criarAssistida(
            nome, 
            idade, 
            identidadeGenero,
            nomeSocial,
            endereco,
            escolaridade,
            religiao,
            nacionalidade,
            zonaHabitacao,
            profissao,
            limitacaoFisica,
            numeroCadastroSocial,
            quantidadeDependentes,
            temDependentes
        )
            
        if(result.success && result.assistida) {
            modalMessage.innerHTML = `<p>✅ Assistida cadastrada com sucesso! Protocolo: ${result.assistida.nome}</p>`;
            errorModal.style.display = 'block';
        }

    } catch (error) {
        modalMessage.innerHTML = `<p>❌ Ocorreu um erro ao processar o cadastro: ${(error as Error).message}</p>`;
        errorModal.style.display = 'block';
    } 
});

        
