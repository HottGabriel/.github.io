// Módulo de rastreador de missões para o site GTA IV

/**
 * Inicializa o rastreador de missões interativo
 */
export function initMissionTracker() {
  // Selecionar o container do rastreador
  const tracker = document.querySelector('.mission-tracker');
  if (!tracker) return;
  
  const missionList = tracker.querySelector('.mission-list');
  const progressBar = tracker.querySelector('.progress-bar__fill');
  const progressText = tracker.querySelector('.progress-text');
  const achievementsList = tracker.querySelector('.achievements-list');
  
  if (!missionList) return;
  
  // Carregar progresso salvo
  loadSavedProgress();
  
  // Adicionar listeners aos itens de missão
  const missionItems = missionList.querySelectorAll('.mission-item');
  missionItems.forEach(item => {
    const checkbox = item.querySelector('.mission-checkbox');
    if (!checkbox) return;
    
    checkbox.addEventListener('change', () => {
      // Atualizar estado da missão
      updateMissionState(item, checkbox.checked);
      
      // Atualizar progresso geral
      updateOverallProgress();
      
      // Verificar conquistas
      checkAchievements();
      
      // Salvar progresso
      saveProgress();
      
      // Reproduzir som
      playTrackerSound(checkbox.checked ? 'complete' : 'reset');
    });
    
    // Adicionar listener para clique no item inteiro
    item.addEventListener('click', (e) => {
      // Evitar ativação ao clicar diretamente no checkbox
      if (e.target !== checkbox && !e.target.closest('.mission-checkbox')) {
        checkbox.checked = !checkbox.checked;
        
        // Disparar evento de change manualmente
        const event = new Event('change');
        checkbox.dispatchEvent(event);
      }
    });
  });
  
  // Adicionar botão de reset se não existir
  if (!tracker.querySelector('.tracker-reset')) {
    const resetButton = document.createElement('button');
    resetButton.className = 'tracker-reset';
    resetButton.textContent = 'Resetar Progresso';
    resetButton.addEventListener('click', resetProgress);
    
    tracker.appendChild(resetButton);
  }
  
  /**
   * Atualiza o estado visual de uma missão
   * @param {HTMLElement} item - Elemento da missão
   * @param {boolean} completed - Se a missão está completa
   */
  function updateMissionState(item, completed) {
    if (completed) {
      item.classList.add('mission-item--completed');
    } else {
      item.classList.remove('mission-item--completed');
    }
  }
  
  /**
   * Atualiza o progresso geral das missões
   */
  function updateOverallProgress() {
    const totalMissions = missionItems.length;
    const completedMissions = missionList.querySelectorAll('.mission-checkbox:checked').length;
    
    // Calcular porcentagem
    const percentage = totalMissions > 0 ? Math.round((completedMissions / totalMissions) * 100) : 0;
    
    // Atualizar barra de progresso
    if (progressBar) {
      progressBar.style.width = `${percentage}%`;
    }
    
    // Atualizar texto de progresso
    if (progressText) {
      progressText.textContent = `${completedMissions}/${totalMissions} missões completas (${percentage}%)`;
    }
    
    // Disparar evento
    const event = new CustomEvent('missionprogress', { 
      detail: { completed: completedMissions, total: totalMissions, percentage } 
    });
    document.dispatchEvent(event);
  }
  
  /**
   * Verifica e atualiza conquistas baseadas no progresso
   */
  function checkAchievements() {
    if (!achievementsList) return;
    
    const totalMissions = missionItems.length;
    const completedMissions = missionList.querySelectorAll('.mission-checkbox:checked').length;
    const percentage = totalMissions > 0 ? (completedMissions / totalMissions) * 100 : 0;
    
    // Definir conquistas
    const achievements = [
      { id: 'beginner', name: 'Iniciante', description: 'Complete 25% das missões', threshold: 25, icon: '🏆' },
      { id: 'intermediate', name: 'Intermediário', description: 'Complete 50% das missões', threshold: 50, icon: '🏆' },
      { id: 'advanced', name: 'Avançado', description: 'Complete 75% das missões', threshold: 75, icon: '🏆' },
      { id: 'master', name: 'Mestre', description: 'Complete 100% das missões', threshold: 100, icon: '🏆' }
    ];
    
    // Verificar cada conquista
    achievements.forEach(achievement => {
      const achievementItem = achievementsList.querySelector(`.achievement-item[data-id="${achievement.id}"]`);
      
      if (achievementItem) {
        const wasUnlocked = achievementItem.classList.contains('achievement-item--unlocked');
        const isUnlocked = percentage >= achievement.threshold;
        
        // Atualizar estado
        if (isUnlocked) {
          achievementItem.classList.add('achievement-item--unlocked');
        } else {
          achievementItem.classList.remove('achievement-item--unlocked');
        }
        
        // Mostrar notificação se acabou de desbloquear
        if (isUnlocked && !wasUnlocked) {
          showAchievementNotification(achievement);
        }
      }
    });
  }
  
  /**
   * Mostra uma notificação de conquista desbloqueada
   * @param {Object} achievement - Dados da conquista
   */
  function showAchievementNotification(achievement) {
    // Criar elemento de notificação
    const notification = document.createElement('div');
    notification.className = 'achievement-notification';
    
    notification.innerHTML = `
      <div class="achievement-notification__icon">${achievement.icon}</div>
      <div class="achievement-notification__content">
        <h4 class="achievement-notification__title">Conquista Desbloqueada!</h4>
        <p class="achievement-notification__name">${achievement.name}</p>
        <p class="achievement-notification__description">${achievement.description}</p>
      </div>
    `;
    
    // Adicionar ao body
    document.body.appendChild(notification);
    
    // Mostrar com animação
    setTimeout(() => {
      notification.classList.add('active');
    }, 100);
    
    // Reproduzir som de conquista
    playTrackerSound('achievement');
    
    // Remover após 5 segundos
    setTimeout(() => {
      notification.classList.remove('active');
      
      // Remover do DOM após a animação
      setTimeout(() => {
        notification.remove();
      }, 500);
    }, 5000);
  }
  
  /**
   * Salva o progresso atual no localStorage
   */
  function saveProgress() {
    try {
      const progress = {};
      
      // Salvar estado de cada missão
      missionItems.forEach(item => {
        const missionId = item.dataset.missionId;
        const checkbox = item.querySelector('.mission-checkbox');
        
        if (missionId && checkbox) {
          progress[missionId] = checkbox.checked;
        }
      });
      
      // Salvar no localStorage
      localStorage.setItem('gta-iv-mission-progress', JSON.stringify(progress));
    } catch (error) {
      console.error('Erro ao salvar progresso:', error);
    }
  }
  
  /**
   * Carrega o progresso salvo do localStorage
   */
  function loadSavedProgress() {
    try {
      const savedProgress = JSON.parse(localStorage.getItem('gta-iv-mission-progress') || '{}');
      
      // Aplicar estado salvo a cada missão
      missionItems.forEach(item => {
        const missionId = item.dataset.missionId;
        const checkbox = item.querySelector('.mission-checkbox');
        
        if (missionId && checkbox && savedProgress[missionId] !== undefined) {
          checkbox.checked = savedProgress[missionId];
          updateMissionState(item, savedProgress[missionId]);
        }
      });
      
      // Atualizar progresso geral
      updateOverallProgress();
      
      // Verificar conquistas
      checkAchievements();
    } catch (error) {
      console.error('Erro ao carregar progresso:', error);
    }
  }
  
  /**
   * Reseta todo o progresso
   */
  function resetProgress() {
    // Confirmar reset
    if (!confirm('Tem certeza que deseja resetar todo o seu progresso?')) {
      return;
    }
    
    // Resetar estado de cada missão
    missionItems.forEach(item => {
      const checkbox = item.querySelector('.mission-checkbox');
      
      if (checkbox) {
        checkbox.checked = false;
        updateMissionState(item, false);
      }
    });
    
    // Atualizar progresso geral
    updateOverallProgress();
    
    // Verificar conquistas
    checkAchievements();
    
    // Salvar progresso
    saveProgress();
    
    // Reproduzir som
    playTrackerSound('reset-all');
  }
  
  /**
   * Reproduz um som do rastreador
   * @param {string} type - Tipo de som
   */
  function playTrackerSound(type) {
    // Verificar se o som está habilitado
    if (tracker.dataset.sound !== 'true') return;
    
    // Mapear tipos para arquivos de som
    const soundMap = {
      complete: 'mission-complete.mp3',
      reset: 'mission-reset.mp3',
      'reset-all': 'mission-reset-all.mp3',
      achievement: 'achievement.mp3'
    };
    
    const soundFile = soundMap[type] || 'mission-complete.mp3';
    const sound = new Audio(`/assets/audio/${soundFile}`);
    sound.volume = 0.5;
    sound.play().catch(err => console.log('Audio playback error:', err));
  }
}

