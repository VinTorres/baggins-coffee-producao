/* Servidor do Baggins Coffee: entrega o site (public/) e a API (/api) */
import express from 'express';
import cookieParser from 'cookie-parser';
import { fileURLToPath } from 'node:url';
import { carregarUsuario } from './auth.js';
import { pool } from './db.js';
import auth from './routes/auth.js';
import usuarios from './routes/usuarios.js';
import empresas from './routes/empresas.js';
import cafes, { receitas } from './routes/cafes.js';
import perfil from './routes/perfil.js';

const app = express();
app.disable('x-powered-by');
app.use(express.json({ limit: '100kb' }));
app.use(cookieParser());
app.use(carregarUsuario);

app.use('/api/auth', auth);
app.use('/api/usuarios', usuarios);
app.use('/api/empresas', empresas);
app.use('/api/cafes', cafes);
app.use('/api/receitas', receitas);
app.use('/api/perfil', perfil);
app.use('/api', (req, res) => res.status(404).json({ erro: 'Rota não encontrada.' }));

app.use(express.static(fileURLToPath(new URL('../public', import.meta.url)), { extensions: ['html'] }));

/* Erros: conexão com o banco, validação e o resto */
app.use((err, req, res, next) => {
  if (err.status && err.status < 500) return res.status(err.status).json({ erro: err.message });
  if (err.type === 'entity.parse.failed') return res.status(400).json({ erro: 'JSON inválido.' });
  console.error(err);
  const semBanco = ['ECONNREFUSED', '28P01', '3D000'].includes(err.code);
  res.status(semBanco ? 503 : 500).json({ erro: semBanco ? 'O banco de dados não está disponível.' : 'Erro interno. Tente de novo.' });
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Baggins Coffee em http://localhost:${port}`));
process.on('SIGINT', () => pool.end().then(() => process.exit(0)));
