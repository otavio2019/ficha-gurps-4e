# Direção de Design — Ficha GURPS 4e

## Três abordagens exploradas

| Tema | Introdução breve | Probabilidade |
| --- | --- | ---: |
| **Códice de Campo** | Uma mesa de jogo tática que encontra um caderno de campanha bem usado: papel mineral, tinta escura, números precisos e marcadores de risco. | 0,07 |
| **Oráculo Ártico** | Um painel claro e etéreo com dados translúcidos, tipografia leve e referências discretas a mapas celestes. | 0,03 |
| **Terminal de Guilda** | Um registro administrativo de aventura em tom sépia e verde-escuro, com cartões modulares e hierarquia inspirada em arquivos de expedições. | 0,09 |

## Abordagem escolhida: Códice de Campo

### Movimento de design

**Neoeditorial utilitário**, inspirado em cadernos de campanha, fichas técnicas e livros-jogo de mesa. A interface deve ser confiável durante a sessão, com aparência tátil, organização severa e pequenos sinais de aventura.

### Princípios centrais

1. **Informação antes de ornamento:** valores de jogo, estados e ações prioritárias devem ser localizados em segundos.
2. **Densidade legível:** a tela acomoda uma ficha rica sem parecer uma planilha genérica, usando ritmo tipográfico, divisores e blocos funcionais.
3. **Materialidade discreta:** tons minerais, papel sutil e contornos de tinta sugerem um códice, sem prejudicar contraste ou desempenho.
4. **Estado sempre visível:** HP, FP, Dodge, Move e pontos permanecem acessíveis como instrumentos de mesa.

### Filosofia de cor

O fundo em **papel-argila claro** reduz fadiga visual em sessões longas. A tinta **azul-noite** carrega a maior parte do conteúdo, enquanto o **vermelho lacre** identifica perigo, gasto de recursos e dano. O **verde-musgo** é reservado para confirmação, recuperação e estados ativos. A paleta evita fantasia genérica: a cor comunica função antes de clima.

### Paradigma de layout

Uma **bancada lateral** em vez de um dashboard centralizado. A navegação vertical esquerda funciona como índice do códice; o corpo da ficha se organiza em colunas de largura desigual, com o resumo numérico ancorado à direita em telas grandes. Em dispositivos menores, o índice vira uma faixa horizontal e as seções fluem em uma única coluna.

### Elementos de assinatura

1. **Marcadores de margem:** tiras verticais com siglas de seção, como abas de um livro de referência.
2. **Réguas de recurso:** HP e FP desenhados como medidores físicos, com faixas de risco contextualizadas.
3. **Selos de ação:** botões de rolagem e combate usam um pequeno motivo de d20/3d6 geométrico, sem texto dentro da marca.

### Filosofia de interação

As interações devem refletir uma mesa de jogo: editar é direto, rolar dados fornece um retorno inequívoco e alterações de recursos deixam uma trilha de evento. Ajustes rápidos são priorizados sobre formulários longos, enquanto o salvamento local acontece sem interromper o fluxo.

### Animação

As transições são curtas e funcionais. Painéis entram com deslocamento leve e opacidade em até 220 ms; modificações de HP/FP piscam brevemente na cor semântica; rolagens recebem apenas uma pequena rotação e escala, sem efeitos chamativos. Toda animação respeita `prefers-reduced-motion`.

### Sistema tipográfico

**DM Serif Display** atua nos títulos de seção e no nome do personagem, trazendo a sensação editorial. **IBM Plex Sans** é o corpo e a interface, escolhida por sua excelente leitura em números, tabelas e campos compactos. Números-chave usam peso semibold e espaçamento levemente expandido; rótulos curtos são em caixa alta com tracking controlado.

### Essência da marca

**Ficha GURPS 4e é o códice de mesa para jogadores que querem administrar personagens complexos sem perder o ritmo da aventura.**

Personalidade: **tática, serena e precisa**.

### Voz da marca

O texto é objetivo e cumplice de quem está em jogo. Títulos usam verbos e substância; microcopy explica consequências, não repete o óbvio. Não usar frases vazias de onboarding.

Exemplos:

> “O que seu personagem carrega para a próxima cena?”

> “Aplicar 3 de dano e registrar no histórico.”

### Logotipo e símbolo

Um **selo geométrico em forma de escudo aberto**, composto por três losangos/dados alinhados em uma moldura de livro. O símbolo não traz texto, funciona como favicon e marca de navegação, e sugere tanto proteção quanto uma rolagem 3d6.

### Cor assinatura

**Vermelho Lacre — `#B5373A`**. Uma cor de decisão: dano, gasto, urgência e o selo da marca.

## Decisões de produto da primeira entrega

O MVP prioriza uma ficha individual e persistente no navegador, não uma plataforma multiplayer. Ele cobre identificação, atributos, características secundárias, pontos, vantagens, desvantagens, perícias, armas, equipamento, carga, recursos de combate e log de sessão. Modelos, magia, poderes, campanhas compartilhadas e um banco completo de suplementos permanecem preparados conceitualmente, mas fora deste primeiro recorte estático.

## Style Decisions

- Em telas grandes, a ficha deve se comportar visualmente como um **códice de campo indexado à esquerda**, com abas de margem, numeração de folhas e navegação persistente.
- O símbolo de **escudo aberto e 3d6** é o dispositivo recorrente da marca: ele entra nos marcadores de seção, na navegação, nas ações de rolagem e no painel de sessão.
- A materialidade de códice vem antes do acabamento de dashboard: linhas de tinta, réguas, carimbos, tabelas e ritmo de livro-caixa definem a hierarquia; sombras e cantos arredondados permanecem discretos.
