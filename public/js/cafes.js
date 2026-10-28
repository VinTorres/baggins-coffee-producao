/* Despensa: cafés, marcas e receitas vêm do banco pela API */
const $ = id => document.getElementById(id);
const { esc, api } = BC;
const MN = { ibrik:'Ibrik', espresso:'Espresso', moka:'Moka', aero:'AeroPress', syphon:'Syphon', melitta:'Melitta', pano:'Coador de pano', v60:'V60', koar:'Koar', kalita:'Kalita Wave', b75:'B75', clever:'Clever', chemex:'Chemex', french:'Prensa francesa', cold:'Cold brew' };
/* Países produtores (código ISO da bandeira) */
const COUNTRIES = { br:'Brasil', co:'Colômbia', et:'Etiópia', ke:'Quênia', gt:'Guatemala', cr:'Costa Rica', hn:'Honduras', sv:'El Salvador', ni:'Nicarágua', pa:'Panamá', mx:'México', pe:'Peru', bo:'Bolívia', ec:'Equador', rw:'Ruanda', bi:'Burundi', tz:'Tanzânia', ug:'Uganda', ye:'Iêmen', in:'Índia', id:'Indonésia', vn:'Vietnã', cn:'China', pg:'Papua-Nova Guiné', jm:'Jamaica', us:'Estados Unidos (Havaí)' };
const PN = { doce:'doce e redondo', fru:'frutado e brilhante', eq:'equilibrado', enc:'encorpado', leve:'leve e limpo' };
const flag = c => `<span class="fi fi-${c} shrink-0 rounded-[2px] shadow-sm" aria-hidden="true"></span>`;
const fmt = n => (Math.round(n * 10) / 10).toString().replace('.', ',');

let cafes = [], empresas = [];

async function carregar() {
  try {
    [{ cafes }, { empresas }] = await Promise.all([api('/cafes'), api('/empresas')]);
    $('status').classList.add('hidden');
    render();
  } catch (e) {
    $('status').textContent = e.message;
  }
}

function origin(c) {
  if (!COUNTRIES[c.pais]) return '<p class="mt-2 text-sm text-cream/60">Origem: blend ou não informada</p>';
  return `<p class="mt-2 flex items-center gap-2 text-sm"><span class="text-lg leading-none">${flag(c.pais)}</span><span><span class="text-cream/60">Origem:</span> <strong>${COUNTRIES[c.pais]}</strong>${c.regiao ? ' · <span class="text-cream/75">' + esc(c.regiao) + '</span>' : ''}</span></p>`;
}

/* Campos de receita: usados no cadastro do café (prefixo fr) e no pop-up de nova receita (nr) */
function recipeFields(p) {
  return `<div class="grid gap-4 sm:grid-cols-2">
    <div><label for="${p}-title" class="text-sm font-semibold">Nome da receita</label><input id="${p}-title" maxlength="60" placeholder="Ex.: Minha receita de domingo" class="inp"></div>
    <div><label for="${p}-method" class="text-sm font-semibold">Método</label><select id="${p}-method" class="inp">${Object.entries(MN).map(([k, v]) => `<option value="${k}"${k === 'v60' ? ' selected' : ''}>${v}</option>`).join('')}</select></div>
    <div class="grid grid-cols-3 gap-3 sm:col-span-2">
      <div><label for="${p}-coffee" class="text-sm font-semibold">Café (g)</label><input id="${p}-coffee" type="number" min="1" max="500" step="0.5" inputmode="decimal" class="inp"></div>
      <div><label for="${p}-water" class="text-sm font-semibold">Água (ml)</label><input id="${p}-water" type="number" min="1" max="5000" step="1" inputmode="decimal" class="inp"></div>
      <div><label for="${p}-temp" class="text-sm font-semibold">Água (°C)</label><input id="${p}-temp" type="number" min="0" max="100" step="1" inputmode="numeric" class="inp"></div>
    </div>
    <div><label for="${p}-grind" class="text-sm font-semibold">Moagem ou cliques</label><input id="${p}-grind" maxlength="40" placeholder="Ex.: 20 cliques no M3 PRO" class="inp"></div>
    <div><label for="${p}-time" class="text-sm font-semibold">Tempo total</label><input id="${p}-time" maxlength="30" placeholder="Ex.: 3:00" class="inp"></div>
    <div class="sm:col-span-2"><label for="${p}-steps" class="text-sm font-semibold">Passo a passo <span class="font-normal text-cream/60">(um passo por linha)</span></label>
      <textarea id="${p}-steps" rows="4" maxlength="1200" placeholder="Bloom com 40 ml por 30 s&#10;Despejo até 150 ml&#10;Despejo até 250 ml" class="inp"></textarea></div>
  </div>`;
}
/* Lê os campos no formato da API; devolve null se ficou tudo vazio */
function readRecipe(p) {
  const v = k => $(`${p}-${k}`).value.trim();
  const r = { titulo:v('title'), metodo:v('method'), cafe_g:parseFloat(v('coffee')) || null, agua_ml:parseFloat(v('water')) || null,
    temp_c:v('temp') === '' ? null : parseFloat(v('temp')), moagem:v('grind'), tempo:v('time'), passos:v('steps').split('\n').map(s => s.trim()).filter(Boolean) };
  if (!r.titulo && !r.cafe_g && !r.passos.length) return null;
  r.titulo ||= 'Receita de ' + MN[r.metodo];
  return r;
}

