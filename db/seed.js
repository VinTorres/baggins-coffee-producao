/* Dados iniciais: as casas e os cafés que já estavam no site. */
export const EMPRESAS = [
  { slug:'moka-clube', nome:'Moka Clube', cidade:'Pinhais (PR)', site:'https://www.mokaclube.com.br',
    sobre:'Primeiro clube de assinatura de cafés especiais do Brasil, nascido em 2012 na região de Curitiba (PR). Torra tudo na própria fábrica, em Pinhais, trabalha com cafés 100% arábica de 84 pontos ou mais e não usa aditivos nem aromatizantes. As torras costumam ser médias, e a única escura é o Mezzanotte.' },
  { slug:'oh-bruder', nome:'Oh Brüder', cidade:'Porto Alegre (RS)', site:'https://ohbruder.com',
    sobre:'Cafeteria e microtorrefação de Porto Alegre (RS), criada em 2019. O nome significa "irmãos" em alemão, e o símbolo Ü representa a conexão entre as pessoas. Seleciona grãos de produtores brasileiros e torra na própria casa.' }
];

export const CAFES = [
  { slug:'bala-de-caramelo', nome:'Café Bala de Caramelo', empresa:'moka-clube', pais:'br', torra:'Costuma ser média, padrão do Moka',
    notas:['Caramelo', 'Baunilha', 'Doce de leite'],
    detalhes:[['Origem e processo', 'Confira na embalagem']],
    sobre:'Um dos cafés mais queridos do Moka Clube: já foi escolhido como base de sorvete de café e de bebidas em uma colaboração com uma rede de sorveterias, e cafeterias o usam no espresso. As notas de caramelo, baunilha e doce de leite fazem dele um café de perfil doce e confortável, que também combina com leite.',
    preparos:[{ m:'espresso', p:'doce' }, { m:'moka', p:'doce' }, { m:'v60', p:'doce' }],
    observacao:'Não encontrei a origem nem o processo deste lote nas páginas que consultei.' },
  { slug:'moranguete', nome:'Café Moranguete', empresa:'moka-clube', pais:'br', regiao:'Alta Mogiana (Ribeirão Corrente, SP)',
    notas:['Morango', 'Chocolate'],
    detalhes:[['Variedade', 'Obatã Vermelho, em uma safra anterior'], ['Corpo e acidez', 'Corpo médio, acidez equilibrada'], ['Linha', 'Microlote']],
    sobre:'O Moka o chama de café traquinas: tem nome de chocolate de infância e uma mistura de frutado vermelho com chocolate. Clientes comentam que o aroma de morango aparece até no pó moído, e o café costuma ser descrito como fermentado, então vale começar por um pacote menor se você prefere cafés mais tradicionais. A página do Moka indica que ele voltou em 2026 e o sugere para coado e cafeteira italiana.',
    preparos:[{ m:'v60', p:'fru' }, { m:'moka', p:'doce' }],
    observacao:'A variedade vem de uma descrição de safra anterior e pode mudar de lote para lote.' },
  { slug:'dolce-cerrado', nome:'Café Dolce Cerrado', empresa:'moka-clube', pais:'br', regiao:'Cerrado Mineiro (MG)', processo:'Natural, como os lotes campeões da categoria',
    notas:['Chocolate', 'Caramelo', 'Amêndoas', 'Acidez cítrica'],
    detalhes:[['Lote', 'Provavelmente o da cooperativa Carpec']],
    sobre:'O nome remete à categoria Doce Cerrado Mineiro, criada no 13º Prêmio Região do Cerrado Mineiro (novembro de 2025), primeiro concurso nacional que valoriza a doçura natural como identidade do café. Os lotes campeões são da safra 2025/2026, de processo natural, com chocolate, caramelo, amêndoas e acidez cítrica. O Moka anunciou o lançamento do lote da Carpec, e uma torrefação que lançou outro lote da categoria diz que esse perfil funciona tanto no espresso quanto no coado.',
    preparos:[{ m:'v60', p:'doce' }, { m:'espresso', p:'doce' }],
    observacao:'Não achei a página do produto: as notas acima são da categoria. Confirme o lote na embalagem.' },
  { slug:'jesus-coffee', nome:'Jesus Coffee', empresa:'oh-bruder', pais:'br', processo:'Natural anaeróbico',
    notas:['Damasco', 'Chocolate', 'Laranja'],
    detalhes:[['Embalagem', '250 g']],
    sobre:'Café especial da Oh Brüder feito em fermentação anaeróbica, em lote natural. Esse tipo de processo costuma realçar a doçura e deixar o frutado mais marcado, aqui com damasco e laranja, enquanto o chocolate segura o fundo da xícara.',
    preparos:[{ m:'v60', p:'fru' }, { m:'aero', p:'fru' }],
    observacao:'Dados da loja online da Oh Brüder.' }
];
