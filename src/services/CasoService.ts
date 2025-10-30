import { Caso } from "../models/Caso/Caso";

export class CasoService {

    private caso: Caso;

    constructor(
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
        quantidadeDependentes: number,
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

        //Outras Infor Importantes
        moraEmAreaRisco: boolean,
        dependenteFinanceiroAgressor: boolean,
        aceitaAbrigamentoTemporario: boolean,

        //PreenchimentoProfissional
        assistidaRespondeuSemAjuda: boolean,
        assistidaRespondeuComAuxilio: boolean,
        assistidaSemCondicoes: boolean,
        assistidaRecusou: boolean,
        terceiroComunicante: boolean,
        tipoViolencia: string,

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
        corRaca: string,

        data: Date, 
        profissionalResponsavel: string, 
        descricao: string 
    ) {
        this.caso = new Caso(
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
            quantidadeDependentes,
            temDependentes,

            //Agressor
            nomeAgressor,
            idadeAgresssor,
            vinculoAssistida,
            dataOcorrida,

            //SobreAgressor
            usoDrogasAlcool,
            doencaMental,
            agressorCumpriuMedidaProtetiva,
            agressorTentativaSuicidio,
            agressorDesempregado,
            agressorPossuiArmaFogo,
            agressorAmeacouAlguem,

            //Historico Violencia
            ameacaFamiliar,
            agressaoFisica,
            outrasFormasViolencia,
            abusoSexual,
            comportamentosAgressor,
            ocorrenciaPolicialMedidaProtetivaAgressor,
            agressoesMaisFrequentesUltimamente,

            //Outras Infor
            anotacoesLivres,

            //PreenchimentoProfissional
            assistidaRespondeuSemAjuda,
            assistidaRespondeuComAuxilio,
            assistidaSemCondicoes,
            assistidaRecusou,
            terceiroComunicante,
            tipoViolencia,

            //Outras Infor Importantes
            moraEmAreaRisco,
            dependenteFinanceiroAgressor,
            aceitaAbrigamentoTemporario,

            //Sobre voce
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
            corRaca,

            data,
            profissionalResponsavel,
            descricao
        );
    }

    public getCaso(): Caso {
        return this.caso;
    }
}