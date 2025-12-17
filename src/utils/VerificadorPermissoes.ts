/**
 * Verificador de Permissões para Telas de Formulário
 * 
 * Verifica se o usuário tem permissão para acessar uma tela específica
 * baseado na privacidade do caso armazenada no banco de dados.
 * 
 * Formato de privacidade: "1,2,3" onde:
 * 1 = Cadastro da Assistida
 * 2 = Cadastro do Caso
 * 3 = Outras Informações e Encaminhamentos
 */

export class VerificadorPermissoes {
    private static readonly TELAS_MAPEAMENTO: { [key: number]: string } = {
        1: 'Cadastro da Assistida',
        2: 'Cadastro do Caso',
        3: 'Outras Informações e Encaminhamentos'
    };

    static async verificarEBloquearSenecessario(numTela: number): Promise<void> {
        try {
            // Obter ID do caso
            const idCaso = parseInt(sessionStorage.getItem('idCasoAtual') || '0');
            
            if (idCaso === 0) {
                return;
            }

            // Verificar se o usuário é jurídico
            const usuarioLogadoJSON = sessionStorage.getItem('usuarioLogado');
            if (!usuarioLogadoJSON) {
                return;
            }

            const usuarioLogado = JSON.parse(usuarioLogadoJSON);
            const cargo = (usuarioLogado.cargo || '').toLowerCase();

            // Só verificar se for jurídico (assistente social tem acesso a tudo)
            if (!cargo.includes('juridico')) {
                return;
            }

            // Obter privacidade do caso
            const resultado = await (window as any).api.obterPrivacidadeCaso(idCaso);
            
            if (!resultado || !resultado.success) {
                return;
            }

            const privacidade = resultado.privacidade || '';
            const telaAutorizada = privacidade.includes(numTela.toString());

            if (!telaAutorizada) {
                this.mostrarAvisoBloqueio(numTela);
            }

        } catch (error) {
            // Erro silencioso - tela será mostrada normalmente
        }
    }

    /**
     * Exibe div centralizada bloqueando acesso à tela
     */
    private static mostrarAvisoBloqueio(numTela: number): void {
        const nomeTela = this.TELAS_MAPEAMENTO[numTela] || `Tela ${numTela}`;

        // Desabilitar scroll na página inteira
        document.body.style.overflow = 'hidden !important' as any;
        document.documentElement.style.overflow = 'hidden !important' as any;
        document.body.style.height = '100vh';
        document.body.style.width = '100vw';

        // Encontrar o container do formulário (geralmente é um div branco)
        let containerFormulario: HTMLElement | null = null;
        
        // Procurar por containers comuns
        const seletoresPossiveis = [
            'main',
            '.container-form',
            '.form-container',
            '[class*="form"]',
            'section:not(.etapas)',
            'article'
        ];

        for (const seletor of seletoresPossiveis) {
            const elemento = document.querySelector(seletor) as HTMLElement;
            if (elemento && elemento.offsetHeight > 300) {
                containerFormulario = elemento;
                break;
            }
        }

        // Se não encontrar um container específico, procurar por divs brancos (mas não a página inteira)
        if (!containerFormulario) {
            const divs = document.querySelectorAll('div');
            for (const div of divs) {
                const el = div as HTMLElement;
                const style = window.getComputedStyle(el);
                const bgColor = style.backgroundColor;
                
                const ehBranco = bgColor === 'rgb(255, 255, 255)' || bgColor === 'white';
                const temAlturaSignificativa = el.offsetHeight > 300 && el.offsetHeight < window.innerHeight * 0.8;
                const temLarguraSignificativa = el.offsetWidth > 300;
                
                if (ehBranco && temAlturaSignificativa && temLarguraSignificativa) {
                    containerFormulario = el;
                    break;
                }
            }
        }

        // Se encontrou o container, colocar o bloqueio nele
        if (containerFormulario) {
            // Esconder scrollbar do container
            containerFormulario.style.overflow = 'hidden';
            
            const bloqueio = document.createElement('div');
            bloqueio.id = 'bloqueio-permissao';
            bloqueio.style.cssText = `
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: white;
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 9999;
            `;

            // Criar conteúdo centralizado
            const conteudo = document.createElement('div');
            conteudo.style.cssText = `
                text-align: center;
                font-family: 'Poppins', Arial, sans-serif;
                padding: 40px;
            `;

            conteudo.innerHTML = `
                <div style="font-size: 80px; margin-bottom: 30px;">🔒</div>
                <h2 style="color: #d32f2f; margin: 0 0 20px 0; font-size: 24px; font-weight: 700;">Acesso Restrito</h2>
                <p style="color: #666; margin: 0 0 15px 0; font-size: 16px; line-height: 1.6;">
                    Você não tem permissão para acessar a tela de:
                </p>
                <p style="color: #333; margin: 0 0 25px 0; font-size: 18px; font-weight: 600;">
                    <strong>${nomeTela}</strong>
            `;

            bloqueio.appendChild(conteudo);
            
            // Garantir que o container está com position relative para o absolute funcionar
            if (window.getComputedStyle(containerFormulario).position === 'static') {
                containerFormulario.style.position = 'relative';
            }
            
            containerFormulario.appendChild(bloqueio);
        }

        // Prevenir scroll via teclado e mouse wheel
        const prevenirScroll = (e: Event) => {
            e.preventDefault();
        };
        
        document.addEventListener('wheel', prevenirScroll, { passive: false });
        document.addEventListener('touchmove', prevenirScroll, { passive: false });
        document.addEventListener('keydown', (e: KeyboardEvent) => {
            if (['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' '].includes(e.key)) {
                e.preventDefault();
            }
        });

        // Desabilitar sidebar
        const sidebar = document.querySelector('aside, [class*="sidebar"], [class*="sideBar"], nav[class*="nav"]');
        if (sidebar) {
            (sidebar as HTMLElement).style.pointerEvents = 'none';
        }
    }
}

// Chamar verificação automaticamente quando o documento carregar
document.addEventListener('DOMContentLoaded', async () => {
    // Detectar qual tela está sendo acessada
    let numTela = 0;
    
    if (window.location.pathname.includes('tela-cadastro-1-visualizacao')) {
        numTela = 1;
    } else if (window.location.pathname.includes('tela-cadastro-2-visualizacao')) {
        numTela = 2;
    } else if (window.location.pathname.includes('tela-cadastro-3-visualizacao')) {
        numTela = 3;
    }

    if (numTela > 0) {
        await VerificadorPermissoes.verificarEBloquearSenecessario(numTela);
    }
});
