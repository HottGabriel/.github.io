// Módulo de mapa interativo para o site GTA IV

/**
 * Inicializa o mapa interativo de Liberty City
 */
export function initMap() {
  // Selecionar o container do mapa
  const mapContainer = document.querySelector('.map-container');
  if (!mapContainer) return;
  
  const mapImage = mapContainer.querySelector('.map-image');
  if (!mapImage) return;
  
  // Configurar hotspots do mapa
  setupMapHotspots(mapContainer);
  
  // Adicionar funcionalidade de zoom se configurado
  if (mapContainer.dataset.zoomable === 'true') {
    setupMapZoom(mapContainer, mapImage);
  }
  
  // Adicionar funcionalidade de arrasto se configurado
  if (mapContainer.dataset.draggable === 'true') {
    setupMapDrag(mapContainer, mapImage);
  }
  
  // Adicionar filtros de distritos se existirem
  setupDistrictFilters();
}

/**
 * Configura os hotspots do mapa
 * @param {HTMLElement} container - Container do mapa
 */
function setupMapHotspots(container) {
  const hotspots = container.querySelectorAll('.map-hotspot');
  
  hotspots.forEach(hotspot => {
    // Configurar tooltip
    const tooltip = hotspot.nextElementSibling;
    if (tooltip && tooltip.classList.contains('map-tooltip')) {
      // Posicionar tooltip
      positionTooltip(hotspot, tooltip);
      
      // Adicionar listeners para mostrar/esconder tooltip
      hotspot.addEventListener('mouseenter', () => {
        showTooltip(tooltip);
      });
      
      hotspot.addEventListener('mouseleave', () => {
        hideTooltip(tooltip);
      });
      
      // Suporte a toque
      hotspot.addEventListener('touchstart', (e) => {
        e.preventDefault();
        toggleTooltip(tooltip);
      }, { passive: false });
      
      // Acessibilidade
      hotspot.setAttribute('role', 'button');
      hotspot.setAttribute('aria-expanded', 'false');
      hotspot.setAttribute('aria-controls', tooltip.id || `tooltip-${Math.floor(Math.random() * 10000)}`);
      hotspot.setAttribute('tabindex', '0');
      
      // Suporte a teclado
      hotspot.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          toggleTooltip(tooltip);
        }
      });
    }
    
    // Adicionar animação de pulso
    hotspot.classList.add('pulse');
  });
  
  // Fechar tooltips ao clicar fora
  document.addEventListener('click', (e) => {
    if (!e.target.classList.contains('map-hotspot')) {
      const tooltips = container.querySelectorAll('.map-tooltip');
      tooltips.forEach(tooltip => {
        hideTooltip(tooltip);
      });
    }
  });
  
  /**
   * Posiciona um tooltip em relação ao seu hotspot
   * @param {HTMLElement} hotspot - Elemento hotspot
   * @param {HTMLElement} tooltip - Elemento tooltip
   */
  function positionTooltip(hotspot, tooltip) {
    // Definir ID para o tooltip se não tiver
    if (!tooltip.id) {
      tooltip.id = `tooltip-${Math.floor(Math.random() * 10000)}`;
    }
    
    // Posicionar tooltip baseado na posição do hotspot
    const hotspotRect = hotspot.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();
    
    const hotspotX = hotspotRect.left - containerRect.left + hotspotRect.width / 2;
    const hotspotY = hotspotRect.top - containerRect.top + hotspotRect.height / 2;
    
    // Determinar posição (acima, abaixo, esquerda, direita)
    const position = tooltip.dataset.position || 'bottom';
    
    switch (position) {
      case 'top':
        tooltip.style.bottom = `${containerRect.height - hotspotY + 10}px`;
        tooltip.style.left = `${hotspotX - tooltip.offsetWidth / 2}px`;
        break;
      case 'right':
        tooltip.style.left = `${hotspotX + 20}px`;
        tooltip.style.top = `${hotspotY - tooltip.offsetHeight / 2}px`;
        break;
      case 'left':
        tooltip.style.right = `${containerRect.width - hotspotX + 20}px`;
        tooltip.style.top = `${hotspotY - tooltip.offsetHeight / 2}px`;
        break;
      default: // bottom
        tooltip.style.top = `${hotspotY + 20}px`;
        tooltip.style.left = `${hotspotX - tooltip.offsetWidth / 2}px`;
    }
  }
  
  /**
   * Mostra um tooltip
   * @param {HTMLElement} tooltip - Elemento tooltip
   */
  function showTooltip(tooltip) {
    // Esconder outros tooltips
    const otherTooltips = container.querySelectorAll('.map-tooltip');
    otherTooltips.forEach(other => {
      if (other !== tooltip) {
        hideTooltip(other);
      }
    });
    
    // Mostrar tooltip
    tooltip.style.opacity = '1';
    tooltip.style.visibility = 'visible';
    
    // Atualizar ARIA
    const hotspot = tooltip.previousElementSibling;
    if (hotspot) {
      hotspot.setAttribute('aria-expanded', 'true');
    }
  }
  
  /**
   * Esconde um tooltip
   * @param {HTMLElement} tooltip - Elemento tooltip
   */
  function hideTooltip(tooltip) {
    tooltip.style.opacity = '0';
    tooltip.style.visibility = 'hidden';
    
    // Atualizar ARIA
    const hotspot = tooltip.previousElementSibling;
    if (hotspot) {
      hotspot.setAttribute('aria-expanded', 'false');
    }
  }
  
  /**
   * Alterna a visibilidade de um tooltip
   * @param {HTMLElement} tooltip - Elemento tooltip
   */
  function toggleTooltip(tooltip) {
    if (tooltip.style.visibility === 'visible') {
      hideTooltip(tooltip);
    } else {
      showTooltip(tooltip);
    }
  }
}

