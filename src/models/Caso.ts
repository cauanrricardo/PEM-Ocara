export class Caso {
    private protocoloCaso?: number;
    
    constructor(protocoloCaso: number) {
        this.protocoloCaso = protocoloCaso;
    }

    // Getters
    public getProtocoloCaso(): number | undefined {
        return this.protocoloCaso;
    }
}