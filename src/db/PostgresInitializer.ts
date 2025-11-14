// DataBasePostgres.ts
import { Pool, PoolConfig } from 'pg'; 
import { IDataBase } from './IDataBase';

export class PostgresInitializer implements IDataBase {
    
    private connectionPool: Pool | null = null;
    
    private config: PoolConfig = {
        user: process.env.DB_USER || 'postgres',
        host: process.env.DB_HOST || 'localhost',
        database: process.env.DB_NAME || 'pocara',
        password: process.env.DB_PASSWORD || 'for123ever',
        port: Number(process.env.DB_PORT) || 5432,
        max: 20,
        idleTimeoutMillis: 30000, 
    };

    public pool(): Pool {
        if (!this.connectionPool) {
            throw new Error('Database pool not initialized. Call initialize() first.');
        }
        return this.connectionPool;
    }


    async initialize(): Promise<void> {
        if (this.connectionPool) {
            console.warn('PostgreSQL pool already initialized.');
            return;
        }
        
        console.log('Attempting to initialize PostgreSQL pool...');
        this.connectionPool = new Pool(this.config);

        await this.testConnection(); 
    }

    async testConnection(): Promise<void> {
        if (!this.connectionPool) {
             console.warn('Pool not initialized, skipping connection test.');
             return;
        }
        
        const client = await this.connectionPool.connect(); 
        
        try {
            console.log('Connected to PostgreSQL! Running test query...');
            
            const result = await client.query('SELECT NOW() AS server_time');
            console.log('Server time:', result.rows[0].server_time);
            
        } catch (error) {
            console.error('CRITICAL: Database connection test failed.', error);
            throw error; 
        } finally {
            client.release(); 
        }
    }

    async close(): Promise<void> {
        if (this.connectionPool) {
            console.log('Closing PostgreSQL pool...');
            await this.connectionPool.end();
            this.connectionPool = null;
            console.log('PostgreSQL pool closed.');
        } else {
            console.warn('PostgreSQL pool was not active.');
        }
    }
}