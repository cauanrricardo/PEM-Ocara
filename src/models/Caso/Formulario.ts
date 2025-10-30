import { Assistida } from "../assistida/Assistida";
import { Agressor } from "./Agressor";
import { HistoricoViolencia } from "./HistoricoViolencia";
import { OutrasInformacoesEncaminhamento } from "./OutrasInformacoesEncaminhamento";
import { OutrasInformacoesImportantes } from "./OutrasInformacoesImportantes";
import { PreenchimentoProfissional } from "./PreenchimentoProfissional";
import { SobreAgressor } from "./SobreAgressor";
import { SobreVoce } from "./SobreVoce";

export class Formulario {
    private idFormulario?: number;
    private assistida: Assistida;
    private agressor: Agressor;
    private sobreAgressor: SobreAgressor;
    private historicoViolencia: HistoricoViolencia;
    private outrasInformacoesEncaminhamento: OutrasInformacoesEncaminhamento;
    private outrasInformacoesImportantes: OutrasInformacoesImportantes;
    private sobreVoce: SobreVoce;
    private preenchimentoProfissional: PreenchimentoProfissional;
    
    constructor(
         //Assistida
        nomeAssistida: string,
        idadeAssistida: number,
        identidadeGenero: string,
        nomeSocial: string,
        endereco: string,
        escolaridade: string,
        religiao: string,
        nacionalidade: string,
        zonaHabitacao: string,
        profissao: string,
        limitacaoFisica: string,
        numeroCadastroSocial: string,
        quanidadeDependentes: number,
        temDependentes: boolean,

        //Agressor
        nomeAgressor: string,
        idadeAgresssor: number,
        vinculoAssistida: string,
        dataOcorrida: Date,

        //SobreAgressor
        usoDrogasAlcool: string[],
        doencaMental: string,
        agressorCumpriuMedidaProtetiva: boolean,
        agressorTentativaSuicidio: boolean,
        agressorDesempregado: string,
        agressorPossuiArmaFogo: string,
        agressorAmeacouAlguem: string,

        //Historico Violencia
        ameacaFamiliar: boolean,
        agressaoFisica: boolean,
        outrasFormasViolencia: string,
        abusoSexual: boolean,
        comportamentosAgressor: string[],
        ocorrenciaPolicialMedidaProtetivaAgressor: boolean,
        agressoesMaisFrequentesUltimamente: boolean,

        //Outras Infor
        anotacoesLivres: string, 

        //PreenchimentoProfissional
        assistidaRespondeuSemAjuda: boolean,
        assistidaRespondeuComAuxilio: boolean,
        assistidaSemCondicoes: boolean,
        assistidaRecusou: boolean,
        terceiroComunicante: boolean,
        tipoViolencia: string,

        //Outras Infor Importantes
        moraEmAreaRisco: boolean,
        dependenteFinanceiroAgressor: boolean,
        aceitaAbrigamentoTemporario: boolean,

        //Sobre voce
        separacaoRecente: string,
        temFilhosComAgressor: boolean,
        qntFilhosComAgressor: number,
        temFilhosOutroRelacionamento: boolean,
        qntFilhosOutroRelacionamento: number,
        faixaFilhos: string[],
        filhosComDeficiencia: boolean,
        conflitoAgressor: string,
        filhosPresenciaramViolencia: boolean,
        violenciaDuranteGravidez: boolean,
        novoRelacionamentoAumentouAgressao: boolean,
        possuiDeficienciaDoenca: string,
        corRaca: string
    ) {
        this.idFormulario = 1;
        this.assistida = new Assistida(
            nomeAssistida,
            idadeAssistida,
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
            quanidadeDependentes,
            temDependentes
        );
        this.agressor = new Agressor(
            nomeAgressor,
            idadeAgresssor,
            vinculoAssistida,
            dataOcorrida
        );

        this.sobreAgressor = new SobreAgressor(
            usoDrogasAlcool,
            doencaMental,
            agressorCumpriuMedidaProtetiva,
            agressorTentativaSuicidio,
            agressorDesempregado,
            agressorPossuiArmaFogo,
            agressorAmeacouAlguem
        );

        this.historicoViolencia = new HistoricoViolencia(
            ameacaFamiliar,
            agressaoFisica,
            outrasFormasViolencia,
            abusoSexual,
            comportamentosAgressor,
            ocorrenciaPolicialMedidaProtetivaAgressor,
            agressoesMaisFrequentesUltimamente
        );

        this.outrasInformacoesEncaminhamento = new OutrasInformacoesEncaminhamento(
            anotacoesLivres
        );

        this.outrasInformacoesImportantes = new OutrasInformacoesImportantes(
            moraEmAreaRisco,
            dependenteFinanceiroAgressor,
            aceitaAbrigamentoTemporario
        );

        this.sobreVoce = new SobreVoce(
            separacaoRecente,
            temFilhosComAgressor,
            qntFilhosComAgressor,
            temFilhosOutroRelacionamento,
            qntFilhosOutroRelacionamento,
            faixaFilhos,
            filhosComDeficiencia,
            conflitoAgressor,
            filhosPresenciaramViolencia,
            violenciaDuranteGravidez,
            novoRelacionamentoAumentouAgressao,
            possuiDeficienciaDoenca,
            corRaca
        );

        this.preenchimentoProfissional = new PreenchimentoProfissional(
            assistidaRespondeuSemAjuda,
            assistidaRespondeuComAuxilio,
            assistidaSemCondicoes,
            assistidaRecusou,
            terceiroComunicante,
            tipoViolencia
        );

    }

    //Getters

    public getAssistida(): Assistida {
        return this.assistida;
    }

    public getIdFormulario(): number | undefined {
        return this.idFormulario;
    }

    //Setters

    public setIdFormulario(idFormulario: number) {
        this.idFormulario = idFormulario;
    }

    public setAssistida(assistida: Assistida) {
        this.assistida = assistida;
    }
}