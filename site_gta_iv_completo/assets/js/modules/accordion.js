// Módulo de acordeão para o site GTA IV

/**
 * Inicializa todos os acordeões do site
 */
export function initAccordion() {
  // Selecionar todos os containers de acordeão
  const accordionContainers = document.querySelectorAll('.accordion');
  
  if (accordionContainers.length === 0) return;
  
  accordionContainers.forEach(container => {
    const accordionItems = container.querySelectorAll('.accordion__item');
    
    if (accordionItems.length === 0) return;
    
    // Configurar atributos ARIA para acessibilidade
    setupAccordionAccessibility(container, accordionItems);
    
    // Adicionar listeners aos headers dos itens
    accordionItems.forEach((item, index) => {
      const header = item.querySelector('.accordion__header');
      const content = item.querySelector('.accordion__content');
      
      if (!header || !content) return;
      
      header.addEventListener('click', () => {
        toggleAccordionItem(item, container.dataset.allowMultiple === 'true');
      });
      
      // Permitir navegação por teclado
      header.addEventListener('keydown', (e) => {
        handleAccordionKeyNavigation(e, accordionItems, index);
      });
    });
    
    // Abrir o primeiro item por padrão, se configurado
    if (container.dataset.openFirst === 'true' && accordionItems[0]) {
      toggleAccordionItem(accordionItems[0], true);
    }
    
    // Abrir item específico baseado em URL hash
    activateAccordionFromHash(container);
    
    // Verificar hash da URL ao mudar
    window.addEventListener('hashchange', () => {
      activateAccordionFromHash(container);
    });
  });
  
  /**
   * Configura atributos ARIA para acessibilidade
   * @param {HTMLElement} container - Container do acordeão
   * @param {NodeList} items - Itens do acordeão
   */
  function setupAccordionAccessibility(container, items) {
    // Gerar ID único para o container se não tiver
    if (!container.id) {
      container.id = `accordion-${Math.floor(Math.random() * 10000)}`;
    }
    
    // Configurar cada item
    items.forEach((item, index) => {
      const header = item.querySelector('.accordion__header');
      const content = item.querySelector('.accordion__content');
      
      if (!header || !content) return;
      
      // Gerar IDs únicos para header e conteúdo
      const headerId = `${container.id}-header-${index}`;
      const contentId = `${container.id}-panel-${index}`;
      
      // Configurar header
      header.id = headerId;
      header.setAttribute('role', 'button');
      header.setAttribute('aria-expanded', 'false');
      header.setAttribute('aria-controls', contentId);
      header.setAttribute('tabindex', '0');
      
      // Configurar conteúdo
      content.id = contentId;
      content.setAttribute('role', 'region');
      content.setAttribute('aria-labelledby', headerId);
      content.setAttribute('hidden', 'true');
    });
  }
  
  /**
   * Alterna o estado de um item do acordeão
   * @param {HTMLElement} item - Item do acordeão
   * @param {boolean} allowMultiple - Se múltiplos itens podem estar abertos simultaneamente
   */
  function toggleAccordionItem(item, allowMultiple) {
    const header = item.querySelector('.accordion__header');
    const content = item.querySelector('.accordion__content');
    const isExpanded = header.getAttribute('aria-expanded') === 'true';
    
    // Fechar outros itens se não permitir múltiplos
    if (!allowMultiple && !isExpanded) {
      const container = item.closest('.accordion');
      const otherItems = container.querySelectorAll('.accordion__item');
      
      otherItems.forEach(otherItem => {
        if (otherItem !== item) {
          const otherHeader = otherItem.querySelector('.accordion__header');
          const otherContent = otherItem.querySelector('.accordion__content');
          
          if (otherHeader && otherContent) {
            otherHeader.setAttribute('aria-expanded', 'false');
            otherContent.setAttribute('hidden', 'true');
            otherItem.classList.remove('accordion__item--active');
          }
        }
      });
    }
    
    // Alternar estado do item atual
    header.setAttribute('aria-expanded', !isExpanded);
    
    if (isExpanded) {
      content.setAttribute('hidden', 'true');
      item.classList.remove('accordion__item--active');
    } else {
      content.removeAttribute('hidden');
      item.classList.add('accordion__item--active');
      
      // Animar entrada do conteúdo
      animateAccordionContent(content);
      
      // Rolar para o item se estiver fora da visualização
      if (!isElementInViewport(header)) {
        header.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
    
    // Atualizar URL hash se o item tiver um data-accordion-id
    if (header.dataset.accordionId && !isExpanded) {
      history.replaceState(null, null, `#${header.dataset.accordionId}`);
    }
    
    // Disparar evento
    const event = new CustomEvent('accordionchange', { 
      detail: { 
        container: item.closest('.accordion').id,
        itemId: header.dataset.accordionId || null,
        expanded: !isExpanded 
      } 
    });
    document.dispatchEvent(event);
  }
  
  /**
   * Ativa um item do acordeão baseado no hash da URL
   * @param {HTMLElement} container - Container do acordeão
   */
  function activateAccordionFromHash(container) {
    if (!window.location.hash) return;
    
    const hash = window.location.hash.substring(1);
    const headers = container.querySelectorAll('.accordion__header');
    
    for (let i = 0; i < headers.length; i++) {
      if (headers[i].dataset.accordionId === hash) {
        const item = headers[i].closest('.accordion__item');
        toggleAccordionItem(item, true);
        break;
      }
    }
  }
  
  /**
   * Manipula navegação por teclado entre itens do acordeão
   * @param {KeyboardEvent} event - Evento de teclado
   * @param {NodeList} items - Itens do acordeão
   * @param {number} currentIndex - Índice atual
   */
  function handleAccordionKeyNavigation(event, items, currentIndex) {
    const maxIndex = items.length - 1;
    let newIndex;
    
    switch (event.key) {
      case 'ArrowDown':
        newIndex = currentIndex < maxIndex ? currentIndex + 1 : 0;
        event.preventDefault();
        items[newIndex].querySelector('.accordion__header').focus();
        break;
        
      case 'ArrowUp':
        newIndex = currentIndex > 0 ? currentIndex - 1 : maxIndex;
        event.preventDefault();
        items[newIndex].querySelector('.accordion__header').focus();
        break;
        
      case 'Home':
        event.preventDefault();
        items[0].querySelector('.accordion__header').focus();
        break;
        
      case 'End':
        event.preventDefault();
        items[maxIndex].querySelector('.accordion__header').focus();
        break;
        
      case 'Enter':
      case ' ':
        event.preventDefault();
        event.target.click();
        break;
    }
  }
  
  /**
   * Anima a entrada do conteúdo do acordeão
   * @param {HTMLElement} content - Elemento de conteúdo
   */
  function animateAccordionContent(content) {
    // Verificar preferência de redução de movimento
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }
    
    content.style.opacity = '0';
    
    setTimeout(() => {
      content.style.transition = 'opacity 0.3s ease';
      content.style.opacity = '1';
    }, 50);
  }
  
  /**
   * Verifica se um elemento está visível na viewport
   * @param {HTMLElement} element - Elemento a verificar
   * @returns {boolean} - Verdadeiro se o elemento estiver visível
   */
  function isElementInViewport(element) {
    const rect = element.getBoundingClientRect();
    
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  }
}

/**
 * Abre um item específico do acordeão por ID
 * @param {string} itemId - ID do item a ser aberto
 * @param {string} containerId - ID do container do acordeão (opcional)
 */
export function openAccordionItem(itemId, containerId = null) {
  // Selecionar containers
  const containers = containerId 
    ? [document.getElementById(containerId)] 
    : document.querySelectorAll('.accordion');
  
  if (!containers || containers.length === 0) return;
  
  // Procurar o item em cada container
  containers.forEach(container => {
    if (!container) return;
    
    const headers = container.querySelectorAll('.accordion__header');
    
    for (let i = 0; i < headers.length; i++) {
      if (headers[i].dataset.accordionId === itemId || headers[i].id === itemId) {
        const item = headers[i].closest('.accordion__item');
        
        // Abrir o item
        if (item) {
          const header = item.querySelector('.accordion__header');
          if (header.getAttribute('aria-expanded') !== 'true') {
            header.click();
          }
          
          // Rolar para o item
          setTimeout(() => {
            header.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }, 100);
        }
        
        break;
      }
    }
  });
}

/**
 * Cria um novo acordeão dinamicamente
 * @param {Object} options - Opções de configuração
 * @param {string} containerId - ID do container onde adicionar o acordeão
 * @returns {HTMLElement} - Elemento do acordeão criado
 */
export function createAccordion(options, containerId) {
  const defaultOptions = {
    items: [],
    allowMultiple: false,
    openFirst: false
  };
  
  const config = { ...defaultOptions, ...options };
  const container = document.getElementById(containerId);
  
  if (!container || config.items.length === 0) return null;
  
  // Criar elemento do acordeão
  const accordion = document.createElement('div');
  accordion.className = 'accordion';
  accordion.id = `${containerId}-accordion`;
  accordion.dataset.allowMultiple = config.allowMultiple.toString();
  accordion.dataset.openFirst = config.openFirst.toString();
  
  // Adicionar itens
  config.items.forEach((item, index) => {
    const accordionItem = document.createElement('div');
    accordionItem.className = 'accordion__item';
    
    // Criar header
    const header = document.createElement('div');
    header.className = 'accordion__header';
    header.dataset.accordionId = item.id || `accordion-item-${index}`;
    
    // Criar título
    const title = document.createElement('h3');
    title.className = 'accordion__title';
    title.textContent = item.title;
    
    // Criar ícone
    const icon = document.createElement('span');
    icon.className = 'accordion__icon';
    icon.innerHTML = '<svg viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"></polyline></svg>';
    
    header.appendChild(title);
    header.appendChild(icon);
    
    // Criar conteúdo
    const content = document.createElement('div');
    content.className = 'accordion__content';
    
    const text = document.createElement('div');
    text.className = 'accordion__text';
    text.innerHTML = item.content;
    
    content.appendChild(text);
    
    // Montar item
    accordionItem.appendChild(header);
    accordionItem.appendChild(content);
    
    // Adicionar ao acordeão
    accordion.appendChild(accordionItem);
  });
  
  // Adicionar ao container
  container.appendChild(accordion);
  
  // Inicializar acordeão
  initAccordion();
  
  return accordion;
}
