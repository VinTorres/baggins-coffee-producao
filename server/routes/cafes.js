/* Cafés e as receitas de cada um */
import { Router } from 'express';
import { pool, q } from '../db.js';
import { exigirLogin } from '../auth.js';
import { h, txt, num, slugUnico, podeEditar, ErroHttp } from '../util.js';

const r = Router();
export const METODOS = ['ibrik', 'espresso', 'moka', 'aero', 'syphon', 'melitta', 'pano', 'v60', 'koar', 'kalita', 'b75', 'clever', 'chemex', 'french', 'cold'];
const PERFIS = ['doce', 'fru', 'eq', 'enc', 'leve'];

r.get('/', h(async (req, res) => {
  const { rows: cafes } = await q(`SELECT c.*, e.nome AS empresa_nome, e.slug AS empresa_slug, u.nome AS autor
    FROM cafes c LEFT JOIN empresas e ON e.id = c.empresa_id LEFT JOIN usuarios u ON u.id = c.criado_por
    ORDER BY (c.criado_por IS NULL), c.criado_em DESC, c.id`);
  const { rows: receitas } = await q(`SELECT rc.*, u.nome AS autor FROM receitas rc LEFT JOIN usuarios u ON u.id = rc.criado_por ORDER BY rc.criado_em, rc.id`);
  const porCafe = Map.groupBy(receitas, x => x.cafe_id);
  res.json({ cafes: cafes.map(({ criado_por, ...c }) => ({
    ...c, meu: !!req.user && req.user.id === criado_por, pode_editar: podeEditar(req.user, criado_por),
    receitas: (porCafe.get(c.id) || []).map(({ criado_por: cp, ...x }) => ({ ...x, pode_editar: podeEditar(req.user, cp) }))
  })) });
}));

/* Valida uma receita vinda do formulário; devolve null se veio vazia */
function lerReceita(b) {
  if (!b) return null;
  const passos = Array.isArray(b.passos) ? b.passos.map(p => txt(p, 200)).filter(Boolean).slice(0, 30) : [];
  const x = { titulo: txt(b.titulo, 60), metodo: METODOS.includes(b.metodo) ? b.metodo : null, cafe_g: num(b.cafe_g, 0.5, 500),
    agua_ml: num(b.agua_ml, 1, 5000), temp_c: num(b.temp_c, 0, 100), moagem: txt(b.moagem, 40), tempo: txt(b.tempo, 30), passos };
  if (!x.titulo && !x.cafe_g && !passos.length) return null;
  if (!x.metodo) throw new ErroHttp(400, 'Escolha um método válido para a receita.');
  x.titulo ||= 'Receita de ' + x.metodo;
  if (x.temp_c !== null) x.temp_c = Math.round(x.temp_c);
  return x;
}
const inserirReceita = (db, cafeId, x, userId) => db.query(
  `INSERT INTO receitas (cafe_id, titulo, metodo, cafe_g, agua_ml, temp_c, moagem, tempo, passos, criado_por)
   VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING id`,
  [cafeId, x.titulo, x.metodo, x.cafe_g, x.agua_ml, x.temp_c, x.moagem, x.tempo, x.passos, userId]);

r.post('/', exigirLogin, h(async (req, res) => {
  const b = req.body, nome = txt(b.nome, 80);
  if (!nome) return res.status(400).json({ erro: 'Dê um nome para o café.' });
  const empresaId = b.empresa_id ? parseInt(b.empresa_id) : null;
  const pais = typeof b.pais === 'string' && /^[a-z]{2}$/.test(b.pais) ? b.pais : null;
  const perfil = PERFIS.includes(b.perfil) ? b.perfil : 'eq';
  const preparos = (Array.isArray(b.metodos) ? b.metodos : []).filter(m => METODOS.includes(m)).map(m => ({ m, p: perfil }));
  const notas = (Array.isArray(b.notas) ? b.notas : []).map(n => txt(n, 30)).filter(Boolean).slice(0, 12);
  const receita = lerReceita(b.receita);

  const c = await pool.connect();
  try {
    await c.query('BEGIN');
    const { rows: [cafe] } = await c.query(
      `INSERT INTO cafes (slug, nome, empresa_id, pais, regiao, altitude, processo, torra, notas, sobre, preparos, observacao, criado_por)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING id, slug`,
      [slugUnico(nome), nome, empresaId, pais, txt(b.regiao, 80), num(b.altitude, 0, 5000), txt(b.processo, 40), txt(b.torra, 40),
       notas, txt(b.sobre, 1000), JSON.stringify(preparos), null, req.user.id]);
    if (receita) await inserirReceita(c, cafe.id, receita, req.user.id);
    await c.query('COMMIT');
    res.status(201).json({ cafe });
  } catch (e) {
    await c.query('ROLLBACK');
    if (e.code === '23503') return res.status(400).json({ erro: 'Empresa não encontrada.' });
    throw e;
  } finally {
    c.release();
  }
}));

r.delete('/:id', exigirLogin, h(async (req, res) => {
  const id = parseInt(req.params.id);
  const { rows: [c] } = await q('SELECT criado_por FROM cafes WHERE id = $1', [id]);
  if (!c) return res.status(404).json({ erro: 'Café não encontrado.' });
  if (!podeEditar(req.user, c.criado_por)) return res.status(403).json({ erro: 'Você não pode remover este café.' });
  await q('DELETE FROM cafes WHERE id = $1', [id]);   // as receitas saem junto (ON DELETE CASCADE)
  res.json({ ok: true });
}));

/* Receitas: qualquer pessoa logada pode criar uma receita para qualquer café */
r.post('/:id/receitas', exigirLogin, h(async (req, res) => {
  const receita = lerReceita(req.body);
  if (!receita) return res.status(400).json({ erro: 'Preencha pelo menos o nome, a dose ou o passo a passo.' });
  try {
    const { rows: [x] } = await inserirReceita(pool, parseInt(req.params.id), receita, req.user.id);
    res.status(201).json({ receita: { id: x.id, titulo: receita.titulo } });
  } catch (e) {
    if (e.code === '23503') return res.status(404).json({ erro: 'Café não encontrado.' });
    throw e;
  }
}));

export const receitas = Router();
receitas.delete('/:id', exigirLogin, h(async (req, res) => {
  const id = parseInt(req.params.id);
  const { rows: [x] } = await q('SELECT criado_por FROM receitas WHERE id = $1', [id]);
  if (!x) return res.status(404).json({ erro: 'Receita não encontrada.' });
  if (!podeEditar(req.user, x.criado_por)) return res.status(403).json({ erro: 'Você não pode remover esta receita.' });
  await q('DELETE FROM receitas WHERE id = $1', [id]);
  res.json({ ok: true });
}));

export default r;
