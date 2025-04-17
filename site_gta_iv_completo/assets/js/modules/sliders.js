// Módulo de sliders para o site GTA IV

/**
 * Inicializa todos os sliders do site
 */
export function initSliders() {
  // Inicializar diferentes tipos de sliders
  initFeaturedSlider();
  initTestimonialsSlider();
  initCarouselSliders();
  
  // Adicionar suporte a swipe para dispositivos touch
  addSwipeSupport();
}

/**
 * Inicializa o slider de itens em destaque
 */
function initFeaturedSlider() {
  const featuredSlider = document.querySelector('.featured-slider');
  if (!featuredSlider) return;
  
  const sliderContainer = featuredSlider.querySelector('.featured-slider__container');
  const sliderTrack = featuredSlider.querySelector('.slider__track');
  const slides = featuredSlider.querySelectorAll('.featured-vehicle');
  const prevButton = featuredSlider.querySelector('.slider-control--prev');
  const nextButton = featuredSlider.querySelector('.slider-control--next');
  
  if (!sliderTrack || slides.length === 0) return;
  
  // Configuração do slider
  let currentIndex = 0;
  const slideWidth = 100; // Porcentagem
  const slidesToShow = getSlidesToShow();
  const totalSlides = slides.length;
  
  // Configurar largura do track e dos slides
  sliderTrack.style.width = `${(totalSlides / slidesToShow) * 100}%`;
  slides.forEach(slide => {
    slide.style.flex = `0 0 ${slideWidth / slidesToShow}%`;
  });
  
  // Adicionar listeners aos botões
  if (prevButton) {
    prevButton.addEventListener('click', () => {
      goToSlide(currentIndex - 1);
    });
  }
  
  if (nextButton) {
    nextButton.addEventListener('click', () => {
      goToSlide(currentIndex + 1);
    });
  }
  
  // Adicionar indicadores se necessário
  addSliderIndicators(featuredSlider, totalSlides);
  
  // Iniciar autoplay se configurado
  if (featuredSlider.dataset.autoplay === 'true') {
    const interval = parseInt(featuredSlider.dataset.interval, 10) || 5000;
    startAutoplay(interval);
  }
  
  // Atualizar slider ao redimensionar a janela
  window.addEventListener('resize', () => {
    const newSlidesToShow = getSlidesToShow();
    if (newSlidesToShow !== slidesToShow) {
      // Recarregar slider se o número de slides visíveis mudar
      location.reload();
    }
  });
  
  /**
   * Navega para um slide específico
   * @param {number} index - Índice do slide
   */
  function goToSlide(index) {
    // Garantir que o índice esteja dentro dos limites
    if (index < 0) {
      index = totalSlides - slidesToShow;
    } else if (index > totalSlides - slidesToShow) {
      index = 0;
    }
    
    currentIndex = index;
    
    // Calcular a posição de translação
    const translateX = -(index * (slideWidth / slidesToShow));
    
    // Aplicar translação com animação
    sliderTrack.style.transform = `translateX(${translateX}%)`;
    
    // Atualizar indicadores
    updateIndicators();
    
    // Disparar evento
    const event = new CustomEvent('slidechange', { 
      detail: { slider: 'featured', index: currentIndex } 
    });
    document.dispatchEvent(event);
  }
  
  /**
   * Inicia o autoplay do slider
   * @param {number} interval - Intervalo em milissegundos
   */
  function startAutoplay(interval) {
    let autoplayTimer;
    
    function play() {
      autoplayTimer = setInterval(() => {
        goToSlide(currentIndex + 1);
      }, interval);
    }
    
    // Iniciar autoplay
    play();
    
    // Pausar ao passar o mouse
    featuredSlider.addEventListener('mouseenter', () => {
      clearInterval(autoplayTimer);
    });
    
    // Retomar ao remover o mouse
    featuredSlider.addEventListener('mouseleave', () => {
      play();
    });
    
    // Pausar ao tocar (dispositivos móveis)
    featuredSlider.addEventListener('touchstart', () => {
      clearInterval(autoplayTimer);
    }, { passive: true });
    
    // Retomar após um tempo sem interação
    featuredSlider.addEventListener('touchend', () => {
      setTimeout(play, 3000);
    }, { passive: true });
  }
  
  /**
   * Adiciona indicadores ao slider
   * @param {HTMLElement} slider - Elemento do slider
   * @param {number} count - Número total de slides
   */
  function addSliderIndicators(slider, count) {
    // Verificar se já existem indicadores
    if (slider.querySelector('.slider-indicators')) return;
    
    // Criar container de indicadores
    const indicators = document.createElement('div');
    indicators.className = 'slider-indicators';
    
    // Criar indicadores individuais
    for (let i = 0; i < count - slidesToShow + 1; i++) {
      const indicator = document.createElement('button');
      indicator.className = 'slider-indicator';
      indicator.setAttribute('aria-label', `Ir para slide ${i + 1}`);
      
      // Adicionar listener
      indicator.addEventListener('click', () => {
        goToSlide(i);
      });
      
      indicators.appendChild(indicator);
    }
    
    // Adicionar ao slider
    slider.appendChild(indicators);
    
    // Marcar indicador inicial como ativo
    updateIndicators();
  }
  
  /**
   * Atualiza o estado dos indicadores
   */
  function updateIndicators() {
    const indicators = featuredSlider.querySelectorAll('.slider-indicator');
    
    indicators.forEach((indicator, index) => {
      if (index === currentIndex) {
        indicator.classList.add('slider-indicator--active');
        indicator.setAttribute('aria-current', 'true');
      } else {
        indicator.classList.remove('slider-indicator--active');
        indicator.removeAttribute('aria-current');
      }
    });
  }
  
  /**
   * Determina o número de slides a mostrar com base na largura da tela
   * @returns {number} - Número de slides a mostrar
   */
  function getSlidesToShow() {
    if (window.matchMedia('(min-width: 992px)').matches) {
      return 3;
    } else if (window.matchMedia('(min-width: 768px)').matches) {
      return 2;
    } else {
      return 1;
    }
  }
}

