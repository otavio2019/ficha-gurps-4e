# Pendências da exportação

- [x] Definir os dados e o nome de arquivo usados nas exportações.
- [x] Adicionar botão para baixar a ficha editável em JSON.
- [x] Adicionar impressão otimizada para salvar a ficha em PDF.
- [x] Validar o conteúdo exportado e o layout de impressão.

## Biblioteca de personagens

- [x] Criar uma tela inicial para listar as fichas salvas.
- [x] Permitir criar, abrir, duplicar e excluir personagens.
- [x] Salvar cada ficha separadamente no navegador.
- [x] Validar a navegação entre menu principal e ficha individual.

## Colaboração e tema escuro

- [x] Atualizar a identidade visual para preto, vermelho e painéis táticos.
- [x] Permitir enviar e salvar um retrato para cada personagem.
- [x] Persistir fichas e permissões em dados compartilhados.
- [x] Criar um link de compartilhamento com acesso de visualização.
- [x] Sincronizar edições de ficha em tempo real entre participantes.
- [x] Validar o fluxo de colaboração e a atualização de dados ao vivo.
- [x] Implementar sincronização instantânea com WebSocket para fichas e links compartilhados.
- [x] Validar a conexão, as salas e o evento WebSocket em teste automatizado.
- [x] Remover a dependência de polling da ficha autenticada, mantendo apenas reconexão por evento.
- [ ] Validar ponta a ponta login, upload de retrato, link público e atualização em outra sessão.

## Acesso e fichas compartilhadas

- [x] Criar um menu de cadastro e login baseado na conta da aplicação.
- [x] Exibir o perfil conectado, a saída de conta e o estado de sincronização.
- [x] Organizar fichas próprias e links compartilhados no menu principal.
- [x] Exibir no menu principal um resumo separado das fichas com link público ativo.
- [x] Validar a navegação de acesso e os estados autenticado e visitante.
- [ ] Confirmar no navegador o perfil conectado, a saída e a seção de links compartilhados após login.

## Correção de retrato

- [ ] Corrigir o upload e a atualização visual do retrato do personagem.
- [ ] Confirmar que o retrato enviado atualiza a API, a biblioteca e o link compartilhado.
- [ ] Validar o retrato novo na ficha, na biblioteca e no link compartilhado.

## Proteção corporal

- [x] Corrigir o acionamento do seletor de imagem do retrato.
- [x] Criar um mapa de corpo humano com regiões de proteção clicáveis e DR por local.
- [x] Validar o retrato e as regiões de proteção na ficha de combate.

## Aliados GURPS

- [x] Adicionar aliados à estrutura da ficha e ao salvamento compartilhado.
- [x] Criar uma seção de aliados com nome, relação, pontos, PV, descrição e estado.
- [x] Permitir adicionar, editar, remover e ajustar os PV de aliados durante a sessão.
- [x] Validar o painel de aliados em desktop e celular.

## Mini-ficha de aliado

- [x] Expandir o modelo de aliado com identificação, atributos e dados específicos de Ally.
- [x] Criar abas ou menu lateral interno para visão geral, atributos, características, perícias, combate e inventário do aliado.
- [x] Garantir que todos os campos e controles do aliado apareçam somente na aba interna correspondente.
- [x] Calcular custo de Ally por porcentagem de pontos e frequência de aparecimento.
- [x] Permitir editar os dados da mini-ficha e manter a integração com a sessão principal.
- [x] Validar a navegação e a mini-ficha de aliado em desktop e celular.
- [x] Corrigir a grade da mini-ficha de aliado para evitar overflow e melhorar a distribuição de atributos e recursos.
- [x] Adicionar exclusão individual para vantagens, desvantagens, perícias e ataques da mini-ficha de aliado.

## Navegação integral da ficha

- [x] Converter Visão geral, Combate, Características, Perícias, Equipamento, Aliados e Diário em seções exclusivas de um menu lateral interno.
- [x] Remover a rolagem longa da ficha e manter apenas o painel ativo visível.
- [ ] Preservar todos os controles, cálculos, exportações e links compartilhados em suas abas correspondentes.
- [x] Validar exportação JSON e PDF após a reorganização por abas.
- [x] Corrigir a composição impressa do PDF para remover a página inicial subutilizada e preservar uma primeira página legível.
- [x] Confirmar programaticamente que a primeira página do PDF contém cabeçalho e conteúdo da Visão geral após a correção de impressão.
- [x] Validar o acesso e a operação de links compartilhados após a reorganização por abas.
- [x] Registrar a checagem dos cálculos e controles principais em cada aba.
- [x] Reler e confirmar o registro persistido da checagem consolidada das dez abas em `validation-notes.md`.
- [x] Validar a navegação integral em desktop e celular.