/**
 * Configura a funcionalidade de zoom do mapa
 * @param {HTMLElement} container - Container do mapa
 * @param {HTMLElement} image - Imagem do mapa
 */
function setupMapZoom(container, image) {
  // Criar controles de zoom
  const zoomControls = document.createElement('div');
  zoomControls.className = 'map-zoom-controls';
  
  const zoomInButton = document.createElement('button');
  zoomInButton.className = 'map-zoom-in';
  zoomInButton.innerHTML = '+';
  zoomInButton.setAttribute('aria-label', 'Aumentar zoom');
  
  const zoomOutButton = document.createElement('button');
  zoomOutButton.className = 'map-zoom-out';
  zoomOutButton.innerHTML = '-';
  zoomOutButton.setAttribute('aria-label', 'Diminuir zoom');
  
  const zoomResetButton = document.createElement('button');
  zoomResetButton.className = 'map-zoom-reset';
  zoomResetButton.innerHTML = '&#x21bb;';
  zoomResetButton.setAttribute('aria-label', 'Resetar zoom');
  
  zoomControls.appendChild(zoomInButton);
  zoomControls.appendChild(zoomOutButton);
  zoomControls.appendChild(zoomResetButton);
  
  container.appendChild(zoomControls);
  
  // Configurar variáveis de zoom
  let scale = 1;
  const maxScale = 3;
  const minScale = 1;
  const scaleStep = 0.2;
  
  // Adicionar listeners aos botões
  zoomInButton.addEventListener('click', () => {
    zoomIn();
  });
  
  zoomOutButton.addEventListener('click', () => {
    zoomOut();
  });
  
  zoomResetButton.addEventListener('click', () => {
    resetZoom();
  });
  
  // Adicionar suporte a roda do mouse
  container.addEventListener('wheel', (e) => {
    e.preventDefault();
    
    if (e.deltaY < 0) {
      zoomIn();
    } else {
      zoomOut();
    }
  }, { passive: false });
  
  // Adicionar suporte a pinch zoom em dispositivos touch
  let initialDistance = 0;
  let initialScale = 1;
  
  container.addEventListener('touchstart', (e) => {
    if (e.touches.length === 2) {
      initialDistance = getTouchDistance(e.touches);
      initialScale = scale;
    }
  }, { passive: true });
  
  container.addEventListener('touchmove', (e) => {
    if (e.touches.length === 2) {
      e.preventDefault();
      
      const currentDistance = getTouchDistance(e.touches);
      const distanceRatio = currentDistance / initialDistance;
      
      scale = Math.min(maxScale, Math.max(minScale, initialScale * distanceRatio));
      applyZoom();
    }
  }, { passive: false });
  
  /**
   * Aumenta o zoom do mapa
   */
  function zoomIn() {
    if (scale < maxScale) {
      scale += scaleStep;
      applyZoom();
    }
  }
  
  /**
   * Diminui o zoom do mapa
   */
  function zoomOut() {
    if (scale > minScale) {
      scale -= scaleStep;
      applyZoom();
    }
  }
  
  /**
   * Reseta o zoom do mapa
   */
  function resetZoom() {
    scale = 1;
    applyZoom();
    
    // Resetar posição se houver arrasto
    if (container.dataset.draggable === 'true') {
      image.style.transform = `scale(${scale})`;
      image.style.left = '0';
      image.style.top = '0';
    }
  }
  
  /**
   * Aplica o zoom atual à imagem
   */
  function applyZoom() {
    if (container.dataset.draggable === 'true') {
      // Se for arrastável, a transformação é aplicada separadamente
      image.style.transform = `scale(${scale})`;
    } else {
      image.style.transform = `scale(${scale})`;
      image.style.transformOrigin = 'center center';
    }
    
    // Atualizar estado dos botões
    zoomInButton.disabled = scale >= maxScale;
    zoomOutButton.disabled = scale <= minScale;
    
    // Disparar evento
    const event = new CustomEvent('mapzoom', { 
      detail: { scale } 
    });
    document.dispatchEvent(event);
  }
  
  /**
   * Calcula a distância entre dois toques
   * @param {TouchList} touches - Lista de toques
   * @returns {number} - Distância entre os toques
   */
  function getTouchDistance(touches) {
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
  }
}

