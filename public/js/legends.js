/* Coffee Legends: campeões do World Brewers Cup desde 2016, com a receita vencedora em um dropdown */
const $ = id => document.getElementById(id);
const flag = c => `<span class="fi fi-${c} shrink-0 rounded-[2px] shadow-sm" aria-hidden="true"></span>`;
const fmt = n => (Math.round(n * 10) / 10).toString().replace('.', ',');
const mmss = s => Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0');

/* Fonte principal: tabela de campeões do artigo "World Brewers Cup" (Wikipedia), que cita as fichas de cada edição.
   receita.despejos: [segundo em que começa (null = quando o leito secar), gramas, temperatura, detalhe].
   Campo ausente = a fonte não publicou. calc = id do método na calculadora do site. */
const LEGENDS = [
  { ano:2016, cidade:'Dublin, Irlanda', nome:'Tetsu Kasuya', casa:'Coffee Factory', pais:['jp', 'Japão'],
    cafe:'Gesha da Ninety Plus (Panamá)', metodo:'Hario V60 de cerâmica', calc:'v60',
    receita:{ cafe:20, agua:300, temp:'92 °C', tempo:'3:00', moagem:'Grossa', tecnica:'Método 4:6',
      despejos:[[0, 50, '92 °C', 'Primeiro despejo menor: deixa a xícara mais doce'], [null, 70, '92 °C', 'Fecha os 40% que equilibram doçura e acidez'],
        [null, 60, '92 °C', 'Os 60% finais definem a força'], [null, 60, '92 °C', ''], [null, 60, '92 °C', 'Último despejo']],
      obs:['Cada despejo começa quando o leito de café seca.'] } },
  { ano:2017, cidade:'Budapeste, Hungria', nome:'Chad Wang', casa:'Jascaffe', pais:['tw', 'Taiwan'],
    cafe:'Gesha da Ninety Plus (Panamá)', metodo:'Hario V60 de cerâmica', calc:'v60',
    receita:{ cafe:15, agua:250, temp:'92 °C', tempo:'2:00' } },
  { ano:2018, cidade:'Belo Horizonte, Brasil', nome:'Emi Fukahori', casa:'MAME', pais:['ch', 'Suíça'],
    cafe:'Laurina da Daterra (Brasil)', metodo:'GINA, da Goat Story',
    receita:{ cafe:17, agua:220, temp:'80 a 95 °C', tempo:'2:55', tecnica:'Híbrido: imersão e coado',
      obs:['Combina uma fase de imersão com uma de coado, usando o controle de fluxo da GINA.'] } },
  { ano:2019, cidade:'Boston, Estados Unidos', nome:'Du Jianing', casa:'Uni-Uni Roasters', pais:['cn', 'China'],
    cafe:'Gesha da Ninety Plus (Panamá)', metodo:'Origami Dripper',
    receita:{ cafe:16, agua:240, temp:'94 °C', tempo:'1:40' } },
  { ano:2020, cancelado:true },
  { ano:2021, cidade:'Milão, Itália', nome:'Matt Winton', pais:['ch', 'Suíça'],
    cafe:'Eugenioides natural da Finca Inmaculada (Colômbia) com Catucaí lavado (Equador)', metodo:'Hario V60 de metal', calc:'v60',
    receita:{ cafe:20, agua:300, temp:'93 °C e depois 88 °C', tempo:'2:40', moedor:'Kinu M47', tecnica:'5 despejos',
      obs:['Cinco despejos, baixando a água de 93 °C para 88 °C ao longo do preparo.'] } },
  { ano:2022, cidade:'Melbourne, Austrália', nome:'Sherry Hsu (Shih Yuan Hsu)', pais:['tw', 'Taiwan'],
    cafe:'Geisha natural de maceração carbônica da Finca Micava', metodo:'Orea V3 preto com filtro Kalita 185',
    receita:{ cafe:14, agua:200, temp:'70 °C e depois 95 °C', moagem:'75% a 1000 µm e 25% a 800 µm', moedor:'1Zpresso K-Pro', tecnica:'4 despejos de 50 g',
      despejos:[[0, 50, '70 °C', 'Água mais fria no início'], [30, 50, '95 °C', ''], [60, 50, '95 °C', ''], [90, 50, '95 °C', 'Último despejo']] } },
  { ano:2023, cidade:'Atenas, Grécia', nome:'Carlos Medina', pais:['cl', 'Chile'],
    cafe:'Sidra natural da Granja La Esperanza (Colômbia)', metodo:'Origami Dripper',
    receita:{ cafe:15.5, agua:250, temp:'91 °C', moedor:'1Zpresso ZP6 Special, no 5.2', tecnica:'5 despejos de 50 g',
      despejos:[[0, 50, '91 °C', ''], [30, 50, '91 °C', ''], [60, 50, '91 °C', ''], [90, 50, '91 °C', ''], [120, 50, '91 °C', 'Último despejo']] } },
  { ano:2024, cidade:'Chicago, Estados Unidos', nome:'Martin Wölfl', casa:'Wildkaffee', pais:['at', 'Áustria'],
    cafe:'Gesha natural anaeróbico da Finca Maya, processado pela Lost Origin (Panamá)', metodo:'Orea v4 de fundo rápido com filtro Sibarist',
    receita:{ cafe:17, agua:270, temp:'93 °C', moagem:'630 µm', moedor:'Mazzer ZM',
      despejos:[[0, 60, '93 °C', 'Bloom'], [40, 60, '93 °C', ''], [80, 50, '93 °C', ''], [120, 100, '93 °C', 'Último despejo']],
      obs:['Usou WDT (agulhas para soltar o pó antes do preparo) e Melodrip (difusor que suaviza o despejo).'] } },
  { ano:2025, nome:'Peng Jinyang', casa:'Captain George Coffee Roaster', pais:['cn', 'China'],
    cafe:'Geisha natural GN-06, lote Amaru, da Mount Totumas (Panamá)', metodo:'SOLO Dripper',
    receita:{ cafe:15, agua:210, temp:'96 °C e depois 80 °C', moedor:'FM Grinder, 11 cliques', tecnica:'30-90-90',
      despejos:[[0, 30, '96 °C', ''], [30, 90, '96 °C', ''], [70, 90, '80 °C', 'Com Melodrip']] } },
  { ano:2026, cidade:'Bruxelas, Bélgica', nome:'Nas Jaafar', pais:['my', 'Malásia'],
    cafe:'Geisha natural anaeróbico da Finca Nuguo (Panamá)', metodo:'UFO V3 sobre a base da Hario Switch',
    receita:{ tecnica:'Híbrido: imersão e coado',
      obs:['Apresentou o método a partir da Lei de Darcy, a física do fluxo em meios porosos.', 'Primeiro campeão da Malásia.'] },
    nota:'As fontes que consultei não publicaram a dose, a água e os tempos desta receita.' }
];

