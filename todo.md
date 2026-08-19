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
- [ ] Validar o retrato e as regiões de proteção na ficha de combate.

## Aliados GURPS

- [x] Adicionar aliados à estrutura da ficha e ao salvamento compartilhado.
- [x] Criar uma seção de aliados com nome, relação, pontos, PV, descrição e estado.
- [x] Permitir adicionar, editar, remover e ajustar os PV de aliados durante a sessão.
- [ ] Validar o painel de aliados em desktop e celular.

## Mini-ficha de aliado

- [x] Expandir o modelo de aliado com identificação, atributos e dados específicos de Ally.
- [x] Criar abas ou menu lateral interno para visão geral, atributos, características, perícias, combate e inventário do aliado.
- [x] Garantir que todos os campos e controles do aliado apareçam somente na aba interna correspondente.
- [x] Calcular custo de Ally por porcentagem de pontos e frequência de aparecimento.
- [x] Permitir editar os dados da mini-ficha e manter a integração com a sessão principal.
- [ ] Validar a navegação e a mini-ficha de aliado em desktop e celular.
- [x] Corrigir a grade da mini-ficha de aliado para evitar overflow e melhorar a distribuição de atributos e recursos.
- [x] Adicionar exclusão individual para vantagens, desvantagens, perícias e ataques da mini-ficha de aliado.

## Navegação integral da ficha

- [x] Converter Visão geral, Combate, Características, Perícias, Equipamento, Aliados e Diário em seções exclusivas de um menu lateral interno.
- [x] Remover a rolagem longa da ficha e manter apenas o painel ativo visível.
- [ ] Preservar todos os controles, cálculos, exportações e links compartilhados em suas abas correspondentes.
- [ ] Validar exportação JSON e PDF após a reorganização por abas.
- [x] Validar o acesso e a operação de links compartilhados após a reorganização por abas.
- [ ] Registrar a checagem dos cálculos e controles principais em cada aba.
- [ ] Validar a navegação integral em desktop e celular.

## Poderes e combate

- [x] Criar uma aba principal de Poderes na ficha.
- [x] Permitir cadastrar poderes com fonte, custo de FP, nível, alcance, dano e efeito.
- [x] Exibir poderes de combate e permitir ativá-los diretamente no painel de Combate.
- [x] Registrar uso de poder, rolagem e gasto de FP no histórico da sessão.
- [ ] Validar a aba de Poderes e sua integração com Combate em desktop e celular.

## Missões e Homebrew

- [x] Adicionar controles individuais para excluir ataques, poderes e itens.
- [x] Criar uma aba de Missões com relatório, dificuldade, pontos ganhos, dinheiro e observações.
- [x] Aplicar pontos ganhos da missão ao orçamento do personagem e registrar a conclusão no diário.
- [x] Criar uma aba de Homebrew para regras, raças, habilidades e notas personalizadas.
- [ ] Validar as abas de Missões e Homebrew, incluindo os controles de exclusão, em desktop e celular.

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

## Legibilidade dos campos de escrita

- [x] Ajustar os campos de escrita para exibir em preto o texto digitado, com fundo que preserve o contraste.
