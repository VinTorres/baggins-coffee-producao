/* clicks = ponto de partida no iCoffee M3 PRO (espresso, coado e prensa vêm do fabricante; os outros são estimados) */
const M = [
  { id:'ibrik', name:'Ibrik', lead:'Imersão com calor, sem filtro. Denso, aromático, com a borra no fundo da xícara.',
    spec:{ Moagem:'Extrafina', 'M3 PRO':'2 a 4 cliques', Proporção:'1 : 10', Água:'Fervura leve', Tempo:'2 a 3 min' },
    extrai:'Como o pó fica em contato direto com a água quente e nada o retém, sai muito corpo, óleos e amargor de torra, com pouca clareza de acidez.',
    best:['Corpo denso e aroma intenso','Espuma natural no topo','Equipamento barato e ritual próprio'],
    worst:['Borra no copo','Esquenta demais com facilidade e amarga','Pede moagem muito fina, e nem todo moedor manual chega lá. Teste no seu'] },
  { id:'espresso', name:'Espresso', lead:'Água sob pressão atravessando um bolo de café fino em menos de meio minuto.',
    spec:{ Moagem:'Fina', 'M3 PRO':'6 a 10 cliques', Proporção:'1 : 2 (na bebida)', Água:'92 a 94 °C', Tempo:'25 a 30 s' },
    extrai:'É a extração mais concentrada: pega acidez, doçura e amargor em poucos segundos, e emulsiona óleos que formam a crema.',
    best:['Concentração e intensidade','Base para bebidas com leite','Textura cremosa e final longo'],
    worst:['Quase não perdoa erro: um clique muda tudo','Exige máquina com pressão estável','Com moedor manual de cliques, o ajuste fica menos fino e o esforço é maior'] },
  { id:'moka', name:'Moka', lead:'O vapor empurra a água pelo café e sobe para a parte de cima. Parente do espresso, mas com menos pressão.',
    spec:{ Moagem:'Média-fina', 'M3 PRO':'11 a 14 cliques', Proporção:'1 : 10', Água:'Quente na base', Tempo:'4 a 5 min' },
    extrai:'Entrega corpo e intensidade, com notas de chocolate e torra. A temperatura alta tende a puxar amargor se você demorar.',
    best:['Corpo forte sem máquina','Barata e dura anos','Prática no dia a dia'],
    worst:['Fácil de queimar o café','Pouco controle de temperatura e de tempo','Não é espresso, apesar de parecido'] },
  { id:'aero', name:'AeroPress', lead:'Imersão curta seguida de pressão manual, com filtro de papel.',
    spec:{ Moagem:'Média', 'M3 PRO':'14 a 18 cliques', Proporção:'1 : 15', Água:'85 a 92 °C', Tempo:'1:30 a 2:00' },
    extrai:'Combina o corpo da imersão com a limpeza do papel. Dá para ir de um café leve e doce a um concentrado só mudando a receita.',
    best:['Versátil e tolerante a erros','Compacta, boa para viagem','Xícara limpa e doce'],
    worst:['Faz uma xícara por vez','Existem receitas demais, e isso confunde','Pressionar com força demais amarga'] },
  { id:'syphon', name:'Syphon', lead:'A cafeteira a vácuo: o vapor empurra a água para o balão de cima, o café fica em imersão e, ao tirar o calor, o vácuo puxa a bebida de volta pelo filtro.',
    spec:{ Moagem:'Média', 'M3 PRO':'14 a 18 cliques', Proporção:'1 : 15', Água:'91 a 94 °C', Tempo:'1:00 de infusão (≈ 2:30 no total)' },
    extrai:'A imersão em temperatura estável extrai doçura e aroma de forma bem uniforme, e o filtro de pano ou papel devolve uma xícara limpa, de corpo médio e aromas muito vivos.',
    best:['Temperatura estável durante toda a infusão','Xícara limpa e aromática, ótima para cafés florais','Um espetáculo na bancada'],
    worst:['Vidro frágil e muitas peças para lavar','Pede fonte de calor própria (lamparina, butano ou halogênio)','O filtro de pano precisa de cuidado para não pegar cheiro'] },
  { id:'melitta', name:'Melitta', lead:'O coador de fundo reto com poucos furinhos e filtro de papel, clássico das cozinhas brasileiras.',
    spec:{ Moagem:'Média', 'M3 PRO':'14 a 18 cliques', Proporção:'1 : 15', Água:'92 a 96 °C', Tempo:'3:00 a 4:00' },
    extrai:'Os furos pequenos seguram a água por mais tempo em contato com o pó, então sai um café com mais corpo e doçura que no V60, mantendo a limpeza do papel.',
    best:['Barato e fácil de achar em qualquer mercado','O fluxo controlado perdoa despejos irregulares','Filtro de papel acessível'],
    worst:['Pouco controle sobre o fluxo','Com moagem fina demais, entope e amarga','Menos clareza de acidez que os coadores de fluxo livre'] },
  { id:'pano', name:'Coador de pano', lead:'O coado de vó: um saco de flanela ou algodão preso num aro, por onde a água passa devagar.',
    spec:{ Moagem:'Média', 'M3 PRO':'14 a 18 cliques', Proporção:'1 : 14', Água:'92 a 96 °C', Tempo:'3:00 a 4:00' },
    extrai:'O pano deixa passar parte dos óleos que o papel seguraria, então a xícara ganha corpo e textura, mas continua sem borra.',
    best:['Mais corpo e textura que o coado de papel','Reutilizável e barato','Sabor afetivo, de café de casa'],
    worst:['Precisa ferver e secar bem o pano, senão pega cheiro','O pano envelhece e muda o fluxo','Difícil repetir a mesma xícara com precisão'] },
  { id:'v60', name:'V60', lead:'Filtro de papel, água despejada aos poucos e café passando por gravidade.',
    spec:{ Moagem:'Média-grossa', 'M3 PRO':'18 a 22 cliques', Proporção:'1 : 16', Água:'92 a 96 °C', Tempo:'2:30 a 3:15' },
    extrai:'O papel retém os óleos e a água sempre nova passando pelo café destaca acidez, notas florais, frutadas e uma doçura limpa.',
    best:['Clareza e complexidade de sabor','Controle total do despejo','Ótimo para cafés de torra clara'],
    worst:['Pede técnica e uma balança','Pequenas variações de moagem ou despejo mudam muito a xícara','Chaleira com bico fino ajuda bastante'],
    recipe:true },
  { id:'koar', name:'Koar', lead:'Coador brasileiro criado em Pernambuco, com 16 sulcos em onda que afastam o filtro de papel das paredes.',
    spec:{ Moagem:'Média-grossa', 'M3 PRO':'18 a 22 cliques', Proporção:'1 : 15', Água:'92 a 94 °C', Tempo:'2:30 a 3:00' },
    extrai:'Como o papel não gruda na parede, a água escoa rápido e por igual. A proposta do método é acentuar a doçura e suavizar a acidez, sem deixar o café amargar.',
    best:['Doçura em destaque e acidez suave','Fluxo rápido e uniforme, difícil de entupir','Feito no Brasil, em cerâmica, acrílico ou madeira'],
    worst:['Pede o filtro de papel próprio, tamanho 02','Com o fluxo rápido, moagem grossa demais deixa o café ralo','Tem menos receitas publicadas que o V60'] },
  { id:'kalita', name:'Kalita Wave', lead:'Coador de fundo chato com três furinhos e filtro de papel ondulado.',
    spec:{ Moagem:'Média-grossa', 'M3 PRO':'18 a 22 cliques', Proporção:'1 : 16', Água:'92 a 96 °C', Tempo:'3:00 a 3:30' },
    extrai:'O leito plano e as ondas do filtro fazem a água passar por igual pelo café, então a extração fica uniforme: doce, equilibrada e com acidez bem integrada.',
    best:['Extração uniforme e consistente','Perdoa mais o despejo que o V60','Xícara doce e redonda'],
    worst:['O filtro ondulado é mais caro e amassa fácil','Menos destaque para acidez e notas florais que o V60','Os furos pequenos entopem com moagem fina'] },
  { id:'b75', name:'B75', lead:'Coador de fundo chato da linha Crystal Eye, da Timemore, com parede a 75° e 20 ranhuras internas.',
    spec:{ Moagem:'Média-grossa', 'M3 PRO':'18 a 22 cliques', Proporção:'1 : 16', Água:'92 °C', Tempo:'2:30 a 3:15' },
    extrai:'O fundo plano e as ranhuras controlam o fluxo e mantêm o leito uniforme. A água desce um pouco mais devagar que no V60, e a xícara sai mais doce e redonda, sem perder clareza.',
    best:['Doçura e corpo com a limpeza do papel','Um despejo contínuo já funciona bem','Aceita filtros tipo cesta, como o Kalita 155'],
    worst:['Poucas receitas próprias: muita gente usa as do April Brewer','Mais caro e difícil de achar no Brasil','Faz 1 a 2 xícaras por vez'] },
  { id:'clever', name:'Clever', lead:'Coador com válvula no fundo: o café fica em imersão e só escoa quando você apoia o coador na xícara.',
    spec:{ Moagem:'Média-grossa', 'M3 PRO':'18 a 22 cliques', Proporção:'1 : 16', Água:'93 a 96 °C', Tempo:'3:00 a 3:30' },
    extrai:'Junta o corpo e a doçura da imersão, como na prensa, com a limpeza do filtro de papel. A extração é estável porque o tempo de contato não depende do seu despejo.',
    best:['Quase impossível de errar','Corpo de prensa com xícara limpa','Usa filtro de papel comum'],
    worst:['Menos acidez e brilho que um coado de fluxo livre','A válvula precisa de limpeza para não vazar','A maioria dos modelos é de plástico'] },
  { id:'chemex', name:'Chemex', lead:'Funil de vidro com um filtro bem mais grosso que o do V60.',
    spec:{ Moagem:'Grossa', 'M3 PRO':'22 a 25 cliques', Proporção:'1 : 16', Água:'93 a 96 °C', Tempo:'4:00' },
    extrai:'O filtro grosso segura mais óleos e finos, resultando em uma xícara muito limpa, leve e com acidez delicada.',
    best:['Limpeza e brilho no sabor','Ótima para servir 2 a 4 pessoas','Linda na mesa'],
    worst:['Mais lenta que o V60','Filtro mais caro e vidro frágil','Corpo mais leve, o que pode soar aguado para quem gosta de café encorpado'] },
  { id:'french', name:'Prensa francesa', lead:'Imersão total com filtro metálico: café e água ficam juntos até o êmbolo descer.',
    spec:{ Moagem:'Bem grossa', 'M3 PRO':'25 a 29 cliques', Proporção:'1 : 15', Água:'93 °C', Tempo:'4:00' },
    extrai:'Todos os óleos e finos passam pelo metal, então a bebida fica encorpada, redonda e com acidez baixa.',
    best:['Muito simples e difícil de errar','Corpo e textura cheios','Não gasta filtro de papel'],
    worst:['Sedimento no fundo da xícara','Menos clareza de sabor','Continua extraindo se o café ficar na prensa, então sirva tudo logo'] },
  { id:'cold', name:'Cold brew', lead:'Imersão em água fria ou gelada por horas.',
    spec:{ Moagem:'Extragrossa', 'M3 PRO':'28 a 30 cliques', Proporção:'1 : 8 (concentrado)', Água:'Ambiente ou geladeira', Tempo:'12 a 18 h' },
    extrai:'A água fria puxa pouca acidez e pouco amargor. Sai um café doce, suave e achocolatado, com menos aromas voláteis.',
    best:['Suave, doce e de baixa acidez','Concentrado rende várias doses','Perfeito para dias quentes'],
    worst:['Leva horas e pede planejamento','Menos aroma e complexidade','Guarde sempre na geladeira e consuma em poucos dias'] }
];

