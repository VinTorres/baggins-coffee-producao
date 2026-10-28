/* Empresas (as casas que fabricam os cafés) */
import { Router } from 'express';
import { q } from '../db.js';
import { exigirLogin } from '../auth.js';
import { h, txt, siteURL, slugUnico, podeEditar } from '../util.js';

const r = Router();

r.get('/', h(async (req, res) => {
  const { rows } = await q(`SELECT e.id, e.slug, e.nome, e.cidade, e.site, e.sobre, e.criado_por, u.nome AS autor,
      COALESCE(json_agg(json_build_object('slug', c.slug, 'nome', c.nome) ORDER BY c.nome) FILTER (WHERE c.id IS NOT NULL), '[]') AS cafes
    FROM empresas e
    LEFT JOIN cafes c ON c.empresa_id = e.id
    LEFT JOIN usuarios u ON u.id = e.criado_por
    GROUP BY e.id, u.nome ORDER BY e.criado_em, e.id`);
  res.json({ empresas: rows.map(({ criado_por, ...e }) => ({ ...e, minha: !!req.user && req.user.id === criado_por, pode_editar: podeEditar(req.user, criado_por) })) });
}));

r.post('/', exigirLogin, h(async (req, res) => {
  const nome = txt(req.body.nome, 80);
  if (!nome) return res.status(400).json({ erro: 'Dê um nome para a empresa.' });
  const { rows: [e] } = await q(`INSERT INTO empresas (slug, nome, cidade, site, sobre, criado_por) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, slug, nome`,
    [slugUnico(nome), nome, txt(req.body.cidade, 60), siteURL(req.body.site), txt(req.body.sobre, 600), req.user.id]);
  res.status(201).json({ empresa: e });
}));

r.delete('/:id', exigirLogin, h(async (req, res) => {
  const { rows: [e] } = await q('SELECT criado_por FROM empresas WHERE id = $1', [parseInt(req.params.id)]);
  if (!e) return res.status(404).json({ erro: 'Empresa não encontrada.' });
  if (!podeEditar(req.user, e.criado_por)) return res.status(403).json({ erro: 'Você não pode remover esta empresa.' });
  await q('DELETE FROM empresas WHERE id = $1', [parseInt(req.params.id)]);   // os cafés ficam, sem empresa
  res.json({ ok: true });
}));

export default r;
