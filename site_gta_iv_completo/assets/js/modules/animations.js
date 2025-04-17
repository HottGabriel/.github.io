// Módulo de animações para o site GTA IV

/**
 * Inicializa as animações baseadas em scroll
 * @param {Object} config - Configuração das animações
 */
export function initAnimations(config = {}) {
  const defaultConfig = {
    enabled: true,
    reducedMotion: false
  };
  
  const animConfig = { ...defaultConfig, ...config };
  
  // Verificar se as animações estão habilitadas
  if (!animConfig.enabled) return;
  
  // Verificar preferência de redução de movimento
  if (animConfig.reducedMotion) {
    // Aplicar animações reduzidas
    applyReducedMotionAnimations();
    return;
  }
  
  // Selecionar elementos com atributos de animação
  const animatedElements = document.querySelectorAll('[data-aos]');
  
  if (animatedElements.length === 0) return;
  
  // Verificar suporte a IntersectionObserver
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Adicionar classe para animar
          entry.target.classList.add('aos-animate');
          
          // Verificar se a animação deve ocorrer apenas uma vez
          if (entry.target.dataset.aosOnce === 'true') {
            observer.unobserve(entry.target);
          }
        } else if (!entry.target.dataset.aosOnce) {
          // Remover classe se não for "apenas uma vez"
          entry.target.classList.remove('aos-animate');
        }
      });
    }, { 
      threshold: 0.1,
      rootMargin: '0px 0px -10% 0px' // Animar um pouco antes do elemento entrar completamente na tela
    });
    
    animatedElements.forEach(element => {
      // Configurar atraso se especificado
      if (element.dataset.aosDelay) {
        element.style.transitionDelay = `${element.dataset.aosDelay}ms`;
      }
      
      observer.observe(element);
    });
  } else {
    // Fallback para navegadores sem suporte a IntersectionObserver
    animatedElements.forEach(element => {
      element.classList.add('aos-animate');
    });
  }
  
  // Inicializar animações de contagem
  initCounterAnimations();
  
  // Inicializar animações de digitação
  initTypingAnimations();
  
  // Inicializar animações de entrada escalonada
  initStaggeredAnimations();
}

/**
 * Aplica animações reduzidas para usuários que preferem menos movimento
 */
function applyReducedMotionAnimations() {
  // Remover animações baseadas em scroll
  const animatedElements = document.querySelectorAll('[data-aos]');
  animatedElements.forEach(element => {
    element.classList.add('aos-animate');
    element.style.transition = 'none';
  });
  
  // Remover animações de parallax
  const parallaxElements = document.querySelectorAll('.parallax, .hero__parallax-layer');
  parallaxElements.forEach(element => {
    element.style.transform = 'none';
    element.style.transition = 'none';
    element.style.animation = 'none';
  });
  
  // Remover animações contínuas
  const continuousAnimations = document.querySelectorAll('.pulse, .bounce, .rotate, .shake, .flip');
  continuousAnimations.forEach(element => {
    element.style.animation = 'none';
  });
  
  // Simplificar transições
  document.documentElement.style.setProperty('--transition-fast', '0.1s');
  document.documentElement.style.setProperty('--transition-medium', '0.1s');
  document.documentElement.style.setProperty('--transition-slow', '0.1s');
}

/**
 * Inicializa animações de contagem para números
 */
function initCounterAnimations() {
  const counterElements = document.querySelectorAll('[data-counter]');
  
  if (counterElements.length === 0) return;
  
  // Verificar suporte a IntersectionObserver
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Iniciar animação de contagem
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    
    counterElements.forEach(element => {
      observer.observe(element);
    });
  } else {
    // Fallback para navegadores sem suporte a IntersectionObserver
    counterElements.forEach(element => {
      animateCounter(element);
    });
  }
  
  /**
   * Anima um contador de número de 0 até o valor final
   * @param {HTMLElement} element - Elemento contador
   */
  function animateCounter(element) {
    const target = parseInt(element.dataset.counter, 10);
    const duration = parseInt(element.dataset.counterDuration, 10) || 2000;
    const step = target / (duration / 16); // 60fps
    
    let current = 0;
    const startTime = performance.now();
    
    function updateCounter(timestamp) {
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Usar easing para desacelerar no final
      const easedProgress = easeOutQuart(progress);
      current = Math.floor(target * easedProgress);
      
      element.textContent = formatNumber(current);
      
      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      } else {
        element.textContent = formatNumber(target);
      }
    }
    
    requestAnimationFrame(updateCounter);
  }
  
  /**
   * Função de easing para desacelerar no final
   * @param {number} x - Progresso (0-1)
   * @returns {number} - Valor com easing aplicado
   */
  function easeOutQuart(x) {
    return 1 - Math.pow(1 - x, 4);
  }
  
  /**
   * Formata um número com separadores de milhar
   * @param {number} num - Número a ser formatado
   * @returns {string} - Número formatado
   */
  function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }
}

/**
 * Inicializa animações de digitação para texto
 */