function recipesHTML(c) {
  const list = c.receitas;
  const line = r => [MN[r.metodo], r.cafe_g && r.agua_ml ? `${fmt(r.cafe_g)} g para ${fmt(r.agua_ml)} ml (1 : ${fmt(r.agua_ml / r.cafe_g)})` : r.cafe_g ? fmt(r.cafe_g) + ' g de café' : '',
    r.temp_c !== null && r.temp_c + ' °C', r.tempo && esc(r.tempo)].filter(Boolean).join(' · ');
  return `<div class="mt-8">
    <div class="flex flex-wrap items-center justify-between gap-3">
      <p class="font-bold">Receitas ${list.length ? `<span class="font-normal text-cream/60">(${list.length})</span>` : ''}</p>
      <button data-recipe="${c.id}" class="rounded-full border border-amber px-3.5 py-1 text-sm font-semibold text-amber hover:bg-amber hover:text-forest focus-visible:outline-2 focus-visible:outline-amber">+ Preparar nova receita</button>
    </div>
    ${list.length ? list.map(r => `
    <details data-rid="${r.id}" class="mt-3 rounded-2xl bg-moss p-4 frame">
      <summary class="cursor-pointer"><span class="font-display text-lg font-bold">${esc(r.titulo)}</span><span class="block text-sm text-amber">${line(r)}</span></summary>
      ${r.moagem ? `<p class="mt-3 text-sm"><span class="text-cream/60">Moagem:</span> ${esc(r.moagem)}</p>` : ''}
      ${r.passos.length ? `<ol class="mt-3 space-y-2">${r.passos.map((s, i) => `<li class="flex gap-3 text-sm"><span class="flex size-6 shrink-0 items-center justify-center rounded-full bg-amber text-xs font-bold text-forest">${i + 1}</span><span class="pt-0.5 text-cream/85">${esc(s)}</span></li>`).join('')}</ol>` : ''}
      ${r.autor ? `<p class="mt-3 text-xs text-cream/50">Por ${esc(r.autor)}</p>` : ''}
      <div class="mt-4 flex flex-wrap gap-4 text-sm">
        <a href="index.html?m=${r.metodo}#calculadora" class="font-semibold underline underline-offset-4 hover:text-amber focus-visible:outline-2 focus-visible:outline-amber">Abrir ${MN[r.metodo]} na calculadora</a>
        ${r.pode_editar ? `<button data-delr="${r.id}" class="font-semibold text-rust underline underline-offset-4 hover:text-cream focus-visible:outline-2 focus-visible:outline-amber">Remover receita</button>` : ''}
      </div>
    </details>`).join('') : '<p class="mt-2 text-sm text-cream/60">Nenhuma receita ainda. Que tal criar a primeira?</p>'}
  </div>`;
}