/**
 * Configura a funcionalidade de arrasto do mapa
 * @param {HTMLElement} container - Container do mapa
 * @param {HTMLElement} image - Imagem do mapa
 */
function setupMapDrag(container, image) {
  // Configurar variáveis de arrasto
  let isDragging = false;
  let startX, startY;
  let translateX = 0;
  let translateY = 0;
  
  // Configurar estilo do container
  container.style.overflow = 'hidden';
  container.style.position = 'relative';
  
  // Configurar estilo da imagem
  image.style.position = 'relative';
  image.style.cursor = 'grab';
  
  // Adicionar listeners de mouse
  image.addEventListener('mousedown', startDrag);
  document.addEventListener('mousemove', drag);
  document.addEventListener('mouseup', endDrag);
  
  // Adicionar listeners de touch
  image.addEventListener('touchstart', startDrag, { passive: false });
  document.addEventListener('touchmove', drag, { passive: false });
  document.addEventListener('touchend', endDrag);
  
  /**
   * Inicia o arrasto
   * @param {Event} e - Evento de mouse ou touch
   */
  function startDrag(e) {
    e.preventDefault();
    
    isDragging = true;
    image.style.cursor = 'grabbing';
    
    if (e.type === 'mousedown') {
      startX = e.clientX - translateX;
      startY = e.clientY - translateY;
    } else if (e.type === 'touchstart' && e.touches.length === 1) {
      startX = e.touches[0].clientX - translateX;
      startY = e.touches[0].clientY - translateY;
    }
  }
  
  /**
   * Executa o arrasto
   * @param {Event} e - Evento de mouse ou touch
   */
  function drag(e) {
    if (!isDragging) return;
    
    e.preventDefault();
    
    let clientX, clientY;
    
    if (e.type === 'mousemove') {
      clientX = e.clientX;
      clientY = e.clientY;
    } else if (e.type === 'touchmove' && e.touches.length === 1) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      return;
    }
    
    translateX = clientX - startX;
    translateY = clientY - startY;
    
    // Limitar arrasto para não sair completamente da visualização
    const scale = parseFloat(getComputedStyle(image).transform.split(',')[3]) || 1;
    const containerRect = container.getBoundingClientRect();
    const imageRect = image.getBoundingClientRect();
    
    const maxX = (imageRect.width * scale - containerRect.width) / 2;
    const maxY = (imageRect.height * scale - containerRect.height) / 2;
    
    translateX = Math.max(-maxX, Math.min(maxX, translateX));
    translateY = Math.max(-maxY, Math.min(maxY, translateY));
    
    // Aplicar transformação
    image.style.left = `${translateX}px`;
    image.style.top = `${translateY}px`;
  }
  
  /**
   * Finaliza o arrasto
   */
  function endDrag() {
    isDragging = false;
    image.style.cursor = 'grab';
  }
}