/**
 * Marca uma missão específica como completa
 * @param {string} missionId - ID da missão
 * @param {boolean} completed - Estado de conclusão
 */
export function setMissionCompleted(missionId, completed = true) {
  const missionItem = document.querySelector(`.mission-item[data-mission-id="${missionId}"]`);
  if (!missionItem) return false;
  
  const checkbox = missionItem.querySelector('.mission-checkbox');
  if (!checkbox) return false;
  
  // Atualizar estado apenas se for diferente
  if (checkbox.checked !== completed) {
    checkbox.checked = completed;
    
    // Disparar evento de change
    const event = new Event('change');
    checkbox.dispatchEvent(event);
  }
  
  return true;
}

/**
 * Cria um rastreador de missões dinamicamente
 * @param {Object} options - Opções de configuração
 * @param {string} containerId - ID do container onde adicionar o rastreador
 * @returns {HTMLElement} - Elemento do rastreador criado
 */
export function createMissionTracker(options, containerId) {
  const defaultOptions = {
    title: 'Progresso de Missões',
    missions: [],
    showAchievements: true,
    sound: true
  };
  
  const config = { ...defaultOptions, ...options };
  const container = document.getElementById(containerId);
  
  if (!container || config.missions.length === 0) return null;
  
  // Criar elemento do rastreador
  const tracker = document.createElement('div');
  tracker.className = 'mission-tracker';
  tracker.dataset.sound = config.sound.toString();
  
  // Criar estrutura interna
  let trackerHTML = `
    <div class="tracker-header">
      <h3 class="tracker-title">${config.title}</h3>
      <div class="progress-container">
        <div class="progress-bar">
          <div class="progress-bar__fill" style="width: 0%"></div>
        </div>
        <div class="progress-text">0/${config.missions.length} missões completas (0%)</div>
      </div>
    </div>
    
    <div class="mission-list">
  `;
  
  // Adicionar missões
  config.missions.forEach(mission => {
    trackerHTML += `
      <div class="mission-item" data-mission-id="${mission.id}">
        <label class="mission-checkbox-container">
          <input type="checkbox" class="mission-checkbox">
          <span class="mission-checkbox-custom"></span>
        </label>
        <div class="mission-info">
          <h4 class="mission-title">${mission.title}</h4>
          <p class="mission-description">${mission.description}</p>
        </div>
      </div>
    `;
  });
  
  trackerHTML += `</div>`;
  
  // Adicionar seção de conquistas se habilitado
  if (config.showAchievements) {
    trackerHTML += `
      <div class="achievements-section">
        <h3 class="achievements-title">Conquistas</h3>
        <div class="achievements-list">
          <div class="achievement-item" data-id="beginner">
            <div class="achievement-icon">🏆</div>
            <div class="achievement-info">
              <h4 class="achievement-name">Iniciante</h4>
              <p class="achievement-description">Complete 25% das missões</p>
            </div>
          </div>
          <div class="achievement-item" data-id="intermediate">
            <div class="achievement-icon">🏆</div>
            <div class="achievement-info">
              <h4 class="achievement-name">Intermediário</h4>
              <p class="achievement-description">Complete 50% das missões</p>
            </div>
          </div>
          <div class="achievement-item" data-id="advanced">
            <div class="achievement-icon">🏆</div>
            <div class="achievement-info">
              <h4 class="achievement-name">Avançado</h4>
              <p class="achievement-description">Complete 75% das missões</p>
            </div>
          </div>
          <div class="achievement-item" data-id="master">
            <div class="achievement-icon">🏆</div>
            <div class="achievement-info">
              <h4 class="achievement-name">Mestre</h4>
              <p class="achievement-description">Complete 100% das missões</p>
            </div>
          </div>
        </div>
      </div>
    `;
  }
  
  // Adicionar botão de reset
  trackerHTML += `<button class="tracker-reset">Resetar Progresso</button>`;
  
  // Definir HTML
  tracker.innerHTML = trackerHTML;
  
  // Adicionar ao container
  container.appendChild(tracker);
  
  // Inicializar rastreador
  initMissionTracker();
  
  return tracker;
}