/**
 * Inicializa o slider de depoimentos
 */
function initTestimonialsSlider() {
  const testimonialsSlider = document.querySelector('.testimonials__slider');
  if (!testimonialsSlider) return;
  
  const testimonials = testimonialsSlider.querySelectorAll('.testimonial');
  if (testimonials.length <= 1) return;
  
  // Configuração do slider
  let currentIndex = 0;
  
  // Esconder todos os depoimentos exceto o primeiro
  testimonials.forEach((testimonial, index) => {
    if (index !== 0) {
      testimonial.style.display = 'none';
      testimonial.setAttribute('aria-hidden', 'true');
    } else {
      testimonial.setAttribute('aria-hidden', 'false');
    }
  });
  
  // Criar botões de navegação
  const prevButton = document.createElement('button');
  prevButton.className = 'testimonials__prev';
  prevButton.innerHTML = '&lt;';
  prevButton.setAttribute('aria-label', 'Depoimento anterior');
  
  const nextButton = document.createElement('button');
  nextButton.className = 'testimonials__next';
  nextButton.innerHTML = '&gt;';
  nextButton.setAttribute('aria-label', 'Próximo depoimento');
  
  testimonialsSlider.appendChild(prevButton);
  testimonialsSlider.appendChild(nextButton);
  
  // Adicionar listeners aos botões
  prevButton.addEventListener('click', () => {
    showTestimonial((currentIndex - 1 + testimonials.length) % testimonials.length);
  });
  
  nextButton.addEventListener('click', () => {
    showTestimonial((currentIndex + 1) % testimonials.length);
  });
  
  // Iniciar autoplay
  const interval = parseInt(testimonialsSlider.dataset.interval, 10) || 8000;
  let autoplayTimer = setInterval(() => {
    showTestimonial((currentIndex + 1) % testimonials.length);
  }, interval);
  
  // Pausar autoplay ao passar o mouse
  testimonialsSlider.addEventListener('mouseenter', () => {
    clearInterval(autoplayTimer);
  });
  
  // Retomar autoplay ao remover o mouse
  testimonialsSlider.addEventListener('mouseleave', () => {
    autoplayTimer = setInterval(() => {
      showTestimonial((currentIndex + 1) % testimonials.length);
    }, interval);
  });
  
  /**
   * Mostra um depoimento específico
   * @param {number} index - Índice do depoimento
   */
  function showTestimonial(index) {
    // Esconder depoimento atual
    testimonials[currentIndex].style.display = 'none';
    testimonials[currentIndex].setAttribute('aria-hidden', 'true');
    
    // Mostrar novo depoimento
    testimonials[index].style.display = 'block';
    testimonials[index].setAttribute('aria-hidden', 'false');
    
    // Adicionar animação de fade
    testimonials[index].style.opacity = '0';
    setTimeout(() => {
      testimonials[index].style.transition = 'opacity 0.5s ease';
      testimonials[index].style.opacity = '1';
    }, 50);
    
    // Atualizar índice atual
    currentIndex = index;
    
    // Disparar evento
    const event = new CustomEvent('testimonialchange', { 
      detail: { index: currentIndex } 
    });
    document.dispatchEvent(event);
  }
}

