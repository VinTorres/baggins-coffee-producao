/* Perfil do usuário logado: ver e editar */
import { Router } from 'express';
import { q } from '../db.js';
import { exigirLogin } from '../auth.js';
import { h, txt, num } from '../util.js';
import { METODOS } from './cafes.js';

const r = Router();
r.use(exigirLogin);
const PERFIS = ['doce', 'fru', 'eq', 'enc', 'leve'];
const NIVEIS = ['iniciante', 'entusiasta', 'barista', 'profissional'];
const CAMPOS = 'id, nome, email, papel, usuario, telefone, cidade, bio, metodo_favorito, cafe_favorito_id, perfil_favorito, moedor, xicaras_dia, nivel, criado_em';

r.get('/', h(async (req, res) => {
  const { rows: [perfil] } = await q(`SELECT ${CAMPOS},
      (SELECT count(*)::int FROM cafes WHERE criado_por = $1) AS total_cafes,
      (SELECT count(*)::int FROM receitas WHERE criado_por = $1) AS total_receitas,
      (SELECT count(*)::int FROM empresas WHERE criado_por = $1) AS total_casas
    FROM usuarios WHERE id = $1`, [req.user.id]);
  const { rows: cafes } = await q('SELECT id, nome FROM cafes ORDER BY nome');
  res.json({ perfil, cafes });
}));

r.put('/', h(async (req, res) => {
  const b = req.body;
  const nome = txt(b.nome, 80);
  if (!nome) return res.status(400).json({ erro: 'O nome não pode ficar vazio.' });

  const usuario = txt(b.usuario, 30)?.toLowerCase().replace(/^@/, '') || null;
  if (usuario && !/^[a-z0-9_.]{3,30}$/.test(usuario)) return res.status(400).json({ erro: 'O usuário precisa ter de 3 a 30 caracteres: letras sem acento, números, ponto ou _.' });

  const telefone = txt(b.telefone, 20);
  if (telefone && !/^[0-9+()\s-]{8,20}$/.test(telefone)) return res.status(400).json({ erro: 'Telefone inválido. Use só números, espaços, +, ( ) e -.' });

  const xicaras = b.xicaras_dia === '' || b.xicaras_dia == null ? null : num(b.xicaras_dia, 0, 20);
  if (b.xicaras_dia !== '' && b.xicaras_dia != null && xicaras === null) return res.status(400).json({ erro: 'Xícaras por dia: um número de 0 a 20.' });

  try {
    const { rows: [perfil] } = await q(`UPDATE usuarios SET nome = $1, usuario = $2, telefone = $3, cidade = $4, bio = $5, metodo_favorito = $6,
        cafe_favorito_id = $7, perfil_favorito = $8, moedor = $9, xicaras_dia = $10, nivel = $11
      WHERE id = $12 RETURNING ${CAMPOS}`,
      [nome, usuario, telefone, txt(b.cidade, 60), txt(b.bio, 300),
       METODOS.includes(b.metodo_favorito) ? b.metodo_favorito : null,
       b.cafe_favorito_id ? parseInt(b.cafe_favorito_id) : null,
       PERFIS.includes(b.perfil_favorito) ? b.perfil_favorito : null,
       txt(b.moedor, 60), xicaras === null ? null : Math.round(xicaras),
       NIVEIS.includes(b.nivel) ? b.nivel : null, req.user.id]);
    res.json({ perfil });
  } catch (e) {
    if (e.code === '23505') return res.status(409).json({ erro: `O usuário @${usuario} já está em uso. Escolha outro.` });
    if (e.code === '23503') return res.status(400).json({ erro: 'Esse café não existe mais. Escolha outro.' });
    throw e;
  }
}));

export default r;
