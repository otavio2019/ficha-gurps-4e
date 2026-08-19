# Nota de Atualização — Códice de Campo

**Ficha digital GURPS 4e** · Atualização consolidada em 19 de agosto de 2026

> O **Códice de Campo** evoluiu de uma ficha editável para uma ferramenta de campanha com personagens múltiplos, cálculos automáticos, combate integrado, biblioteca Homebrew e suporte ampliado para mesa presencial ou remota.

## Visão geral da entrega

A aplicação passou a usar uma estrutura de navegação por abas, preservando o visual em **preto, vermelho lacre e branco**. A ficha pode ser usada tanto em desktop quanto em celular, com painéis separados para os dados do personagem, combate, poderes, inventário, aliados, missões, Homebrew e diário de sessão.

| Área | Entregas concluídas |
|---|---|
| Navegação | Dez abas principais, barra lateral agrupada em Personagem, Combate, Campanha e Personalização, além de seletor móvel. |
| Visão geral | Recursos, atributos, pontos, traços, perícias e equipamento preparado em leitura rápida. |
| Perícias e traços | Catálogo de 263 perícias e 60 vantagens/desvantagens, com pesquisa e preenchimento automático. |
| Combate | Ataques, regiões de proteção, condições, rolagens 3d6, dano e resultado de sessão. |
| Poderes | NH automático, vínculo com perícia, custo de FP, tipos, dano, duração, resistência e integração com Combate. |
| Inventário | Categorias táticas, mão utilizada, modificadores, descrições e carga calculada. |
| Aliados | Mini-ficha com seis abas internas, atributos, perícias, ataques, inventário e recursos próprios. |
| Homebrew | Biblioteca por categorias, busca, filtros, editor dinâmico e aplicação de conteúdos compatíveis. |
| Exportação | JSON estruturado e PDF A4 com composição impressa corrigida. |

## Organização e uso da ficha

A barra lateral foi reorganizada para acompanhar o fluxo de jogo. **Personagem** reúne Visão geral, Características e Perícias; **Combate** concentra Combate, Poderes e Equipamento; **Campanha** abriga Aliados, Missões e Diário; enquanto **Personalização** mantém o Homebrew. Em telas estreitas, o seletor móvel mantém as mesmas dez abas acessíveis sem transformar a ficha em uma página longa.

A Visão geral agora funciona como ponto de partida da sessão. Ela mostra atributos, PV, PF, Esquiva, Movimento, pontos disponíveis, traços prioritários, perícias de destaque e equipamento preparado. Os recursos contam com edição direta e ajustes de **−5, −1, +1 e +5**, com cada alteração registrada no Diário.

## Regras automáticas e catálogos

O cálculo de **NH** foi centralizado para perícias, ataques e poderes. A regra considera atributo, dificuldade, pontos investidos, nível relativo e bônus extra. Ataques e poderes podem apontar para uma perícia vinculada, mantendo um valor manual como alternativa quando necessário.

O banco de dados de perícias contém **263 entradas em português brasileiro**, com nomes originais, dificuldades, atributos, descrições e busca. O catálogo de traços reúne **60 vantagens e desvantagens**, também pesquisáveis e utilizáveis na ficha principal ou na mini-ficha de Aliados.

| Recurso | Comportamento atual |
|---|---|
| Perícia | NH calculado automaticamente, bônus extra e descrição editável. |
| Ataque | Pode usar NH manual ou NH da perícia vinculada; possui dano, alcance e aparar. |
| Poder | Calcula NH, pode gastar FP, definir dano/efeito e aparecer no Combate. |
| Aliado | Replica as regras de NH para perícias e ataques em sua mini-ficha. |

## Combate, rolagens e Poderes

O motor de rolagens centralizado suporta testes **3d6**, sucesso ou falha, margem e rolagens de dano por expressão. O painel de Combate apresenta o último resultado e o Diário mantém um histórico cronológico das ações realizadas.

Poderes foram separados nos grupos **Ofensivo, Defensivo, Controle e Utilidade**. Quando um poder está pronto para combate, ele aparece também no painel de Combate, respeita o custo de FP, executa a rolagem e registra a ação. A validação local confirmou os quatro grupos tanto em desktop quanto em 375 × 812 px, com redução de FP e resultado 3d6 funcionando.