function render() {
  if (!cafes.length) { $('list').innerHTML = '<p class="border-t border-cream/15 py-10 text-cream/70">A despensa está vazia. Cadastre o primeiro café!</p>'; return; }
  $('list').innerHTML = cafes.map(c => {
    const dl = [['Marca', c.empresa_nome && `<a href="casas.html#${esc(c.empresa_slug)}" class="underline underline-offset-4 hover:text-amber">${esc(c.empresa_nome)}</a>`],
      ['Região', c.regiao && esc(c.regiao)], ['Altitude', c.altitude && c.altitude.toLocaleString('pt-BR') + ' m'], ['Processo', c.processo && esc(c.processo)],
      ['Torra', c.torra && esc(c.torra)], ...c.detalhes.map(([k, v]) => [esc(k), esc(v)])].filter(([, v]) => v);
    const nota = c.criado_em && c.autor ? `Cadastrado por ${esc(c.autor)} em ${new Date(c.criado_em).toLocaleDateString('pt-BR')}.` : esc(c.observacao || '');
    return `
  <article id="${esc(c.slug)}" class="scroll-mt-6 border-t border-cream/15 py-10">
    <div class="grid gap-8 lg:grid-cols-[18rem_1fr]">
      <div>
        ${c.meu ? '<p class="mb-2 inline-block rounded-full bg-leaf/20 px-3 py-0.5 text-xs font-semibold text-leaf">Seu café</p>' : ''}
        <h2 class="text-3xl font-bold">${esc(c.nome)}</h2>
        <p class="mt-1 text-amber">${c.empresa_nome ? esc(c.empresa_nome) : 'Marca não informada'}</p>
        ${origin(c)}
        ${c.notas.length ? `<ul class="mt-4 flex flex-wrap gap-2">${c.notas.map(n => `<li class="rounded-full border border-amber/40 px-3 py-1 text-sm">${esc(n)}</li>`).join('')}</ul>` : ''}
        ${dl.length ? `<dl class="mt-5 divide-y divide-cream/10 text-sm">${dl.map(([k, v]) => `<div class="flex justify-between gap-4 py-2"><dt class="text-cream/60">${k}</dt><dd class="text-right font-semibold">${v}</dd></div>`).join('')}</dl>` : ''}
      </div>
      <div>
        ${c.sobre ? `<p class="max-w-prose whitespace-pre-line text-cream/85">${esc(c.sobre)}</p>` : ''}
        ${c.preparos.length ? `<p class="mt-6 font-bold">${c.meu ? 'Como você prepara' : 'Como eu prepararia'}</p>
        <div class="mt-2 flex flex-wrap gap-2">${c.preparos.filter(b => MN[b.m] && PN[b.p]).map(b => `<a href="index.html?m=${b.m}&amp;p=${b.p}#calculadora" class="rounded-full bg-amber px-4 py-1.5 text-sm font-semibold text-forest hover:bg-crema focus-visible:outline-2 focus-visible:outline-amber">${MN[b.m]}, ${PN[b.p]}</a>`).join('')}</div>` : ''}
        ${recipesHTML(c)}
        ${nota ? `<p class="mt-6 text-sm text-cream/60">${nota}</p>` : ''}
        ${c.pode_editar ? `<button data-del="${c.id}" class="mt-3 text-sm font-semibold text-rust underline underline-offset-4 hover:text-cream focus-visible:outline-2 focus-visible:outline-amber">Remover da despensa</button>` : ''}
      </div>
    </div>
  </article>`;
  }).join('');
}

function toast(msg, erro) {
  const t = $('toast'); t.textContent = msg;
  t.classList.toggle('bg-leaf', !erro); t.classList.toggle('bg-rust', !!erro); t.classList.remove('hidden');
  clearTimeout(toast.h); toast.h = setTimeout(() => t.classList.add('hidden'), 4500);
}

/* Cadastrar pede login: sem conta, manda para a página de entrar */
async function precisaLogin() {
  const u = await BC.pronto;
  if (!u) { location.href = BC.entrarURL(); return true; }
  return false;
}

/* Pop-ups: abrir, fechar no ✕, no Cancelar ou clicando fora */
async function openCadastro() {
  if (await precisaLogin()) return;
  $('cafe-form').reset(); $('f-recipe-box').open = false;
  ['f-err', 'nb-err', 'f-api-err'].forEach(id => $(id).classList.add('hidden'));
  fillBrands(); setFlag(); toggleNewBrand();
  $('cadastro').showModal(); $('f-name').focus();
}
document.addEventListener('click', e => {
  if (e.target.closest('[data-open="cadastro"]')) openCadastro();
  const x = e.target.closest('[data-close]'); if (x) x.closest('dialog').close();
});
document.querySelectorAll('dialog').forEach(d => d.addEventListener('click', e => { if (e.target === d) d.close(); }));

/* Ações nos cards */
let recipeFor = null;
$('list').addEventListener('click', async e => {
  const del = e.target.closest('[data-del]'), delr = e.target.closest('[data-delr]'), add = e.target.closest('[data-recipe]');
  try {
    if (del && confirm('Remover este café e as receitas dele?')) {
      await api('/cafes/' + del.dataset.del, { method:'DELETE' }); toast('Café removido.'); await carregar();
    }
    if (delr && confirm('Remover esta receita?')) {
      await api('/receitas/' + delr.dataset.delr, { method:'DELETE' }); toast('Receita removida.'); await carregar();
    }
  } catch (err) { toast(err.message, true); }
  if (add) {
    if (await precisaLogin()) return;
    recipeFor = add.dataset.recipe;
    $('recipe-form').reset(); $('nr-err').classList.add('hidden');
    $('rec-cafe').textContent = 'Para o ' + cafes.find(c => String(c.id) === recipeFor).nome;
    $('receita').showModal(); $('nr-title').focus();
  }
});

