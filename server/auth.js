/* Sessão em cookie httpOnly com JWT. O papel é lido do banco a cada requisição,
   então uma mudança de papel feita pelo admin vale na hora. */
import jwt from 'jsonwebtoken';
import { q } from './db.js';

const COOKIE = 'baggins_sessao';
const DIAS = 7;
const SECRET = process.env.JWT_SECRET;
if (!SECRET || SECRET.length < 32) throw new Error('Defina um JWT_SECRET com pelo menos 32 caracteres no .env');

export function abrirSessao(res, userId) {
  const token = jwt.sign({ sub: userId }, SECRET, { expiresIn: `${DIAS}d` });
  res.cookie(COOKIE, token, { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', maxAge: DIAS * 864e5, path: '/' });
}
export const fecharSessao = res => res.clearCookie(COOKIE, { path: '/' });

/* Preenche req.user (ou null) em toda requisição */
export async function carregarUsuario(req, res, next) {
  req.user = null;
  const token = req.cookies?.[COOKIE];
  if (!token) return next();
  try {
    const { sub } = jwt.verify(token, SECRET);
    const { rows } = await q('SELECT id, nome, email, papel, usuario FROM usuarios WHERE id = $1', [sub]);
    req.user = rows[0] || null;
    if (!req.user) fecharSessao(res);
  } catch {
    fecharSessao(res);
  }
  next();
}

export function exigirLogin(req, res, next) {
  if (!req.user) return res.status(401).json({ erro: 'Entre na sua conta para continuar.' });
  next();
}

export const exigirPapel = (...papeis) => (req, res, next) => {
  if (!req.user) return res.status(401).json({ erro: 'Entre na sua conta para continuar.' });
  if (!papeis.includes(req.user.papel)) return res.status(403).json({ erro: 'Você não tem permissão para isso.' });
  next();
};
