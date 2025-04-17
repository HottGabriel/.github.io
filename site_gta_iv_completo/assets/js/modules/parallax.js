// Módulo de efeito parallax para o site GTA IV

/**
 * Inicializa os efeitos de parallax
 */
export function initParallax() {
  // Selecionar elementos com parallax
  const parallaxContainers = document.querySelectorAll('.hero__parallax-container');
  
  if (parallaxContainers.length === 0) return;
  
  // Verificar suporte a IntersectionObserver
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Ativar parallax quando visível
          activateParallax(entry.target);
        } else {
          // Desativar parallax quando não visível
          deactivateParallax(entry.target);
        }
      });
    }, { threshold: 0.1 });
    
    parallaxContainers.forEach(container => {
      observer.observe(container);
    });
  } else {
    // Fallback para navegadores sem suporte a IntersectionObserver
    parallaxContainers.forEach(container => {
      activateParallax(container);
    });
  }
  
  /**
   * Ativa o efeito parallax em um container
   * @param {HTMLElement} container - Container do parallax
   */
  function activateParallax(container) {
    const layers = container.querySelectorAll('.hero__parallax-layer');
    
    // Adicionar listener de scroll
    window.addEventListener('scroll', handleParallaxScroll);
    
    // Adicionar listener de movimento do mouse se disponível
    if (window.matchMedia('(min-width: 992px)').matches) {
      container.addEventListener('mousemove', handleParallaxMouseMove);
    }
    
    // Aplicar parallax inicial
    updateParallaxPosition();
    
    /**
     * Manipula o efeito parallax baseado no scroll
     */
    function handleParallaxScroll() {
      updateParallaxPosition();
    }
    
    /**
     * Manipula o efeito parallax baseado no movimento do mouse
     * @param {MouseEvent} e - Evento de movimento do mouse
     */
    function handleParallaxMouseMove(e) {
      const containerRect = container.getBoundingClientRect();
      const mouseX = e.clientX - containerRect.left;
      const mouseY = e.clientY - containerRect.top;
      
      // Calcular posição relativa do mouse (0-1)
      const relativeX = mouseX / containerRect.width;
      const relativeY = mouseY / containerRect.height;
      
      // Aplicar movimento baseado na posição do mouse
      layers.forEach((layer, index) => {
        const depth = index + 1;
        const moveX = (relativeX - 0.5) * depth * 20;
        const moveY = (relativeY - 0.5) * depth * 20;
        
        layer.style.transform = `translate3d(${moveX}px, ${moveY}px, 0)`;
      });
    }
    
    /**
     * Atualiza a posição dos elementos parallax baseado no scroll
     */
    function updateParallaxPosition() {
      const scrollY = window.scrollY;
      const containerRect = container.getBoundingClientRect();
      
      // Verificar se o container está visível
      if (containerRect.bottom < 0 || containerRect.top > window.innerHeight) {
        return;
      }
      
      // Aplicar parallax baseado no scroll
      layers.forEach((layer, index) => {
        const speed = 0.1 * (index + 1);
        const yOffset = scrollY * speed;
        
        // Aplicar transformação apenas se não houver transformação de mouse
        if (!window.matchMedia('(min-width: 992px)').matches) {
          layer.style.transform = `translate3d(0, ${yOffset}px, 0)`;
        }
        
        // Ajustar opacidade baseado no scroll
        const opacity = Math.max(0, Math.min(1, 1 - (scrollY * 0.002)));
        layer.style.opacity = opacity;
      });
    }
  }
  
  /**
   * Desativa o efeito parallax em um container
   * @param {HTMLElement} container - Container do parallax
   */
  function deactivateParallax(container) {
    window.removeEventListener('scroll', handleParallaxScroll);
    container.removeEventListener('mousemove', handleParallaxMouseMove);
    
    // Funções vazias para evitar erros
    function handleParallaxScroll() {}
    function handleParallaxMouseMove() {}
  }
}

/**
 * Cria um efeito parallax em qualquer elemento
 * @param {HTMLElement} element - Elemento para aplicar o parallax
 * @param {Object} options - Opções de configuração
 */
export function createParallaxEffect(element, options = {}) {
  const defaultOptions = {
    speed: 0.5,
    direction: 'vertical',
    reverse: false,
    mouseEffect: true
  };
  
  const config = { ...defaultOptions, ...options };
  
  // Verificar se o elemento existe
  if (!element) return;
  
  // Configurar o elemento
  element.style.willChange = 'transform';
  element.style.transition = 'transform 0.1s linear';
  
  // Adicionar listener de scroll
  window.addEventListener('scroll', handleScroll);
  
  // Adicionar listener de movimento do mouse se habilitado
  if (config.mouseEffect && window.matchMedia('(min-width: 992px)').matches) {
    element.addEventListener('mousemove', handleMouseMove);
  }
  
  // Aplicar parallax inicial
  handleScroll();
  
  /**
   * Manipula o efeito parallax baseado no scroll
   */
  function handleScroll() {
    const scrollY = window.scrollY;
    const elementRect = element.getBoundingClientRect();
    
    // Verificar se o elemento está visível
    if (elementRect.bottom < 0 || elementRect.top > window.innerHeight) {
      return;
    }
    
    // Calcular deslocamento
    const speed = config.reverse ? -config.speed : config.speed;
    const offset = scrollY * speed;
    
    // Aplicar transformação baseada na direção
    if (config.direction === 'vertical') {
      element.style.transform = `translate3d(0, ${offset}px, 0)`;
    } else if (config.direction === 'horizontal') {
      element.style.transform = `translate3d(${offset}px, 0, 0)`;
    }
  }
  
  /**
   * Manipula o efeito parallax baseado no movimento do mouse
   * @param {MouseEvent} e - Evento de movimento do mouse
   */
  function handleMouseMove(e) {
    const elementRect = element.getBoundingClientRect();
    const mouseX = e.clientX - elementRect.left;
    const mouseY = e.clientY - elementRect.top;
    
    // Calcular posição relativa do mouse (0-1)
    const relativeX = mouseX / elementRect.width;
    const relativeY = mouseY / elementRect.height;
    
    // Calcular deslocamento
    const moveX = (relativeX - 0.5) * 20 * config.speed;
    const moveY = (relativeY - 0.5) * 20 * config.speed;
    
    // Aplicar transformação
    if (config.direction === 'both') {
      element.style.transform = `translate3d(${moveX}px, ${moveY}px, 0)`;
    } else if (config.direction === 'vertical') {
      element.style.transform = `translate3d(0, ${moveY}px, 0)`;
    } else if (config.direction === 'horizontal') {
      element.style.transform = `translate3d(${moveX}px, 0, 0)`;
    }
  }
  
  // Retornar funções para remover os listeners
  return {
    destroy: () => {
      window.removeEventListener('scroll', handleScroll);
      element.removeEventListener('mousemove', handleMouseMove);
    }
  };
}