A proteção corporal inclui um mapa humano clicável com **11 regiões**, permitindo selecionar áreas e definir DR e fonte de proteção. Condições de cena, ataques, danos e defesas permanecem reunidos no mesmo contexto de uso.

## Inventário e Aliados

O inventário foi convertido em estrutura tática por categorias: **Armas, Armaduras, Consumíveis, Ferramentas, Itens-chave e Outros**. Cada item oferece quantidade, peso, estado carregado/equipado, mão utilizada, bônus ou penalidade e descrição. A carga atual influencia os indicadores derivados de Movimento e Esquiva.

Os Aliados funcionam como mini-personagens. Cada um possui as abas **Visão geral, Atributos, Características, Perícias, Combate e Inventário**, com PV, PF, ataques, traços e equipamento próprios. A ficha de Aliado foi ajustada para celular, evitando que os atributos ultrapassem suas células e garantindo uma faixa de abas internas rolável.

## Biblioteca Homebrew e Raças

A área Homebrew agora é uma biblioteca de campanha com busca, filtros, tags, cards, visualização detalhada e editor por tipo. Estão disponíveis as categorias Regra, Raça, Vantagem, Desvantagem, Perícia, Poder, Magia, Técnica, Equipamentos, Arma, Armadura, NPC e Nota.

Conteúdos compatíveis podem ser adicionados diretamente à ficha. Raças Homebrew podem alterar ST, DX, IQ, HT, vantagens e desvantagens de forma reversível, preservando a raça anterior para que o personagem possa retornar ao estado original.

## Exportações, compartilhamento e retrato

O arquivo **JSON** exportado contém uma versão de esquema, os dados completos da ficha e os cálculos derivados. A exportação em **PDF** foi ajustada para que o conteúdo ativo se distribua corretamente pelas páginas A4, sem uma primeira página vazia. As descrições de itens da ficha e do inventário de Aliados foram verificadas nos dois formatos.

A aplicação já inclui autenticação Manus OAuth, links públicos de visualização simplificada, sincronização em tempo real e upload de retrato por personagem. As funcionalidades existem no projeto; no entanto, as verificações ponta a ponta que dependem de uma sessão autenticada — login, envio de retrato, criação de link e sincronização entre sessões — continuam registradas como pendentes de confirmação manual.

## Qualidade e validações realizadas

As validações locais cobriram desktop e celular, incluindo a largura de **375 × 812 px**. As dez abas foram abertas sem overflow horizontal, e os controles móveis visíveis foram ajustados para um mínimo de **10,24 px** de tipografia. A última suíte completa executada concluiu **43 testes automatizados** com êxito, além de verificação de tipos e compilação de produção.

| Validação local | Resultado |
|---|---|
| Navegação das dez abas | Aprovada em desktop e celular. |
| Legibilidade e overflow móvel | Aprovada; controles ampliados onde necessário. |
| Poderes e Combate | Aprovados; grupos, FP e rolagem 3d6 confirmados. |
| Aliados | Aprovados; seis abas internas e ajuste de PV confirmados. |
| Inventário | Aprovado; categorias e campos táticos confirmados. |
| Exportação JSON/PDF | Aprovada; estrutura, descrições e primeira página do PDF confirmadas. |
| Persistência local | Aprovada após recarga do navegador para PV e descrições. |

## Confirmações manuais autenticadas

As validações que dependem da conta e do armazenamento em nuvem foram confirmadas manualmente pelo usuário em 19 de agosto de 2026. O login, perfil, saída e links compartilhados funcionaram; o retrato foi atualizado na ficha, na biblioteca e no link público; as descrições foram salvas, reabertas e sincronizadas; e os poderes foram exibidos corretamente na visualização compartilhada.

Com isso, todas as tarefas registradas no acompanhamento da ficha estão concluídas. O repositório GitHub será sincronizado com esta finalização, conforme solicitado.

---

**Versão publicada de referência:** `245fb364`  
**Endereço da aplicação:** <https://gurps4e-hgjqjucn.manus.space>
