// Módulo de efeitos de wanted level para o site GTA IV

/**
 * Inicializa o sistema de efeitos de wanted level
 */
export function initWantedLevelEffects() {
  // Verificar se o elemento de wanted level já existe
  let wantedLevelIndicator = document.querySelector('.wanted-level-indicator');
  
  // Se não existir, criar um
  if (!wantedLevelIndicator) {
    wantedLevelIndicator = createWantedLevelIndicator();
  }
  
  // Adicionar listeners para ativar wanted level
  setupWantedLevelTriggers();
  
  // Adicionar efeitos de Easter egg
  setupEasterEggs();
  
  /**
   * Cria o indicador de wanted level
   * @returns {HTMLElement} - Elemento do indicador
   */
  function createWantedLevelIndicator() {
    const indicator = document.createElement('div');
    indicator.className = 'wanted-level-indicator';
    indicator.setAttribute('aria-hidden', 'true');
    
    // Criar estrelas de wanted level
    for (let i = 0; i < 6; i++) {
      const star = document.createElement('div');
      star.className = 'wanted-star';
      star.innerHTML = `
        <svg viewBox="0 0 24 24">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
        </svg>
      `;
      indicator.appendChild(star);
    }
    
    // Adicionar ao body
    document.body.appendChild(indicator);
    
    // Esconder inicialmente
    indicator.style.display = 'none';
    
    return indicator;
  }
  
  /**
   * Configura os gatilhos para ativar o wanted level
   */
  function setupWantedLevelTriggers() {
    // Gatilho 1: Cliques rápidos no logo
    const logo = document.querySelector('.site-logo');
    if (logo) {
      let clickCount = 0;
      let clickTimer;
      
      logo.addEventListener('click', (e) => {
        e.preventDefault();
        clickCount++;
        
        clearTimeout(clickTimer);
        clickTimer = setTimeout(() => {
          if (clickCount >= 5) {
            setWantedLevel(1);
          }
          clickCount = 0;
        }, 1500);
      });
    }
    
    // Gatilho 2: Código Konami
    let konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    let konamiPosition = 0;
    
    document.addEventListener('keydown', (e) => {
      if (e.key === konamiCode[konamiPosition]) {
        konamiPosition++;
        
        if (konamiPosition === konamiCode.length) {
          setWantedLevel(6);
          konamiPosition = 0;
        }
      } else {
        konamiPosition = 0;
      }
    });
    
    // Gatilho 3: Botões escondidos na página
    const hiddenButtons = document.querySelectorAll('[data-wanted-trigger]');
    hiddenButtons.forEach(button => {
      button.addEventListener('click', () => {
        const level = parseInt(button.dataset.wantedTrigger, 10) || 1;
        setWantedLevel(level);
      });
    });
  }
  
  /**
   * Configura Easter eggs relacionados ao wanted level
   */
  function setupEasterEggs() {
    // Easter egg 1: Clique em sequência em elementos específicos
    const easterEggElements = document.querySelectorAll('[data-easter-egg]');
    let clickedElements = [];
    
    easterEggElements.forEach(element => {
      element.addEventListener('click', () => {
        clickedElements.push(element.dataset.easterEgg);
        
        // Verificar sequências específicas
        if (clickedElements.join('-') === 'niko-roman-niko') {
          setWantedLevel(3);
          clickedElements = [];
        }
        
        // Limitar tamanho do array
        if (clickedElements.length > 5) {
          clickedElements.shift();
        }
      });
    });
    
    // Easter egg 2: Código secreto digitado
    let secretCode = '';
    document.addEventListener('keypress', (e) => {
      secretCode += e.key.toLowerCase();
      
      // Limitar tamanho
      if (secretCode.length > 10) {
        secretCode = secretCode.substring(secretCode.length - 10);
      }
      
      // Verificar códigos
      if (secretCode.includes('sixstar')) {
        setWantedLevel(6);
      } else if (secretCode.includes('wanted')) {
        setWantedLevel(3);
      }
    });
  }
}

/**
 * Define o nível de procurado (wanted level)
 * @param {number} level - Nível de procurado (1-6)
 * @param {Object} options - Opções adicionais
 */
