// Módulo de chatbot para o site GTA IV

/**
 * Inicializa o chatbot (Roman Bellic)
 */
export function initChatBot() {
  // Selecionar elementos do chatbot
  const chatBot = document.querySelector('.chat-bot');
  if (!chatBot) return;
  
  const chatBotToggle = chatBot.querySelector('.chat-bot__toggle');
  const chatBotContainer = chatBot.querySelector('.chat-bot__container');
  const chatMessages = chatBot.querySelector('.chat-bot__messages');
  const chatInput = chatBot.querySelector('.chat-bot__input');
  const chatSend = chatBot.querySelector('.chat-bot__send');
  
  if (!chatBotToggle || !chatBotContainer || !chatMessages || !chatInput || !chatSend) return;
  
  // Configurar estado inicial
  let isOpen = false;
  let hasGreeted = false;
  
  // Adicionar listener ao botão de toggle
  chatBotToggle.addEventListener('click', () => {
    toggleChatBot();
  });
  
  // Adicionar listener ao botão de envio
  chatSend.addEventListener('click', () => {
    sendMessage();
  });
  
  // Adicionar listener ao campo de entrada
  chatInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      sendMessage();
    }
  });
  
  // Adicionar listener para fechar com ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isOpen) {
      toggleChatBot();
    }
  });
  
  // Mostrar chatbot após um tempo se configurado
  if (chatBot.dataset.autoShow === 'true') {
    const delay = parseInt(chatBot.dataset.autoShowDelay, 10) || 10000;
    setTimeout(() => {
      if (!isOpen && !sessionStorage.getItem('chatbot-dismissed')) {
        toggleChatBot();
      }
    }, delay);
  }
  
  /**
   * Alterna a visibilidade do chatbot
   */
  function toggleChatBot() {
    isOpen = !isOpen;
    
    // Atualizar atributos ARIA
    chatBotToggle.setAttribute('aria-expanded', isOpen);
    
    // Mostrar mensagem de boas-vindas na primeira abertura
    if (isOpen && !hasGreeted) {
      setTimeout(() => {
        addBotMessage("Hey cousin! It's Roman! Want to go bowling?");
        setTimeout(() => {
          addBotMessage("Just kidding! I'm your virtual assistant for this GTA IV website. How can I help you today?");
        }, 1500);
      }, 500);
      hasGreeted = true;
    }
    
    // Focar no campo de entrada quando abrir
    if (isOpen) {
      setTimeout(() => {
        chatInput.focus();
      }, 300);
    }
    
    // Salvar estado se fechado pelo usuário
    if (!isOpen) {
      sessionStorage.setItem('chatbot-dismissed', 'true');
    }
  }
  
  /**
   * Envia uma mensagem do usuário
   */
  function sendMessage() {
    const message = chatInput.value.trim();
    if (!message) return;
    
    // Adicionar mensagem do usuário
    addUserMessage(message);
    
    // Limpar campo de entrada
    chatInput.value = '';
    
    // Processar mensagem e gerar resposta
    processMessage(message);
  }
  
  /**
   * Adiciona uma mensagem do bot ao chat
   * @param {string} text - Texto da mensagem
   */
  function addBotMessage(text) {
    const message = document.createElement('div');
    message.className = 'chat-message chat-message--bot';
    
    const content = document.createElement('div');
    content.className = 'chat-message__content';
    content.textContent = text;
    
    const time = document.createElement('span');
    time.className = 'chat-message__time';
    
    const now = new Date();
    time.textContent = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    
    message.appendChild(content);
    message.appendChild(time);
    
    chatMessages.appendChild(message);
    scrollToBottom();
    
    // Reproduzir som de notificação se configurado
    if (chatBot.dataset.sound === 'true') {
      playNotificationSound();
    }
  }
  
  /**
   * Adiciona uma mensagem do usuário ao chat
   * @param {string} text - Texto da mensagem
   */
  function addUserMessage(text) {
    const message = document.createElement('div');
    message.className = 'chat-message chat-message--user';
    
    const content = document.createElement('div');
    content.className = 'chat-message__content';
    content.textContent = text;
    
    const time = document.createElement('span');
    time.className = 'chat-message__time';
    
    const now = new Date();
    time.textContent = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    
    message.appendChild(content);
    message.appendChild(time);
    
    chatMessages.appendChild(message);
    scrollToBottom();
  }
  
  /**
   * Processa a mensagem do usuário e gera uma resposta
   * @param {string} message - Mensagem do usuário
   */
  function processMessage(message) {
    // Simular digitação
    const typingIndicator = document.createElement('div');
    typingIndicator.className = 'chat-message chat-message--bot chat-message--typing';
    typingIndicator.innerHTML = '<div class="chat-message__content">Digitando<span>.</span><span>.</span><span>.</span></div>';
    
    chatMessages.appendChild(typingIndicator);
    scrollToBottom();
    
    // Gerar resposta após um pequeno atraso
    setTimeout(() => {
      // Remover indicador de digitação
      typingIndicator.remove();
      
      // Adicionar resposta do bot
      const response = generateResponse(message.toLowerCase());
      addBotMessage(response);
    }, 1500);
  }
  
  /**
   * Gera uma resposta baseada na mensagem do usuário
   * @param {string} message - Mensagem do usuário em minúsculas
   * @returns {string} - Resposta do bot
   */
  function generateResponse(message) {
    // Palavras-chave para respostas específicas
    if (message.includes('bowling') || message.includes('boliche')) {
      return "Bowling? BOWLING? Você realmente quer ir jogar boliche comigo? Estou brincando, não sou o Roman de verdade!";
    }
    
    if (message.includes('niko') || message.includes('bellic')) {
      return "Niko Bellic é o protagonista de GTA IV. Ele é um veterano da Guerra dos Balcãs que se muda para Liberty City em busca do 'sonho americano' e para encontrar alguém de seu passado.";
    }
    
    if (message.includes('liberty city')) {
      return "Liberty City em GTA IV é baseada em Nova York. Possui quatro distritos principais: Algonquin (Manhattan), Broker (Brooklyn), Dukes (Queens) e Bohan (Bronx).";
    }
    
    if (message.includes('roman')) {
      return "Roman Bellic é o primo de Niko e um personagem importante em GTA IV. Ele possui uma empresa de táxis e está sempre metido em problemas. E sim, ele realmente ama boliche!";
    }
    
    if (message.includes('little jacob') || message.includes('jacob')) {
      return "Little Jacob é um traficante jamaicano e um dos melhores amigos de Niko em Liberty City. Ele fala com um sotaque jamaicano muito forte que às vezes é difícil de entender.";
    }
    
    if (message.includes('missões') || message.includes('missions')) {
      return "GTA IV tem mais de 90 missões na história principal. Algumas das mais memoráveis incluem 'Three Leaf Clover' (o assalto ao banco) e as missões finais onde você deve escolher entre vingança ou dinheiro.";
    }
    
    if (message.includes('carros') || message.includes('veículos') || message.includes('cars') || message.includes('vehicles')) {
      return "GTA IV tem mais de 150 veículos diferentes, incluindo carros, motos, barcos e helicópteros. A física de direção é mais realista comparada aos jogos anteriores da série.";
    }
    
    if (message.includes('dlc') || message.includes('expansões') || message.includes('expansions')) {
      return "GTA IV teve duas expansões principais: 'The Lost and Damned' e 'The Ballad of Gay Tony'. Cada uma apresenta um novo protagonista e história que se cruza com a narrativa principal.";
    }
    
    if (message.includes('final') || message.includes('ending')) {
      return "GTA IV tem dois finais possíveis, dependendo de sua escolha na missão 'One Last Thing'. Você pode escolher entre Vingança (Deal) ou Dinheiro (Revenge), e cada escolha leva a consequências diferentes.";
    }
    
    if (message.includes('easter eggs')) {
      return "GTA IV está cheio de easter eggs! Há referências ao Coração da Cidade de Liberty, o monstro do mar em Happiness Island, e até mesmo um easter egg do Ratman nos metrôs.";
    }
    
    if (message.includes('rádio') || message.includes('radio') || message.includes('música') || message.includes('music')) {
      return "GTA IV tem 19 estações de rádio com mais de 200 músicas licenciadas. Algumas das mais populares são Liberty Rock Radio, The Beat, e The Vibe.";
    }
    
    if (message.includes('multiplayer') || message.includes('online')) {
      return "GTA IV tinha um modo multiplayer com vários modos de jogo como Deathmatch, Corridas e Modo Livre. Infelizmente, os servidores oficiais foram desativados em 2020.";
    }
    
    if (message.includes('ajuda') || message.includes('help')) {
      return "Posso te ajudar com informações sobre GTA IV, incluindo personagens, missões, veículos, Easter eggs e muito mais. Basta me perguntar!";
    }
    
    if (message.includes('olá') || message.includes('oi') || message.includes('hello') || message.includes('hi')) {
      return "Olá! Como posso ajudar você hoje? Quer saber algo específico sobre GTA IV?";
    }
    
    if (message.includes('obrigado') || message.includes('thanks')) {
      return "De nada! Se precisar de mais informações sobre GTA IV, é só perguntar!";
    }
    
    // Resposta padrão para mensagens não reconhecidas
    return "Interessante! Se quiser saber mais sobre GTA IV, pode me perguntar sobre personagens, missões, veículos, Easter eggs ou qualquer outro aspecto do jogo.";
  }
  
  /**
   * Rola o chat para o final
   */
  function scrollToBottom() {
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }
  
  /**
   * Reproduz um som de notificação
   */
  function playNotificationSound() {
    const sound = new Audio('/assets/audio/notification.mp3');
    sound.volume = 0.5;
    sound.play().catch(err => console.log('Audio playback error:', err));
  }
}

