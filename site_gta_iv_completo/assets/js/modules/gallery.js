// Módulo de galeria para o site GTA IV

/**
 * Inicializa a galeria de imagens interativa
 */
export function initGallery() {
  // Selecionar elementos da galeria
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightbox = document.querySelector('.gallery-lightbox');
  
  if (galleryItems.length === 0) return;
  
  // Verificar se o lightbox existe, se não, criar um
  let lightboxImage, lightboxCaption, lightboxClose, lightboxPrev, lightboxNext;
  
  if (!lightbox) {
    createLightbox();
  } else {
    // Obter elementos do lightbox existente
    lightboxImage = lightbox.querySelector('.gallery-lightbox__image');
    lightboxCaption = lightbox.querySelector('.gallery-lightbox__caption');
    lightboxClose = lightbox.querySelector('.gallery-lightbox__close');
    lightboxPrev = lightbox.querySelector('.gallery-lightbox__prev');
    lightboxNext = lightbox.querySelector('.gallery-lightbox__next');
    
    // Adicionar listeners aos controles
    setupLightboxControls();
  }
  
  // Adicionar listeners aos itens da galeria
  galleryItems.forEach((item, index) => {
    item.addEventListener('click', () => {
      openLightbox(index);
    });
    
    // Adicionar atributos de acessibilidade
    item.setAttribute('role', 'button');
    item.setAttribute('aria-label', 'Abrir imagem na galeria');
    item.setAttribute('tabindex', '0');
    
    // Permitir ativação por teclado
    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openLightbox(index);
      }
    });
  });
  
  // Inicializar filtros da galeria se existirem
  initGalleryFilters();
  
  // Índice da imagem atual no lightbox
  let currentIndex = 0;
  
  /**
   * Cria o lightbox se não existir no HTML
   */
  function createLightbox() {
    // Criar elementos do lightbox
    const newLightbox = document.createElement('div');
    newLightbox.className = 'gallery-lightbox';
    newLightbox.setAttribute('role', 'dialog');
    newLightbox.setAttribute('aria-modal', 'true');
    newLightbox.setAttribute('aria-label', 'Visualizador de imagens');
    
    newLightbox.innerHTML = `
      <div class="gallery-lightbox__content">
        <img class="gallery-lightbox__image" src="" alt="Imagem da galeria">
        <button class="gallery-lightbox__close" aria-label="Fechar galeria">&times;</button>
        <div class="gallery-lightbox__caption"></div>
        <button class="gallery-lightbox__prev" aria-label="Imagem anterior">&lt;</button>
        <button class="gallery-lightbox__next" aria-label="Próxima imagem">&gt;</button>
      </div>
    `;
    
    // Adicionar ao body
    document.body.appendChild(newLightbox);
    
    // Obter referências aos elementos
    lightbox = newLightbox;
    lightboxImage = lightbox.querySelector('.gallery-lightbox__image');
    lightboxCaption = lightbox.querySelector('.gallery-lightbox__caption');
    lightboxClose = lightbox.querySelector('.gallery-lightbox__close');
    lightboxPrev = lightbox.querySelector('.gallery-lightbox__prev');
    lightboxNext = lightbox.querySelector('.gallery-lightbox__next');
    
    // Configurar controles
    setupLightboxControls();
  }
  
  /**
   * Configura os controles do lightbox
   */
  function setupLightboxControls() {
    // Fechar lightbox
    lightboxClose.addEventListener('click', closeLightbox);
    
    // Navegação
    lightboxPrev.addEventListener('click', showPrevImage);
    lightboxNext.addEventListener('click', showNextImage);
    
    // Fechar ao clicar fora da imagem
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        closeLightbox();
      }
    });
    
    // Navegação por teclado
    lightbox.addEventListener('keydown', (e) => {
      switch (e.key) {
        case 'Escape':
          closeLightbox();
          break;
        case 'ArrowLeft':
          showPrevImage();
          break;
        case 'ArrowRight':
          showNextImage();
          break;
      }
    });
    
    // Swipe em dispositivos touch
    let touchStartX = 0;
    let touchEndX = 0;
    
    lightbox.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    
    lightbox.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    }, { passive: true });
    
    function handleSwipe() {
      const swipeThreshold = 50;
      if (touchEndX < touchStartX - swipeThreshold) {
        // Swipe para esquerda (próxima imagem)
        showNextImage();
      } else if (touchEndX > touchStartX + swipeThreshold) {
        // Swipe para direita (imagem anterior)
        showPrevImage();
      }
    }
  }
  
  /**
   * Abre o lightbox com a imagem especificada
   * @param {number} index - Índice da imagem na galeria
   */
  function openLightbox(index) {
    currentIndex = index;
    updateLightboxContent();
    
    // Mostrar lightbox
    lightbox.classList.add('active');
    document.body.classList.add('lightbox-open');
    
    // Focar no lightbox para navegação por teclado
    lightbox.focus();
    
    // Disparar evento
    const event = new CustomEvent('lightboxopen', { detail: { index } });
    document.dispatchEvent(event);
  }
  
  /**
   * Fecha o lightbox
   */
  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.classList.remove('lightbox-open');
    
    // Disparar evento
    const event = new CustomEvent('lightboxclose');
    document.dispatchEvent(event);
    
    // Devolver foco ao item da galeria
    galleryItems[currentIndex].focus();
  }
  
  /**
   * Mostra a imagem anterior
   */
  function showPrevImage() {
    currentIndex = (currentIndex - 1 + galleryItems.length) % galleryItems.length;
    updateLightboxContent();
  }
  
  /**
   * Mostra a próxima imagem
   */
  function showNextImage() {
    currentIndex = (currentIndex + 1) % galleryItems.length;
    updateLightboxContent();
  }
  
  /**
   * Atualiza o conteúdo do lightbox com a imagem atual
   */
  function updateLightboxContent() {
    const currentItem = galleryItems[currentIndex];
    const image = currentItem.querySelector('.gallery-item__image');
    const title = currentItem.querySelector('.gallery-item__title')?.textContent || '';
    const description = currentItem.querySelector('.gallery-item__description')?.textContent || '';
    
    // Atualizar src da imagem
    const imageSrc = image.dataset.fullsize || image.src;
    lightboxImage.src = imageSrc;
    lightboxImage.alt = image.alt || title;
    
    // Atualizar legenda
    lightboxCaption.textContent = description ? `${title} - ${description}` : title;
    
    // Atualizar navegação
    lightboxPrev.style.display = galleryItems.length > 1 ? 'block' : 'none';
    lightboxNext.style.display = galleryItems.length > 1 ? 'block' : 'none';
    
    // Disparar evento
    const event = new CustomEvent('lightboxchange', { detail: { index: currentIndex } });
    document.dispatchEvent(event);
  }
  
  /**
   * Inicializa os filtros da galeria
   */
  function initGalleryFilters() {
    const filterButtons = document.querySelectorAll('.gallery-categories__tab');
    if (filterButtons.length === 0) return;
    
    // Adicionar listeners aos botões de filtro
    filterButtons.forEach(button => {
      button.addEventListener('click', () => {
        // Remover classe ativa de todos os botões
        filterButtons.forEach(btn => {
          btn.classList.remove('gallery-categories__tab--active');
        });
        
        // Adicionar classe ativa ao botão clicado
        button.classList.add('gallery-categories__tab--active');
        
        // Filtrar itens da galeria
        const filter = button.dataset.filter;
        filterGalleryItems(filter);
      });
    });
    
    // Ativar o primeiro filtro por padrão
    if (filterButtons[0]) {
      filterButtons[0].click();
    }
  }
  
  /**
   * Filtra os itens da galeria
   * @param {string} filter - Categoria para filtrar
   */
  function filterGalleryItems(filter) {
    galleryItems.forEach(item => {
      if (filter === 'all' || item.dataset.category === filter) {
        // Mostrar item com animação
        item.style.display = 'block';
        setTimeout(() => {
          item.style.opacity = '1';
          item.style.transform = 'scale(1)';
        }, 50);
      } else {
        // Esconder item com animação
        item.style.opacity = '0';
        item.style.transform = 'scale(0.8)';
        setTimeout(() => {
          item.style.display = 'none';
        }, 300);
      }
    });
    
    // Disparar evento
    const event = new CustomEvent('galleryfilter', { detail: { filter } });
    document.dispatchEvent(event);
  }
}