/* Local de origem de cada método: [código da bandeira (ISO), país, detalhe] */
const ORIGIN = {
  ibrik:    ['tr', 'Turquia', 'Império Otomano, séc. XVI'],
  espresso: ['it', 'Itália', 'Turim e Milão, de 1884 a 1901'],
  moka:     ['it', 'Itália', 'Alfonso Bialetti, 1933'],
  aero:     ['us', 'Estados Unidos', 'Alan Adler, Califórnia, 2005'],
  syphon:   ['de', 'Alemanha', 'Loeff, Berlim, década de 1830'],
  melitta:  ['de', 'Alemanha', 'Melitta Bentz, Dresden, 1908'],
  pano:     ['br', 'Brasil', 'Tradição das cozinhas brasileiras'],
  v60:      ['jp', 'Japão', 'Hario, 2004'],
  koar:     ['br', 'Brasil', 'Pernambuco, 2017'],
  kalita:   ['jp', 'Japão', 'Kalita, Yokohama'],
  b75:      ['cn', 'China', 'Timemore, linha Crystal Eye'],
  clever:   ['tw', 'Taiwan', 'Anos 2000'],
  chemex:   ['us', 'Estados Unidos', 'Peter Schlumbohm, 1941'],
  french:   ['fr', 'França', 'Mayer e Delforge, Paris, 1852'],
  cold:     ['jp', 'Japão', 'Estilo Kyoto, séc. XVII (a versão mais citada)']
};
const flag = id => `<span class="fi fi-${ORIGIN[id][0]} shrink-0 rounded-[2px] shadow-sm" aria-hidden="true"></span>`;

