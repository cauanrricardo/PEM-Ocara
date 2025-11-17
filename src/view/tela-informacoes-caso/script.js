// Dados que vem do backend
let dadosDoCaso = {};
let dadosDosAnexos = [];
let dadosDosRelatorios = [];
let tipoAnexoAtual = 'prova';

// Pega o icone certo pra cada tipo de arquivo
function obterIconeArquivo(nomeArquivo) {
    const extensao = nomeArquivo.split('.').pop().toLowerCase();
    
    switch (extensao) {
        case 'pdf':
            return 'icons/pdf.png';
        case 'doc':
        case 'docx':
            return 'icons/doc.png';
        case 'txt':
            return 'icons/txt.png';
        case 'jpg':
        case 'jpeg':
            return 'icons/jpg.png';
        case 'png':
            return 'icons/png.png';
        case 'mp3':
            return 'icons/mp3.png';
        case 'mp4':
        case 'm4a':
            return 'icons/mov.png';
        case 'zip':
        case 'rar':
            return 'icons/fecho-eclair.png';
        default:
            return 'icons/pdf.png';
    }
}

// Encurta nomes de arquivo muito grandes
function truncarNomeArquivo(nomeCompleto, maxLength = 40) {
    if (nomeCompleto.length <= maxLength) {
        return nomeCompleto;
    }
    
    const ultimoPonto = nomeCompleto.lastIndexOf('.');
    
    if (ultimoPonto === -1) {
        return nomeCompleto.substring(0, maxLength - 3) + '...';
    }
    
    const nome = nomeCompleto.substring(0, ultimoPonto);
    const extensao = nomeCompleto.substring(ultimoPonto);
    const espacoParaNome = maxLength - extensao.length - 3;
    
    if (espacoParaNome <= 0) {
        return nomeCompleto.substring(0, maxLength - 3) + '...';
    }
    
    return nome.substring(0, espacoParaNome) + '...' + extensao;
}

