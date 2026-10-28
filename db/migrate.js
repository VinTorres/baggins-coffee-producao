/* Cria as tabelas (schema.sql) e insere os dados iniciais sem duplicar. */
import { readFileSync } from 'node:fs';
import pg from 'pg';
import { EMPRESAS, CAFES } from './seed.js';

const db = new pg.Client({ connectionString: process.env.DATABASE_URL });
await db.connect();
try {
  await db.query(readFileSync(new URL('./schema.sql', import.meta.url), 'utf8'));
  console.log('Tabelas prontas: usuarios, empresas, cafes, receitas.');

  for (const e of EMPRESAS) {
    await db.query(`INSERT INTO empresas (slug, nome, cidade, site, sobre) VALUES ($1, $2, $3, $4, $5) ON CONFLICT (slug) DO NOTHING`,
      [e.slug, e.nome, e.cidade, e.site, e.sobre]);
  }
  for (const c of CAFES) {
    await db.query(`INSERT INTO cafes (slug, nome, empresa_id, pais, regiao, processo, torra, notas, sobre, detalhes, observacao, preparos)
      VALUES ($1, $2, (SELECT id FROM empresas WHERE slug = $3), $4, $5, $6, $7, $8, $9, $10, $11, $12) ON CONFLICT (slug) DO NOTHING`,
      [c.slug, c.nome, c.empresa, c.pais, c.regiao ?? null, c.processo ?? null, c.torra ?? null, c.notas, c.sobre,
       JSON.stringify(c.detalhes), c.observacao, JSON.stringify(c.preparos)]);
  }
  const { rows } = await db.query(`SELECT (SELECT count(*) FROM usuarios) u, (SELECT count(*) FROM empresas) e, (SELECT count(*) FROM cafes) c, (SELECT count(*) FROM receitas) r`);
  console.log(`No banco: ${rows[0].u} usuários, ${rows[0].e} empresas, ${rows[0].c} cafés, ${rows[0].r} receitas.`);
} finally {
  await db.end();
}