export function setWantedLevel(level, options = {}) {
  const defaultOptions = {
    duration: 10000, // Duração em ms
    sound: true,     // Reproduzir som
    policeChase: true // Ativar efeitos de perseguição
  };
  
  const config = { ...defaultOptions, ...options };
  
  // Validar nível
  level = Math.max(0, Math.min(6, level));
  
  // Obter indicador
  const indicator = document.querySelector('.wanted-level-indicator');
  if (!indicator) return;
  
  // Se o nível for 0, esconder o indicador
  if (level === 0) {
    indicator.style.display = 'none';
    document.body.classList.remove('wanted-active');
    stopPoliceChaseEffects();
    return;
  }
  
  // Mostrar indicador
  indicator.style.display = 'flex';
  document.body.classList.add('wanted-active');
  
  // Atualizar estrelas
  const stars = indicator.querySelectorAll('.wanted-star');
  stars.forEach((star, index) => {
    if (index < level) {
      star.classList.add('active');
    } else {
      star.classList.remove('active');
    }
  });
  
  // Adicionar classe ao body baseada no nível
  for (let i = 1; i <= 6; i++) {
    document.body.classList.remove(`wanted-level-${i}`);
  }
  document.body.classList.add(`wanted-level-${level}`);
  
  // Reproduzir som se habilitado
  if (config.sound) {
    playWantedSound(level);
  }
  
  // Ativar efeitos de perseguição se habilitado
  if (config.policeChase && level >= 3) {
    startPoliceChaseEffects(level);
  }
  
  // Configurar timer para remover wanted level
  if (config.duration > 0) {
    setTimeout(() => {
      setWantedLevel(0);
    }, config.duration);
  }
  
  // Disparar evento
  const event = new CustomEvent('wantedlevelchange', { 
    detail: { level } 
  });
  document.dispatchEvent(event);
}

/**
 * Reproduz o som de wanted level
 * @param {number} level - Nível de procurado
 */
function playWantedSound(level) {
  const sound = new Audio(`/assets/audio/wanted-level-${level}.mp3`);
  sound.volume = 0.5;
  sound.play().catch(err => console.log('Audio playback error:', err));
}

/**
 * Inicia os efeitos visuais de perseguição policial
 * @param {number} level - Nível de procurado
 */
function startPoliceChaseEffects(level) {
  // Remover efeitos existentes
  stopPoliceChaseEffects();
  
  // Criar overlay de perseguição
  const overlay = document.createElement('div');
  overlay.className = 'police-chase-overlay';
  document.body.appendChild(overlay);
  
  // Adicionar sirenes baseadas no nível
  const sirensCount = Math.min(level, 4);
  for (let i = 0; i < sirensCount; i++) {
    const siren = document.createElement('div');
    siren.className = 'police-siren';
    siren.style.animationDelay = `${i * 0.5}s`;
    overlay.appendChild(siren);
  }
  
  // Adicionar efeito de câmera tremendo para níveis altos
  if (level >= 5) {
    document.body.classList.add('camera-shake');
  }
  
  // Adicionar sons de sirene
  if (level >= 4) {
    playSirenSound();
  }
}

/**
 * Para os efeitos visuais de perseguição policial
 */
function stopPoliceChaseEffects() {
  // Remover overlay de perseguição
  const overlay = document.querySelector('.police-chase-overlay');
  if (overlay) {
    overlay.remove();
  }
  
  // Remover efeito de câmera tremendo
  document.body.classList.remove('camera-shake');
  
  // Parar sons de sirene
  stopSirenSound();
}

/**
 * Reproduz o som de sirene em loop
 */
function playSirenSound() {
  // Parar som existente
  stopSirenSound();
  
  // Criar novo elemento de áudio
  const sirenSound = new Audio('/assets/audio/police-siren.mp3');
  sirenSound.id = 'siren-sound';
  sirenSound.loop = true;
  sirenSound.volume = 0.3;
  
  // Adicionar ao body e reproduzir
  document.body.appendChild(sirenSound);
  sirenSound.play().catch(err => console.log('Audio playback error:', err));
}

/**
 * Para o som de sirene
 */
function stopSirenSound() {
  const sirenSound = document.getElementById('siren-sound');
  if (sirenSound) {
    sirenSound.pause();
    sirenSound.remove();
  }
}

/**
 * Cria um botão de gatilho de wanted level
 * @param {Object} options - Opções de configuração
 * @param {string} containerId - ID do container onde adicionar o botão
 * @returns {HTMLElement} - Elemento do botão criado
 */
export function createWantedTrigger(options, containerId) {
  const defaultOptions = {
    level: 3,
    text: 'Ativar Wanted Level',
    hidden: false,
    style: 'default' // 'default', 'easter-egg', 'secret'
  };
  
  const config = { ...defaultOptions, ...options };
  const container = document.getElementById(containerId);
  
  if (!container) return null;
  
  // Criar botão
  const button = document.createElement('button');
  button.className = `wanted-trigger wanted-trigger--${config.style}`;
  button.dataset.wantedTrigger = config.level.toString();
  button.textContent = config.text;
  
  // Configurar estilo
  if (config.hidden) {
    button.style.opacity = '0.1';
    button.style.fontSize = '10px';
  }
  
  if (config.style === 'easter-egg') {
    button.style.position = 'absolute';
    button.style.right = '5px';
    button.style.bottom = '5px';
    button.style.opacity = '0.05';
    button.style.transform = 'scale(0.5)';
  }
  
  // Adicionar ao container
  container.appendChild(button);
  
  // Adicionar listener
  button.addEventListener('click', () => {
    setWantedLevel(config.level);
  });
  
  return button;
}
