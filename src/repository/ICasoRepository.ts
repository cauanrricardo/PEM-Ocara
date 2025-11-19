import { Caso } from "../models/Caso/Caso";

/**
 * ICasoRepository
 * 
 * Interface que define o contrato para persistência de casos.
 * Implementa inversão de dependência permitindo múltiplas implementações (PostgreSQL, MySQL, etc).
 */
export interface ICasoRepository {
    /**
     * Salva um novo caso no banco de dados
     * @param caso - Objeto Caso a ser salvo com todas as suas relações
     * @returns Promise<number> - ID do caso salvo
     * @throws Error - Se houver erro na persistência
     */
    salvar(caso: Caso): Promise<number>;
}
