// Módulo de tabs para o site GTA IV

/**
 * Inicializa todas as tabs do site
 */
export function initTabs() {
  // Selecionar todos os containers de tabs
  const tabsContainers = document.querySelectorAll('.tabs, .endings-tabs, .gallery-categories');
  
  if (tabsContainers.length === 0) return;
  
  tabsContainers.forEach(container => {
    const tabButtons = container.querySelectorAll('.tabs__button, .endings-tabs__button, .gallery-categories__tab');
    const tabContents = container.querySelectorAll('.tabs__content, .endings-tabs__content, .gallery-categories__content');
    
    if (tabButtons.length === 0 || tabContents.length === 0) return;
    
    // Configurar atributos ARIA para acessibilidade
    setupTabsAccessibility(container, tabButtons, tabContents);
    
    // Adicionar listeners aos botões
    tabButtons.forEach((button, index) => {
      button.addEventListener('click', () => {
        activateTab(container, button, index);
      });
      
      // Permitir navegação por teclado
      button.addEventListener('keydown', (e) => {
        handleTabKeyNavigation(e, tabButtons, index);
      });
    });
    
    // Ativar a primeira tab por padrão, ou a tab especificada por URL hash
    activateTabFromHash(container) || activateTab(container, tabButtons[0], 0);
    
    // Verificar hash da URL ao mudar
    window.addEventListener('hashchange', () => {
      activateTabFromHash(container);
    });
  });
  
  /**
   * Configura atributos ARIA para acessibilidade
   * @param {HTMLElement} container - Container das tabs
   * @param {NodeList} buttons - Botões das tabs
   * @param {NodeList} contents - Conteúdos das tabs
   */
  function setupTabsAccessibility(container, buttons, contents) {
    // Gerar ID único para o container se não tiver
    if (!container.id) {
      container.id = `tabs-${Math.floor(Math.random() * 10000)}`;
    }
    
    // Configurar role e atributos do container
    container.setAttribute('role', 'tablist');
    
    // Configurar cada botão e seu conteúdo correspondente
    buttons.forEach((button, index) => {
      // Gerar IDs únicos para botão e conteúdo
      const buttonId = `${container.id}-tab-${index}`;
      const contentId = `${container.id}-panel-${index}`;
      
      // Configurar botão
      button.id = buttonId;
      button.setAttribute('role', 'tab');
      button.setAttribute('aria-selected', 'false');
      button.setAttribute('aria-controls', contentId);
      button.setAttribute('tabindex', '-1');
      
      // Configurar conteúdo
      if (contents[index]) {
        contents[index].id = contentId;
        contents[index].setAttribute('role', 'tabpanel');
        contents[index].setAttribute('aria-labelledby', buttonId);
        contents[index].setAttribute('tabindex', '0');
        contents[index].setAttribute('hidden', 'true');
      }
    });
  }
  
  /**
   * Ativa uma tab específica
   * @param {HTMLElement} container - Container das tabs
   * @param {HTMLElement} activeButton - Botão da tab a ser ativada
   * @param {number} activeIndex - Índice da tab a ser ativada
   */
  function activateTab(container, activeButton, activeIndex) {
    const tabButtons = container.querySelectorAll('[role="tab"]');
    const tabContents = container.querySelectorAll('[role="tabpanel"]');
    
    // Desativar todas as tabs
    tabButtons.forEach(button => {
      button.setAttribute('aria-selected', 'false');
      button.setAttribute('tabindex', '-1');
      button.classList.remove('tabs__button--active', 'endings-tabs__button--active', 'gallery-categories__tab--active');
    });
    
    tabContents.forEach(content => {
      content.setAttribute('hidden', 'true');
      content.classList.remove('tabs__content--active', 'endings-tabs__content--active', 'gallery-categories__content--active');
    });
    
    // Ativar a tab selecionada
    activeButton.setAttribute('aria-selected', 'true');
    activeButton.setAttribute('tabindex', '0');
    activeButton.classList.add(getActiveClass(container, 'button'));
    activeButton.focus();
    
    // Ativar o conteúdo correspondente
    if (tabContents[activeIndex]) {
      tabContents[activeIndex].removeAttribute('hidden');
      tabContents[activeIndex].classList.add(getActiveClass(container, 'content'));
      
      // Animar entrada do conteúdo
      animateTabContent(tabContents[activeIndex]);
    }
    
    // Atualizar URL hash se a tab tiver um data-tab-id
    if (activeButton.dataset.tabId) {
      history.replaceState(null, null, `#${activeButton.dataset.tabId}`);
    }
    
    // Disparar evento
    const event = new CustomEvent('tabchange', { 
      detail: { 
        container: container.id,
        tabId: activeButton.dataset.tabId || null,
        index: activeIndex 
      } 
    });
    document.dispatchEvent(event);
  }
  
  /**
   * Ativa uma tab baseada no hash da URL
   * @param {HTMLElement} container - Container das tabs
   * @returns {boolean} - Verdadeiro se uma tab foi ativada, falso caso contrário
   */
  function activateTabFromHash(container) {
    if (!window.location.hash) return false;
    
    const hash = window.location.hash.substring(1);
    const tabButtons = container.querySelectorAll('[role="tab"]');
    
    for (let i = 0; i < tabButtons.length; i++) {
      if (tabButtons[i].dataset.tabId === hash) {
        activateTab(container, tabButtons[i], i);
        return true;
      }
    }
    
    return false;
  }
  
  /**
   * Manipula navegação por teclado entre tabs
   * @param {KeyboardEvent} event - Evento de teclado
   * @param {NodeList} buttons - Botões das tabs
   * @param {number} currentIndex - Índice atual
   */
  function handleTabKeyNavigation(event, buttons, currentIndex) {
    const maxIndex = buttons.length - 1;
    let newIndex;
    
    switch (event.key) {
      case 'ArrowRight':
        newIndex = currentIndex < maxIndex ? currentIndex + 1 : 0;
        event.preventDefault();
        buttons[newIndex].click();
        break;
        
      case 'ArrowLeft':
        newIndex = currentIndex > 0 ? currentIndex - 1 : maxIndex;
        event.preventDefault();
        buttons[newIndex].click();
        break;
        
      case 'Home':
        event.preventDefault();
        buttons[0].click();
        break;
        
      case 'End':
        event.preventDefault();
        buttons[maxIndex].click();
        break;
    }
  }
  
  /**
   * Anima a entrada do conteúdo da tab
   * @param {HTMLElement} content - Elemento de conteúdo
   */
  function animateTabContent(content) {
    // Verificar preferência de redução de movimento
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }
    
    content.style.opacity = '0';
    content.style.transform = 'translateY(10px)';
    
    setTimeout(() => {
      content.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
      content.style.opacity = '1';
      content.style.transform = 'translateY(0)';
    }, 50);
  }
  
  /**
   * Obtém a classe de elemento ativo baseada no tipo de container
   * @param {HTMLElement} container - Container das tabs
   * @param {string} elementType - Tipo de elemento ('button' ou 'content')
   * @returns {string} - Nome da classe CSS
   */
  function getActiveClass(container, elementType) {
    if (container.classList.contains('gallery-categories')) {
      return elementType === 'button' ? 'gallery-categories__tab--active' : 'gallery-categories__content--active';
    } else if (container.classList.contains('endings-tabs')) {
      return elementType === 'button' ? 'endings-tabs__button--active' : 'endings-tabs__content--active';
    } else {
      return elementType === 'button' ? 'tabs__button--active' : 'tabs__content--active';
    }
  }
}