## Poderes e combate

- [x] Criar uma aba principal de Poderes na ficha.
- [x] Permitir cadastrar poderes com fonte, custo de FP, nível, alcance, dano e efeito.
- [x] Exibir poderes de combate e permitir ativá-los diretamente no painel de Combate.
- [x] Registrar uso de poder, rolagem e gasto de FP no histórico da sessão.
- [x] Validar a aba de Poderes e sua integração com Combate em desktop e celular.
- [x] Confirmar em 375×812 que um poder aparece no Combate, é ativado por lá, reduz FP e registra a rolagem no Diário.

## Missões e Homebrew

- [x] Adicionar controles individuais para excluir ataques, poderes e itens.
- [x] Criar uma aba de Missões com relatório, dificuldade, pontos ganhos, dinheiro e observações.
- [x] Aplicar pontos ganhos da missão ao orçamento do personagem e registrar a conclusão no diário.
- [x] Criar uma aba de Homebrew para regras, raças, habilidades e notas personalizadas.
- [x] Validar as abas de Missões e Homebrew, incluindo os controles de exclusão, em desktop e celular.

## Correções de remoção e pontos

- [x] Garantir botão de remoção individual para ataques, vantagens, desvantagens, itens, perícias, aliados e poderes.
- [x] Revisar custos de atributos e valores adicionais no orçamento de pontos.
- [x] Descontar corretamente todos os valores adicionais dos pontos disponíveis.
- [x] Adicionar testes automatizados para cálculo de pontos e remoções de listas.
- [x] Validar os controles de exclusão e os totais na interface.

## Correção de contraste do seletor

- [x] Ajustar o contraste das opções do seletor de status para mantê-las legíveis no tema escuro.
- [x] Aplicar fundo preto sólido ao combobox de status e ao respectivo menu de opções.

## Apresentação

- [x] Escrever um texto simples de apresentação da ficha digital GURPS 4e.

## Correção de sincronização local

- [x] Impedir mutações na nuvem para fichas locais ou sem autorização de edição.

## Visualização compartilhada

- [x] Simplificar a ficha pública para exibir todos os dados em seções claras e fáceis de acompanhar.
- [x] Incluir, de forma simplificada, os detalhes ainda omitidos de poderes, missões, traços e mini-fichas de aliados na visualização pública.
- [x] Validar a rota pública simplificada após publicação em desktop e celular.
- [x] Validar em celular a rota pública simplificada no domínio publicado, incluindo a mini-ficha de aliados e os blocos completos.
- [x] Exibir uma mini-ficha simplificada de cada aliado compartilhado, incluindo atributos, recursos, características, perícias, combate e inventário.
- [x] Validar a visualização pública com aliados e missões preenchidos.

## Descrições de perícias

- [x] Adicionar um campo de descrição às perícias da ficha principal e da mini-ficha de aliados.
- [x] Exibir a descrição de cada perícia na ficha compartilhada.
- [ ] Validar ponta a ponta as descrições preenchidas em um link público autenticado.

## Banco de perícias

- [x] Definir o modelo do catálogo pesquisável de perícias de GURPS 4e.
- [x] Criar tabela, migração e procedimentos seguros para consultar o catálogo.
- [x] Popular o catálogo inicial com 263 perícias-base, atributos e dificuldades de referência.
- [x] Permitir buscar e adicionar uma perícia do catálogo à ficha principal e à mini-ficha de aliados.
- [x] Cobrir o catálogo com testes e validar a experiência na interface.
- [x] Mover a semeadura inicial para uma rotina explícita, sem escrita em consultas públicas.
- [x] Testar busca, limite de resultados e ausência de escrita na consulta pública do catálogo.
- [x] Adicionar teste do procedimento público de catálogo, cobrindo consulta, busca, limite e ausência de mutação.
- [x] Adicionar teste de integração da inclusão de uma perícia do catálogo na ficha principal e na mini-ficha de aliados.
- [x] Adicionar teste tRPC do procedimento público, incluindo busca, limite e ausência de escrita.
- [x] Adicionar teste de integração de estado para inclusão do catálogo na ficha principal e em aliados.
- [x] Validar no procedimento tRPC o limite de 80 registros em uma consulta pública sem escrita.