/* Resumo dos coadores campeões (sem o ano cancelado) */
const familia = m => m.split(/,| de | com | sobre | preto/)[0].replace('Hario ', '').replace(/ v\d| V\d/, '');
const contagem = {};
LEGENDS.filter(l => !l.cancelado).forEach(l => { const f = familia(l.metodo); contagem[f] = (contagem[f] || 0) + 1; });
$('resumo').innerHTML = Object.entries(contagem).sort((a, b) => b[1] - a[1])
  .map(([m, n]) => `<li class="rounded-full border border-amber/40 px-3 py-1 text-sm"><strong>${m}</strong> <span class="text-cream/60">× ${n}</span></li>`).join('');
$('anos').innerHTML = LEGENDS.map(l => `<a href="#ano-${l.ano}" class="rounded-full border border-cream/20 bg-moss px-3.5 py-1.5 text-sm font-medium tabular-nums hover:border-amber hover:text-amber focus-visible:outline-2 focus-visible:outline-amber ${l.cancelado ? 'opacity-50' : ''}">${l.ano}</a>`).join('');

const tile = (k, v) => `<div class="rounded-2xl bg-forest p-3"><dt class="text-xs text-cream/60">${k}</dt><dd class="mt-0.5 font-semibold">${v}</dd></div>`;

/* Linha do tempo dos despejos, quando a fonte deu o segundo de cada um */
function timeline(d) {
  const ends = d.map(([t, g]) => t + Math.max(8, Math.round(g / 5)));
  const fim = Math.max(...ends) + 20;
  return `<div class="relative mt-4 h-4 rounded-full bg-cream/15" role="img" aria-label="Linha do tempo: despejos em ${d.map(([t]) => mmss(t)).join(', ')}">
      ${d.map(([t, g], i) => `<span class="absolute top-0 h-full rounded-full bg-amber" style="left:${(t / fim * 100).toFixed(1)}%;width:${((ends[i] - t) / fim * 100).toFixed(1)}%"></span>`).join('')}
    </div>
    <div class="mt-1 flex justify-between text-xs text-cream/60"><span>0:00</span><span>${mmss(fim)}</span></div>`;
}

