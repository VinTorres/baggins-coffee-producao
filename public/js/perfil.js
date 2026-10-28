/* Meu perfil: ver e editar os dados do usuário logado */
const $ = id => document.getElementById(id);
const { esc, api, PAPEL } = BC;
const MN = { ibrik:'Ibrik', espresso:'Espresso', moka:'Moka', aero:'AeroPress', syphon:'Syphon', melitta:'Melitta', pano:'Coador de pano', v60:'V60', koar:'Koar', kalita:'Kalita Wave', b75:'B75', clever:'Clever', chemex:'Chemex', french:'Prensa francesa', cold:'Cold brew' };
const PN = { doce:'Doce e redondo', fru:'Frutado e brilhante', eq:'Equilibrado', enc:'Encorpado e intenso', leve:'Leve e limpo' };
const NIVEL = { iniciante:'Iniciante: estou começando', entusiasta:'Entusiasta: preparo todo dia', barista:'Barista caseiro: peso, meço e ajusto', profissional:'Profissional do café' };
const opts = (o, vazio) => `<option value="">${vazio}</option>` + Object.entries(o).map(([k, v]) => `<option value="${k}">${esc(v)}</option>`).join('');

let cafes = [];

/* Cartão à esquerda: mostra o perfil como os outros veriam */
function cartao(p) {
  $('c-inicial').textContent = p.nome[0].toUpperCase();
  $('c-nome').textContent = p.nome;
  $('c-usuario').textContent = p.usuario ? '@' + p.usuario : 'Sem usuário ainda';
  $('c-bio').textContent = p.bio || '';
  $('c-bio').classList.toggle('hidden', !p.bio);
  $('c-tags').innerHTML = [PAPEL[p.papel], p.nivel && NIVEL[p.nivel].split(':')[0], p.cidade]
    .filter(Boolean).map(t => `<span class="rounded-full border border-amber/40 px-3 py-0.5 text-xs">${esc(t)}</span>`).join('');
  const cafe = cafes.find(c => c.id === p.cafe_favorito_id);
  const favs = [['Método favorito', p.metodo_favorito && MN[p.metodo_favorito]], ['Café favorito', cafe?.nome], ['Perfil', p.perfil_favorito && PN[p.perfil_favorito]],
    ['Moedor', p.moedor], ['Xícaras por dia', p.xicaras_dia ?? null]].filter(([, v]) => v !== null && v !== undefined && v !== '');
  $('c-favs').innerHTML = favs.map(([k, v]) => `<div class="flex justify-between gap-4 py-2"><dt class="text-cream/60">${k}</dt><dd class="text-right font-semibold">${esc(v)}</dd></div>`).join('');
  $('s-cafes').textContent = p.total_cafes;
  $('s-receitas').textContent = p.total_receitas;
  $('s-casas').textContent = p.total_casas;
  $('c-desde').textContent = 'No Baggins Coffee desde ' + new Date(p.criado_em).toLocaleDateString('pt-BR', { month:'long', year:'numeric' }) + '.';
}

function preencher(p) {
  $('p-nome').value = p.nome;
  $('p-usuario').value = p.usuario || '';
  $('p-email').value = p.email;
  $('p-telefone').value = p.telefone || '';
  $('p-cidade').value = p.cidade || '';
  $('p-bio').value = p.bio || '';
  $('p-bio-n').textContent = $('p-bio').value.length;
  $('p-metodo').value = p.metodo_favorito || '';
  $('p-cafe').value = p.cafe_favorito_id || '';
  $('p-perfil').value = p.perfil_favorito || '';
  $('p-nivel').value = p.nivel || '';
  $('p-moedor').value = p.moedor || '';
  $('p-xicaras').value = p.xicaras_dia ?? '';
}

async function carregar() {
  if (!await BC.pronto) { location.href = BC.entrarURL(); return; }
  try {
    const d = await api('/perfil');
    cafes = d.cafes;
    $('p-metodo').innerHTML = opts(MN, 'Ainda não escolhi');
    $('p-cafe').innerHTML = opts(Object.fromEntries(cafes.map(c => [c.id, c.nome])), 'Ainda não escolhi');
    $('p-perfil').innerHTML = opts(PN, 'Ainda não escolhi');
    $('p-nivel').innerHTML = opts(NIVEL, 'Prefiro não dizer');
    preencher(d.perfil); cartao(d.perfil);
    $('status').classList.add('hidden');
    $('conteudo').classList.remove('hidden');
  } catch (e) {
    $('status').textContent = e.message;
  }
}

$('p-bio').addEventListener('input', () => { $('p-bio-n').textContent = $('p-bio').value.length; });
/* Usuário: minúsculas, sem @ e sem espaço enquanto digita */
$('p-usuario').addEventListener('input', e => { e.target.value = e.target.value.toLowerCase().replace(/^@/, '').replace(/\s/g, ''); });

$('perfil-form').addEventListener('submit', async e => {
  e.preventDefault();
  const v = id => $(id).value.trim(), err = $('p-err'), ok = $('p-ok');
  err.classList.add('hidden'); ok.textContent = '';
  if (!v('p-nome')) { err.textContent = 'O nome não pode ficar vazio.'; err.classList.remove('hidden'); $('p-nome').focus(); return; }
  if (v('p-usuario') && !/^[a-z0-9_.]{3,30}$/.test(v('p-usuario'))) { err.textContent = 'O usuário precisa ter de 3 a 30 caracteres: letras sem acento, números, ponto ou _.'; err.classList.remove('hidden'); $('p-usuario').focus(); return; }
  const btn = e.submitter || e.target.querySelector('button:not([type=button])'); btn.disabled = true;
  try {
    const { perfil } = await api('/perfil', { method:'PUT', body:{
      nome:v('p-nome'), usuario:v('p-usuario'), telefone:v('p-telefone'), cidade:v('p-cidade'), bio:v('p-bio'),
      metodo_favorito:v('p-metodo'), cafe_favorito_id:v('p-cafe'), perfil_favorito:v('p-perfil'), nivel:v('p-nivel'),
      moedor:v('p-moedor'), xicaras_dia:v('p-xicaras') } });
    const atual = await api('/perfil');
    preencher(perfil); cartao(atual.perfil);
    ok.textContent = 'Perfil salvo.';
    /* Atualiza o nome no menu do topo */
    document.querySelector('#auth-slot summary')?.lastChild && (document.querySelector('#auth-slot summary').lastChild.textContent = perfil.nome.split(' ')[0]);
  } catch (ex) {
    err.textContent = ex.message; err.classList.remove('hidden');
  } finally {
    btn.disabled = false;
  }
});

carregar();
