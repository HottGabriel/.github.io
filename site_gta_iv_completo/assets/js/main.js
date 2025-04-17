// Arquivo principal de JavaScript para o site GTA IV

// Importações de módulos
import { initThemeToggle } from './modules/theme.js';
import { initNavigation } from './modules/navigation.js';
import { initParallax } from './modules/parallax.js';
import { initAnimations } from './modules/animations.js';
import { initGallery } from './modules/gallery.js';
import { initSliders } from './modules/sliders.js';
import { initTabs } from './modules/tabs.js';
import { initAccordion } from './modules/accordion.js';
import { initMap } from './modules/map.js';
import { initChatBot } from './modules/chatbot.js';
import { initSearch } from './modules/search.js';
import { initVehicleCustomizer } from './modules/vehicle-customizer.js';
import { initMissionTracker } from './modules/mission-tracker.js';
import { initPreloader } from './modules/preloader.js';

// Configuração global
const CONFIG = {
  animations: {
    enabled: true,
    reducedMotion: false
  },
  theme: {
    default: 'dark',
    remember: true
  },
  performance: {
    lazyLoad: true,
    asyncLoading: true
  }
};

// Verificar preferências de redução de movimento
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  CONFIG.animations.reducedMotion = true;
}

// Função principal de inicialização
function initApp() {
  console.log('GTA IV Website - Initializing...');
  
  // Inicializar preloader
  initPreloader();
  
  // Detectar recursos do navegador
  detectBrowserFeatures();
  
  // Inicializar componentes principais
  initThemeToggle(CONFIG.theme);
  initNavigation();
  
  // Inicializar componentes baseados em scroll
  initScrollBasedComponents();
  
  // Inicializar componentes interativos
  initInteractiveComponents();
  
  // Inicializar componentes específicos de GTA IV
  initGTAComponents();
  
  // Adicionar listeners globais
  addGlobalEventListeners();
  
  console.log('GTA IV Website - Initialization complete');
}

// Detectar recursos do navegador
function detectBrowserFeatures() {
  const features = {
    webp: false,
    webgl: false,
    touchscreen: false,
    localStorage: false
  };
  
  // Verificar suporte a WebP
  const webpTest = new Image();
  webpTest.onload = function() { features.webp = true; };
  webpTest.onerror = function() { features.webp = false; };
  webpTest.src = 'data:image/webp;base64,UklGRiQAAABXRUJQVlA4IBgAAAAwAQCdASoBAAEAAwA0JaQAA3AA/vuUAAA=';
  
  // Verificar suporte a WebGL
  try {
    const canvas = document.createElement('canvas');
    features.webgl = !!(window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
  } catch (e) {
    features.webgl = false;
  }
  
  // Verificar suporte a touchscreen
  features.touchscreen = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  
  // Verificar suporte a localStorage
  try {
    localStorage.setItem('test', 'test');
    localStorage.removeItem('test');
    features.localStorage = true;
  } catch (e) {
    features.localStorage = false;
  }
  
  // Adicionar classes ao HTML baseadas nos recursos
  const html = document.documentElement;
  Object.keys(features).forEach(feature => {
    html.classList.toggle(`has-${feature}`, features[feature]);
  });
  
  console.log('Browser features detected:', features);
  return features;
}

// Inicializar componentes baseados em scroll
function initScrollBasedComponents() {
  // Parallax
  if (CONFIG.animations.enabled && !CONFIG.animations.reducedMotion) {
    initParallax();
  }
  
  // Animações ao scroll
  initAnimations(CONFIG.animations);
  
  // Barra de progresso de scroll
  initScrollProgressBar();
  
  // Header com mudança ao scroll
  initScrollHeader();
  
  // Botão de voltar ao topo
  initScrollToTopButton();
}

// Inicializar componentes interativos
function initInteractiveComponents() {
  // Galeria
  initGallery();
  
  // Sliders
  initSliders();
  
  // Tabs
  initTabs();
  
  // Acordeões
  initAccordion();
  
  // Pesquisa
  initSearch();
  
  // Mapa interativo
  initMap();
}

// Inicializar componentes específicos de GTA IV
function initGTAComponents() {
  // Chat bot (Roman Bellic)
  initChatBot();
  
  // Customizador de veículos
  initVehicleCustomizer();
  
  // Rastreador de missões
  initMissionTracker();
  
  // Easter eggs
  initEasterEggs();
}

// Inicializar barra de progresso de scroll
function initScrollProgressBar() {
  const progressBar = document.querySelector('.progress-bar');
  if (!progressBar) return;
  
  window.addEventListener('scroll', () => {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    progressBar.style.width = scrolled + '%';
  });
}

// Inicializar header com mudança ao scroll
function initScrollHeader() {
  const header = document.querySelector('.header');
  if (!header) return;
  
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('header--scrolled');
    } else {
      header.classList.remove('header--scrolled');
    }
  });
}