function initTypingAnimations() {
  const typingElements = document.querySelectorAll('.typing-effect');
  
  if (typingElements.length === 0) return;
  
  // Verificar suporte a IntersectionObserver
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Iniciar animação de digitação
          animateTyping(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    
    typingElements.forEach(element => {
      // Salvar o texto original e limpar o elemento
      element.dataset.originalText = element.textContent;
      element.textContent = '';
      
      observer.observe(element);
    });
  } else {
    // Fallback para navegadores sem suporte a IntersectionObserver
    typingElements.forEach(element => {
      animateTyping(element);
    });
  }
  
  /**
   * Anima um efeito de digitação em um elemento
   * @param {HTMLElement} element - Elemento para animar
   */
  function animateTyping(element) {
    const text = element.dataset.originalText || element.textContent;
    const speed = parseInt(element.dataset.typingSpeed, 10) || 50;
    
    element.textContent = '';
    element.style.visibility = 'visible';
    
    let i = 0;
    function type() {
      if (i < text.length) {
        element.textContent += text.charAt(i);
        i++;
        setTimeout(type, speed);
      } else {
        // Remover classe para parar animação do cursor
        setTimeout(() => {
          element.classList.add('typing-complete');
        }, 1500);
      }
    }
    
    type();
  }
}

/**
 * Inicializa animações de entrada escalonada para grupos de elementos
 */
function initStaggeredAnimations() {
  const staggerContainers = document.querySelectorAll('.stagger-fade-in, .stagger-fade-up, .stagger-fade-down');
  
  if (staggerContainers.length === 0) return;
  
  // Verificar suporte a IntersectionObserver
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Animar filhos com atraso escalonado
          animateStaggeredChildren(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    
    staggerContainers.forEach(container => {
      observer.observe(container);
    });
  } else {
    // Fallback para navegadores sem suporte a IntersectionObserver
    staggerContainers.forEach(container => {
      animateStaggeredChildren(container);
    });
  }
  
  /**
   * Anima os filhos de um container com atraso escalonado
   * @param {HTMLElement} container - Container dos elementos
   */
  function animateStaggeredChildren(container) {
    const children = container.children;
    const staggerDelay = parseInt(container.dataset.staggerDelay, 10) || 100;
    
    Array.from(children).forEach((child, index) => {
      child.style.transitionDelay = `${index * staggerDelay}ms`;
      child.style.opacity = '0';
      child.style.transform = getInitialTransform(container);
      
      // Aplicar animação após um pequeno atraso
      setTimeout(() => {
        child.style.opacity = '1';
        child.style.transform = 'translate(0, 0)';
      }, 50);
    });
  }
  
  /**
   * Obtém a transformação inicial baseada na classe do container
   * @param {HTMLElement} container - Container dos elementos
   * @returns {string} - Transformação CSS inicial
   */
  function getInitialTransform(container) {
    if (container.classList.contains('stagger-fade-up')) {
      return 'translateY(20px)';
    } else if (container.classList.contains('stagger-fade-down')) {
      return 'translateY(-20px)';
    } else {
      return 'translate(0, 0)';
    }
  }
}

/**
 * Adiciona uma animação personalizada a um elemento
 * @param {HTMLElement} element - Elemento para animar
 * @param {string} animationName - Nome da animação CSS
 * @param {Object} options - Opções da animação
 */
export function addAnimation(element, animationName, options = {}) {
  const defaultOptions = {
    duration: '1s',
    delay: '0s',
    iterations: 1,
    fill: 'forwards',
    easing: 'ease'
  };
  
  const config = { ...defaultOptions, ...options };
  
  // Verificar se o elemento existe
  if (!element) return;
  
  // Configurar a animação
  element.style.animation = `${animationName} ${config.duration} ${config.easing} ${config.delay} ${config.iterations} ${config.fill}`;
  
  // Adicionar listener para o fim da animação
  if (config.onComplete) {
    element.addEventListener('animationend', config.onComplete, { once: true });
  }
  
  // Retornar função para parar a animação
  return {
    stop: () => {
      element.style.animation = 'none';
    }
  };
}

/**
 * Cria uma animação de entrada para um elemento
 * @param {HTMLElement} element - Elemento para animar
 * @param {string} type - Tipo de animação (fade, slide, zoom)
 * @param {Object} options - Opções da animação
 */
export function createEntranceAnimation(element, type = 'fade', options = {}) {
  const animationMap = {
    fade: 'fadeIn',
    fadeUp: 'fadeInUp',
    fadeDown: 'fadeInDown',
    fadeLeft: 'fadeInLeft',
    fadeRight: 'fadeInRight',
    zoom: 'zoomIn',
    slide: 'slideInFromBottom'
  };
  
  const animation = animationMap[type] || 'fadeIn';
  return addAnimation(element, animation, options);
}

/**
 * Cria uma animação de saída para um elemento
 * @param {HTMLElement} element - Elemento para animar
 * @param {string} type - Tipo de animação (fade, slide, zoom)
 * @param {Object} options - Opções da animação
 */
export function createExitAnimation(element, type = 'fade', options = {}) {
  const animationMap = {
    fade: 'fadeOut',
    fadeUp: 'fadeOutUp',
    fadeDown: 'fadeOutDown',
    fadeLeft: 'fadeOutLeft',
    fadeRight: 'fadeOutRight',
    zoom: 'zoomOut',
    slide: 'slideOutToBottom'
  };
  
  const animation = animationMap[type] || 'fadeOut';
  return addAnimation(element, animation, options);
}
