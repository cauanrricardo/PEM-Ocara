import { Anexo } from "./Anexo";
import { Formulario } from "./Formulario";

export class Caso {
    private protocoloCaso?: number;
    private anexos: Anexo[] = [];
    private formulario: Formulario;
    
    constructor(protocoloCaso: number, formulario: Formulario) {
        this.protocoloCaso = protocoloCaso;
        this.formulario = formulario;
    }

    // Getters
    public getProtocoloCaso(): number | undefined {
        return this.protocoloCaso;
    }

    public getAnexos(): Anexo[] {
        return this.anexos;
    }

    public getAnexoById(idAnexo: number): Anexo | undefined{
        return this.anexos.find(anexos => anexos.getidAnexo() === idAnexo);
    }

    //Setters
    public setAnexos(anexos: Anexo[]) {
        this.anexos = anexos;
    }

    public setProtocoloCaso(protocoloCaso: number) {
        this.protocoloCaso = protocoloCaso;
    }

}