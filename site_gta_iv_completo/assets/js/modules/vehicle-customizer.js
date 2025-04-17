// Módulo de customização de veículos para o site GTA IV

/**
 * Inicializa o customizador de veículos interativo
 */
export function initVehicleCustomizer() {
  // Selecionar o container do customizador
  const customizer = document.querySelector('.vehicle-customizer');
  if (!customizer) return;
  
  const vehicleDisplay = customizer.querySelector('.vehicle-display');
  const colorOptions = customizer.querySelectorAll('.color-option');
  const wheelOptions = customizer.querySelectorAll('.wheel-option');
  const extraOptions = customizer.querySelectorAll('.extra-option');
  const resetButton = customizer.querySelector('.customizer-reset');
  const saveButton = customizer.querySelector('.customizer-save');
  
  if (!vehicleDisplay) return;
  
  // Estado atual da customização
  const state = {
    vehicle: vehicleDisplay.dataset.defaultVehicle || 'infernus',
    color: 'default',
    wheels: 'default',
    extras: []
  };
  
  // Inicializar veículo
  updateVehicleDisplay();
  
  // Adicionar listeners para opções de cores
  if (colorOptions.length > 0) {
    colorOptions.forEach(option => {
      option.addEventListener('click', () => {
        // Remover seleção anterior
        colorOptions.forEach(opt => opt.classList.remove('selected'));
        
        // Aplicar nova seleção
        option.classList.add('selected');
        state.color = option.dataset.color;
        
        // Atualizar display
        updateVehicleDisplay();
        
        // Reproduzir som de spray
        playCustomizationSound('spray');
      });
    });
  }
  
  // Adicionar listeners para opções de rodas
  if (wheelOptions.length > 0) {
    wheelOptions.forEach(option => {
      option.addEventListener('click', () => {
        // Remover seleção anterior
        wheelOptions.forEach(opt => opt.classList.remove('selected'));
        
        // Aplicar nova seleção
        option.classList.add('selected');
        state.wheels = option.dataset.wheels;
        
        // Atualizar display
        updateVehicleDisplay();
        
        // Reproduzir som de troca de rodas
        playCustomizationSound('wheels');
      });
    });
  }
  
  // Adicionar listeners para opções extras
  if (extraOptions.length > 0) {
    extraOptions.forEach(option => {
      option.addEventListener('click', () => {
        const extra = option.dataset.extra;
        
        // Alternar seleção
        if (option.classList.contains('selected')) {
          option.classList.remove('selected');
          state.extras = state.extras.filter(item => item !== extra);
        } else {
          option.classList.add('selected');
          state.extras.push(extra);
        }
        
        // Atualizar display
        updateVehicleDisplay();
        
        // Reproduzir som de modificação
        playCustomizationSound('mod');
      });
    });
  }
  
  // Adicionar listener para botão de reset
  if (resetButton) {
    resetButton.addEventListener('click', () => {
      resetCustomization();
      
      // Reproduzir som de reset
      playCustomizationSound('reset');
    });
  }
  
  // Adicionar listener para botão de salvar
  if (saveButton) {
    saveButton.addEventListener('click', () => {
      saveCustomization();
    });
  }
  
  /**
   * Atualiza o display do veículo com as customizações atuais
   */
  function updateVehicleDisplay() {
    // Construir caminho da imagem baseado no estado atual
    let imagePath = `/assets/images/vehicles/${state.vehicle}`;
    
    // Adicionar cor se não for a padrão
    if (state.color !== 'default') {
      imagePath += `-${state.color}`;
    }
    
    // Adicionar rodas se não for a padrão
    if (state.wheels !== 'default') {
      imagePath += `-${state.wheels}`;
    }
    
    // Adicionar extensão
    imagePath += '.jpg';
    
    // Atualizar imagem principal
    const vehicleImage = vehicleDisplay.querySelector('.vehicle-image');
    if (vehicleImage) {
      // Aplicar efeito de transição
      vehicleImage.style.opacity = '0';
      
      setTimeout(() => {
        vehicleImage.src = imagePath;
        vehicleImage.style.opacity = '1';
      }, 300);
    }
    
    // Atualizar extras
    const extrasContainer = vehicleDisplay.querySelector('.vehicle-extras');
    if (extrasContainer) {
      // Limpar extras anteriores
      extrasContainer.innerHTML = '';
      
      // Adicionar novos extras
      state.extras.forEach(extra => {
        const extraElement = document.createElement('img');
        extraElement.className = 'vehicle-extra';
        extraElement.src = `/assets/images/vehicles/extras/${state.vehicle}-${extra}.png`;
        extraElement.alt = `Extra: ${extra}`;
        
        extrasContainer.appendChild(extraElement);
      });
    }
    
    // Atualizar estatísticas do veículo
    updateVehicleStats();
    
    // Disparar evento
    const event = new CustomEvent('vehiclecustomize', { 
      detail: { ...state } 
    });
    document.dispatchEvent(event);
  }
  
  /**
   * Atualiza as estatísticas do veículo baseado nas customizações
   */
  function updateVehicleStats() {
    const statsContainer = customizer.querySelector('.vehicle-stats');
    if (!statsContainer) return;
    
    // Valores base para cada veículo
    const baseStats = {
      infernus: { speed: 85, acceleration: 80, handling: 70, braking: 75 },
      comet: { speed: 80, acceleration: 85, handling: 85, braking: 80 },
      sultan: { speed: 75, acceleration: 70, handling: 90, braking: 75 },
      turismo: { speed: 90, acceleration: 85, handling: 75, braking: 80 }
    };
    
    // Modificadores para customizações
    const modifiers = {
      wheels: {
        default: { handling: 0, acceleration: 0 },
        sport: { handling: 5, acceleration: 3 },
        offroad: { handling: -2, acceleration: -1, braking: 2 },
        tuner: { handling: 7, acceleration: 5, speed: 2 }
      },
      extras: {
        spoiler: { speed: 3, handling: 5 },
        nitro: { acceleration: 10, speed: 5 },
        exhaust: { acceleration: 3, speed: 2 },
        lightkit: { handling: 1 }
      }
    };
    
    // Calcular estatísticas atuais
    const currentVehicle = state.vehicle;
    const stats = { ...baseStats[currentVehicle] };
    
    // Aplicar modificadores de rodas
    const wheelMods = modifiers.wheels[state.wheels] || modifiers.wheels.default;
    Object.keys(wheelMods).forEach(stat => {
      stats[stat] += wheelMods[stat];
    });
    
    // Aplicar modificadores de extras
    state.extras.forEach(extra => {
      const extraMods = modifiers.extras[extra];
      if (extraMods) {
        Object.keys(extraMods).forEach(stat => {
          stats[stat] += extraMods[stat];
        });
      }
    });
    
    // Limitar valores entre 0 e 100
    Object.keys(stats).forEach(stat => {
      stats[stat] = Math.max(0, Math.min(100, stats[stat]));
    });
    
    // Atualizar barras de estatísticas
    Object.keys(stats).forEach(stat => {
      const statBar = statsContainer.querySelector(`.stat-bar--${stat} .stat-bar__fill`);
      if (statBar) {
        statBar.style.width = `${stats[stat]}%`;
      }
      
      const statValue = statsContainer.querySelector(`.stat-bar--${stat} .stat-bar__value`);
      if (statValue) {
        statValue.textContent = stats[stat];
      }
    });
  }
  
  /**
   * Reseta todas as customizações para o padrão
   */
  function resetCustomization() {
    // Resetar estado
    state.color = 'default';
    state.wheels = 'default';
    state.extras = [];
    
    // Resetar seleções visuais
    colorOptions.forEach(option => {
      option.classList.remove('selected');
      if (option.dataset.color === 'default') {
        option.classList.add('selected');
      }
    });
    
    wheelOptions.forEach(option => {
      option.classList.remove('selected');
      if (option.dataset.wheels === 'default') {
        option.classList.add('selected');
      }
    });
    
    extraOptions.forEach(option => {
      option.classList.remove('selected');
    });
    
    // Atualizar display
    updateVehicleDisplay();
  }
  
  /**
   * Salva a customização atual
   */
  function saveCustomization() {
    // Criar objeto de customização
    const customization = { ...state };
    
    // Salvar no localStorage
    try {
      const savedCustomizations = JSON.parse(localStorage.getItem('gta-iv-customizations') || '{}');
      savedCustomizations[state.vehicle] = customization;
      localStorage.setItem('gta-iv-customizations', JSON.stringify(savedCustomizations));
      
      // Mostrar mensagem de sucesso
      showNotification('Customização salva com sucesso!');
      
      // Reproduzir som de sucesso
      playCustomizationSound('save');
    } catch (error) {
      console.error('Erro ao salvar customização:', error);
      showNotification('Erro ao salvar customização.', 'error');
    }
    
    // Disparar evento
    const event = new CustomEvent('vehiclesave', { 
      detail: { vehicle: state.vehicle, customization } 
    });
    document.dispatchEvent(event);
  }
  
  /**
   * Mostra uma notificação temporária
   * @param {string} message - Mensagem da notificação
   * @param {string} type - Tipo da notificação ('success' ou 'error')
   */
  function showNotification(message, type = 'success') {
    // Verificar se já existe uma notificação
    let notification = document.querySelector('.customizer-notification');
    
    if (!notification) {
      // Criar elemento de notificação
      notification = document.createElement('div');
      notification.className = 'customizer-notification';
      document.body.appendChild(notification);
    }
    
    // Configurar notificação
    notification.textContent = message;
    notification.className = `customizer-notification customizer-notification--${type}`;
    
    // Mostrar notificação
    notification.classList.add('active');
    
    // Esconder após 3 segundos
    setTimeout(() => {
      notification.classList.remove('active');
    }, 3000);
  }
  
  /**
   * Reproduz um som de customização
   * @param {string} type - Tipo de som
   */
  function playCustomizationSound(type) {
    // Verificar se o som está habilitado
    if (customizer.dataset.sound !== 'true') return;
    
    // Mapear tipos para arquivos de som
    const soundMap = {
      spray: 'spray.mp3',
      wheels: 'wheels.mp3',
      mod: 'mod.mp3',
      reset: 'reset.mp3',
      save: 'save.mp3'
    };
    
    const soundFile = soundMap[type] || 'mod.mp3';
    const sound = new Audio(`/assets/audio/${soundFile}`);
    sound.volume = 0.5;
    sound.play().catch(err => console.log('Audio playback error:', err));
  }
}