/**
 * Configura os filtros de distritos do mapa
 */
function setupDistrictFilters() {
  const filterButtons = document.querySelectorAll('.district-filter');
  if (filterButtons.length === 0) return;
  
  const mapHotspots = document.querySelectorAll('.map-hotspot');
  if (mapHotspots.length === 0) return;
  
  // Adicionar listeners aos botões de filtro
  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      const district = button.dataset.district;
      
      // Remover classe ativa de todos os botões
      filterButtons.forEach(btn => {
        btn.classList.remove('district-filter--active');
      });
      
      // Adicionar classe ativa ao botão clicado
      button.classList.add('district-filter--active');
      
      // Filtrar hotspots
      filterMapHotspots(district);
    });
  });
  
  // Ativar o filtro "Todos" por padrão
  const allFilter = document.querySelector('.district-filter[data-district="all"]');
  if (allFilter) {
    allFilter.classList.add('district-filter--active');
  }
  
  /**
   * Filtra os hotspots do mapa por distrito
   * @param {string} district - Distrito para filtrar
   */
  function filterMapHotspots(district) {
    mapHotspots.forEach(hotspot => {
      if (district === 'all' || hotspot.dataset.district === district) {
        hotspot.style.display = 'block';
        hotspot.classList.add('fade-in');
      } else {
        hotspot.style.display = 'none';
        hotspot.classList.remove('fade-in');
      }
    });
    
    // Disparar evento
    const event = new CustomEvent('mapfilter', { 
      detail: { district } 
    });
    document.dispatchEvent(event);
  }
}

/**
 * Adiciona um hotspot ao mapa
 * @param {Object} options - Opções do hotspot
 * @param {string} containerId - ID do container do mapa
 * @returns {HTMLElement} - Elemento do hotspot criado
 */
export function addMapHotspot(options, containerId) {
  const defaultOptions = {
    x: 50, // Porcentagem
    y: 50, // Porcentagem
    title: 'Local',
    description: '',
    district: 'all',
    tooltipPosition: 'bottom'
  };
  
  const config = { ...defaultOptions, ...options };
  const container = document.getElementById(containerId);
  
  if (!container) return null;
  
  // Criar hotspot
  const hotspot = document.createElement('div');
  hotspot.className = 'map-hotspot';
  hotspot.style.left = `${config.x}%`;
  hotspot.style.top = `${config.y}%`;
  hotspot.dataset.district = config.district;
  
  // Criar tooltip
  const tooltip = document.createElement('div');
  tooltip.className = 'map-tooltip';
  tooltip.dataset.position = config.tooltipPosition;
  tooltip.id = `tooltip-${Math.floor(Math.random() * 10000)}`;
  
  // Adicionar conteúdo ao tooltip
  tooltip.innerHTML = `
    <h3 class="map-tooltip__title">${config.title}</h3>
    <p class="map-tooltip__description">${config.description}</p>
  `;
  
  // Adicionar ao container
  container.appendChild(hotspot);
  container.appendChild(tooltip);
  
  // Reinicializar mapa
  initMap();
  
  return hotspot;
}
