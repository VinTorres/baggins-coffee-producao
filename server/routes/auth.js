/* Cadastro (nome, e-mail e senha), login, logout e "quem sou eu" */
import { Router } from 'express';
import bcrypt from 'bcryptjs';
import rateLimit from 'express-rate-limit';
import { pool, q } from '../db.js';
import { abrirSessao, fecharSessao } from '../auth.js';
import { h, txt } from '../util.js';

const r = Router();
const limite = rateLimit({ windowMs: 15 * 60e3, limit: 20, standardHeaders: 'draft-8', legacyHeaders: false,
  message: { erro: 'Muitas tentativas. Espere alguns minutos e tente de novo.' } });
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
/* Hash qualquer para o login levar o mesmo tempo quando o e-mail não existe */
const HASH_FALSO = bcrypt.hashSync('senha-que-nao-existe', 10);

r.post('/cadastro', limite, h(async (req, res) => {
  const nome = txt(req.body.nome, 80), email = txt(req.body.email, 200)?.toLowerCase(), senha = req.body.senha;
  if (!nome) return res.status(400).json({ erro: 'Informe o seu nome.' });
  if (!email || !EMAIL.test(email)) return res.status(400).json({ erro: 'Informe um e-mail válido.' });
  if (typeof senha !== 'string' || senha.length < 8 || senha.length > 200) return res.status(400).json({ erro: 'A senha precisa ter pelo menos 8 caracteres.' });

  const hash = await bcrypt.hash(senha, 12);
  const c = await pool.connect();
  try {
    await c.query('BEGIN');
    await c.query('LOCK TABLE usuarios IN SHARE ROW EXCLUSIVE MODE');
    const { rows: [{ total }] } = await c.query('SELECT count(*)::int AS total FROM usuarios');
    const { rows: [u] } = await c.query(
      'INSERT INTO usuarios (nome, email, senha_hash, papel) VALUES ($1, $2, $3, $4) RETURNING id, nome, email, papel',
      [nome, email, hash, total === 0 ? 'admin' : 'usuario']);   // o primeiro cadastro vira admin
    await c.query('COMMIT');
    abrirSessao(res, u.id);
    res.status(201).json({ usuario: u });
  } catch (e) {
    await c.query('ROLLBACK');
    if (e.code === '23505') return res.status(409).json({ erro: 'Este e-mail já tem cadastro. Tente entrar.' });
    throw e;
  } finally {
    c.release();
  }
}));

r.post('/login', limite, h(async (req, res) => {
  const email = txt(req.body.email, 200)?.toLowerCase(), senha = typeof req.body.senha === 'string' ? req.body.senha : '';
  const { rows: [u] } = await q('SELECT id, nome, email, papel, senha_hash FROM usuarios WHERE lower(email) = $1', [email || '']);
  const ok = await bcrypt.compare(senha, u?.senha_hash || HASH_FALSO);
  if (!u || !ok) return res.status(401).json({ erro: 'E-mail ou senha incorretos.' });
  abrirSessao(res, u.id);
  delete u.senha_hash;
  res.json({ usuario: u });
}));

r.post('/logout', (req, res) => { fecharSessao(res); res.json({ ok: true }); });

r.get('/eu', (req, res) => res.json({ usuario: req.user }));

export default r;
