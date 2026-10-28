/* c = cliques centrais no iCoffee M3 PRO (30 níveis); cr = faixa sugerida.
   Espresso (6 a 10), coado (16 a 24) e prensa (24 a 30) vêm das indicações do fabricante;
   os demais níveis são estimados entre eles. Se o seu moedor pedir outro ponto, mude CAL. */
const CAL = 0; // soma ou subtrai cliques em tudo (calibração do seu M3 PRO)
const LEVELS = [
  { n:'Extrafina',   um:150,  like:'talco grosso',            m:'ibrik',           c:3,  cr:'2 a 4' },
  { n:'Fina',        um:250,  like:'açúcar refinado',         m:'espresso',        c:8,  cr:'6 a 10' },
  { n:'Média-fina',  um:400,  like:'sal fino de mesa',        m:'moka',            c:12, cr:'11 a 14' },
  { n:'Média',       um:550,  like:'areia fina de rio',       m:'AeroPress, syphon, Melitta e coador de pano', c:16, cr:'14 a 18' },
  { n:'Média-grossa',um:750,  like:'areia de construção',     m:'V60, Koar, Kalita, B75 e Clever', c:20, cr:'18 a 22' },
  { n:'Grossa',      um:950,  like:'sal grosso fino',         m:'Chemex',          c:23, cr:'22 a 25' },
  { n:'Bem grossa',  um:1150, like:'flocos de sal marinho',   m:'prensa francesa', c:27, cr:'25 a 29' },
  { n:'Extragrossa', um:1400, like:'milho de pipoca quebrado',m:'cold brew',       c:29, cr:'28 a 30' }
];

const PROFILES = [
  { id:'eq',  name:'Equilibrado',        desc:'Doçura, acidez e corpo na medida.',        clicks:0,  rp:0,    tip:'Ponto de partida. Prove e ajuste a partir daqui.' },
  { id:'doce',name:'Doce e redondo',     desc:'Caramelo e chocolate, acidez baixa.',      clicks:-1, rp:0,    tip:'Moagem um pouco mais fechada, água até 1 °C mais quente e despejos calmos realçam a doçura.' },
  { id:'fru', name:'Frutado e brilhante',desc:'Acidez viva, notas de fruta e flor.',      clicks:2,  rp:0.06, tip:'Moagem mais aberta e tempo no limite curto da faixa. Rende mais com café de torra clara.' },
  { id:'enc', name:'Encorpado e intenso',desc:'Textura cheia, amargor de chocolate.',     clicks:-2, rp:-0.1, tip:'Moagem mais fina e receita mais concentrada. Use o tempo longo da faixa, de olho no amargor.' },
  { id:'leve',name:'Leve e limpo',       desc:'Textura de chá, final limpo.',             clicks:1,  rp:0.1,  tip:'Um pouco mais de água para o mesmo café. Combina com filtro de papel e café de torra clara a média.' }
];