function receitaHTML(l) {
  const r = l.receita;
  const tiles = [['Café', r.cafe && fmt(r.cafe) + ' g'], ['Água', r.agua && r.agua + ' g'], ['Proporção', r.cafe && r.agua && '1 : ' + fmt(r.agua / r.cafe)],
    ['Temperatura', r.temp], ['Tempo total', r.tempo], ['Moagem', r.moagem], ['Moedor', r.moedor], ['Técnica', r.tecnica]].filter(([, v]) => v);
  const prev = [r.cafe && fmt(r.cafe) + ' g', r.agua && r.agua + ' g', r.temp, r.tempo].filter(Boolean).join(' · ');
  let despejos = '';
  if (r.despejos) {
    let acc = 0;
    const comHora = r.despejos.every(([t]) => t !== null);
    despejos = `<p class="mt-6 font-bold">Despejos</p>
      ${comHora ? timeline(r.despejos) : ''}
      <div class="mt-3 overflow-x-auto"><table class="w-full min-w-[30rem] text-left text-sm">
        <thead class="text-cream/60"><tr><th class="py-1 pr-3 font-medium">#</th><th class="py-1 pr-3 font-medium">Quando</th><th class="py-1 pr-3 font-medium">Despejar</th><th class="py-1 pr-3 font-medium">Na balança</th><th class="py-1 pr-3 font-medium">Água a</th><th class="py-1 font-medium">Detalhe</th></tr></thead>
        <tbody>${r.despejos.map(([t, g, temp, nota], i) => { acc += g; return `<tr class="border-t border-cream/10">
          <td class="py-2 pr-3"><span class="flex size-6 items-center justify-center rounded-full bg-amber text-xs font-bold text-forest">${i + 1}</span></td>
          <td class="py-2 pr-3 font-semibold tabular-nums">${t === null ? 'Leito seco' : mmss(t)}</td>
          <td class="py-2 pr-3 tabular-nums">${g} g</td>
          <td class="py-2 pr-3 tabular-nums text-cream/70">${acc} g</td>
          <td class="py-2 pr-3">${temp}</td>
          <td class="py-2 text-cream/75">${nota}</td></tr>`; }).join('')}</tbody></table></div>`;
  } else if (r.cafe) {
    despejos = '<p class="mt-5 text-sm text-cream/60">A divisão dos despejos desta receita não foi publicada nas fontes.</p>';
  }
  return `
  <details class="group mt-6 rounded-2xl bg-roast frame">
    <summary class="flex cursor-pointer list-none items-center justify-between gap-4 rounded-2xl p-4 hover:bg-cream/5 focus-visible:outline-2 focus-visible:outline-amber">
      <span><span class="font-display text-lg font-bold">Ver a receita vencedora</span>${prev ? `<span class="block text-sm text-amber">${prev}</span>` : ''}</span>
      <span class="text-xl text-amber transition-transform group-open:rotate-180" aria-hidden="true">▾</span>
    </summary>
    <div class="border-t border-cream/15 p-4 pt-4">
      ${tiles.length ? `<dl class="grid grid-cols-2 gap-2 text-sm sm:grid-cols-3">${tiles.map(([k, v]) => tile(k, v)).join('')}</dl>` : ''}
      ${despejos}
      ${r.obs ? `<ul class="mt-5 space-y-2 text-sm">${r.obs.map(o => `<li class="border-l-2 border-amber pl-3 text-cream/85">${o}</li>`).join('')}</ul>` : ''}
      ${l.nota ? `<p class="mt-4 text-sm text-cream/60">${l.nota}</p>` : ''}
      ${l.calc ? `<a href="index.html?m=${l.calc}#calculadora" class="mt-5 inline-block text-sm font-semibold underline underline-offset-4 hover:text-amber focus-visible:outline-2 focus-visible:outline-amber">Abrir o V60 na calculadora</a>` : ''}
    </div>
  </details>`;
}

$('legends').innerHTML = LEGENDS.map(l => l.cancelado ? `
  <article id="ano-${l.ano}" class="scroll-mt-6 border-t border-cream/15 py-8">
    <p class="font-display text-4xl font-bold tabular-nums text-cream/40">${l.ano}</p>
    <p class="mt-1 text-cream/60">Sem campeonato: a pandemia cancelou o World Brewers Cup deste ano.</p>
  </article>` : `
  <article id="ano-${l.ano}" class="scroll-mt-6 border-t border-cream/15 py-12">
    <div class="grid gap-8 lg:grid-cols-[18rem_1fr]">
      <div>
        <p class="font-display text-6xl font-bold tabular-nums text-amber">${l.ano}</p>
        ${l.cidade ? `<p class="text-sm text-cream/60">${l.cidade}</p>` : ''}
        <h2 class="mt-4 text-3xl font-bold">${l.nome}</h2>
        ${l.casa ? `<p class="text-cream/75">${l.casa}</p>` : ''}
        <p class="mt-2 flex items-center gap-2 text-sm"><span class="text-lg leading-none">${flag(l.pais[0])}</span><strong>${l.pais[1]}</strong></p>
      </div>
      <div class="min-w-0">
        <p class="text-sm font-semibold uppercase tracking-wider text-cream/60">Método vencedor</p>
        <p class="mt-1 font-display text-2xl font-bold text-amber">${l.metodo}</p>
        <dl class="mt-4 text-sm"><div class="flex justify-between gap-4 border-t border-cream/10 py-2"><dt class="text-cream/60">Café</dt><dd class="text-right font-semibold">${l.cafe}</dd></div></dl>
        ${receitaHTML(l)}
      </div>
    </div>
  </article>`).join('');