/**
 * Carrega uma customização salva
 * @param {string} vehicle - ID do veículo
 */
export function loadSavedCustomization(vehicle) {
  try {
    const savedCustomizations = JSON.parse(localStorage.getItem('gta-iv-customizations') || '{}');
    const customization = savedCustomizations[vehicle];
    
    if (customization) {
      // Selecionar customizador
      const customizer = document.querySelector('.vehicle-customizer');
      if (!customizer) return;
      
      // Aplicar customização
      const colorOption = customizer.querySelector(`.color-option[data-color="${customization.color}"]`);
      if (colorOption) {
        colorOption.click();
      }
      
      const wheelOption = customizer.querySelector(`.wheel-option[data-wheels="${customization.wheels}"]`);
      if (wheelOption) {
        wheelOption.click();
      }
      
      // Aplicar extras
      customization.extras.forEach(extra => {
        const extraOption = customizer.querySelector(`.extra-option[data-extra="${extra}"]`);
        if (extraOption && !extraOption.classList.contains('selected')) {
          extraOption.click();
        }
      });
      
      return true;
    }
  } catch (error) {
    console.error('Erro ao carregar customização:', error);
  }
  
  return false;
}

/**
 * Cria um customizador de veículos dinamicamente
 * @param {Object} options - Opções de configuração
 * @param {string} containerId - ID do container onde adicionar o customizador
 * @returns {HTMLElement} - Elemento do customizador criado
 */
