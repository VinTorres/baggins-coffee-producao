import pg from 'pg';

export const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });

/* numeric do Postgres chega como texto; aqui vira número */
pg.types.setTypeParser(pg.types.builtins.NUMERIC, v => v === null ? null : parseFloat(v));

export const q = (sql, params) => pool.query(sql, params);
