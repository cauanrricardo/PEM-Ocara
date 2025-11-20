import { Pool } from 'pg';
import * as dotenv from 'dotenv';
import * as path from 'path';

// --- CORREÇÃO DEFINITIVA DE CAMINHO ---
// process.cwd() pega a pasta raiz onde você rodou o comando npm start
const envPath = path.resolve(process.cwd(), '.env');

dotenv.config({ path: envPath });

// --- LOGS DE DEBUG ---
console.log("\n========================================");
console.log("🔌 TENTANDO CONECTAR AO BANCO...");
console.log("📂 Caminho do .env:", envPath);
console.log("👤 Usuário lido:", process.env.DB_USER); // Deve aparecer 'postgres'
console.log("🏠 Host lido:", process.env.DB_HOST);     // Deve aparecer 'localhost'
console.log("🗄️  Database lido:", process.env.DB_NAME); // Deve aparecer 'db_procuradoria'
console.log("========================================\n");

export const db = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: parseInt(process.env.DB_PORT || "5432"),
});

db.connect()
    .then(client => {
        console.log("✅ SUCESSO! Conectado ao PostgreSQL!");
        client.release();
    })
    .catch(err => {
        console.error("\n❌ ERRO CRÍTICO NA CONEXÃO:");
        console.error("Mensagem:", err.message);
        if (err.message.includes("password")) console.error("DICA: A senha no .env está errada ou não foi lida.");
        console.error("\n");
    });