/* Receita padrão de V60 (despejos em gramas; "total" é a soma) */
const V60_STEPS = [
  { t:'0:00', s:0,   g:70,  note:'Blooming: molhe tudo e espere' },
  { t:'0:30', s:30,  g:100, note:'Despejo' },
  { t:'1:45', s:105, g:80,  note:'Despejo' },
  { t:'2:45', s:165, g:50,  note:'Despejo' },
  { t:'3:15', s:195, g:0,   note:'Fim da extração' }
];

const $ = id => document.getElementById(id);

$('jump').innerHTML = M.map(m => `<a href="#${m.id}" class="rounded-full border border-cream/20 bg-moss px-3.5 py-1.5 text-sm font-medium hover:border-amber hover:text-amber focus-visible:outline-2 focus-visible:outline-amber">${m.name}</a>`).join('');

function recipeHTML() {
  let acc = 0;
  const rows = V60_STEPS.map(r => { acc += r.g; return `
    <tr class="border-t border-cream/10"><td class="py-2 pr-4 font-semibold tabular-nums">${r.t}</td><td class="py-2 pr-4">${r.note}</td>
    <td class="py-2 pr-4 tabular-nums">${r.g ? r.g + ' g' : '–'}</td><td class="py-2 tabular-nums text-cream/60">${r.g ? acc + ' g' : acc + ' g no total'}</td></tr>`; }).join('');
  const total = V60_STEPS.reduce((a, r) => a + r.g, 0), end = V60_STEPS[V60_STEPS.length - 1].s;
  const marks = V60_STEPS.slice(0, -1).map(r => `<span class="absolute top-0 h-full -translate-x-1/2" style="left:${(r.s / end * 100).toFixed(1)}%"><span class="block h-4 w-1 rounded-full bg-amber"></span></span>`).join('');
  return `
  <div class="mt-8 rounded-3xl bg-roast p-6 text-cream sm:p-8 frame">
    <h3 class="text-2xl font-bold">Receita da casa para o V60</h3>
    <p class="mt-1 text-sm text-cream/70">Total de ${total} g de água em ${V60_STEPS[V60_STEPS.length - 1].t}. Para 20 g de café, dá 1 : 15.</p>
    <div class="relative mt-5 h-4 rounded-full bg-cream/15" role="img" aria-label="Linha do tempo: despejos em 0:00, 0:30, 1:45 e 2:45, fim em 3:15">${marks}</div>
    <div class="mt-1 flex justify-between text-xs text-cream/60"><span>0:00</span><span>3:15</span></div>
    <div class="mt-4 overflow-x-auto"><table class="w-full min-w-[22rem] text-left text-sm">
      <thead class="text-cream/60"><tr><th class="py-1 pr-4 font-medium">Quando</th><th class="py-1 pr-4 font-medium">Etapa</th><th class="py-1 pr-4 font-medium">Despejar</th><th class="py-1 font-medium">Na balança</th></tr></thead>
      <tbody>${rows}</tbody></table></div>
  </div>`;
}