/**
 * Inicializa sliders de carrossel genéricos
 */
function initCarouselSliders() {
  const carousels = document.querySelectorAll('.slider:not(.featured-slider):not(.testimonials__slider)');
  
  carousels.forEach(carousel => {
    const sliderTrack = carousel.querySelector('.slider__track');
    const slides = carousel.querySelectorAll('.slider__item');
    const prevButton = carousel.querySelector('.slider-control--prev');
    const nextButton = carousel.querySelector('.slider-control--next');
    
    if (!sliderTrack || slides.length === 0) return;
    
    // Configuração do slider
    let currentIndex = 0;
    const slideWidth = 100; // Porcentagem
    const slidesToShow = getSlidesToShow(carousel);
    const totalSlides = slides.length;
    
    // Configurar largura do track e dos slides
    sliderTrack.style.width = `${(totalSlides / slidesToShow) * 100}%`;
    slides.forEach(slide => {
      slide.style.flex = `0 0 ${slideWidth / slidesToShow}%`;
    });
    
    // Adicionar listeners aos botões
    if (prevButton) {
      prevButton.addEventListener('click', () => {
        goToSlide(currentIndex - 1);
      });
    }
    
    if (nextButton) {
      nextButton.addEventListener('click', () => {
        goToSlide(currentIndex + 1);
      });
    }
    
    // Adicionar indicadores se necessário
    if (carousel.dataset.indicators === 'true') {
      addSliderIndicators(carousel, totalSlides);
    }
    
    // Iniciar autoplay se configurado
    if (carousel.dataset.autoplay === 'true') {
      const interval = parseInt(carousel.dataset.interval, 10) || 5000;
      startAutoplay(interval);
    }
    
    /**
     * Navega para um slide específico
     * @param {number} index - Índice do slide
     */
    function goToSlide(index) {
      // Garantir que o índice esteja dentro dos limites
      if (index < 0) {
        index = totalSlides - slidesToShow;
      } else if (index > totalSlides - slidesToShow) {
        index = 0;
      }
      
      currentIndex = index;
      
      // Calcular a posição de translação
      const translateX = -(index * (slideWidth / slidesToShow));
      
      // Aplicar translação com animação
      sliderTrack.style.transform = `translateX(${translateX}%)`;
      
      // Atualizar indicadores
      updateIndicators();
      
      // Disparar evento
      const event = new CustomEvent('slidechange', { 
        detail: { slider: carousel.id || 'carousel', index: currentIndex } 
      });
      document.dispatchEvent(event);
    }
    
    /**
     * Inicia o autoplay do slider
     * @param {number} interval - Intervalo em milissegundos
     */
    function startAutoplay(interval) {
      let autoplayTimer;
      
      function play() {
        autoplayTimer = setInterval(() => {
          goToSlide(currentIndex + 1);
        }, interval);
      }
      
      // Iniciar autoplay
      play();
      
      // Pausar ao passar o mouse
      carousel.addEventListener('mouseenter', () => {
        clearInterval(autoplayTimer);
      });
      
      // Retomar ao remover o mouse
      carousel.addEventListener('mouseleave', () => {
        play();
      });
      
      // Pausar ao tocar (dispositivos móveis)
      carousel.addEventListener('touchstart', () => {
        clearInterval(autoplayTimer);
      }, { passive: true });
      
      // Retomar após um tempo sem interação
      carousel.addEventListener('touchend', () => {
        setTimeout(play, 3000);
      }, { passive: true });
    }
    
    /**
     * Adiciona indicadores ao slider
     * @param {HTMLElement} slider - Elemento do slider
     * @param {number} count - Número total de slides
     */
    function addSliderIndicators(slider, count) {
      // Verificar se já existem indicadores
      if (slider.querySelector('.slider-indicators')) return;
      
      // Criar container de indicadores
      const indicators = document.createElement('div');
      indicators.className = 'slider-indicators';
      
      // Criar indicadores individuais
      for (let i = 0; i < count - slidesToShow + 1; i++) {
        const indicator = document.createElement('button');
        indicator.className = 'slider-indicator';
        indicator.setAttribute('aria-label', `Ir para slide ${i + 1}`);
        
        // Adicionar listener
        indicator.addEventListener('click', () => {
          goToSlide(i);
        });
        
        indicators.appendChild(indicator);
      }
      
      // Adicionar ao slider
      slider.appendChild(indicators);
      
      // Marcar indicador inicial como ativo
      updateIndicators();
    }
    
    /**
     * Atualiza o estado dos indicadores
     */
    function updateIndicators() {
      const indicators = carousel.querySelectorAll('.slider-indicator');
      
      indicators.forEach((indicator, index) => {
        if (index === currentIndex) {
          indicator.classList.add('slider-indicator--active');
          indicator.setAttribute('aria-current', 'true');
        } else {
          indicator.classList.remove('slider-indicator--active');
          indicator.removeAttribute('aria-current');
        }
      });
    }
    
    /**
     * Determina o número de slides a mostrar com base na largura da tela
     * @param {HTMLElement} slider - Elemento do slider
     * @returns {number} - Número de slides a mostrar
     */
    function getSlidesToShow(slider) {
      // Verificar configuração personalizada
      const desktop = parseInt(slider.dataset.desktop, 10) || 3;
      const tablet = parseInt(slider.dataset.tablet, 10) || 2;
      const mobile = parseInt(slider.dataset.mobile, 10) || 1;
      
      if (window.matchMedia('(min-width: 992px)').matches) {
        return desktop;
      } else if (window.matchMedia('(min-width: 768px)').matches) {
        return tablet;
      } else {
        return mobile;
      }
    }
  });
}