// Inicializar botão de voltar ao topo
function initScrollToTopButton() {
  const scrollTopBtn = document.querySelector('.scroll-top');
  if (!scrollTopBtn) return;
  
  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      scrollTopBtn.classList.add('visible');
    } else {
      scrollTopBtn.classList.remove('visible');
    }
  });
  
  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

// Inicializar easter eggs
function initEasterEggs() {
  // Código Konami
  let konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
  let konamiPosition = 0;
  
  document.addEventListener('keydown', (e) => {
    if (e.key === konamiCode[konamiPosition]) {
      konamiPosition++;
      
      if (konamiPosition === konamiCode.length) {
        activateEasterEgg('konami');
        konamiPosition = 0;
      }
    } else {
      konamiPosition = 0;
    }
  });
  
  // Cliques em sequência em elementos específicos
  const easterEggElements = document.querySelectorAll('[data-easter-egg]');
  let clickedElements = [];
  
  easterEggElements.forEach(element => {
    element.addEventListener('click', () => {
      clickedElements.push(element.dataset.easterEgg);
      
      // Verificar sequências específicas
      if (clickedElements.join('-') === 'niko-roman-niko') {
        activateEasterEgg('cousins');
        clickedElements = [];
      }
      
      // Limitar tamanho do array
      if (clickedElements.length > 5) {
        clickedElements.shift();
      }
    });
  });
}

// Ativar easter egg
function activateEasterEgg(type) {
  console.log(`Easter egg activated: ${type}`);
  
  switch (type) {
    case 'konami':
      // Ativar modo "wanted level 6"
      document.body.classList.add('wanted-level-6');
      playSound('wanted-level.mp3');
      
      // Mostrar overlay de "Busted" após 10 segundos
      setTimeout(() => {
        const overlay = document.createElement('div');
        overlay.className = 'easter-egg-overlay busted';
        overlay.innerHTML = '<h1>BUSTED</h1>';
        document.body.appendChild(overlay);
        
        playSound('busted.mp3');
        
        // Remover após 3 segundos
        setTimeout(() => {
          overlay.remove();
          document.body.classList.remove('wanted-level-6');
        }, 3000);
      }, 10000);
      break;
      
    case 'cousins':
      // Mostrar mensagem de Roman
      const chatBot = document.querySelector('.chat-bot');
      if (chatBot) {
        const chatBotToggle = chatBot.querySelector('.chat-bot__toggle');
        if (chatBotToggle && chatBotToggle.getAttribute('aria-expanded') === 'false') {
          chatBotToggle.click();
        }
        
        // Adicionar mensagem especial
        setTimeout(() => {
          addChatBotMessage("Hey cousin! Let's go bowling!", 'bot');
          playSound('bowling.mp3');
        }, 500);
      }
      break;
  }
}

// Reproduzir som
function playSound(filename) {
  const sound = new Audio(`/assets/audio/${filename}`);
  sound.volume = 0.5;
  sound.play().catch(err => console.log('Audio playback error:', err));
}

// Adicionar mensagem ao chat bot
function addChatBotMessage(text, type) {
  const chatMessages = document.querySelector('.chat-bot__messages');
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
}

// Adicionar listeners globais
function addGlobalEventListeners() {
  // Listener para links internos com scroll suave
  document.addEventListener('click', (e) => {
    const target = e.target.closest('a[href^="#"]');
    if (!target) return;
    
    const id = target.getAttribute('href');
    const element = document.querySelector(id);
    
    if (element) {
      e.preventDefault();
      window.scrollTo({
        top: element.offsetTop - 80, // Ajuste para o header fixo
        behavior: 'smooth'
      });
    }
  });
  
  // Listener para teclas de acessibilidade
  document.addEventListener('keydown', (e) => {
    // ESC para fechar modais
    if (e.key === 'Escape') {
      const activeModals = document.querySelectorAll('.modal.active, .gallery-lightbox.active, .search-overlay.active');
      activeModals.forEach(modal => {
        const closeBtn = modal.querySelector('.modal__close, .gallery-lightbox__close, .search-overlay__close');
        if (closeBtn) closeBtn.click();
      });
    }
    
    // Tab para navegação por teclado
    if (e.key === 'Tab') {
      document.body.classList.add('keyboard-navigation');
    }
  });
  
  // Remover classe de navegação por teclado ao usar mouse
  document.addEventListener('mousedown', () => {
    document.body.classList.remove('keyboard-navigation');
  });
  
  // Listener para mudanças de preferência de redução de movimento
  window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', (e) => {
    CONFIG.animations.reducedMotion = e.matches;
    
    // Recarregar animações com novas configurações
    if (CONFIG.animations.enabled) {
      initAnimations(CONFIG.animations);
      initParallax();
    }
  });
}

// Inicializar quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', initApp);

// Exportar funções e configurações para uso em outros scripts
export {
  CONFIG,
  playSound,
  addChatBotMessage,
  activateEasterEgg
};