export function createVehicleCustomizer(options, containerId) {
  const defaultOptions = {
    vehicle: 'infernus',
    colors: [
      { id: 'default', name: 'Preto', hex: '#111111' },
      { id: 'red', name: 'Vermelho', hex: '#cc0000' },
      { id: 'blue', name: 'Azul', hex: '#0066cc' },
      { id: 'yellow', name: 'Amarelo', hex: '#ffcc00' },
      { id: 'green', name: 'Verde', hex: '#339933' }
    ],
    wheels: [
      { id: 'default', name: 'Padrão' },
      { id: 'sport', name: 'Esportivas' },
      { id: 'offroad', name: 'Off-Road' },
      { id: 'tuner', name: 'Tuner' }
    ],
    extras: [
      { id: 'spoiler', name: 'Aerofólio' },
      { id: 'nitro', name: 'Nitro' },
      { id: 'exhaust', name: 'Escapamento' },
      { id: 'lightkit', name: 'Kit de Luzes' }
    ],
    sound: true
  };
  
  const config = { ...defaultOptions, ...options };
  const container = document.getElementById(containerId);
  
  if (!container) return null;
  
  // Criar elemento do customizador
  const customizer = document.createElement('div');
  customizer.className = 'vehicle-customizer';
  customizer.dataset.sound = config.sound.toString();
  
  // Criar estrutura interna
  customizer.innerHTML = `
    <div class="customizer-header">
      <h3 class="customizer-title">Customizar ${getVehicleName(config.vehicle)}</h3>
      <div class="customizer-actions">
        <button class="customizer-reset">Resetar</button>
        <button class="customizer-save">Salvar</button>
      </div>
    </div>
    
    <div class="customizer-content">
      <div class="vehicle-display" data-default-vehicle="${config.vehicle}">
        <img class="vehicle-image" src="/assets/images/vehicles/${config.vehicle}.jpg" alt="${getVehicleName(config.vehicle)}">
        <div class="vehicle-extras"></div>
      </div>
      
      <div class="customizer-options">
        <div class="options-section">
          <h4 class="options-title">Cor</h4>
          <div class="color-options">
            ${config.colors.map(color => `
              <button class="color-option ${color.id === 'default' ? 'selected' : ''}" 
                data-color="${color.id}" 
                title="${color.name}" 
                style="background-color: ${color.hex}">
              </button>
            `).join('')}
          </div>
        </div>
        
        <div class="options-section">
          <h4 class="options-title">Rodas</h4>
          <div class="wheel-options">
            ${config.wheels.map(wheel => `
              <button class="wheel-option ${wheel.id === 'default' ? 'selected' : ''}" 
                data-wheels="${wheel.id}">
                ${wheel.name}
              </button>
            `).join('')}
          </div>
        </div>
        
        <div class="options-section">
          <h4 class="options-title">Extras</h4>
          <div class="extra-options">
            ${config.extras.map(extra => `
              <button class="extra-option" data-extra="${extra.id}">
                ${extra.name}
              </button>
            `).join('')}
          </div>
        </div>
        
        <div class="options-section">
          <h4 class="options-title">Estatísticas</h4>
          <div class="vehicle-stats">
            <div class="stat-bar stat-bar--speed">
              <span class="stat-bar__label">Velocidade</span>
              <div class="stat-bar__track">
                <div class="stat-bar__fill" style="width: 85%"></div>
              </div>
              <span class="stat-bar__value">85</span>
            </div>
            
            <div class="stat-bar stat-bar--acceleration">
              <span class="stat-bar__label">Aceleração</span>
              <div class="stat-bar__track">
                <div class="stat-bar__fill" style="width: 80%"></div>
              </div>
              <span class="stat-bar__value">80</span>
            </div>
            
            <div class="stat-bar stat-bar--handling">
              <span class="stat-bar__label">Dirigibilidade</span>
              <div class="stat-bar__track">
                <div class="stat-bar__fill" style="width: 70%"></div>
              </div>
              <span class="stat-bar__value">70</span>
            </div>
            
            <div class="stat-bar stat-bar--braking">
              <span class="stat-bar__label">Frenagem</span>
              <div class="stat-bar__track">
                <div class="stat-bar__fill" style="width: 75%"></div>
              </div>
              <span class="stat-bar__value">75</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
  
  // Adicionar ao container
  container.appendChild(customizer);
  
  // Inicializar customizador
  initVehicleCustomizer();
  
  return customizer;
  
  /**
   * Obtém o nome formatado do veículo
   * @param {string} vehicleId - ID do veículo
   * @returns {string} - Nome formatado
   */
  function getVehicleName(vehicleId) {
    const vehicleNames = {
      infernus: 'Infernus',
      comet: 'Comet',
      sultan: 'Sultan RS',
      turismo: 'Turismo'
    };
    
    return vehicleNames[vehicleId] || vehicleId;
  }
}