/**
 * Adiciona suporte a swipe para dispositivos touch
 */
function addSwipeSupport() {
  const sliders = document.querySelectorAll('.slider');
  
  sliders.forEach(slider => {
    let touchStartX = 0;
    let touchEndX = 0;
    
    slider.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    
    slider.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe(slider);
    }, { passive: true });
    
    function handleSwipe(slider) {
      const swipeThreshold = 50;
      if (touchEndX < touchStartX - swipeThreshold) {
        // Swipe para esquerda (próximo slide)
        const nextButton = slider.querySelector('.slider-control--next');
        if (nextButton) nextButton.click();
      } else if (touchEndX > touchStartX + swipeThreshold) {
        // Swipe para direita (slide anterior)
        const prevButton = slider.querySelector('.slider-control--prev');
        if (prevButton) prevButton.click();
      }
    }
  });
}

/**
 * Cria um novo slider dinamicamente
 * @param {Object} options - Opções de configuração
 * @param {string} containerId - ID do container onde adicionar o slider
 * @returns {HTMLElement} - Elemento do slider criado
 */
export function createSlider(options, containerId) {
  const defaultOptions = {
    items: [],
    slidesToShow: {
      desktop: 3,
      tablet: 2,
      mobile: 1
    },
    autoplay: false,
    interval: 5000,
    indicators: true
  };
  
  const config = { ...defaultOptions, ...options };
  const container = document.getElementById(containerId);
  
  if (!container) return null;
  
  // Criar elemento do slider
  const slider = document.createElement('div');
  slider.className = 'slider';
  slider.dataset.desktop = config.slidesToShow.desktop;
  slider.dataset.tablet = config.slidesToShow.tablet;
  slider.dataset.mobile = config.slidesToShow.mobile;
  slider.dataset.autoplay = config.autoplay;
  slider.dataset.interval = config.interval;
  slider.dataset.indicators = config.indicators;
  
  // Criar estrutura interna
  slider.innerHTML = `
    <div class="slider__container">
      <div class="slider__track"></div>
    </div>
    <button class="slider-control slider-control--prev" aria-label="Slide anterior">&lt;</button>
    <button class="slider-control slider-control--next" aria-label="Próximo slide">&gt;</button>
  `;
  
  // Adicionar slides
  const sliderTrack = slider.querySelector('.slider__track');
  
  config.items.forEach(item => {
    const slide = document.createElement('div');
    slide.className = 'slider__item';
    slide.innerHTML = item.content;
    sliderTrack.appendChild(slide);
  });
  
  // Adicionar ao container
  container.appendChild(slider);
  
  // Inicializar slider
  initSliders();
  
  return slider;
}
