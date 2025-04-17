// Módulo de tema para o site GTA IV

/**
 * Inicializa o sistema de alternância de tema
 * @param {Object} config - Configuração do tema
 */
export function initThemeToggle(config = {}) {
  const defaultConfig = {
    default: 'dark',
    remember: true
  };
  
  const themeConfig = { ...defaultConfig, ...config };
  const themeToggle = document.querySelector('.theme-toggle');
  const html = document.documentElement;
  
  // Verificar tema salvo no localStorage
  let currentTheme = themeConfig.default;
  
  if (themeConfig.remember) {
    const savedTheme = localStorage.getItem('gta-iv-theme');
    if (savedTheme) {
      currentTheme = savedTheme;
    } else {
      // Verificar preferência do sistema
      const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)').matches;
      currentTheme = prefersDarkScheme ? 'dark' : 'light';
    }
  }
  
  // Aplicar tema inicial
  applyTheme(currentTheme);
  
  // Adicionar listener para o botão de alternância
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      // Alternar entre temas
      switch (currentTheme) {
        case 'dark':
          currentTheme = 'light';
          break;
        case 'light':
          currentTheme = 'gta-iv';
          break;
        case 'gta-iv':
          currentTheme = 'tlad';
          break;
        case 'tlad':
          currentTheme = 'tbogt';
          break;
        case 'tbogt':
          currentTheme = 'dark';
          break;
        default:
          currentTheme = 'dark';
      }
      
      applyTheme(currentTheme);
      
      // Salvar preferência
      if (themeConfig.remember) {
        localStorage.setItem('gta-iv-theme', currentTheme);
      }
    });
  }
  
  // Adicionar listener para mudanças na preferência do sistema
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('gta-iv-theme')) {
      const newTheme = e.matches ? 'dark' : 'light';
      applyTheme(newTheme);
      currentTheme = newTheme;
    }
  });
  
  /**
   * Aplica o tema especificado
   * @param {string} theme - Nome do tema a ser aplicado
   */
  function applyTheme(theme) {
    html.setAttribute('data-theme', theme);
    
    // Atualizar ícones do botão de tema
    if (themeToggle) {
      const themeIcon = themeToggle.querySelector('.theme-toggle__icon');
      if (themeIcon) {
        themeIcon.textContent = getThemeIcon(theme);
      }
      
      // Atualizar texto de acessibilidade
      themeToggle.setAttribute('aria-label', `Alternar para ${getNextThemeName(theme)}`);
      themeToggle.title = `Alternar para ${getNextThemeName(theme)}`;
    }
    
    // Disparar evento de mudança de tema
    const event = new CustomEvent('themechange', { detail: { theme } });
    document.dispatchEvent(event);
    
    console.log(`Tema aplicado: ${theme}`);
  }
  
  /**
   * Obtém o ícone para o tema atual
   * @param {string} theme - Nome do tema
   * @returns {string} - Ícone correspondente
   */
  function getThemeIcon(theme) {
    switch (theme) {
      case 'light':
        return '🌙'; // Lua (próximo será escuro)
      case 'dark':
        return '💡'; // Lâmpada (próximo será claro)
      case 'gta-iv':
        return '🏙️'; // Cidade (GTA IV)
      case 'tlad':
        return '🏍️'; // Moto (The Lost and Damned)
      case 'tbogt':
        return '🌃'; // Cidade à noite (The Ballad of Gay Tony)
      default:
        return '💡';
    }
  }
  
  /**
   * Obtém o nome do próximo tema
   * @param {string} currentTheme - Nome do tema atual
   * @returns {string} - Nome do próximo tema
   */
  function getNextThemeName(currentTheme) {
    switch (currentTheme) {
      case 'dark':
        return 'tema claro';
      case 'light':
        return 'tema GTA IV';
      case 'gta-iv':
        return 'tema The Lost and Damned';
      case 'tlad':
        return 'tema The Ballad of Gay Tony';
      case 'tbogt':
        return 'tema escuro';
      default:
        return 'próximo tema';
    }
  }
}

/**
 * Obtém o tema atual
 * @returns {string} - Nome do tema atual
 */
export function getCurrentTheme() {
  return document.documentElement.getAttribute('data-theme') || 'dark';
}

/**
 * Verifica se o tema atual é escuro
 * @returns {boolean} - Verdadeiro se o tema for escuro
 */
export function isDarkTheme() {
  const theme = getCurrentTheme();
  return theme === 'dark' || theme === 'gta-iv' || theme === 'tlad' || theme === 'tbogt';
}
