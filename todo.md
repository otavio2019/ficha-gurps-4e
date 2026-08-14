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

- [ ] Expandir o modelo de aliado com identificação, atributos e dados específicos de Ally.
- [ ] Criar abas ou menu lateral interno para visão geral, atributos, características, perícias, combate e inventário do aliado.
- [ ] Garantir que todos os campos e controles do aliado apareçam somente na aba interna correspondente.
- [ ] Calcular custo de Ally por porcentagem de pontos e frequência de aparecimento.
- [ ] Permitir editar os dados da mini-ficha e manter a integração com a sessão principal.
- [ ] Validar a navegação e a mini-ficha de aliado em desktop e celular.

## Navegação integral da ficha

- [ ] Converter Visão geral, Combate, Características, Perícias, Equipamento, Aliados e Diário em seções exclusivas de um menu lateral interno.
- [ ] Remover a rolagem longa da ficha e manter apenas o painel ativo visível.
- [ ] Preservar todos os controles, cálculos, exportações e links compartilhados em suas abas correspondentes.
- [ ] Validar a navegação integral em desktop e celular.

## Poderes e combate

- [x] Criar uma aba principal de Poderes na ficha.
- [x] Permitir cadastrar poderes com fonte, custo de FP, nível, alcance, dano e efeito.
- [x] Exibir poderes de combate e permitir ativá-los diretamente no painel de Combate.
- [x] Registrar uso de poder, rolagem e gasto de FP no histórico da sessão.
- [ ] Validar a aba de Poderes e sua integração com Combate em desktop e celular.