const METHODS = [
  { id:'ibrik',   name:'Ibrik',           lvl:0, ratio:10, temp:'Fervura leve', time:'2 a 3 min', note:'Leve ao fogo baixo e retire quando a espuma subir. Não deixe ferver forte.' },
  { id:'espresso',name:'Espresso',        lvl:1, ratio:2,  temp:'92 a 94 °C',   time:'25 a 30 s', note:'Aqui 1 : 2 é o peso da bebida na xícara, não o da água. Ex.: 18 g de café para 36 g de espresso.' },
  { id:'moka',    name:'Moka',            lvl:2, ratio:10, temp:'Água quente',  time:'4 a 5 min', note:'Encha a base com água quente até a válvula e retire do fogo assim que o café subir.' },
  { id:'aero',    name:'AeroPress',       lvl:3, ratio:15, temp:'85 a 92 °C',   time:'1:30 a 2:00', note:'Receita versátil. Misture, espere cerca de um minuto e pressione devagar.' },
  { id:'syphon',  name:'Syphon',          lvl:3, ratio:15, temp:'91 a 94 °C',   time:'≈ 2:30', note:'Junte o café quando a água subir, mexa, deixe 1 minuto e tire do fogo. O vácuo puxa o café de volta.' },
  { id:'melitta', name:'Melitta',         lvl:3, ratio:15, temp:'92 a 96 °C',   time:'3:00 a 4:00', note:'Dobre as costuras do filtro, escalde o papel e despeje devagar, sempre no centro.' },
  { id:'pano',    name:'Coador de pano',  lvl:3, ratio:14, temp:'92 a 96 °C',   time:'3:00 a 4:00', note:'Escalde o pano antes de usar. Depois, enxágue só com água, sem sabão, e seque bem.' },
  { id:'v60',     name:'V60',            lvl:4, ratio:16, temp:'92 a 96 °C',   time:'2:30 a 3:00', note:'Molhe o café com o dobro do peso em água, espere 40 s e despeje em círculos.' },
  { id:'koar',    name:'Koar',            lvl:4, ratio:15, temp:'92 a 94 °C',   time:'2:30 a 3:00', note:'Use o filtro Koar tamanho 02 e escalde o papel. O fluxo é rápido: se ficar ralo, feche 1 clique.' },
  { id:'kalita',  name:'Kalita Wave',     lvl:4, ratio:16, temp:'92 a 96 °C',   time:'3:00 a 3:30', note:'Despeje no centro, em pulsos, sem molhar as ondas do filtro.' },
  { id:'b75',     name:'B75',             lvl:4, ratio:16, temp:'92 °C',        time:'2:30 a 3:15', note:'Receita da Timemore: bloom curto e depois um despejo contínuo em círculos até o total.' },
  { id:'clever',  name:'Clever',          lvl:4, ratio:16, temp:'93 a 96 °C',   time:'3:00 a 3:30', note:'Coloque a água primeiro e o café depois: assim o leito não entope a válvula.' },
  { id:'chemex',  name:'Chemex',         lvl:5, ratio:16, temp:'93 a 96 °C',   time:'4:00', note:'O filtro é mais grosso, então a moagem pode ser um pouco mais aberta que no V60.' },
  { id:'french',  name:'Prensa francesa', lvl:6, ratio:15, temp:'93 °C',        time:'4:00', note:'Deixe 4 minutos, quebre a crosta com a colher e pressione sem força.' },
  { id:'cold',    name:'Cold brew',       lvl:7, ratio:8,  temp:'Ambiente ou geladeira', time:'12 a 18 h', note:'Sai concentrado. Na hora de servir, dilua com água, gelo ou leite a gosto.' }
];

const $ = id => document.getElementById(id);
const fmt = n => (Math.round(n * 10) / 10).toString().replace('.', ',');

/* Escala de moagem */
function drawDots(um) {
  const box = $('dots');
  const d = um * 0.045, gap = 3;
  const W = box.clientWidth || 600, H = 160;
  const cols = Math.floor(W / (d + gap)), rows = Math.floor(H / (d + gap));
  let s = 7, html = '';
  for (let i = 0; i < cols * rows; i++) {
    s = (s * 9301 + 49297) % 233280;
    const sz = (d * (0.8 + (s / 233280) * 0.4)).toFixed(1);
    html += `<i style="width:${sz}px;height:${sz}px"></i>`;
  }
  box.innerHTML = html;
}
function setGrind(i) {
  const L = LEVELS[i];
  $('grind').value = i + 1;
  $('g-name').textContent = L.n;
  $('g-um').textContent = '≈ ' + L.um + ' µm';
  $('g-like').textContent = L.like;
  $('g-methods').textContent = L.m;
  $('g-clicks').textContent = L.cr + ' cliques';
  drawDots(L.um);
}
$('grind').addEventListener('input', e => setGrind(+e.target.value - 1));
window.addEventListener('resize', () => drawDots(LEVELS[+$('grind').value - 1].um));

