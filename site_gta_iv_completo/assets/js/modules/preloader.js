// Módulo de preloader para o site GTA IV

/**
 * Inicializa o preloader temático de GTA IV
 */
export function initPreloader() {
  // Verificar se o preloader já existe
  let preloader = document.querySelector('.gta-preloader');
  
  // Se não existir, criar um
  if (!preloader) {
    preloader = createPreloader();
  }
  
  // Verificar se a página já está carregada
  if (document.readyState === 'complete') {
    hidePreloader(preloader);
  } else {
    // Adicionar listener para quando a página carregar
    window.addEventListener('load', () => {
      hidePreloader(preloader);
    });
    
    // Fallback para garantir que o preloader será removido
    setTimeout(() => {
      hidePreloader(preloader);
    }, 5000);
  }
  
  /**
   * Cria o elemento de preloader
   * @returns {HTMLElement} - Elemento do preloader
   */
  function createPreloader() {
    const preloaderElement = document.createElement('div');
    preloaderElement.className = 'gta-preloader';
    
    // Adicionar conteúdo do preloader
    preloaderElement.innerHTML = `
      <div class="gta-preloader__content">
        <div class="gta-preloader__logo">
          <img src="/assets/images/logo-gta-iv.png" alt="GTA IV Logo">
        </div>
        <div class="gta-preloader__loading-bar">
          <div class="gta-preloader__loading-bar-fill"></div>
        </div>
        <div class="gta-preloader__text">Carregando Liberty City...</div>
        <div class="gta-preloader__tip">
          <span class="gta-preloader__tip-label">DICA:</span>
          <span class="gta-preloader__tip-text">${getRandomTip()}</span>
        </div>
      </div>
    `;
    
    // Adicionar ao body
    document.body.appendChild(preloaderElement);
    
    // Iniciar animação da barra de carregamento
    animateLoadingBar(preloaderElement.querySelector('.gta-preloader__loading-bar-fill'));
    
    return preloaderElement;
  }
  
  /**
   * Anima a barra de carregamento
   * @param {HTMLElement} barFill - Elemento de preenchimento da barra
   */
  function animateLoadingBar(barFill) {
    if (!barFill) return;
    
    let width = 0;
    const interval = setInterval(() => {
      if (width >= 100) {
        clearInterval(interval);
      } else {
        width += Math.random() * 10;
        if (width > 100) width = 100;
        barFill.style.width = `${width}%`;
      }
    }, 200);
  }
  
  /**
   * Esconde o preloader com animação
   * @param {HTMLElement} preloader - Elemento do preloader
   */
  function hidePreloader(preloader) {
    if (!preloader) return;
    
    // Garantir que a barra de carregamento esteja completa
    const barFill = preloader.querySelector('.gta-preloader__loading-bar-fill');
    if (barFill) {
      barFill.style.width = '100%';
    }
    
    // Adicionar classe para iniciar animação de saída
    setTimeout(() => {
      preloader.classList.add('gta-preloader--fade-out');
      
      // Remover do DOM após a animação
      setTimeout(() => {
        preloader.remove();
        
        // Disparar evento
        const event = new CustomEvent('preloaderComplete');
        document.dispatchEvent(event);
      }, 1000);
    }, 500);
  }
  
  /**
   * Retorna uma dica aleatória no estilo GTA IV
   * @returns {string} - Dica aleatória
   */
  function getRandomTip() {
    const tips = [
      "Pressione Tab para abrir o celular e acessar contatos.",
      "Você pode chamar um táxi e pular a viagem para chegar mais rápido ao destino.",
      "Amizades são importantes em Liberty City. Mantenha contato com seus amigos.",
      "Visite os sites da internet nos cybercafés para descobrir segredos.",
      "Cuidado com a polícia! Seu nível de procurado é mostrado no canto superior direito.",
      "Você pode se esconder da polícia saindo da área de busca mostrada no minimapa.",
      "Restaurantes e barracas de comida podem restaurar sua saúde.",
      "Salve seu progresso dormindo em um apartamento ou casa segura.",
      "Você pode jogar boliche com seu primo Roman para aumentar sua amizade.",
      "Diferentes veículos têm diferentes características de direção.",
      "Você pode assistir TV em seu apartamento para relaxar.",
      "Visite o Clube de Comédia para assistir a shows de stand-up.",
      "Você pode mudar de estação de rádio enquanto dirige pressionando as setas.",
      "Cuidado com suas decisões. Elas podem afetar o final do jogo.",
      "Você pode comprar roupas novas nas lojas espalhadas pela cidade."
    ];
    
    return tips[Math.floor(Math.random() * tips.length)];
  }
}