$('list').innerHTML = M.map(m => `
  <article id="${m.id}" class="scroll-mt-6 border-t border-cream/15 py-12">
    <div class="grid gap-8 lg:grid-cols-[18rem_1fr]">
      <div>
        <h2 class="text-3xl font-bold sm:text-4xl">${m.name}</h2>
        <p class="mt-2 flex items-center gap-2 text-sm"><span class="text-lg leading-none">${flag(m.id)}</span><span><span class="text-cream/60">Origem:</span> <strong class="text-amber">${ORIGIN[m.id][1]}</strong> · <span class="text-cream/75">${ORIGIN[m.id][2]}</span></span></p>
        <p class="mt-3 text-cream/75">${m.lead}</p>
        <dl class="mt-5 divide-y divide-cream/10 text-sm">
          ${Object.entries(m.spec).map(([k, v]) => `<div class="flex justify-between gap-4 py-2"><dt class="text-cream/60">${k}</dt><dd class="text-right font-semibold">${v}</dd></div>`).join('')}
        </dl>
      </div>
      <div>
        <h3 class="text-lg font-bold">O que ele extrai</h3>
        <p class="mt-1 max-w-prose text-cream/80">${m.extrai}</p>
        <div class="mt-6 grid gap-6 sm:grid-cols-2">
          <div><h3 class="font-bold text-leaf">O que tem de melhor</h3>
            <ul class="mt-2 space-y-2 text-sm">${m.best.map(x => `<li class="border-l-2 border-leaf pl-3">${x}</li>`).join('')}</ul></div>
          <div><h3 class="font-bold text-rust">O que tem de pior</h3>
            <ul class="mt-2 space-y-2 text-sm">${m.worst.map(x => `<li class="border-l-2 border-rust pl-3">${x}</li>`).join('')}</ul></div>
        </div>
        ${m.recipe ? recipeHTML() : ''}
        <a href="index.html?m=${m.id}#calculadora" class="mt-6 inline-block text-sm font-semibold underline underline-offset-4 hover:text-amber focus-visible:outline-2 focus-visible:outline-amber">Calcular a receita de ${m.name}</a>
      </div>
    </div>
  </article>`).join('');