/**
 * Adiciona uma mensagem ao chatbot
 * @param {string} text - Texto da mensagem
 * @param {string} type - Tipo da mensagem ('bot' ou 'user')
 */
export function addChatBotMessage(text, type = 'bot') {
  const chatBot = document.querySelector('.chat-bot');
  if (!chatBot) return;
  
  const chatMessages = chatBot.querySelector('.chat-bot__messages');
  if (!chatMessages) return;
  
  const message = document.createElement('div');
  message.className = `chat-message chat-message--${type}`;
  
  const content = document.createElement('div');
  content.className = 'chat-message__content';
  content.textContent = text;
  
  const time = document.createElement('span');
  time.className = 'chat-message__time';
  
  const now = new Date();
  time.textContent = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
  
  message.appendChild(content);
  message.appendChild(time);
  
  chatMessages.appendChild(message);
  chatMessages.scrollTop = chatMessages.scrollHeight;
  
  // Abrir chatbot se estiver fechado
  const chatBotToggle = chatBot.querySelector('.chat-bot__toggle');
  if (chatBotToggle && chatBotToggle.getAttribute('aria-expanded') === 'false') {
    chatBotToggle.click();
  }
}

/**
 * Cria um novo chatbot dinamicamente
 * @param {Object} options - Opções de configuração
 * @param {string} containerId - ID do container onde adicionar o chatbot
 * @returns {HTMLElement} - Elemento do chatbot criado
 */