/**
 * Ativa uma tab específica por ID
 * @param {string} tabId - ID da tab a ser ativada
 * @param {string} containerId - ID do container das tabs (opcional)
 */
export function activateTabById(tabId, containerId = null) {
  // Selecionar containers
  const containers = containerId 
    ? [document.getElementById(containerId)] 
    : document.querySelectorAll('.tabs, .endings-tabs, .gallery-categories');
  
  if (!containers || containers.length === 0) return;
  
  // Procurar a tab em cada container
  containers.forEach(container => {
    if (!container) return;
    
    const tabButtons = container.querySelectorAll('[role="tab"]');
    
    for (let i = 0; i < tabButtons.length; i++) {
      if (tabButtons[i].dataset.tabId === tabId || tabButtons[i].id === tabId) {
        // Simular clique na tab
        tabButtons[i].click();
        
        // Rolar para a tab se necessário
        tabButtons[i].scrollIntoView({ behavior: 'smooth', block: 'center' });
        break;
      }
    }
  });
}

/**
 * Cria um novo conjunto de tabs dinamicamente
 * @param {Object} options - Opções de configuração
 * @param {string} containerId - ID do container onde adicionar as tabs
 * @returns {HTMLElement} - Elemento das tabs criado
 */
export function createTabs(options, containerId) {
  const defaultOptions = {
    tabs: [],
    type: 'default', // 'default', 'endings', 'gallery'
    activeTab: 0
  };
  
  const config = { ...defaultOptions, ...options };
  const container = document.getElementById(containerId);
  
  if (!container || config.tabs.length === 0) return null;
  
  // Determinar classes baseadas no tipo
  let containerClass, buttonClass, contentClass, buttonActiveClass, contentActiveClass;
  
  switch (config.type) {
    case 'endings':
      containerClass = 'endings-tabs';
      buttonClass = 'endings-tabs__button';
      contentClass = 'endings-tabs__content';
      buttonActiveClass = 'endings-tabs__button--active';
      contentActiveClass = 'endings-tabs__content--active';
      break;
    case 'gallery':
      containerClass = 'gallery-categories';
      buttonClass = 'gallery-categories__tab';
      contentClass = 'gallery-categories__content';
      buttonActiveClass = 'gallery-categories__tab--active';
      contentActiveClass = 'gallery-categories__content--active';
      break;
    default:
      containerClass = 'tabs';
      buttonClass = 'tabs__button';
      contentClass = 'tabs__content';
      buttonActiveClass = 'tabs__button--active';
      contentActiveClass = 'tabs__content--active';
  }
  
  // Criar elemento das tabs
  const tabsElement = document.createElement('div');
  tabsElement.className = containerClass;
  tabsElement.id = `${containerId}-tabs`;
  
  // Criar navegação das tabs
  const tabsNav = document.createElement('div');
  tabsNav.className = `${containerClass}__nav`;
  
  // Criar conteúdo das tabs
  const tabsContents = document.createElement('div');
  tabsContents.className = `${containerClass}__contents`;
  
  // Adicionar tabs
  config.tabs.forEach((tab, index) => {
    // Criar botão
    const button = document.createElement('button');
    button.className = buttonClass;
    button.textContent = tab.title;
    button.dataset.tabId = tab.id || `tab-${index}`;
    
    if (index === config.activeTab) {
      button.classList.add(buttonActiveClass);
    }
    
    tabsNav.appendChild(button);
    
    // Criar conteúdo
    const content = document.createElement('div');
    content.className = contentClass;
    content.innerHTML = tab.content;
    
    if (index === config.activeTab) {
      content.classList.add(contentActiveClass);
    }
    
    tabsContents.appendChild(content);
  });
  
  // Montar estrutura
  tabsElement.appendChild(tabsNav);
  tabsElement.appendChild(tabsContents);
  
  // Adicionar ao container
  container.appendChild(tabsElement);
  
  // Inicializar tabs
  initTabs();
  
  return tabsElement;
}
