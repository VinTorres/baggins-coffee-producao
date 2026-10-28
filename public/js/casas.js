/* As casas (empresas): lista, site de cada uma, cafés delas e cadastro */
const $ = id => document.getElementById(id);
const { esc, api } = BC;

function toast(msg, erro) {
  const t = $('toast'); t.textContent = msg;
  t.classList.toggle('bg-leaf', !erro); t.classList.toggle('bg-rust', !!erro); t.classList.remove('hidden');
  clearTimeout(toast.h); toast.h = setTimeout(() => t.classList.add('hidden'), 4500);
}

async function carregar() {
  try {
    const { empresas } = await api('/empresas');
    $('status').classList.toggle('hidden', empresas.length > 0);
    if (!empresas.length) $('status').textContent = 'Nenhuma casa cadastrada ainda.';
    $('houses').innerHTML = empresas.map(h => `
    <article id="${esc(h.slug)}" class="scroll-mt-6 border-t border-cream/15 py-10">
      <div class="grid gap-6 lg:grid-cols-[18rem_1fr]">
        <div>
          ${h.minha ? '<p class="mb-2 inline-block rounded-full bg-leaf/20 px-3 py-0.5 text-xs font-semibold text-leaf">Cadastrada por você</p>' : ''}
          <h2 class="text-3xl font-bold">${esc(h.nome)}</h2>
          ${h.cidade ? `<p class="mt-1 text-amber">${esc(h.cidade)}</p>` : ''}
          ${h.site ? `<a href="${esc(h.site)}" target="_blank" rel="noopener noreferrer" class="mt-4 inline-block rounded-full border border-amber px-4 py-1.5 text-sm font-semibold text-amber hover:bg-amber hover:text-forest focus-visible:outline-2 focus-visible:outline-amber">Visitar o site ↗</a>` : ''}
        </div>
        <div>
          ${h.sobre ? `<p class="max-w-prose whitespace-pre-line text-cream/85">${esc(h.sobre)}</p>` : ''}
          <p class="mt-6 font-bold">Cafés na despensa</p>
          ${h.cafes.length ? `<ul class="mt-2 flex flex-wrap gap-2">${h.cafes.map(c => `<li><a href="cafes.html#${esc(c.slug)}" class="inline-block rounded-full border border-amber/40 px-3 py-1 text-sm hover:border-amber hover:text-amber focus-visible:outline-2 focus-visible:outline-amber">${esc(c.nome)}</a></li>`).join('')}</ul>`
            : '<p class="mt-2 text-sm text-cream/60">Nenhum café desta casa ainda.</p>'}
          ${h.autor ? `<p class="mt-6 text-sm text-cream/60">Cadastrada por ${esc(h.autor)}.</p>` : ''}
          ${h.pode_editar ? `<button data-delb="${h.id}" class="mt-3 text-sm font-semibold text-rust underline underline-offset-4 hover:text-cream focus-visible:outline-2 focus-visible:outline-amber">Remover casa</button>` : ''}
        </div>
      </div>
    </article>`).join('');
    if (location.hash) document.getElementById(location.hash.slice(1))?.scrollIntoView();
  } catch (e) {
    $('status').textContent = e.message;
  }
}

$('houses').addEventListener('click', async e => {
  const b = e.target.closest('[data-delb]');
  if (!b || !confirm('Remover esta casa? Os cafés dela continuam na despensa, sem marca.')) return;
  try { await api('/empresas/' + b.dataset.delb, { method:'DELETE' }); toast('Casa removida.'); carregar(); }
  catch (err) { toast(err.message, true); }
});

$('abrir-casa').addEventListener('click', async () => {
  if (!await BC.pronto) { location.href = BC.entrarURL(); return; }
  $('casa-form').reset(); $('c-err').classList.add('hidden');
  $('casa').showModal(); $('c-nome').focus();
});
document.addEventListener('click', e => { const x = e.target.closest('[data-close]'); if (x) x.closest('dialog').close(); });
$('casa').addEventListener('click', e => { if (e.target === $('casa')) $('casa').close(); });

$('casa-form').addEventListener('submit', async e => {
  e.preventDefault();
  const v = id => $(id).value.trim(), err = $('c-err');
  if (!v('c-nome')) { err.textContent = 'Dê um nome para a casa.'; err.classList.remove('hidden'); $('c-nome').focus(); return; }
  const btn = e.submitter || e.target.querySelector('button:not([type=button])'); btn.disabled = true;
  try {
    const { empresa } = await api('/empresas', { method:'POST', body:{ nome:v('c-nome'), cidade:v('c-cidade'), site:v('c-site'), sobre:v('c-sobre') } });
    $('casa').close();
    await carregar();
    document.getElementById(empresa.slug)?.scrollIntoView({ behavior:'smooth' });
    toast(`${empresa.nome} entrou nas casas.`);
  } catch (ex) {
    err.textContent = ex.message; err.classList.remove('hidden');
  } finally {
    btn.disabled = false;
  }
});

carregar();