/* Atalhos extras no topo */
const chip = (h, t) => `<a href="${h}" class="rounded-full border border-cream/20 bg-moss px-3.5 py-1.5 text-sm font-medium hover:border-amber hover:text-amber focus-visible:outline-2 focus-visible:outline-amber">${t}</a>`;
$('jump').insertAdjacentHTML('afterbegin', chip('#comparar', 'Lado a lado'));
$('jump').insertAdjacentHTML('beforeend', chip('legends.html', '★ Coffee Legends'));

/* Tabela comparativa */
$('compare').innerHTML = `
  <thead class="text-sm text-cream/60"><tr>${['Método', 'Origem', 'Moagem', 'M3 PRO', 'Proporção', 'Água', 'Tempo'].map(h => `<th class="py-2 pr-4 font-medium">${h}</th>`).join('')}</tr></thead>
  <tbody>${M.map(m => `<tr class="border-t border-cream/10">
    <td class="py-3 pr-4"><a href="#${m.id}" class="font-display text-lg font-bold underline-offset-4 hover:text-amber hover:underline focus-visible:outline-2 focus-visible:outline-amber">${m.name}</a></td>
    <td class="py-3 pr-4"><span class="flex items-center gap-2 whitespace-nowrap">${flag(m.id)}${ORIGIN[m.id][1]}</span></td>
    ${['Moagem', 'M3 PRO', 'Proporção', 'Água', 'Tempo'].map(k => `<td class="py-3 pr-4">${m.spec[k]}</td>`).join('')}</tr>`).join('')}</tbody>`;
