
// Import de modelos:
import { OrgaoRedeApoio } from "../models/Rede-Apoio/OrgaoRedeApoio";
import { Encaminhamento } from "../models/Rede-Apoio/Encaminhamento";
import { Caso } from "../models/Caso/Caso";
import { AssistenteSocial } from "../models/AssistenteSocial";

// Import de serviços:
import { ServicoDeEmail } from "../services/ServicoDeEmail";

export class ControladorEncaminhamento {
    private servicoDeEmail: ServicoDeEmail;

    constructor(servicoDeEmail: ServicoDeEmail) {
        this.servicoDeEmail = servicoDeEmail;
    }

    public async registrarEncaminhamento(caso: Caso, orgao: OrgaoRedeApoio, motivo: string, observacoes: string, assistenteSocial: AssistenteSocial) {
        try {
            const encaminhamento = new Encaminhamento(new Date(), motivo, observacoes, orgao, assistenteSocial, caso);
            try{
                const infoEmail = await this.servicoDeEmail.enviarEmailAutomatico(encaminhamento);
            }
        }
    }   
}