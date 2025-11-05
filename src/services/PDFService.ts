import { Caso } from "../models/Caso/Caso";
import { Assistida } from "../models/assistida/Assistida";
import { Agressor } from "../models/Caso/Agressor";
import { HistoricoViolencia } from "../models/Caso/HistoricoViolencia";
import { PdfUtil, IAtendimentoData, IAgressorData, IBlocoIData, IBlocoIIData, IBlocoIIIData, IBlocoIVData, IPreenchimentoProfissional, IFormularioCompleto } from "../utils/PdfUtil";

export class PdfService {
  
  private pdfUtil: PdfUtil;
  private caso: Caso;

  constructor() {
    this.pdfUtil = new PdfUtil();
    this.caso = new Caso();
  }

  public async criarPdfDeFormulario(casoId: number): Promise<string> {
    // buscar o caso do banco(não tem então vou criar)

    const caso = new Caso();
    caso.criarCaso(
      //assistida
      'Maria da Silva', 30, 'Mulher Cis', '', 'Rua...', 'Superior', 'N/A', 'BR', 'URBANA', 'Profissão', '', '12345', 1, true,
      //agressor
      'João', 35, 'Ex-companheiro', new Date(),
      ['ALCOOL'], 'NAO', false, false, 'NAO', 'NAO', 'SIM',
      true,
      true,
      'ARMA_FOGO,SOCOS,CHUTES',
      false,
      ['FRASE_NINGUEM', 'PERSEGUIU'],
      true,
      true,
      'Anotaçãoaoao livreeee',
      true, false, false, false, false, 'FISICA',
      false, true, false,
      'NAO', true, 1, false, 0, ['0 A 11 ANOS'], false, 'NENHUM', true, false, false, 'N/A', 'PARDA',
      new Date(), 'Dr. Responsável (Simulado)', 'Descrição do caso...'
    );
    
    const assistida = caso.getAssistida();
    if (!assistida) {
      throw new Error("Caso não possui uma assistida associada.");
    }
    
    const atendimentoData: IAtendimentoData = this.mapAtendimento(caso);
    const agressorData: IAgressorData = this.mapAgressor(caso.getAgressor());
    const blocoIData: IBlocoIData = this.mapBlocoI(caso.getHistoricoViolencia());

    return this.pdfUtil.gerarPdfFormulario(
      assistida,
      atendimentoData,
      agressorData,
      blocoIData
    );
  }

  private mapAtendimento(caso: Caso): IAtendimentoData {

    return {
      data: caso.getData().toLocaleDateString('pt-BR'),
      responsavel: caso.getProfissionalResponsavel(),
    };
  }

  private mapAgressor(agressor?: Agressor): IAgressorData {
    if (!agressor) {
      return { nome: '', idade: 0, vinculo: '', dataFato: '' };
    }

    return {
      nome: (agressor as any).getNomeAgressor() || '',
      idade: (agressor as any).getIdadeAgressor() || 0,
      vinculo: (agressor as any).getVinculoAssistida() || '',
      dataFato: (agressor as any).getDataOcorrida()?.toLocaleDateString('pt-BR') || '',
    };
  }

  private mapBlocoI(historico?: HistoricoViolencia): IBlocoIData {
    if (!historico) {
      throw new Error("Dados do Histórico de Violência não encontrados.");
    }
    
    const formasViolencia = (historico as any).getOutrasFormasViolencia()?.toUpperCase() || '';
    const comportamentos = (historico as any).getComportamentosAgressor() || [];

    let p_ameaca = 'NAO';
    if ((historico as any).getAmeacaFamiliar()) {
      if (formasViolencia.includes('ARMA_FOGO')) p_ameaca = 'ARMA_FOGO';
      else if (formasViolencia.includes('FACA')) p_ameaca = 'FACA';
      else p_ameaca = 'OUTRA'; 
      
    const p_agressoes = {
      queimadura: formasViolencia.includes('QUEIMADURA'),
      enforcamento: formasViolencia.includes('ENFORCAMENTO'),
      sufocamento: formasViolencia.includes('SUFOCAMENTO'),
      tiro: formasViolencia.includes('TIRO'),
      afogamento: formasViolencia.includes('AFOGAMENTO'),
      facada: formasViolencia.includes('FACADA'),
      paulada: formasViolencia.includes('PAULADA'),
      nenhuma: false,
    };
    
    const p2_agressoes = {
      socos: formasViolencia.includes('SOCOS'),
      chutes: formasViolencia.includes('CHUTES'),
      tapas: formasViolencia.includes('TAPAS'),
      empurroes: formasViolencia.includes('EMPURROES'),
      puxoesCabelo: formasViolencia.includes('PUXOESCABELO'),
      nenhuma: false,
    };

    const p_sexo_forcado = (historico as any).getAbusoSexual() || false;

    const p_comportamentos = {
      frase_ninguem: comportamentos.includes('FRASE_NINGUEM'),
      perseguiu_vigiu: comportamentos.includes('PERSEGUIU'),
      proibiu_visitas: comportamentos.includes('PROIBIU_VISITAS'),
      proibiu_trabalhar: comportamentos.includes('PROIBIU_TRABALHAR'),
      telefonemas_insistentes: comportamentos.includes('TELEFONEMAS'),
      impediu_dinheiro: comportamentos.includes('IMPEDIU_DINHEIRO'),
      ciume_excessivo: comportamentos.includes('CIUME_EXCESSIVO'),
      nenhum: comportamentos.length === 0,
    };
    
    return {
      p_ameaca,
      p_agressoes,
      p2_agressoes,
      p_sexo_forcado,
      p_comportamentos,
      };
    }
  }
}