export function createChatBot(options, containerId) {
  const defaultOptions = {
    title: 'Roman Bellic',
    autoShow: false,
    autoShowDelay: 10000,
    sound: true,
    position: 'bottom-right'
  };
  
  const config = { ...defaultOptions, ...options };
  const container = document.getElementById(containerId);
  
  if (!container) return null;
  
  // Criar elemento do chatbot
  const chatBot = document.createElement('div');
  chatBot.className = `chat-bot chat-bot--${config.position}`;
  chatBot.dataset.autoShow = config.autoShow.toString();
  chatBot.dataset.autoShowDelay = config.autoShowDelay.toString();
  chatBot.dataset.sound = config.sound.toString();
  
  // Criar estrutura interna
  chatBot.innerHTML = `
    <button class="chat-bot__toggle" aria-expanded="false" aria-label="Abrir chat">
      <span class="chat-bot__icon chat-bot__icon--open">
        <svg viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
      </span>
      <span class="chat-bot__icon chat-bot__icon--close">
        <svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
      </span>
    </button>
    <div class="chat-bot__container">
      <div class="chat-bot__header">
        <h3 class="chat-bot__title">${config.title}</h3>
      </div>
      <div class="chat-bot__messages"></div>
      <div class="chat-bot__input-area">
        <input type="text" class="chat-bot__input" placeholder="Digite sua mensagem...">
        <button class="chat-bot__send">
          <svg viewBox="0 0 24 24"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
        </button>
      </div>
    </div>
  `;
  
  // Adicionar ao container
  container.appendChild(chatBot);
  
  // Inicializar chatbot
  initChatBot();
  
  return chatBot;
}
