# Validação de colaboração

- A biblioteca e os controles visuais carregam corretamente na prévia.
- A sessão de validação atual não está autenticada; por isso, os controles de sincronização na nuvem, retrato e link público ainda não podem ser exercitados nessa sessão. O menu visitante exibe corretamente as ações de entrar e criar conta.
- O canal Socket.IO foi validado com teste automatizado de conexão, sala e emissão de evento.
- A ficha de combate renderiza as regiões corporais clicáveis, incluindo Cabeça, Pescoço, Tronco, membros e pés, com DR e fonte de proteção para a região selecionada.
- A região Cabeça foi acionada na interface; o painel passou a exibir DR 0 e “Sem proteção”, confirmando a criação e seleção da região corporal.
- A ficha agora apresenta a seção Aliados no índice lateral e o estado vazio com controle de adição; o orçamento exibe a linha de custo de aliados.
- A criação de um aliado foi validada no navegador: o painel passou a mostrar 1 aliado, 25 pontos de valor, 5 pontos de custo, PV 10/10 e o orçamento foi recalculado de 59 para 54 pontos disponíveis.
- O controle de dano do aliado foi acionado e reduziu corretamente seus PV de 10/10 para 9/10.