## Tradução do catálogo de perícias

- [x] Definir convenções consistentes de tradução para as perícias e seus marcadores técnicos.
- [x] Traduzir os 263 nomes do catálogo para português brasileiro.
- [x] Preservar a busca por nomes em português e inglês no banco de perícias.
- [x] Validar a exibição e a inclusão de perícias traduzidas na ficha principal e em aliados.
- [x] Normalizar termos de famílias relacionadas, incluindo as variantes de chicote, monofio e força.
- [x] Testar convenções terminológicas e categorias esperadas no catálogo traduzido.

## Descrições automáticas do catálogo

- [x] Adicionar uma descrição curta em português para cada perícia do banco.
- [x] Preencher automaticamente a descrição ao incluir uma perícia na ficha principal ou em um aliado.
- [x] Validar o preenchimento de descrição na ficha principal e na mini-ficha de aliado.
- [x] Integrar as descrições específicas de cada perícia ao catálogo publicado.
- [x] Testar descrições distintas para Briga, Abrir Fechaduras/NT e Contabilidade.

## Catálogo de vantagens e desvantagens

- [x] Modelar um banco pesquisável de vantagens e desvantagens de GURPS 4e, com custo, categoria, tipo e descrição em português.
- [x] Criar a tabela, a semeadura e a consulta segura do catálogo de vantagens e desvantagens.
- [x] Permitir buscar e adicionar vantagens e desvantagens do catálogo à ficha com preenchimento automático.
- [x] Cobrir o catálogo com testes e validar sua experiência na interface.
- [x] Validar no navegador o catálogo de vantagens na aba Características, incluindo busca, carregamento e inclusão automática com custo, notas e fonte.
- [x] Validar no navegador o catálogo de desvantagens na aba Características, incluindo busca bilíngue, inclusão automática e impacto no total de pontos.
- [x] Validar em viewport móvel o catálogo de vantagens e desvantagens na aba Características e registrar a checagem em `validation-notes.md`.
- [x] Integrar o catálogo de vantagens e desvantagens à aba Características da mini-ficha de Aliados, com busca e preenchimento automático.

## Correção de implantação

- [x] Investigar os registros disponíveis da falha de implantação: a tentativa parou no agendamento remoto antes de iniciar a compilação.
- [x] Confirmar que não havia erro de código ou configuração de implantação no projeto local.
- [x] Validar a compilação e publicar uma nova versão com sucesso.
- [x] Registrar formalmente que a causa raiz da falha anterior é inconclusiva por falta de logs adicionais da plataforma.

## Nova investigação de implantação

- [x] Verificar a nova falha ocorrida no agendamento remoto do construtor.
- [x] Confirmar a compilação local e a ausência de erro de código antes de repetir a publicação.
- [x] Repetir a publicação e confirmar a disponibilidade do domínio.

## Falha recorrente de implantação

- [x] Conferir os registros de implantação e validar localmente o projeto após a falha recorrente.
- [x] Determinar que não há correção de projeto identificável: a falha ocorre antes do início do construtor remoto.
- [x] Repetir a publicação somente após a validação e confirmar a disponibilidade do domínio.
- [x] Verificar arquivos grandes e scripts de instalação que possam impedir o construtor remoto antes dos logs.
- [x] Reproduzir localmente a instalação limpa que o construtor remoto executaria.

## Navegação móvel entre abas

- [x] Analisar a acessibilidade atual das abas em telas pequenas.
- [x] Adicionar um controle móvel para acessar e trocar todas as abas da ficha.
- [x] Validar em viewport móvel real que o seletor aparece, abre e troca o painel ativo.
- [x] Confirmar em documentação a barra lateral preservada em desktop e o seletor nativo abaixo de 880 px.

## Exportação para GitHub

