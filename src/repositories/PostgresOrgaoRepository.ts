import { IOrgaoRepository } from "./IOrgaoRepository";
import { OrgaoRedeApoio } from "../models/Rede-Apoio/OrgaoRedeApoio";
import { db } from "../database/db";

export class PostgresOrgaoRepository implements IOrgaoRepository {

    async criar(orgao: OrgaoRedeApoio): Promise<OrgaoRedeApoio> {
        // SQL exato para sua tabela
        const sql = `
            INSERT INTO REDE_DE_APOIO (Email, Nome) 
            VALUES ($1, $2) 
            RETURNING *;
        `;
        
        const values = [orgao.getEmail(), orgao.getNome()];

        console.log("------------------------------------------------");
        console.log("💾 [REPO] Tentando salvar no banco...");
        console.log("💾 [REPO] SQL:", sql);
        console.log("💾 [REPO] Dados:", values);

        try {
            // Tenta executar a query
            const result = await db.query(sql, values);
            
            console.log("✅ [REPO] Sucesso! Linhas afetadas:", result.rowCount);
            console.log("✅ [REPO] Dado retornado:", result.rows[0]);
            console.log("------------------------------------------------");
            
            return orgao;

        } catch (error: any) {
            // AQUI VAI APARECER O MOTIVO DO ERRO
            console.error("❌ [REPO] ERRO CRÍTICO NO INSERT:");
            console.error("❌ Mensagem:", error.message);
            console.error("❌ Código SQLState:", error.code);
            console.error("------------------------------------------------");
            
            // Relançar o erro para o controlador pegar
            throw error;
        }
    }

    async listarTodos(): Promise<OrgaoRedeApoio[]> {
        const sql = `SELECT * FROM REDE_DE_APOIO`;
        try {
            const result = await db.query(sql);
            return result.rows.map((row: any) => 
                new OrgaoRedeApoio(
                    row.nome || row.Nome, 
                    row.email || row.Email
                ) 
            );
        } catch (error) {
            console.error("❌ Erro ao listar:", error);
            return [];
        }
    }

    async buscarPorEmail(email: string): Promise<OrgaoRedeApoio | null> {
        const sql = `SELECT * FROM REDE_DE_APOIO WHERE Email = $1`;
        const result = await db.query(sql, [email]);
        
        if (result.rows.length === 0) return null;
        
        const row = result.rows[0];
        return new OrgaoRedeApoio(
            row.nome || row.Nome, 
            row.email || row.Email
        );
    }

    async atualizar(orgao: OrgaoRedeApoio): Promise<OrgaoRedeApoio> { throw new Error("Não implementado"); }
    async remover(email: string): Promise<void> { throw new Error("Não implementado"); }
}