/* Calculadora */
function current() { return METHODS.find(m => m.id === $('method').value); }
function profile() { return PROFILES.find(p => p.id === document.querySelector('input[name=profile]:checked').value); }
function clicksFor(m, p) {
  const off = m.lvl <= 1 ? Math.sign(p.clicks) : p.clicks; /* espresso e ibrik: ajuste de 1 clique */
  return Math.min(30, Math.max(1, Math.round(LEVELS[m.lvl].c + off + CAL)));
}
function ratioFor(m, p) {
  const step = m.ratio < 5 ? 10 : 2;
  return Math.round(m.ratio * (1 + p.rp) * step) / step;
}
function calc() {
  const m = current();
  const mode = document.querySelector('input[name=mode]:checked').value;
  const amount = parseFloat($('amount').value) || 0;
  const ratio = parseFloat($('ratio').value) || 1;
  const coffee = mode === 'coffee' ? amount : amount / ratio;
  const water  = mode === 'coffee' ? amount * ratio : amount;
  const isEsp = m.id === 'espresso';
  $('out-coffee').textContent = fmt(coffee);
  $('out-water').textContent = fmt(water);
  $('out-water-unit').textContent = isEsp ? 'g de bebida' : 'ml de água';
  const p = profile(), c = clicksFor(m, p), v = Math.floor(c / 12), r = c % 12;
  $('out-clicks').textContent = c + (c === 1 ? ' clique' : ' cliques');
  $('out-turns').textContent = v === 0 ? 'menos de 1 volta' : `${v} ${v === 1 ? 'volta' : 'voltas'}${r ? ' e ' + r + (r === 1 ? ' clique' : ' cliques') : ''}`;
  $('out-profile').textContent = p.name + ': ' + p.tip;
  $('out-grind').textContent = LEVELS[m.lvl].n;
  $('out-temp').textContent = m.temp;
  $('out-time').textContent = m.time;
  $('out-note').textContent = m.note;
  $('amount-label').textContent = mode === 'coffee' ? 'Café disponível (g)' : (isEsp ? 'Bebida desejada (g)' : 'Água disponível (ml)');
  renderSteps(m, p, coffee, water);
}
function pick(id, scroll) {
  $('method').value = id;
  const m = current();
  $('ratio').value = ratioFor(m, profile());
  setGrind(m.lvl);
  calc();
  if (scroll) $('calculadora').scrollIntoView({ behavior: 'smooth' });
}

/* Passo a passo */
const TM = { eq:1, doce:1, fru:.9, enc:1.1, leve:.95 };
const mmss = t => Math.floor(t / 60) + ':' + String(Math.round(t % 60)).padStart(2, '0');
const dur = ml => Math.max(8, Math.round(ml / 5));
const cumul = (a, W) => { let c = 0; return a.map((x, i) => (c += x, i === a.length - 1 ? W : Math.min(W, c))); };

