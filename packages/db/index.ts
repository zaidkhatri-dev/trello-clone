import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

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
    const pool = new Pool({
        connectionString,
        max: maxPoolSize,
        min: minPoolSize,
        idleTimeoutMillis,
        connectionTimeoutMillis,
        allowExitOnIdle: true,
        ssl: environment === 'production' ? true : false
    })

    return drizzle({ client: pool })
}