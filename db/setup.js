/* Cria o usuário e o banco descritos no DATABASE_URL do .env.
   O psql pede a senha do usuário "postgres" (a que você definiu ao instalar o PostgreSQL). */
import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const url = new URL(process.env.DATABASE_URL);
const psql = process.env.PSQL && existsSync(process.env.PSQL) ? process.env.PSQL : 'psql';
const sql = fileURLToPath(new URL('./setup.sql', import.meta.url));

console.log(`Criando o usuário "${url.username}" e o banco "${url.pathname.slice(1)}" em ${url.hostname}:${url.port || 5432}...`);
const r = spawnSync(psql, [
  '-h', url.hostname, '-p', url.port || '5432', '-U', process.env.PG_ADMIN_USER || 'postgres', '-d', 'postgres',
  '-v', 'ON_ERROR_STOP=1',
  '-v', `app_user=${decodeURIComponent(url.username)}`,
  '-v', `app_pass=${decodeURIComponent(url.password)}`,
  '-v', `app_db=${url.pathname.slice(1)}`,
  '-f', sql
], { stdio: 'inherit' });

if (r.error) { console.error('Não consegui rodar o psql:', r.error.message, '\nAjuste PSQL no .env.'); process.exit(1); }
if (r.status === 0) console.log('Pronto. Agora rode: npm run db:migrate');
process.exit(r.status ?? 1);