function stepsV60(p, W) {
  let amts, starts, end, pauses = false, src;
  if (p.id === 'eq') { /* sua receita: 70, 100, 80 e 50 g para 300 g, escalada para o total */
    amts = [70, 100, 80, 50].map(x => Math.round(W * x / 300));
    starts = [0, 30, 105, 165]; end = 195; pauses = true; src = 'Receita da casa';
  } else { /* 4:6 do Tetsu Kasuya: 40% definem doçura e acidez, 60% definem a força */
    const a = p.id === 'doce' ? 1 / 3 : p.id === 'fru' ? 2 / 3 : .5, n = p.id === 'enc' ? 3 : p.id === 'leve' ? 1 : 2;
    amts = [.4 * a, .4 * (1 - a), ...Array(n).fill(.6 / n)].map(x => Math.round(W * x));
    starts = amts.map((_, i) => i * 45);
    end = starts[starts.length - 1] + dur(amts[amts.length - 1]) + 40; src = 'Adaptado do método 4:6 de Tetsu Kasuya';
  }
  const cum = cumul(amts, W), out = [];
  amts.forEach((a, i) => {
    const s0 = starts[i], e0 = s0 + dur(a);
    if (pauses && i > 1) { /* o bloom já cobre a espera até o 1º despejo */
      const pe = starts[i - 1] + dur(amts[i - 1]);
      if (s0 - pe >= 10) out.push({ title:'Pausa', t:`${mmss(pe)} – ${mmss(s0)}`, ml:cum[i - 1], text:'Espere o nível baixar antes do próximo despejo.' });
    }
    if (p.id === 'eq') out.push(i === 0
      ? { title:'Bloom', t:`0:00 – ${mmss(starts[1])}`, ml:cum[0], text:`Molhe todo o pó com ${a} ml em círculos e agite levemente. Deixe liberar o CO₂.` }
      : { title:`${i}º despejo`, t:`${mmss(s0)} – ${mmss(e0)}`, ml:cum[i], text:`Suba até ${cum[i]} ml em espiral do centro para fora, sem tocar as bordas.` });
    else out.push({ title:`${i + 1}º despejo`, t:`${mmss(s0)} – ${mmss(e0)}`, ml:cum[i],
      text: i < 2 ? `Despeje até ${cum[i]} ml em espiral e espere o leito secar. Os dois primeiros despejos equilibram doçura e acidez.` : `Suba até ${cum[i]} ml. Os despejos finais definem a força da xícara.` });
  });
  const last = starts[starts.length - 1] + dur(amts[amts.length - 1]);
  out.push({ title:'Drawdown', t:`${mmss(last)} – ${mmss(end)}`, ml:W, text:`Deixe escoar por completo. Alvo total próximo de ${mmss(end)}.` });
  return { src, out };
}

