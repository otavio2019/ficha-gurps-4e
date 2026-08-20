# Nota de Atualização — Códice de Campo

**Ficha digital para GURPS 4ª edição** · Atualizada em **20 de agosto de 2026**

> O **Códice de Campo** passou a reunir construção de personagem, combate, Homebrew, aliados, inventário, missões e compartilhamento em uma única ficha editável, responsiva e voltada ao uso durante a sessão.

## Destaques da atualização atual

Esta rodada amplia as Raças Homebrew, corrige a organização visual da ficha e padroniza a navegação. O editor de raças agora aceita modificadores para **Vontade, Percepção, Velocidade, Movimento e Esquiva**, além de ST, DX, IQ e HT. Ao aplicar uma raça, todos os ajustes são incorporados à ficha; ao removê-la, atributos, subatributos e traços retornam ao estado anterior sem duplicações.

A navegação foi reorganizada em uma sequência contínua de **01 a 10**, igual na barra lateral, no seletor móvel e no cabeçalho de cada aba. A Visão geral também foi compactada para que os painéis de identidade e atributos usem apenas a altura necessária, eliminando espaços vazios e melhorando o enquadramento em desktop e celular.

| Área | Entregas atuais |
|---|---|
| Raças Homebrew | Modificadores reversíveis de atributos e subatributos, vantagens, desvantagens e características. |
| Navegação | Numeração contínua: Visão geral 01 até Homebrew 10. |
| Interface | Painéis mais compactos, retrato centralizado no celular e ausência de faixa inferior sobreposta. |
| Validação | Aplicação e reversão de raça, numeração e responsividade confirmadas em 1280×720 e 375×812. |

## Personagem, recursos e combate

A ficha principal mantém os cálculos de **NH** para perícias, ataques e poderes. O NH considera atributo, dificuldade, pontos, nível relativo e bônus adicional. Ataques e poderes podem ser vinculados a perícias e ainda conservar um valor manual quando necessário.

O combate inclui mapa corporal com 11 regiões de proteção, condições rápidas, efeitos temporários com severidade e duração, rolagens 3d6, margem de sucesso ou falha e dano por expressão. Golpe e Balanço são calculados automaticamente pela ST e aceitam bônus independentes para cada dano.

Além de PV e PF, a ficha suporta **energias personalizadas** criadas pelo Homebrew. Cada energia possui máximo-base, bônus, máximo final, valor atual, afinidade e descrição. Esses recursos podem pagar poderes, são registrados no Diário e aparecem na visualização compartilhada.

## Aliados e compartilhamento

Aliados contam com mini-ficha em seis abas: Visão geral, Atributos, Características, Perícias, Combate e Inventário. Os subatributos do aliado — Vontade, Percepção, Velocidade, Movimento e Esquiva — são editáveis. Cada aliado também pode receber retrato próprio, com envio, substituição, remoção e exibição no link público.

O compartilhamento público apresenta a ficha em blocos simplificados, incluindo recursos, energias personalizadas, atributos, combate, poderes, inventário, missões, Homebrew e mini-fichas de aliados. A sincronização usa autenticação da plataforma e atualização em tempo real para fichas compartilhadas.

## Biblioteca Homebrew e campanha

A biblioteca Homebrew reúne Regra, Raça, Vantagem, Desvantagem, Perícia, Poder, Magia, Energia, Técnica, Equipamentos, Arma, Armadura, NPC e Nota. Ela oferece busca por nome, descrição e tags, filtros por categoria, editor dinâmico, visualização detalhada e aplicação direta de conteúdos compatíveis na ficha.

As Missões aceitam dificuldades padrão ou personalizadas pela mesa, registram recompensas e podem aplicar pontos ao orçamento do personagem. O Diário mantém o histórico de gastos de recursos, rolagens, efeitos, missões e ações relevantes da sessão.

## Inventário e peso universal

O inventário tático usa categorias reais, campos para mão utilizada, estado carregado/equipado, modificadores, descrição e peso em **quilogramas**. A carga atual afeta Movimento e Esquiva, e o atalho **Mochila** adiciona uma mochila de campanha já configurada como ferramenta carregada.

## Qualidade e validações

As telas foram verificadas em desktop e celular, com atenção ao viewport de **375×812**. A navegação, os novos subatributos raciais, a reversão de raça, a numeração, o inventário em kg, os bônus de energia e os danos por ST foram validados sem overflow horizontal.

| Verificação | Resultado |
|---|---|
| Tipagem TypeScript | Aprovada. |
| Testes automatizados | **54 testes** em 21 arquivos aprovados. |
| Aplicação e remoção de raça | Aprovadas, inclusive para os cinco subatributos. |
| Numeração 01–10 | Aprovada na barra lateral, seletor móvel e cabeçalhos. |
| Responsividade | Aprovada em 1280×720 e 375×812, sem sobreposição. |

---

**Versão publicada de referência:** `5860afe5`  
**Aplicação:** <https://gurps4e-hgjqjucn.manus.space>  
**Repositório:** <https://github.com/otavio2019/ficha-gurps-4e>
