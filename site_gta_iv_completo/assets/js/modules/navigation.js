// Módulo de navegação para o site GTA IV

/**
 * Inicializa a navegação responsiva e interativa
 */
export function initNavigation() {
  const header = document.querySelector('.header');
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const searchToggle = document.querySelector('.search-toggle');
  const searchOverlay = document.querySelector('.search-overlay');
  const searchClose = document.querySelector('.search-overlay__close');
  
  // Navegação mobile
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      const expanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', !expanded);
      
      // Alternar classe no body para prevenir scroll
      document.body.classList.toggle('nav-open', !expanded);
      
      // Animar itens do menu
      if (!expanded) {
        animateMenuItems();
      }
    });
    
    // Fechar menu ao clicar em links
    const navLinks = navMenu.querySelectorAll('.nav-menu__link');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navToggle.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('nav-open');
      });
    });
    
    // Fechar menu ao pressionar ESC
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navToggle.getAttribute('aria-expanded') === 'true') {
        navToggle.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('nav-open');
      }
    });
    
    // Fechar menu ao clicar fora
    document.addEventListener('click', (e) => {
      if (
        navToggle.getAttribute('aria-expanded') === 'true' &&
        !navMenu.contains(e.target) &&
        !navToggle.contains(e.target)
      ) {
        navToggle.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('nav-open');
      }
    });
  }
  
  // Overlay de pesquisa
  if (searchToggle && searchOverlay && searchClose) {
    searchToggle.addEventListener('click', () => {
      searchOverlay.classList.add('active');
      document.body.classList.add('overlay-open');
      
      // Focar no campo de pesquisa
      const searchInput = searchOverlay.querySelector('.search-form__input');
      if (searchInput) {
        setTimeout(() => {
          searchInput.focus();
        }, 100);
      }
    });
    
    searchClose.addEventListener('click', () => {
      searchOverlay.classList.remove('active');
      document.body.classList.remove('overlay-open');
    });
    
    // Fechar ao pressionar ESC
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && searchOverlay.classList.contains('active')) {
        searchOverlay.classList.remove('active');
        document.body.classList.remove('overlay-open');
      }
    });
  }
  
  // Marcar item de menu ativo baseado na página atual
  markActiveMenuItem();
  
  // Adicionar classe de página atual ao body
  addCurrentPageClass();
  
  /**
   * Anima os itens do menu com efeito de entrada
   */
  function animateMenuItems() {
    const menuItems = navMenu.querySelectorAll('.nav-menu__item');
    
    menuItems.forEach((item, index) => {
      // Resetar animações
      item.style.opacity = '0';
      item.style.transform = 'translateY(20px)';
      
      // Aplicar animação com delay baseado no índice
      setTimeout(() => {
        item.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        item.style.opacity = '1';
        item.style.transform = 'translateY(0)';
      }, 50 * index);
    });
  }
  
  /**
   * Marca o item de menu correspondente à página atual
   */
  function markActiveMenuItem() {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-menu__link');
    
    navLinks.forEach(link => {
      const linkPath = link.getAttribute('href');
      const linkItem = link.closest('.nav-menu__item');
      
      if (linkPath === currentPath || 
          (currentPath === '/' && linkPath === 'index.html') ||
          (currentPath !== '/' && linkPath !== 'index.html' && currentPath.includes(linkPath))) {
        linkItem.classList.add('nav-menu__item--active');
      } else {
        linkItem.classList.remove('nav-menu__item--active');
      }
    });
  }
  
  /**
   * Adiciona classe ao body baseada na página atual
   */
  function addCurrentPageClass() {
    const path = window.location.pathname;
    let pageName = 'home';
    
    if (path.includes('story.html')) {
      pageName = 'story';
    } else if (path.includes('characters.html')) {
      pageName = 'characters';
    } else if (path.includes('world.html')) {
      pageName = 'world';
    } else if (path.includes('vehicles.html')) {
      pageName = 'vehicles';
    } else if (path.includes('missions.html')) {
      pageName = 'missions';
    } else if (path.includes('gallery.html')) {
      pageName = 'gallery';
    }
    
    document.body.classList.add(`page-${pageName}`);
    
    // Atualizar hero específico da página
    const hero = document.querySelector('.hero');
    if (hero) {
      hero.classList.add(`hero--${pageName}`);
    }
  }
}

/**
 * Atualiza a navegação quando o conteúdo muda dinamicamente
 */
export function updateNavigation() {
  markActiveMenuItem();
}

/**
 * Marca o item de menu correspondente à página atual
 */
function markActiveMenuItem() {
  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll('.nav-menu__link');
  
  navLinks.forEach(link => {
    const linkPath = link.getAttribute('href');
    const linkItem = link.closest('.nav-menu__item');
    
    if (linkPath === currentPath || 
        (currentPath === '/' && linkPath === 'index.html') ||
        (currentPath !== '/' && linkPath !== 'index.html' && currentPath.includes(linkPath))) {
      linkItem.classList.add('nav-menu__item--active');
    } else {
      linkItem.classList.remove('nav-menu__item--active');
    }
  });
}