/* [título, início, fim (s) ou rótulo, fração da água acumulada, texto] */
const T = {
  ibrik: [['Misture',0,30,1,'Coloque o café e a água fria no ibrik e mexa até molhar tudo.'],['Aqueça',30,150,1,'Fogo baixo, sem mexer. Observe a espuma começar a subir.'],['Retire do fogo',150,165,1,'Assim que a espuma subir, tire antes de ferver forte.'],['Descanse',165,195,1,'Espere a borra assentar e sirva devagar.']],
  espresso: [['Prepare o café','Antes da extração',0,0,'Moa na hora, distribua e nivele o café e compacte com pressão firme e reta.'],['Pré-infusão',0,5,.1,'Molhe o café com baixa vazão para ele se acomodar.'],['Extração',5,28,1,'O fluxo deve sair contínuo, cor de mel. Pare ao atingir o peso alvo da bebida.'],['Sirva',28,40,1,'Prove logo: o espresso perde brilho rápido.']],
  moka: [['Encha a base',0,30,1,'Coloque água quente até a válvula, sem cobri-la.'],['Coloque o café',30,60,0,'Encha o filtro e nivele, sem compactar.'],['Monte e aqueça',60,180,0,'Rosqueie bem e leve ao fogo baixo, com a tampa aberta.'],['Retire',180,270,1,'Tire do fogo quando o fluxo ficar claro e começar a chiar. Passe a base sob água fria por alguns segundos.']],
  aero: [['Bloom',0,30,.2,'Molhe o café com pouca água e espere.'],['Complete a água',30,45,1,'Suba até o volume total.'],['Mexa',45,60,1,'Três voltas suaves.'],['Infusão',60,90,1,'Encaixe o êmbolo para segurar o líquido e espere.'],['Pressione',90,135,1,'Desça devagar por uns 30 s e pare ao ouvir o chiado.']],
  syphon: [['Aqueça a água','Antes de começar',0,1,'Coloque a água quente no balão de baixo, encaixe o funil com o filtro e aqueça até a água subir.'],['Junte o café',0,10,1,'Com a água no funil, adicione o café de uma vez.'],['Mexa',10,20,1,'Mexa até molhar todo o pó, sem raspar o filtro.'],['Infusão',20,70,1,'Fogo baixo, só para manter a água em cima.'],['Tire do fogo e mexa',70,80,1,'Desligue o calor e dê uma volta suave com a colher.'],['Drawdown',80,140,1,'O vácuo puxa o café para o balão. Está pronto quando o leito ficar em cúpula.']],
  melitta: [['Bloom',0,30,.15,'Molhe todo o pó e espere ele inchar.'],['1º despejo',30,75,.6,'Despeje devagar, em círculos pequenos no centro.'],['2º despejo',90,130,1,'Complete o total sem encher até a borda.'],['Drawdown',130,210,1,'Deixe escoar pelos furinhos.']],
  pano: [['Escalde o pano','Antes de começar',0,0,'Passe água quente pelo pano e descarte.'],['Bloom',0,30,.15,'Molhe todo o pó e espere.'],['Despejo',30,120,1,'Despeje aos poucos, em fio, mantendo o nível baixo.'],['Escoe',120,210,1,'Deixe passar tudo. Não esprema o pano.']],
  koar: [['Bloom',0,30,.15,'Molhe todo o pó em círculos e deixe liberar o CO₂.'],['1º despejo',30,60,.55,'Suba em espiral do centro para fora.'],['2º despejo',75,105,1,'Complete o total, sem despejar nas paredes.'],['Drawdown',105,170,1,'O fluxo é rápido. Alvo próximo de 2:50.']],
  kalita: [['Bloom',0,35,.15,'Molhe todo o pó no centro.'],['1º pulso',35,60,.4,'Despeje em círculos pequenos, sem tocar as ondas do filtro.'],['2º pulso',70,95,.7,'Mantenha o nível constante.'],['3º pulso',105,130,1,'Complete o total.'],['Drawdown',130,200,1,'Deixe escoar. O leito deve ficar plano.']],
  b75: [['Bloom',0,45,.18,'Molhe todo o pó e agite de leve por 5 a 10 s.'],['Despejo contínuo',45,100,1,'Despeje em círculos controlados até o total.'],['Mexa na borda',100,110,1,'Uma volta suave na borda para assentar o leito.'],['Drawdown',110,180,1,'Deixe escoar por completo.']],
  clever: [['Despeje a água',0,20,1,'Com o filtro escaldado e o coador apoiado na bancada, coloque toda a água.'],['Junte o café',20,30,1,'Adicione o pó e afunde com a colher.'],['Infusão',30,120,1,'Tampe e espere.'],['Mexa',120,135,1,'Quebre a crosta com uma volta suave.'],['Escoe',135,200,1,'Apoie na xícara: a válvula abre e o café desce.']],
  chemex: [['Bloom',0,45,.16,'Molhe todo o pó e deixe liberar o CO₂.'],['1º despejo',45,75,.6,'Suba em espiral, sem tocar o papel.'],['2º despejo',90,120,1,'Complete o volume total e nivele o leito com um leve swirl.'],['Drawdown',120,240,1,'Deixe escoar. Alvo total próximo de 4:00.']],
  french: [['Despeje',0,20,1,'Molhe todo o pó de uma vez.'],['Infusão',20,240,1,'Tampe sem pressionar e espere.'],['Quebre a crosta',240,260,1,'Mexa de leve e retire a espuma.'],['Pressione',260,290,1,'Desça o êmbolo devagar, sem forçar, e sirva tudo logo.']],
  cold: [['Misture','Hoje',0,1,'Coloque o café extragrosso e a água fria no pote e mexa.'],['Geladeira','Em seguida',0,0,'Tampe e leve à geladeira.'],['Coe','Após 12 a 18 h',0,0,'Coe em filtro de papel e guarde na geladeira.'],['Sirva','Na hora',0,0,'Dilua com água, gelo ou leite a gosto.']]
};

