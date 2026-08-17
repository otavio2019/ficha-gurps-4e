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
- [ ] Validar a navegação de acesso e os estados autenticado e visitante.
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

## Navegação integral da ficha

- [x] Converter Visão geral, Combate, Características, Perícias, Equipamento, Aliados e Diário em seções exclusivas de um menu lateral interno.
- [x] Remover a rolagem longa da ficha e manter apenas o painel ativo visível.
- [ ] Preservar todos os controles, cálculos, exportações e links compartilhados em suas abas correspondentes.
- [ ] Validar exportação JSON e PDF após a reorganização por abas.
- [ ] Validar o acesso e a operação de links compartilhados após a reorganização por abas.
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