/* Formulário de cadastro */
$('f-country').innerHTML = '<option value="">Blend / não sei</option>' + Object.entries(COUNTRIES).map(([k, v]) => `<option value="${k}"${k === 'br' ? ' selected' : ''}>${v}</option>`).join('');
const setFlag = () => { const c = $('f-country').value; $('f-flag').innerHTML = c ? flag(c) : '🌍'; };
$('f-country').addEventListener('change', setFlag);
$('f-methods').innerHTML = Object.entries(MN).map(([k, v]) => `<label><input type="checkbox" name="f-m" value="${k}" class="peer sr-only">
  <span class="block cursor-pointer rounded-full border border-cream/20 bg-forest px-3.5 py-1.5 text-sm peer-checked:border-amber peer-checked:bg-amber peer-checked:text-forest peer-focus-visible:outline-2 peer-focus-visible:outline-amber">${v}</span></label>`).join('');
$('f-profile').innerHTML = Object.entries(PN).map(([k, v]) => `<option value="${k}"${k === 'eq' ? ' selected' : ''}>${v[0].toUpperCase() + v.slice(1)}</option>`).join('');
$('f-recipe').innerHTML = recipeFields('fr');
$('nr-fields').innerHTML = recipeFields('nr');

function fillBrands() {
  $('f-brand').innerHTML = '<option value="">Não sei / prefiro não dizer</option>'
    + empresas.map(e => `<option value="${e.id}">${esc(e.nome)}</option>`).join('')
    + '<option value="__new">+ Cadastrar uma nova marca</option>';
}
const toggleNewBrand = () => { const on = $('f-brand').value === '__new'; $('f-newbrand').classList.toggle('hidden', !on); $('f-newbrand').classList.toggle('grid', on); };
$('f-brand').addEventListener('change', () => { toggleNewBrand(); if ($('f-brand').value === '__new') $('nb-name').focus(); });

function erroForm(id, msg) { $(id).textContent = msg; $(id).classList.remove('hidden'); }

$('cafe-form').addEventListener('submit', async e => {
  e.preventDefault();
  const v = id => $(id).value.trim(), name = v('f-name'), isNew = v('f-brand') === '__new';
  $('f-err').classList.toggle('hidden', !!name);
  $('nb-err').classList.toggle('hidden', !isNew || !!v('nb-name'));
  $('f-api-err').classList.add('hidden');
  if (!name) { $('f-name').focus(); return; }
  if (isNew && !v('nb-name')) { $('nb-name').focus(); return; }

  const btn = e.submitter || e.target.querySelector('button:not([type=button])'); btn.disabled = true;
  try {
    let empresa_id = isNew ? null : v('f-brand') || null;
    if (isNew) {
      const { empresa } = await api('/empresas', { method:'POST', body:{ nome:v('nb-name'), cidade:v('nb-city'), site:v('nb-site'), sobre:v('nb-about') } });
      empresa_id = empresa.id;
    }
    const { cafe } = await api('/cafes', { method:'POST', body:{
      nome:name, empresa_id, pais:v('f-country'), regiao:v('f-region'), altitude:v('f-alt') ? parseInt(v('f-alt')) : null,
      processo:v('f-process'), torra:v('f-roast'), notas:v('f-notes').split(',').map(s => s.trim()).filter(Boolean), sobre:v('f-about'),
      metodos:[...document.querySelectorAll('input[name=f-m]:checked')].map(i => i.value), perfil:v('f-profile'), receita:readRecipe('fr') } });
    $('cadastro').close();
    await carregar();
    document.getElementById(cafe.slug)?.scrollIntoView({ behavior:'smooth' });
    toast(`${name} entrou na despensa.`);
  } catch (err) {
    erroForm('f-api-err', err.message);
  } finally {
    btn.disabled = false;
  }
});

$('recipe-form').addEventListener('submit', async e => {
  e.preventDefault();
  const r = readRecipe('nr');
  if (!r) { erroForm('nr-err', 'Preencha pelo menos o nome, a dose ou o passo a passo.'); $('nr-title').focus(); return; }
  const btn = e.submitter || e.target.querySelector('button:not([type=button])'); btn.disabled = true;
  try {
    const { receita } = await api(`/cafes/${recipeFor}/receitas`, { method:'POST', body:r });
    $('receita').close();
    await carregar();
    const d = document.querySelector(`details[data-rid="${receita.id}"]`); if (d) { d.open = true; d.scrollIntoView({ behavior:'smooth', block:'center' }); }
    toast(`Receita "${receita.titulo}" salva.`);
  } catch (err) {
    erroForm('nr-err', err.message);
  } finally {
    btn.disabled = false;
  }
});

carregar();
