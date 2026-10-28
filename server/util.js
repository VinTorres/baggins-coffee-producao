/* Funções pequenas usadas pelas rotas */

/* Envolve handlers async para os erros chegarem ao tratador do Express */
export const h = fn => (req, res, next) => fn(req, res, next).catch(next);

/* Texto limpo e cortado no tamanho máximo; vazio vira null */
export function txt(v, max) {
  if (typeof v !== 'string') return null;
  const s = v.trim().slice(0, max);
  return s || null;
}

export function num(v, min, max) {
  const n = typeof v === 'number' ? v : parseFloat(v);
  return Number.isFinite(n) && n >= min && n <= max ? n : null;
}

/* Só aceita http(s); completa o https:// se faltar */
export function siteURL(s) {
  s = txt(s, 200); if (!s) return null;
  if (!/^https?:\/\//i.test(s)) s = 'https://' + s;
  try { const u = new URL(s); return /^https?:$/.test(u.protocol) ? u.href : null; } catch { return null; }
}

export function slugify(s) {
  return s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 50) || 'item';
}
/* slug único: nome + sufixo curto aleatório */
export const slugUnico = nome => slugify(nome) + '-' + Math.random().toString(36).slice(2, 7);

/* Admin e superuser editam tudo; o usuário comum só o que ele mesmo criou */
export const podeEditar = (user, criadoPor) => !!user && (user.papel !== 'usuario' || user.id === criadoPor);

export class ErroHttp extends Error {
  constructor(status, msg) { super(msg); this.status = status; }
}