/**
 * Mostra o preloader manualmente
 * @param {Object} options - Opções de configuração
 * @returns {HTMLElement} - Elemento do preloader
 */
export function showPreloader(options = {}) {
  const defaultOptions = {
    text: 'Carregando Liberty City...',
    showTip: true,
    autoHide: true,
    hideDelay: 3000
  };
  
  const config = { ...defaultOptions, ...options };
  
  // Remover preloader existente se houver
  const existingPreloader = document.querySelector('.gta-preloader');
  if (existingPreloader) {
    existingPreloader.remove();
  }
  
  // Criar novo preloader
  const preloader = document.createElement('div');
  preloader.className = 'gta-preloader';
  
  // Adicionar conteúdo do preloader
  preloader.innerHTML = `
    <div class="gta-preloader__content">
      <div class="gta-preloader__logo">
        <img src="/assets/images/logo-gta-iv.png" alt="GTA IV Logo">
      </div>
      <div class="gta-preloader__loading-bar">
        <div class="gta-preloader__loading-bar-fill"></div>
      </div>
      <div class="gta-preloader__text">${config.text}</div>
      ${config.showTip ? `
        <div class="gta-preloader__tip">
          <span class="gta-preloader__tip-label">DICA:</span>
          <span class="gta-preloader__tip-text">${getRandomTip()}</span>
        </div>
      ` : ''}
    </div>
  `;
  
  // Adicionar ao body
  document.body.appendChild(preloader);
  
  // Iniciar animação da barra de carregamento
  const barFill = preloader.querySelector('.gta-preloader__loading-bar-fill');
  animateLoadingBar(barFill);
  
  // Auto-esconder se configurado
  if (config.autoHide) {
    setTimeout(() => {
      hidePreloader(preloader);
    }, config.hideDelay);
  }
  
  return preloader;
  
  /**
   * Anima a barra de carregamento
   * @param {HTMLElement} barFill - Elemento de preenchimento da barra
   */
  function animateLoadingBar(barFill) {
    if (!barFill) return;
    
    let width = 0;
    const interval = setInterval(() => {
      if (width >= 100) {
        clearInterval(interval);
      } else {
        width += Math.random() * 10;
        if (width > 100) width = 100;
        barFill.style.width = `${width}%`;
      }
    }, 200);
  }
  
  /**
   * Esconde o preloader com animação
   * @param {HTMLElement} preloader - Elemento do preloader
   */
  function hidePreloader(preloader) {
    if (!preloader) return;
    
    // Garantir que a barra de carregamento esteja completa
    const barFill = preloader.querySelector('.gta-preloader__loading-bar-fill');
    if (barFill) {
      barFill.style.width = '100%';
    }
    
    // Adicionar classe para iniciar animação de saída
    setTimeout(() => {
      preloader.classList.add('gta-preloader--fade-out');
      
      // Remover do DOM após a animação
      setTimeout(() => {
        preloader.remove();
        
        // Disparar evento
        const event = new CustomEvent('preloaderComplete');
        document.dispatchEvent(event);
      }, 1000);
    }, 500);
  }
  
  /**
   * Retorna uma dica aleatória no estilo GTA IV
   * @returns {string} - Dica aleatória
   */
  function getRandomTip() {
    const tips = [
      "Pressione Tab para abrir o celular e acessar contatos.",
      "Você pode chamar um táxi e pular a viagem para chegar mais rápido ao destino.",
      "Amizades são importantes em Liberty City. Mantenha contato com seus amigos.",
      "Visite os sites da internet nos cybercafés para descobrir segredos.",
      "Cuidado com a polícia! Seu nível de procurado é mostrado no canto superior direito.",
      "Você pode se esconder da polícia saindo da área de busca mostrada no minimapa.",
      "Restaurantes e barracas de comida podem restaurar sua saúde.",
      "Salve seu progresso dormindo em um apartamento ou casa segura.",
      "Você pode jogar boliche com seu primo Roman para aumentar sua amizade.",
      "Diferentes veículos têm diferentes características de direção.",
      "Você pode assistir TV em seu apartamento para relaxar.",
      "Visite o Clube de Comédia para assistir a shows de stand-up.",
      "Você pode mudar de estação de rádio enquanto dirige pressionando as setas.",
      "Cuidado com suas decisões. Elas podem afetar o final do jogo.",
      "Você pode comprar roupas novas nas lojas espalhadas pela cidade."
    ];
    
    return tips[Math.floor(Math.random() * tips.length)];
  }
}