function renderSteps(m, p, C, W) {
  const unit = m.id === 'espresso' ? 'g' : 'ml';
  let src = '', st;
  if (m.id === 'v60') { const r = stepsV60(p, W); st = r.out; src = r.src; }
  else { const tm = TM[p.id]; st = T[m.id].map(([title, a, b, fr, text]) => ({ title, text, ml: fr ? Math.round(W * fr) : null, t: typeof a === 'string' ? a : `${mmss(a * tm)} – ${mmss(b * tm)}` })); }
  $('steps-sub').textContent = `${m.name}, perfil ${p.name.toLowerCase()}: ${fmt(C)} g de café e ${fmt(W)} ${unit}. ${src ? src + '.' : ''}`;
  $('steps').innerHTML = st.map((s, i) => `
    <li class="flex gap-4 border-t border-cream/10 py-4">
      <span class="flex size-8 shrink-0 items-center justify-center rounded-full bg-amber font-bold text-forest">${i + 1}</span>
      <div><p class="font-display text-lg font-bold">${s.title}</p>
        <p class="text-sm text-amber">${s.t}${s.ml ? ' · ' + s.ml + ' ' + unit : ''}</p>
        <p class="mt-1 text-sm text-cream/80">${s.text}</p></div>
    </li>`).join('');
}

/* Drawer de métodos */
const drawer = $('drawer'), openBtn = $('open-drawer');
function setDrawer(o) {
  drawer.classList.toggle('hidden', !o); openBtn.setAttribute('aria-expanded', String(o));
  if (o) $('close-drawer').focus(); else openBtn.focus({ preventScroll:true });
}
openBtn.addEventListener('click', () => setDrawer(true));
$('close-drawer').addEventListener('click', () => setDrawer(false));
$('drawer-bg').addEventListener('click', () => setDrawer(false));
document.addEventListener('keydown', e => { if (e.key === 'Escape' && !drawer.classList.contains('hidden')) setDrawer(false); });

/* Montagem */
METHODS.forEach(m => $('method').insertAdjacentHTML('beforeend', `<option value="${m.id}">${m.name}</option>`));
$('method').addEventListener('change', e => pick(e.target.value, false));
['amount', 'ratio'].forEach(id => $(id).addEventListener('input', calc));
document.querySelectorAll('input[name=mode]').forEach(r => r.addEventListener('change', calc));

$('profiles').innerHTML = PROFILES.map((p, i) => `
  <label><input type="radio" name="profile" value="${p.id}" class="peer sr-only"${i === 0 ? ' checked' : ''}>
    <span class="block h-full cursor-pointer rounded-xl border border-cream/20 bg-moss px-3 py-2.5 peer-checked:border-amber peer-checked:ring-1 peer-checked:ring-amber peer-focus-visible:outline-2 peer-focus-visible:outline-amber">
      <span class="block font-semibold">${p.name}</span>
      <span class="block text-sm text-cream/65">${p.desc}</span>
    </span></label>`).join('');
document.querySelectorAll('input[name=profile]').forEach(r => r.addEventListener('change', () => { $('ratio').value = ratioFor(current(), profile()); calc(); }));

$('drawer-list').innerHTML = METHODS.map(m => `
  <li class="flex items-center justify-between gap-3 py-3">
    <button data-id="${m.id}" class="text-left font-display text-lg font-bold hover:text-amber focus-visible:outline-2 focus-visible:outline-amber">${m.name}<span class="block font-body text-xs font-normal text-cream/60">${LEVELS[m.lvl].n} · ${LEVELS[m.lvl].cr} cliques</span></button>
    <a href="methods.html#${m.id}" class="shrink-0 text-sm font-medium underline underline-offset-4 hover:text-amber focus-visible:outline-2 focus-visible:outline-amber">Guia</a>
  </li>`).join('');
$('drawer-list').addEventListener('click', e => { const b = e.target.closest('button'); if (b) { pick(b.dataset.id, true); setDrawer(false); } });

const qs = new URLSearchParams(location.search), qp = qs.get('p'), qm = qs.get('m');
if (PROFILES.some(x => x.id === qp)) document.querySelector(`input[name=profile][value=${qp}]`).checked = true;
pick(METHODS.some(x => x.id === qm) ? qm : 'v60', false);
