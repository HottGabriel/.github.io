// Módulo de pesquisa para o site GTA IV

/**
 * Inicializa a funcionalidade de pesquisa do site
 */
export function initSearch() {
  // Selecionar elementos de pesquisa
  const searchForm = document.querySelector('.search-form');
  const searchOverlay = document.querySelector('.search-overlay');
  const searchInput = document.querySelector('.search-form__input');
  const searchResults = document.querySelector('.search-results');
  const searchClose = document.querySelector('.search-overlay__close');
  
  if (!searchForm || !searchInput) return;
  
  // Configurar listener para o formulário de pesquisa
  searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const query = searchInput.value.trim();
    if (query.length < 2) return;
    
    // Executar pesquisa
    performSearch(query);
  });
  
  // Configurar pesquisa em tempo real se habilitada
  if (searchInput.dataset.liveSearch === 'true') {
    let debounceTimer;
    
    searchInput.addEventListener('input', () => {
      clearTimeout(debounceTimer);
      
      const query = searchInput.value.trim();
      if (query.length < 2) {
        clearSearchResults();
        return;
      }
      
      // Debounce para evitar muitas pesquisas durante digitação rápida
      debounceTimer = setTimeout(() => {
        performSearch(query);
      }, 300);
    });
  }
  
  // Configurar fechamento do overlay de pesquisa
  if (searchOverlay && searchClose) {
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
  
  /**
   * Executa a pesquisa e exibe os resultados
   * @param {string} query - Termo de pesquisa
   */
  function performSearch(query) {
    // Mostrar indicador de carregamento
    showLoadingIndicator();
    
    // Simular atraso de rede (remover em produção)
    setTimeout(() => {
      // Obter resultados da pesquisa
      const results = searchSiteContent(query);
      
      // Exibir resultados
      displaySearchResults(results, query);
      
      // Disparar evento
      const event = new CustomEvent('search', { 
        detail: { query, resultsCount: results.length } 
      });
      document.dispatchEvent(event);
    }, 500);
  }
  
  /**
   * Pesquisa no conteúdo do site
   * @param {string} query - Termo de pesquisa
   * @returns {Array} - Resultados da pesquisa
   */
  function searchSiteContent(query) {
    // Dados de pesquisa (em produção, isso seria carregado de um JSON ou API)
    const searchData = [
      {
        title: 'Niko Bellic',
        content: 'Niko Bellic é o protagonista de GTA IV. Ele é um veterano da Guerra dos Balcãs que se muda para Liberty City em busca do "sonho americano" e para encontrar alguém de seu passado.',
        url: 'characters.html#niko',
        type: 'character',
        image: '/assets/images/characters/niko.jpg'
      },
      {
        title: 'Roman Bellic',
        content: 'Roman Bellic é o primo de Niko e um personagem importante em GTA IV. Ele possui uma empresa de táxis e está sempre metido em problemas.',
        url: 'characters.html#roman',
        type: 'character',
        image: '/assets/images/characters/roman.jpg'
      },
      {
        title: 'Little Jacob',
        content: 'Little Jacob é um traficante jamaicano e um dos melhores amigos de Niko em Liberty City. Ele fala com um sotaque jamaicano muito forte.',
        url: 'characters.html#jacob',
        type: 'character',
        image: '/assets/images/characters/jacob.jpg'
      },
      {
        title: 'Dimitri Rascalov',
        content: 'Dimitri Rascalov é um dos principais antagonistas de GTA IV. Ele é um criminoso russo que trai Niko e se torna seu inimigo.',
        url: 'characters.html#dimitri',
        type: 'character',
        image: '/assets/images/characters/dimitri.jpg'
      },
      {
        title: 'Liberty City',
        content: 'Liberty City em GTA IV é baseada em Nova York. Possui quatro distritos principais: Algonquin (Manhattan), Broker (Brooklyn), Dukes (Queens) e Bohan (Bronx).',
        url: 'world.html#liberty-city',
        type: 'location',
        image: '/assets/images/locations/liberty-city.jpg'
      },
      {
        title: 'Algonquin',
        content: 'Algonquin é o distrito central de Liberty City, baseado em Manhattan. É o centro financeiro e comercial da cidade.',
        url: 'world.html#algonquin',
        type: 'location',
        image: '/assets/images/locations/algonquin.jpg'
      },
      {
        title: 'Broker',
        content: 'Broker é um distrito de Liberty City baseado em Brooklyn. É onde Niko e Roman moram no início do jogo.',
        url: 'world.html#broker',
        type: 'location',
        image: '/assets/images/locations/broker.jpg'
      },
      {
        title: 'Three Leaf Clover',
        content: 'Three Leaf Clover é uma das missões mais icônicas de GTA IV, onde Niko participa de um assalto a banco com a família McReary.',
        url: 'missions.html#three-leaf-clover',
        type: 'mission',
        image: '/assets/images/missions/three-leaf-clover.jpg'
      },
      {
        title: 'Final Deal',
        content: 'Deal é um dos possíveis finais de GTA IV, onde Niko decide fazer um acordo com Dimitri, resultando em consequências trágicas.',
        url: 'story.html#ending-deal',
        type: 'story',
        image: '/assets/images/story/ending-deal.jpg'
      },
      {
        title: 'Final Revenge',
        content: 'Revenge é um dos possíveis finais de GTA IV, onde Niko decide se vingar de Dimitri em vez de fazer um acordo com ele.',
        url: 'story.html#ending-revenge',
        type: 'story',
        image: '/assets/images/story/ending-revenge.jpg'
      },
      {
        title: 'Comet',
        content: 'O Comet é um dos carros esportivos mais rápidos de GTA IV, baseado no Porsche 911.',
        url: 'vehicles.html#comet',
        type: 'vehicle',
        image: '/assets/images/vehicles/comet.jpg'
      },
      {
        title: 'Infernus',
        content: 'O Infernus é um superesportivo em GTA IV, baseado no Lamborghini Murciélago.',
        url: 'vehicles.html#infernus',
        type: 'vehicle',
        image: '/assets/images/vehicles/infernus.jpg'
      },
      {
        title: 'The Lost and Damned',
        content: 'The Lost and Damned é a primeira expansão de GTA IV, focada em Johnny Klebitz e sua gangue de motoqueiros.',
        url: 'story.html#tlad',
        type: 'dlc',
        image: '/assets/images/dlc/tlad.jpg'
      },
      {
        title: 'The Ballad of Gay Tony',
        content: 'The Ballad of Gay Tony é a segunda expansão de GTA IV, focada em Luis Lopez e o mundo das boates de luxo de Liberty City.',
        url: 'story.html#tbogt',
        type: 'dlc',
        image: '/assets/images/dlc/tbogt.jpg'
      }
    ];
    
    // Converter query para minúsculas para pesquisa case-insensitive
    const queryLower = query.toLowerCase();
    
    // Filtrar resultados
    return searchData.filter(item => {
      return (
        item.title.toLowerCase().includes(queryLower) ||
        item.content.toLowerCase().includes(queryLower)
      );
    });
  }
  
  /**
   * Exibe os resultados da pesquisa
   * @param {Array} results - Resultados da pesquisa
   * @param {string} query - Termo pesquisado
   */
  function displaySearchResults(results, query) {
    if (!searchResults) return;
    
    // Limpar resultados anteriores
    searchResults.innerHTML = '';
    
    // Verificar se há resultados
    if (results.length === 0) {
      searchResults.innerHTML = `
        <div class="search-results__empty">
          <p>Nenhum resultado encontrado para "<strong>${query}</strong>".</p>
          <p>Tente termos diferentes ou mais gerais.</p>
        </div>
      `;
      return;
    }
    
    // Criar cabeçalho de resultados
    const header = document.createElement('div');
    header.className = 'search-results__header';
    header.innerHTML = `<h3>${results.length} resultado${results.length > 1 ? 's' : ''} para "${query}"</h3>`;
    searchResults.appendChild(header);
    
    // Agrupar resultados por tipo
    const groupedResults = groupResultsByType(results);
    
    // Exibir resultados agrupados
    Object.keys(groupedResults).forEach(type => {
      const typeResults = groupedResults[type];
      
      // Criar seção para o tipo
      const section = document.createElement('div');
      section.className = 'search-results__section';
      
      // Adicionar título da seção
      const sectionTitle = document.createElement('h4');
      sectionTitle.className = 'search-results__section-title';
      sectionTitle.textContent = getTypeLabel(type);
      section.appendChild(sectionTitle);
      
      // Adicionar itens
      const itemsList = document.createElement('div');
      itemsList.className = 'search-results__items';
      
      typeResults.forEach(item => {
        const resultItem = createResultItem(item, query);
        itemsList.appendChild(resultItem);
      });
      
      section.appendChild(itemsList);
      searchResults.appendChild(section);
    });
  }
  
  /**
   * Agrupa resultados por tipo
   * @param {Array} results - Resultados da pesquisa
   * @returns {Object} - Resultados agrupados por tipo
   */
  function groupResultsByType(results) {
    const grouped = {};
    
    results.forEach(item => {
      if (!grouped[item.type]) {
        grouped[item.type] = [];
      }
      
      grouped[item.type].push(item);
    });
    
    return grouped;
  }
  
  /**
   * Cria um item de resultado de pesquisa
   * @param {Object} item - Item de resultado
   * @param {string} query - Termo pesquisado
   * @returns {HTMLElement} - Elemento do item de resultado
   */
  function createResultItem(item, query) {
    const resultItem = document.createElement('a');
    resultItem.className = 'search-result-item';
    resultItem.href = item.url;
    
    // Destacar termo pesquisado no conteúdo
    const highlightedContent = highlightText(item.content, query);
    
    // Estrutura do item
    resultItem.innerHTML = `
      <div class="search-result-item__image">
        <img src="${item.image}" alt="${item.title}">
      </div>
      <div class="search-result-item__content">
        <h5 class="search-result-item__title">${highlightText(item.title, query)}</h5>
        <p class="search-result-item__excerpt">${highlightedContent}</p>
        <span class="search-result-item__link">Ver mais</span>
      </div>
    `;
    
    return resultItem;
  }
  
  /**
   * Destaca o termo pesquisado no texto
   * @param {string} text - Texto original
   * @param {string} query - Termo a destacar
   * @returns {string} - Texto com destaque HTML
   */
  function highlightText(text, query) {
    if (!query) return text;
    
    const regex = new RegExp(`(${escapeRegExp(query)})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
  }
  
  /**
   * Escapa caracteres especiais para uso em regex
   * @param {string} string - String a escapar
   * @returns {string} - String escapada
   */
  function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
  
  /**
   * Obtém o rótulo para um tipo de resultado
   * @param {string} type - Tipo de resultado
   * @returns {string} - Rótulo do tipo
   */
  function getTypeLabel(type) {
    const labels = {
      character: 'Personagens',
      location: 'Locais',
      mission: 'Missões',
      story: 'História',
      vehicle: 'Veículos',
      dlc: 'DLCs'
    };
    
    return labels[type] || 'Resultados';
  }
  
  /**
   * Mostra indicador de carregamento
   */
  function showLoadingIndicator() {
    if (!searchResults) return;
    
    searchResults.innerHTML = `
      <div class="search-results__loading">
        <div class="loading-spinner"></div>
        <p>Pesquisando...</p>
      </div>
    `;
  }
  
  /**
   * Limpa os resultados da pesquisa
   */
  function clearSearchResults() {
    if (!searchResults) return;
    searchResults.innerHTML = '';
  }
}

/**
 * Executa uma pesquisa programaticamente
 * @param {string} query - Termo de pesquisa
 * @param {boolean} openOverlay - Se deve abrir o overlay de pesquisa
 */
export function performSearch(query, openOverlay = true) {
  if (!query) return;
  
  // Abrir overlay de pesquisa se necessário
  if (openOverlay) {
    const searchOverlay = document.querySelector('.search-overlay');
    if (searchOverlay) {
      searchOverlay.classList.add('active');
      document.body.classList.add('overlay-open');
    }
  }
  
  // Preencher campo de pesquisa
  const searchInput = document.querySelector('.search-form__input');
  if (searchInput) {
    searchInput.value = query;
    
    // Disparar evento de envio do formulário
    const searchForm = document.querySelector('.search-form');
    if (searchForm) {
      const event = new Event('submit', { cancelable: true });
      searchForm.dispatchEvent(event);
    }
  }
}

/**
 * Cria um componente de pesquisa dinamicamente
 * @param {Object} options - Opções de configuração
 * @param {string} containerId - ID do container onde adicionar a pesquisa
 * @returns {HTMLElement} - Elemento de pesquisa criado
 */
export function createSearchComponent(options, containerId) {
  const defaultOptions = {
    placeholder: 'Pesquisar em GTA IV...',
    liveSearch: true,
    fullOverlay: true
  };
  
  const config = { ...defaultOptions, ...options };
  const container = document.getElementById(containerId);
  
  if (!container) return null;
  
  // Criar formulário de pesquisa
  const searchForm = document.createElement('form');
  searchForm.className = 'search-form';
  
  // Criar campo de pesquisa
  const searchInput = document.createElement('input');
  searchInput.type = 'text';
  searchInput.className = 'search-form__input';
  searchInput.placeholder = config.placeholder;
  searchInput.dataset.liveSearch = config.liveSearch.toString();
  
  // Criar botão de pesquisa
  const searchButton = document.createElement('button');
  searchButton.type = 'submit';
  searchButton.className = 'search-form__button';
  searchButton.innerHTML = '<svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>';
  searchButton.setAttribute('aria-label', 'Pesquisar');
  
  // Montar formulário
  searchForm.appendChild(searchInput);
  searchForm.appendChild(searchButton);
  
  // Criar container de resultados
  const searchResults = document.createElement('div');
  searchResults.className = 'search-results';
  
  // Adicionar ao container
  container.appendChild(searchForm);
  container.appendChild(searchResults);
  
  // Criar overlay se necessário
  if (config.fullOverlay) {
    const searchOverlay = document.createElement('div');
    searchOverlay.className = 'search-overlay';
    
    const overlayContent = document.createElement('div');
    overlayContent.className = 'search-overlay__content';
    
    const overlayClose = document.createElement('button');
    overlayClose.className = 'search-overlay__close';
    overlayClose.innerHTML = '&times;';
    overlayClose.setAttribute('aria-label', 'Fechar pesquisa');
    
    const overlayForm = searchForm.cloneNode(true);
    const overlayResults = document.createElement('div');
    overlayResults.className = 'search-results';
    
    overlayContent.appendChild(overlayClose);
    overlayContent.appendChild(overlayForm);
    overlayContent.appendChild(overlayResults);
    searchOverlay.appendChild(overlayContent);
    
    document.body.appendChild(searchOverlay);
    
    // Configurar toggle para abrir overlay
    searchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const query = searchInput.value.trim();
      if (query.length < 2) return;
      
      // Copiar query para o overlay
      const overlayInput = overlayForm.querySelector('.search-form__input');
      if (overlayInput) {
        overlayInput.value = query;
      }
      
      // Abrir overlay
      searchOverlay.classList.add('active');
      document.body.classList.add('overlay-open');
      
      // Focar no campo de pesquisa
      setTimeout(() => {
        overlayInput.focus();
        
        // Disparar evento de envio no formulário do overlay
        const event = new Event('submit', { cancelable: true });
        overlayForm.dispatchEvent(event);
      }, 100);
    });
  }
  
  // Inicializar pesquisa
  initSearch();
  
  return container;
}