- [x] Definir o repositório GitHub de destino e a forma de envio do código.
- [x] Enviar a versão atual do projeto ao repositório GitHub autorizado.
- [x] Confirmar o repositório e a revisão enviados.
- [x] Criar um novo repositório GitHub para a ficha GURPS 4e.
- [x] Criar o repositório público `ficha-gurps-4e` e enviar a versão atual do código.
- [x] Enviar ao repositório GitHub as alterações recentes do tema grafite dos campos de escrita.

## Legibilidade dos campos de escrita

- [x] Ajustar os campos de escrita para exibir em preto o texto digitado, com fundo que preserve o contraste.
- [x] Alterar os campos de escrita para fundo preto e texto branco, conforme o tema escuro da ficha.
- [x] Ajustar o fundo dos campos de escrita para o mesmo preto grafite dos painéis da ficha, mantendo texto branco.

## Sincronização GitHub da versão estável

- [x] Enviar ao GitHub a versão estável atual, preservando o registro de que o catálogo dos Aliados ainda está pendente.


## Automação de NH e bônus extra

- [x] Automatizar o NH das perícias com base no atributo, dificuldade, nível e bônus extra.
- [x] Automatizar o NH dos ataques usando a perícia vinculada, nível e bônus extra do ataque.
- [x] Adicionar campos editáveis de bônus extra para perícias e ataques, inclusive na mini-ficha de Aliados.
- [x] Aumentar a largura e a legibilidade dos campos de NH em desktop e celular.
- [x] Testar os cálculos, os bônus, a responsividade e a publicação.
- [x] Implementar cálculo de NH baseado em atributo, dificuldade, pontos e bônus extra, com testes unitários.
- [x] Implementar vínculo de ataques a perícias e cálculo de NH final, com testes unitários.
- [x] Levar o NH e o bônus extra para os Aliados e validar desktop/celular.
- [x] Publicar e confirmar a revisão após a validação específica de NH.

## Vínculo de perícias aos ataques

- [x] Adicionar seleção de perícia vinculada em cada ataque.
- [x] Calcular o NH do ataque a partir da perícia escolhida e do bônus extra.
- [x] Testar ataques vinculados em desktop e celular.
- [x] Validar no navegador os ataques vinculados da ficha principal em desktop, incluindo NH recalculado e bônus extra.
- [x] Validar em viewport móvel real os ataques vinculados da ficha principal, sem overflow e com campos de NH legíveis.

## Sincronização GitHub do NH automático

- [x] Enviar ao repositório público as alterações de NH automático, vínculo de ataques e suporte à mini-ficha de Aliados.

## Descrição de itens de equipamento

- [x] Adicionar descrição editável aos itens da ficha principal.
- [x] Adicionar descrição editável aos itens da mini-ficha de Aliados.
- [x] Exibir a descrição dos itens na visualização compartilhada.
- [x] Testar descrição, persistência, exportação e responsividade dos itens.

### Validações específicas pendentes de descrição de itens

- [ ] Validar em uma ficha autenticada a edição da descrição na aba Equipamento e na mini-ficha de Aliados, em desktop e celular.
- [ ] Confirmar persistência ao salvar/reabrir e sincronização compartilhada das descrições.
- [x] Confirmar a presença das descrições nas exportações JSON e PDF e registrar a checagem.

## Nota de atualização

- [x] Redigir uma nota de atualização do projeto com as novidades recentes.
- [x] Acrescentar à nota os recursos de compartilhamento ao vivo e links públicos.
- [x] Enviar a nota de atualização revisada ao repositório GitHub.

## Automação e organização de Poderes

- [x] Agrupar a aba de Poderes em seções reais por tipo, com cabeçalhos próprios.
- [x] Propagar o NH automático por perícia vinculada, bônus e fallback manual para Combate e visualização compartilhada.
- [x] Estruturar dano, alcance, custo de FP, custo em pontos, duração e efeito em campos próprios.
- [x] Exibir e organizar poderes ofensivos e defensivos no painel de Combate pelo NH final.
- [ ] Testar cálculos, uso de FP, agrupamento, responsividade e visualização compartilhada dos poderes.
- [x] Validar localmente os quatro grupos de Poderes, o gasto de FP e a rolagem no Combate sem depender de compartilhamento.
- [x] Validar persistência local ao recarregar a ficha após editar recursos, itens e descrições.
- [x] Adicionar testes automatizados específicos para NH, bônus, vínculo e fallback de poderes.