/**
 * Carrega imagens de forma lazy
 * @param {NodeList|Array} images - Lista de elementos de imagem
 */
export function lazyLoadImages(images) {
  // Verificar suporte a IntersectionObserver
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const image = entry.target;
          
          // Carregar imagem
          if (image.dataset.src) {
            image.src = image.dataset.src;
            image.removeAttribute('data-src');
          }
          
          // Carregar srcset se existir
          if (image.dataset.srcset) {
            image.srcset = image.dataset.srcset;
            image.removeAttribute('data-srcset');
          }
          
          // Adicionar classe quando carregada
          image.addEventListener('load', () => {
            image.classList.add('loaded');
          });
          
          imageObserver.unobserve(image);
        }
      });
    }, { rootMargin: '50px 0px' });
    
    images.forEach(image => {
      imageObserver.observe(image);
    });
  } else {
    // Fallback para navegadores sem suporte a IntersectionObserver
    images.forEach(image => {
      if (image.dataset.src) {
        image.src = image.dataset.src;
        image.removeAttribute('data-src');
      }
      
      if (image.dataset.srcset) {
        image.srcset = image.dataset.srcset;
        image.removeAttribute('data-srcset');
      }
      
      image.classList.add('loaded');
    });
  }
}

/**
 * Adiciona uma imagem à galeria dinamicamente
 * @param {Object} imageData - Dados da imagem
 * @param {string} containerSelector - Seletor do container da galeria
 */
export function addGalleryImage(imageData, containerSelector = '.gallery-grid') {
  const container = document.querySelector(containerSelector);
  if (!container) return;
  
  // Criar elemento da galeria
  const galleryItem = document.createElement('div');
  galleryItem.className = 'gallery-item';
  galleryItem.dataset.category = imageData.category || 'all';
  
  galleryItem.innerHTML = `
    <img class="gallery-item__image" src="${imageData.src}" alt="${imageData.alt || 'Imagem da galeria'}" ${imageData.fullsize ? `data-fullsize="${imageData.fullsize}"` : ''}>
    <div class="gallery-item__overlay">
      <h3 class="gallery-item__title">${imageData.title || ''}</h3>
      <p class="gallery-item__description">${imageData.description || ''}</p>
    </div>
  `;
  
  // Adicionar ao container
  container.appendChild(galleryItem);
  
  // Reinicializar galeria
  initGallery();
  
  return galleryItem;
}