// Converte bytes em KB, MB, etc
function formatarTamanho(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

// Cria os cards de anexos na tela
function renderizarAnexos(dados, containerId) {
    const listaContainer = document.getElementById(containerId);
    
    if (!listaContainer) {
        console.error(`Container ${containerId} não encontrado`);
        return;
    }
    
    listaContainer.innerHTML = "";
    
    dados.forEach(arquivo => {
        const itemLista = document.createElement("li");
        itemLista.className = "item-anexo";
        const estaUpando = arquivo.status === 'upando';
        
        if (estaUpando) {
            // Layout com barra de progresso
            const iconeArquivo = obterIconeArquivo(arquivo.nome);
            itemLista.innerHTML = `
                <div class="icone-arquivo">
                    <img src="${iconeArquivo}" alt="Ícone do arquivo">
                </div>
                
                <div class="info-arquivo">
                    <div class="progresso-info">
                        <span class="texto-progresso">Upando arquivo... ${arquivo.progresso || 0}%</span>
                    </div>
                    <div class="barra-progresso">
                        <div class="barra-progresso-preenchida" style="width: ${arquivo.progresso || 0}%"></div>
                    </div>
                </div>
                
                <button class="btn-cancelar" data-id="${arquivo.id}">
                    <span class="material-symbols-outlined">cancel</span>
                </button>
            `;
        } else {
            // Layout normal do arquivo
            const iconeArquivo = obterIconeArquivo(arquivo.nome);
            const nomeExibicao = truncarNomeArquivo(arquivo.nome);
            itemLista.innerHTML = `
                <div class="icone-arquivo">
                    <img src="${iconeArquivo}" alt="Ícone do arquivo">
                </div>
                
                <div class="info-arquivo">
                    <span class="nome-arquivo" title="${arquivo.nome}">${nomeExibicao}</span>
                    <span class="tamanho-arquivo">${arquivo.tamanho}</span>
                </div>
                
                <button class="btn-apagar" data-id="${arquivo.id}">
                    <span class="material-symbols-outlined">delete_forever</span>
                </button>
            `;
        }
        
        listaContainer.appendChild(itemLista);
    });
    
    // Botões de apagar
    const botoesApagar = listaContainer.querySelectorAll('.btn-apagar');
    botoesApagar.forEach(botao => {
        botao.addEventListener('click', function() {
            const id = this.getAttribute('data-id');
            apagarAnexo(id, containerId);
        });
    });
    
    // Botões de cancelar
    const botoesCancelar = listaContainer.querySelectorAll('.btn-cancelar');
    botoesCancelar.forEach(botao => {
        botao.addEventListener('click', function() {
            const id = this.getAttribute('data-id');
            cancelarUpload(id, containerId);
        });
    });
}

// Apaga um arquivo da lista
function apagarAnexo(id, containerId) {
    if (confirm('Tem certeza que deseja apagar este arquivo?')) {
        console.log(`Apagando arquivo com ID: ${id}`);
        
        if (containerId === 'lista-anexos') {
            const index = dadosDosAnexos.findIndex(a => a.id === id);
            if (index > -1) {
                dadosDosAnexos.splice(index, 1);
                renderizarAnexos(dadosDosAnexos, 'lista-anexos');
            }
        } else if (containerId === 'lista-relatorios') {
            const index = dadosDosRelatorios.findIndex(a => a.id === id);
            if (index > -1) {
                dadosDosRelatorios.splice(index, 1);
                renderizarAnexos(dadosDosRelatorios, 'lista-relatorios');
            }
        }
    }
}

// Cancela upload em andamento
function cancelarUpload(id, containerId) {
    if (confirm('Tem certeza que deseja cancelar o upload?')) {
        console.log(`Cancelando upload do arquivo com ID: ${id}`);
        
        if (containerId === 'lista-anexos') {
            const index = dadosDosAnexos.findIndex(a => a.id === id);
            if (index > -1) {
                dadosDosAnexos.splice(index, 1);
                renderizarAnexos(dadosDosAnexos, 'lista-anexos');
            }
        } else if (containerId === 'lista-relatorios') {
            const index = dadosDosRelatorios.findIndex(a => a.id === id);
            if (index > -1) {
                dadosDosRelatorios.splice(index, 1);
                renderizarAnexos(dadosDosRelatorios, 'lista-relatorios');
            }
        }
    }
}

// Abre popup de upload
function abrirPopupUpload(tipo) {
    tipoAnexoAtual = tipo || 'prova';
    const popup = document.getElementById('popup-upload');
    popup.style.display = 'flex';
}

// Fecha popup de upload
function fecharPopupUpload() {
    const popup = document.getElementById('popup-upload');
    popup.style.display = 'none';
    document.getElementById('file-input').value = '';
}

// Processa arquivo selecionado
function handleFileSelect(files) {
    if (files.length > 0) {
        const file = files[0];
        console.log('Arquivo selecionado:', file.name);
        console.log('Tipo de anexo:', tipoAnexoAtual);
        
        // Valida tamanho maximo de 100MB
        const maxSize = 100 * 1024 * 1024;
        if (file.size > maxSize) {
            alert('O arquivo excede o tamanho máximo permitido de 100MB. Por favor, selecione um arquivo menor.');
            return;
        }
        
        const novoAnexo = {
            id: 'uuid-' + Date.now(),
            nome: file.name,
            tamanho: formatarTamanho(file.size),
            status: 'upando',
            progresso: 0
        };
        
        // Adiciona na lista certa
        if (tipoAnexoAtual === 'relatorio') {
            dadosDosRelatorios.push(novoAnexo);
            renderizarAnexos(dadosDosRelatorios, 'lista-relatorios');
            simularUpload(novoAnexo.id, 'relatorio');
        } else {
            dadosDosAnexos.push(novoAnexo);
            renderizarAnexos(dadosDosAnexos, 'lista-anexos');
            simularUpload(novoAnexo.id, 'prova');
        }
        
        fecharPopupUpload();
    }
}

// Simula progresso de upload (remover quando integrar backend)
function simularUpload(id, tipo) {
    let progresso = 0;
    const interval = setInterval(() => {
        progresso += 10;
        
        const dados = tipo === 'relatorio' ? dadosDosRelatorios : dadosDosAnexos;
        const containerId = tipo === 'relatorio' ? 'lista-relatorios' : 'lista-anexos';
        
        const anexo = dados.find(a => a.id === id);
        if (anexo) {
            anexo.progresso = progresso;
            if (progresso >= 100) {
                anexo.status = 'upado';
                clearInterval(interval);
            }
            renderizarAnexos(dados, containerId);
        } else {
            clearInterval(interval);
        }
    }, 500);
}

// Preenche informacoes do caso na tela
function preencherInformacoesCaso(dados) {
    if (!dados) return;
    
    if (dados.protocolo) {
        document.getElementById('Protocolo').textContent = dados.protocolo;
    }
    if (dados.assistida) {
        document.getElementById('Assistida').textContent = dados.assistida;
    }
    if (dados.agressor) {
        document.getElementById('Agressor').textContent = dados.agressor;
    }
    if (dados.dataCadastro) {
        document.getElementById('DataCadastro').textContent = dados.dataCadastro;
    }
    if (dados.statusAssistencia) {
        document.getElementById('StatusAssistencia').textContent = dados.statusAssistencia;
    }
    if (dados.statusJuridico) {
        document.getElementById('StatusJuridico').textContent = dados.statusJuridico;
    }
    if (dados.tipoViolencia) {
        document.getElementById('TipoViolencia').textContent = dados.tipoViolencia;
    }
    
    const redesContatadas = document.getElementById('redes-contatadas');
    if (dados.redesContatadas && dados.redesContatadas.trim() !== '') {
        redesContatadas.textContent = dados.redesContatadas;
    } else {
        redesContatadas.textContent = 'Nenhuma rede de apoio foi contatada até o momento';
    }
}

// Inicializa tudo quando a pagina carregar
document.addEventListener('DOMContentLoaded', function() {
    // Mensagem padrao se nao tiver redes contatadas
    const redesContatadas = document.getElementById('redes-contatadas');
    if (redesContatadas && !redesContatadas.textContent.trim()) {
        redesContatadas.textContent = 'Nenhuma rede de apoio foi contatada até o momento';
    }
    
    renderizarAnexos(dadosDosAnexos, 'lista-anexos');
    renderizarAnexos(dadosDosRelatorios, 'lista-relatorios');

    // Modal de encaminhamento
    const botaoEncaminhamento = document.getElementById('encaminhamento');
    const modalEncaminhamento = document.getElementById('modalEncaminhamento');
    const botaoFecharModalEncaminhamento = document.getElementById('fecharModalEncaminhamento');
    const selectEmailPara = document.getElementById('email-para');

    let redesCadastradas = []; // Array de redes que vem do backend

    function carregarRedes() {
        selectEmailPara.innerHTML = '<option value="" disabled selected>Para</option>';
        
        redesCadastradas.forEach(rede => {
            const option = document.createElement('option');
            option.value = rede.id;
            option.textContent = rede.nome;
            selectEmailPara.appendChild(option);
        });
    }

    function abrirModalEncaminhamento() {
        carregarRedes();
        modalEncaminhamento.classList.add('visible');
        document.body.style.overflow = 'hidden';
    }

    function fecharModalEncaminhamento() {
        modalEncaminhamento.classList.remove('visible');
        document.body.style.overflow = '';
    }

    if (botaoEncaminhamento) {
        botaoEncaminhamento.addEventListener('click', abrirModalEncaminhamento);
    }

    if (botaoFecharModalEncaminhamento) {
        botaoFecharModalEncaminhamento.addEventListener('click', fecharModalEncaminhamento);
    }

    // Selecao de anexos no modal
    const botaoAnexo = document.getElementById('botaoAnexo');
    const nomeAnexoModalEl = document.getElementById('nome-anexo-modal');
    const menuAnexos = document.getElementById('menuAnexos');
    const fecharMenuAnexos = document.getElementById('fecharMenuAnexos');
    const listaAnexosModal = document.getElementById('listaAnexosModal');
    
    let anexosSelecionados = [];

    if (nomeAnexoModalEl) {
        nomeAnexoModalEl.textContent = 'Nenhum anexo selecionado';
    }

    // Monta lista de anexos disponiveis
    function atualizarListaAnexosModal() {
        listaAnexosModal.innerHTML = '';
        
        const formulario = {
            id: 'formulario',
            nome: 'Formulário'
        };
        
        const todosAnexos = [
            formulario,
            ...dadosDosAnexos.filter(a => a.status === 'upado'),
            ...dadosDosRelatorios.filter(a => a.status === 'upado')
        ];

        todosAnexos.forEach(anexo => {
            const itemDiv = document.createElement('div');
            itemDiv.className = 'anexo-item-modal';
            
            const iconeDiv = document.createElement('div');
            iconeDiv.className = 'anexo-icone-modal';
            if (anexo.id === 'formulario') {
                iconeDiv.innerHTML = '<span class="material-symbols-outlined">attach_file</span>';
            } else {
                iconeDiv.innerHTML = '<span class="material-symbols-outlined">description</span>';
            }
            
            const nomeSpan = document.createElement('div');
            nomeSpan.className = 'anexo-nome-modal';
            const nomeExibicao = truncarNomeArquivo(anexo.nome, 35);
            nomeSpan.textContent = nomeExibicao;
            nomeSpan.title = anexo.nome;
            
            itemDiv.appendChild(nomeSpan);
            itemDiv.appendChild(iconeDiv);
            
            // Clique seleciona/desseleciona
            itemDiv.addEventListener('click', (e) => {
                if (!anexosSelecionados.includes(anexo.id)) {
                    anexosSelecionados.push(anexo.id);
                } else {
                    anexosSelecionados = anexosSelecionados.filter(id => id !== anexo.id);
                }
                
                if (anexosSelecionados.includes(anexo.id)) {
                    itemDiv.style.backgroundColor = '#F0E6F8';
                } else {
                    itemDiv.style.backgroundColor = '#ffffff';
                }
                
                atualizarTextoAnexosSelecionados();
            });
            
            if (anexosSelecionados.includes(anexo.id)) {
                itemDiv.style.backgroundColor = '#F0E6F8';
            }
            
            listaAnexosModal.appendChild(itemDiv);
        });
    }

    // Atualiza texto de quantos anexos foram selecionados
    function atualizarTextoAnexosSelecionados() {
        if (anexosSelecionados.length === 0) {
            nomeAnexoModalEl.textContent = 'Nenhum anexo selecionado';
        } else if (anexosSelecionados.length === 1) {
            const anexo = [...dadosDosAnexos, ...dadosDosRelatorios].find(a => a.id === anexosSelecionados[0]);
            nomeAnexoModalEl.textContent = anexo ? anexo.nome : '1 anexo selecionado';
        } else {
            nomeAnexoModalEl.textContent = `${anexosSelecionados.length} anexos selecionados`;
        }
    }

    if (botaoAnexo) {
        botaoAnexo.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            if (menuAnexos.style.display === 'none' || menuAnexos.style.display === '') {
                atualizarListaAnexosModal();
                menuAnexos.style.display = 'block';
            } else {
                menuAnexos.style.display = 'none';
            }
        });
    }

    if (fecharMenuAnexos) {
        fecharMenuAnexos.addEventListener('click', () => {
            menuAnexos.style.display = 'none';
        });
    }

    // Fecha dropdown se clicar fora
    document.addEventListener('click', (e) => {
        if (menuAnexos && !menuAnexos.contains(e.target) && !botaoAnexo.contains(e.target)) {
            menuAnexos.style.display = 'none';
        }
    });

    // Botao enviar encaminhamento
    const btnEnviarEncaminhamento = document.getElementById('btnEnviarEncaminhamento');
    if (btnEnviarEncaminhamento) {
        btnEnviarEncaminhamento.addEventListener('click', function() {
            const emailPara = document.getElementById('email-para').value;
            const emailAssunto = document.getElementById('email-assunto').value;
            const emailCorpo = document.getElementById('email-corpo').value;
            
            console.log('Enviando encaminhamento...');
            console.log('Para:', emailPara);
            console.log('Assunto:', emailAssunto);
            console.log('Corpo:', emailCorpo);
            console.log('Anexos selecionados:', anexosSelecionados);
            
            fecharModalEncaminhamento();
            
            // Limpa campos
            document.getElementById('email-para').value = '';
            document.getElementById('email-assunto').value = '';
            document.getElementById('email-corpo').value = '';
            anexosSelecionados = [];
            atualizarTextoAnexosSelecionados();
            menuAnexos.style.display = 'none';
        });
    }
    
    // Botoes de anexar
    const botaoAnexarProva = document.getElementById('anexar-prova');
    if (botaoAnexarProva) {
        botaoAnexarProva.addEventListener('click', () => abrirPopupUpload('prova'));
    }
    
    const botaoAnexarRelatorio = document.getElementById('anexar-relatorio');
    if (botaoAnexarRelatorio) {
        botaoAnexarRelatorio.addEventListener('click', () => abrirPopupUpload('relatorio'));
    }
    
    // Popup de upload
    const btnFecharPopup = document.getElementById('fechar-popup');
    if (btnFecharPopup) {
        btnFecharPopup.addEventListener('click', fecharPopupUpload);
    }
    
    const fileInput = document.getElementById('file-input');
    if (fileInput) {
        fileInput.addEventListener('change', function(e) {
            handleFileSelect(e.target.files);
        });
    }
    
    const btnSelecionarArquivo = document.getElementById('btn-selecionar-arquivo');
    if (btnSelecionarArquivo) {
        btnSelecionarArquivo.addEventListener('click', function() {
            fileInput.click();
        });
    }
    
    // Drag and drop
    const dropZone = document.getElementById('drop-zone');
    if (dropZone) {
        dropZone.addEventListener('dragover', function(e) {
            e.preventDefault();
            dropZone.classList.add('drag-over');
        });
        
        dropZone.addEventListener('dragleave', function(e) {
            e.preventDefault();
            dropZone.classList.remove('drag-over');
        });
        
        dropZone.addEventListener('drop', function(e) {
            e.preventDefault();
            dropZone.classList.remove('drag-over');
            handleFileSelect(e.dataTransfer.files);
        });
    }
});