### Detalhes adicionais de Poderes

- [x] Adicionar duração, área de efeito, resistência, pré-requisitos e observações ao modelo de poder.
- [x] Exibir e editar os detalhes adicionais no painel de Poderes e na visualização compartilhada.
- [x] Enviar ao GitHub a atualização recente da área de Poderes.

## Experiência móvel

- [x] Reorganizar o painel de Aliados para leitura e edição mais confortáveis em celular.
- [x] Ampliar áreas de toque e controles de alta frequência em telas móveis.
- [x] Ajustar atributos, recursos e abas internas de Aliados para evitar compactação excessiva.
- [x] Validar navegação, legibilidade e ausência de overflow em celular.
- [x] Ampliar os controles móveis de recursos, regiões corporais e filtros Homebrew para no mínimo 10 px de leitura.
- [x] Corrigir a compactação excessiva das abas e dos atributos da mini-ficha de Aliados em celular.
- [x] Garantir espaço inferior seguro para que a barra fixa não cubra os controles da mini-ficha.
- [x] Corrigir a exibição dos valores de ST, DX, IQ e HT no bloco de atributos da mini-ficha móvel.

## Biblioteca Homebrew da campanha

- [x] Expandir o modelo Homebrew para fonte, categoria, tags, descrição curta, observações e dados específicos por tipo.
- [x] Criar a biblioteca Homebrew com busca textual, filtros por categoria, cards e painel-resumo lateral.
- [x] Adicionar visualização detalhada e editor dinâmico para regras, notas, armas, vantagens, perícias, raças e poderes.
- [x] Permitir adicionar conteúdos Homebrew compatíveis diretamente a equipamentos, traços, perícias e poderes da ficha.
- [x] Validar os fluxos principais da biblioteca Homebrew em desktop e celular e adicionar testes de regressão.

## Raças aplicáveis do Homebrew

- [x] Estruturar modificadores de atributos, vantagens, desvantagens e características nas raças Homebrew.
- [x] Exibir um seletor de raças Homebrew na ficha com prévia dos efeitos a aplicar.
- [x] Aplicar e remover modificadores raciais sem duplicar vantagens, desvantagens ou ajustes de atributos.
- [x] Validar em testes e no navegador a seleção de uma raça Homebrew e o reflexo na ficha.

## Prioridade atual: NH e bônus extra

- [x] Revisar visualmente a largura, o contraste e a leitura dos campos de NH na ficha principal e nos Aliados.
- [x] Validar em desktop e celular os cálculos de NH, bônus extra e vínculos de ataques nas duas fichas.
- [x] Validar em viewport móvel real a largura, legibilidade e ausência de overflow dos campos de NH e bônus na ficha principal.
- [x] Validar em viewport móvel real os campos de NH e bônus da mini-ficha de Aliados, em Perícias e Combate.
- [x] Publicar a revisão de legibilidade do NH após concluir as validações móveis.

## Prioridade de sessão: rolagens e combate

- [x] Criar motor central de rolagens 3d6, com sucesso/falha e margem contra um NH-alvo.
- [x] Adicionar rolagem de dano para ataques, preservando a expressão de dano da ficha.
- [x] Integrar botões de rolagem rápida a ataques, perícias e poderes.
- [x] Criar histórico de rolagens com horário, origem, resultado e margem.
- [x] Validar a central de rolagens e combate em desktop e celular.

## Prioridade de sessão: recursos rápidos

- [x] Adicionar controles de −5, −1, +1 e +5 para PV e PF, respeitando os limites calculados.
- [x] Permitir editar diretamente o valor atual de PV e PF durante a sessão.
- [x] Registrar alterações de recursos no histórico e validar em desktop e celular.

## Organização temática da ficha

- [x] Reorganizar a barra lateral em grupos de Personagem, Combate, Campanha e Personalização.
- [x] Ampliar a Visão geral com resumo tático de recursos, atributos, traços, perícias e equipamento preparado.
- [x] Validar a organização da navegação e o resumo tático em desktop e celular.

## Inventário tático

- [x] Organizar os itens por Armas, Armaduras, Consumíveis, Ferramentas, Itens-chave e Outros.
- [x] Adicionar mão utilizada e modificadores de bônus ou penalidade aos itens de inventário.
- [x] Validar o inventário categorizado em desktop e celular.
