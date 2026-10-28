/* Gestão de usuários: só o admin */
import { Router } from 'express';
import { q } from '../db.js';
import { exigirPapel } from '../auth.js';
import { h } from '../util.js';

const r = Router();
const PAPEIS = ['admin', 'superuser', 'usuario'];
r.use(exigirPapel('admin'));

r.get('/', h(async (req, res) => {
  const { rows } = await q(`SELECT u.id, u.nome, u.email, u.papel, u.criado_em,
      (SELECT count(*)::int FROM cafes c WHERE c.criado_por = u.id) AS cafes,
      (SELECT count(*)::int FROM receitas rc WHERE rc.criado_por = u.id) AS receitas
    FROM usuarios u ORDER BY u.criado_em`);
  res.json({ usuarios: rows });
}));

/* Não deixa o site ficar sem nenhum admin */
async function ultimoAdmin(id) {
  const { rows: [x] } = await q(`SELECT count(*)::int AS n, bool_or(id = $1) AS e_admin FROM usuarios WHERE papel = 'admin'`, [id]);
  return x.e_admin && x.n === 1;
}

r.patch('/:id', h(async (req, res) => {
  const id = parseInt(req.params.id), papel = req.body.papel;
  if (!PAPEIS.includes(papel)) return res.status(400).json({ erro: 'Papel inválido.' });
  if (papel !== 'admin' && await ultimoAdmin(id)) return res.status(400).json({ erro: 'Este é o único admin. Promova outra pessoa antes.' });
  const { rows: [u] } = await q('UPDATE usuarios SET papel = $1 WHERE id = $2 RETURNING id, nome, email, papel', [papel, id]);
  if (!u) return res.status(404).json({ erro: 'Usuário não encontrado.' });
  res.json({ usuario: u });
}));

r.delete('/:id', h(async (req, res) => {
  const id = parseInt(req.params.id);
  if (id === req.user.id) return res.status(400).json({ erro: 'Você não pode remover a sua própria conta por aqui.' });
  const { rowCount } = await q('DELETE FROM usuarios WHERE id = $1', [id]);
  if (!rowCount) return res.status(404).json({ erro: 'Usuário não encontrado.' });
  res.json({ ok: true });
}));

export default r;
