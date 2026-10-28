/* Gestão de usuários (só admin): papel de cada um e remoção de contas */
const $ = id => document.getElementById(id);
const { esc, api, PAPEL } = BC;

function toast(msg, erro) {
  const t = $('toast'); t.textContent = msg;
  t.classList.toggle('bg-leaf', !erro); t.classList.toggle('bg-rust', !!erro); t.classList.remove('hidden');
  clearTimeout(toast.h); toast.h = setTimeout(() => t.classList.add('hidden'), 4500);
}

async function carregar() {
  const eu = await BC.pronto;
  if (!eu) { location.href = BC.entrarURL(); return; }
  if (eu.papel !== 'admin') { $('status').textContent = 'Esta página é só para admins.'; return; }
  try {
    const { usuarios } = await api('/usuarios');
    $('status').classList.add('hidden');
    $('tabela').innerHTML = `<table class="w-full min-w-[40rem] text-left">
      <thead class="text-sm text-cream/60"><tr>${['Nome', 'E-mail', 'Desde', 'Conteúdo', 'Papel', ''].map(x => `<th class="py-2 pr-4 font-medium">${x}</th>`).join('')}</tr></thead>
      <tbody>${usuarios.map(u => `<tr class="border-t border-cream/10">
        <td class="py-3 pr-4 font-semibold">${esc(u.nome)}${u.id === eu.id ? ' <span class="text-xs font-normal text-amber">(você)</span>' : ''}</td>
        <td class="py-3 pr-4 break-all text-cream/80">${esc(u.email)}</td>
        <td class="py-3 pr-4 text-sm">${new Date(u.criado_em).toLocaleDateString('pt-BR')}</td>
        <td class="py-3 pr-4 text-sm text-cream/70">${u.cafes} cafés · ${u.receitas} receitas</td>
        <td class="py-3 pr-4"><label class="sr-only" for="p-${u.id}">Papel de ${esc(u.nome)}</label>
          <select id="p-${u.id}" data-papel="${u.id}" class="rounded-xl border border-cream/20 bg-forest px-3 py-2 focus-visible:outline-2 focus-visible:outline-amber">
            ${Object.entries(PAPEL).map(([k, v]) => `<option value="${k}"${k === u.papel ? ' selected' : ''}>${v}</option>`).join('')}</select></td>
        <td class="py-3">${u.id === eu.id ? '' : `<button data-del="${u.id}" data-nome="${esc(u.nome)}" class="text-sm font-semibold text-rust underline underline-offset-4 hover:text-cream focus-visible:outline-2 focus-visible:outline-amber">Remover</button>`}</td>
      </tr>`).join('')}</tbody></table>`;
  } catch (e) {
    $('status').textContent = e.message; $('status').classList.remove('hidden');
  }
}

$('tabela').addEventListener('change', async e => {
  const s = e.target.closest('[data-papel]'); if (!s) return;
  try {
    const { usuario } = await api('/usuarios/' + s.dataset.papel, { method:'PATCH', body:{ papel:s.value } });
    toast(`${usuario.nome} agora é ${PAPEL[usuario.papel]}.`);
    if (usuario.id === BC.user.id && usuario.papel !== 'admin') location.reload();
  } catch (err) { toast(err.message, true); carregar(); }
});

$('tabela').addEventListener('click', async e => {
  const b = e.target.closest('[data-del]');
  if (!b || !confirm(`Remover a conta de ${b.dataset.nome}? Os cafés e receitas dela continuam no site.`)) return;
  try { await api('/usuarios/' + b.dataset.del, { method:'DELETE' }); toast('Conta removida.'); carregar(); }
  catch (err) { toast(err.message, true); }
});

carregar();
