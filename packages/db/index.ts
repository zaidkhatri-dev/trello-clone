import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

let pool: Pool | null = null

export const client = ({
    connectionString,
    maxPoolSize = 10,
    minPoolSize = 0,
    idleTimeoutMillis = 30_000,
    connectionTimeoutMillis = 3_000,
    environment
}: { 
    connectionString: string,
    maxPoolSize?: number,
    minPoolSize?: number,
    idleTimeoutMillis?: number,
    connectionTimeoutMillis?: number,
    environment: 'production' | 'development'
}) => {
    pool = new Pool({
        connectionString,
        max: maxPoolSize,
        min: minPoolSize,
        idleTimeoutMillis,
        connectionTimeoutMillis,
        allowExitOnIdle: true,
        ssl: environment === 'production' ? true : false
    })

    const db = drizzle({ client: pool })

    return db
}

export const closeDBConnection = async () => {
    if (pool) {
        await pool.end()   
    }    
}