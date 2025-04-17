// Módulo de rádio para o site GTA IV

/**
 * Inicializa o player de rádio temático de GTA IV
 */
export function initRadioPlayer() {
  // Selecionar o container do player de rádio
  const radioPlayer = document.querySelector('.radio-player');
  if (!radioPlayer) return;
  
  const radioToggle = radioPlayer.querySelector('.radio-toggle');
  const radioStations = radioPlayer.querySelector('.radio-stations');
  const radioDisplay = radioPlayer.querySelector('.radio-display');
  const radioControls = radioPlayer.querySelector('.radio-controls');
  
  // Definir estações de rádio
  const stations = [
    { id: 'liberty-rock', name: 'Liberty Rock Radio', genre: 'Classic Rock', host: 'Iggy Pop', logo: '/assets/images/radio/liberty-rock.png', audio: '/assets/audio/radio/liberty-rock.mp3' },
    { id: 'vladivostok', name: 'Vladivostok FM', genre: 'East European', host: 'DJ Paul', logo: '/assets/images/radio/vladivostok.png', audio: '/assets/audio/radio/vladivostok.mp3' },
    { id: 'beat', name: 'The Beat 102.7', genre: 'Hip-Hop', host: 'DJ Mister Cee', logo: '/assets/images/radio/beat.png', audio: '/assets/audio/radio/beat.mp3' },
    { id: 'jnr', name: 'JNR - Jazz Nation Radio', genre: 'Jazz', host: 'Roy Haynes', logo: '/assets/images/radio/jnr.png', audio: '/assets/audio/radio/jnr.mp3' },
    { id: 'k109', name: 'K109 The Studio', genre: 'Disco', host: 'Karl Lagerfeld', logo: '/assets/images/radio/k109.png', audio: '/assets/audio/radio/k109.mp3' },
    { id: 'lcfr', name: 'LCFR', genre: 'Talk Radio', host: 'Diversos', logo: '/assets/images/radio/lcfr.png', audio: '/assets/audio/radio/lcfr.mp3' }
  ];
  
  // Estado atual do player
  let currentStation = null;
  let isPlaying = false;
  let audioElement = null;
  
  // Inicializar player
  if (radioToggle) {
    radioToggle.addEventListener('click', toggleRadioPlayer);
  }
  
  // Criar estações de rádio
  if (radioStations) {
    stations.forEach(station => {
      const stationElement = createStationElement(station);
      radioStations.appendChild(stationElement);
    });
  }
  
  // Adicionar controles de volume
  if (radioControls) {
    const volumeControl = document.createElement('div');
    volumeControl.className = 'radio-volume';
    
    volumeControl.innerHTML = `
      <button class="radio-volume-down" aria-label="Diminuir volume">
        <svg viewBox="0 0 24 24"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon></svg>
      </button>
      <input type="range" min="0" max="100" value="70" class="radio-volume-slider">
      <button class="radio-volume-up" aria-label="Aumentar volume">
        <svg viewBox="0 0 24 24">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
          <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
        </svg>
      </button>
    `;
    
    radioControls.appendChild(volumeControl);
    
    // Adicionar listeners aos controles de volume
    const volumeSlider = volumeControl.querySelector('.radio-volume-slider');
    const volumeDown = volumeControl.querySelector('.radio-volume-down');
    const volumeUp = volumeControl.querySelector('.radio-volume-up');
    
    if (volumeSlider) {
      volumeSlider.addEventListener('input', () => {
        setVolume(volumeSlider.value / 100);
      });
    }
    
    if (volumeDown) {
      volumeDown.addEventListener('click', () => {
        const currentVolume = parseFloat(volumeSlider.value);
        const newVolume = Math.max(0, currentVolume - 10);
        volumeSlider.value = newVolume;
        setVolume(newVolume / 100);
      });
    }
    
    if (volumeUp) {
      volumeUp.addEventListener('click', () => {
        const currentVolume = parseFloat(volumeSlider.value);
        const newVolume = Math.min(100, currentVolume + 10);
        volumeSlider.value = newVolume;
        setVolume(newVolume / 100);
      });
    }
  }
  
  // Adicionar controle por teclado
  document.addEventListener('keydown', (e) => {
    // Alt + R para alternar o player
    if (e.altKey && e.key === 'r') {
      toggleRadioPlayer();
    }
    
    // Se o player estiver aberto
    if (radioPlayer.classList.contains('active')) {
      // Setas para mudar de estação
      if (e.key === 'ArrowUp' || e.key === 'ArrowRight') {
        changeStation(1);
      } else if (e.key === 'ArrowDown' || e.key === 'ArrowLeft') {
        changeStation(-1);
      }
      
      // Espaço para play/pause
      if (e.key === ' ' && currentStation) {
        e.preventDefault();
        togglePlayback();
      }
    }
  });
  
  /**
   * Cria um elemento de estação de rádio
   * @param {Object} station - Dados da estação
   * @returns {HTMLElement} - Elemento da estação
   */
  function createStationElement(station) {
    const stationElement = document.createElement('div');
    stationElement.className = 'radio-station';
    stationElement.dataset.stationId = station.id;
    
    stationElement.innerHTML = `
      <div class="radio-station__logo">
        <img src="${station.logo}" alt="${station.name} logo">
      </div>
      <div class="radio-station__info">
        <h4 class="radio-station__name">${station.name}</h4>
        <p class="radio-station__genre">${station.genre}</p>
      </div>
    `;
    
    // Adicionar listener para selecionar estação
    stationElement.addEventListener('click', () => {
      selectStation(station);
    });
    
    return stationElement;
  }
  
  /**
   * Alterna a visibilidade do player de rádio
   */
  function toggleRadioPlayer() {
    radioPlayer.classList.toggle('active');
    
    // Atualizar atributos ARIA
    radioToggle.setAttribute('aria-expanded', radioPlayer.classList.contains('active'));
    
    // Parar reprodução se fechar o player
    if (!radioPlayer.classList.contains('active') && isPlaying) {
      stopPlayback();
    }
  }
  
  /**
   * Seleciona uma estação de rádio
   * @param {Object} station - Estação a ser selecionada
   */
  function selectStation(station) {
    // Remover seleção anterior
    const stationElements = radioStations.querySelectorAll('.radio-station');
    stationElements.forEach(element => {
      element.classList.remove('active');
    });
    
    // Selecionar nova estação
    const stationElement = radioStations.querySelector(`.radio-station[data-station-id="${station.id}"]`);
    if (stationElement) {
      stationElement.classList.add('active');
    }
    
    // Atualizar display
    if (radioDisplay) {
      radioDisplay.innerHTML = `
        <div class="radio-display__logo">
          <img src="${station.logo}" alt="${station.name} logo">
        </div>
        <div class="radio-display__info">
          <h3 class="radio-display__name">${station.name}</h3>
          <p class="radio-display__genre">${station.genre}</p>
          <p class="radio-display__host">Host: ${station.host}</p>
        </div>
        <div class="radio-display__controls">
          <button class="radio-play-pause" aria-label="Reproduzir">
            <svg class="radio-play-icon" viewBox="0 0 24 24"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
            <svg class="radio-pause-icon" viewBox="0 0 24 24"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>
          </button>
        </div>
      `;
      
      // Adicionar listener ao botão de play/pause
      const playPauseButton = radioDisplay.querySelector('.radio-play-pause');
      if (playPauseButton) {
        playPauseButton.addEventListener('click', togglePlayback);
      }
    }
    
    // Atualizar estação atual
    currentStation = station;
    
    // Iniciar reprodução
    startPlayback();
    
    // Disparar evento
    const event = new CustomEvent('radiostationchange', { 
      detail: { station: station.id } 
    });
    document.dispatchEvent(event);
  }
  
  /**
   * Inicia a reprodução da estação atual
   */
  function startPlayback() {
    if (!currentStation) return;
    
    // Parar reprodução anterior
    stopPlayback();
    
    // Criar novo elemento de áudio
    audioElement = new Audio(currentStation.audio);
    audioElement.loop = true;
    
    // Definir volume
    const volumeSlider = radioPlayer.querySelector('.radio-volume-slider');
    if (volumeSlider) {
      audioElement.volume = volumeSlider.value / 100;
    } else {
      audioElement.volume = 0.7;
    }
    
    // Reproduzir
    audioElement.play().then(() => {
      isPlaying = true;
      updatePlayPauseButton();
    }).catch(err => {
      console.log('Audio playback error:', err);
      isPlaying = false;
      updatePlayPauseButton();
    });
  }
  
  /**
   * Para a reprodução atual
   */
  function stopPlayback() {
    if (audioElement) {
      audioElement.pause();
      audioElement = null;
    }
    
    isPlaying = false;
    updatePlayPauseButton();
  }
  
  /**
   * Alterna entre reproduzir e pausar
   */
  function togglePlayback() {
    if (!currentStation) return;
    
    if (isPlaying) {
      if (audioElement) {
        audioElement.pause();
      }
      isPlaying = false;
    } else {
      if (audioElement) {
        audioElement.play().catch(err => console.log('Audio playback error:', err));
      } else {
        startPlayback();
      }
      isPlaying = true;
    }
    
    updatePlayPauseButton();
  }
  
  /**
   * Atualiza o estado visual do botão de play/pause
   */
  function updatePlayPauseButton() {
    const playPauseButton = radioDisplay.querySelector('.radio-play-pause');
    if (!playPauseButton) return;
    
    if (isPlaying) {
      playPauseButton.classList.add('playing');
      playPauseButton.setAttribute('aria-label', 'Pausar');
    } else {
      playPauseButton.classList.remove('playing');
      playPauseButton.setAttribute('aria-label', 'Reproduzir');
    }
  }
  
  /**
   * Define o volume da reprodução
   * @param {number} volume - Volume (0-1)
   */
  function setVolume(volume) {
    if (audioElement) {
      audioElement.volume = volume;
    }
  }
  
  /**
   * Muda para a próxima ou anterior estação
   * @param {number} direction - Direção (1 para próxima, -1 para anterior)
   */
  function changeStation(direction) {
    if (!currentStation) {
      // Se nenhuma estação estiver selecionada, selecionar a primeira
      selectStation(stations[0]);
      return;
    }
    
    // Encontrar índice da estação atual
    const currentIndex = stations.findIndex(station => station.id === currentStation.id);
    if (currentIndex === -1) return;
    
    // Calcular novo índice
    let newIndex = currentIndex + direction;
    
    // Garantir que o índice esteja dentro dos limites
    if (newIndex < 0) {
      newIndex = stations.length - 1;
    } else if (newIndex >= stations.length) {
      newIndex = 0;
    }
    
    // Selecionar nova estação
    selectStation(stations[newIndex]);
  }
}

/**
 * Cria um player de rádio dinamicamente
 * @param {Object} options - Opções de configuração
 * @param {string} containerId - ID do container onde adicionar o player
 * @returns {HTMLElement} - Elemento do player criado
 */
export function createRadioPlayer(options, containerId) {
  const defaultOptions = {
    position: 'bottom-right',
    initialVolume: 70,
    autoPlay: false,
    initialStation: null
  };
  
  const config = { ...defaultOptions, ...options };
  const container = document.getElementById(containerId);
  
  if (!container) return null;
  
  // Criar elemento do player
  const radioPlayer = document.createElement('div');
  radioPlayer.className = `radio-player radio-player--${config.position}`;
  
  // Criar estrutura interna
  radioPlayer.innerHTML = `
    <button class="radio-toggle" aria-expanded="false" aria-label="Abrir rádio">
      <svg viewBox="0 0 24 24"><path d="M3.24 6.15C2.51 6.43 2 7.17 2 8v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2H8.9l7.08-4.61a1 1 0 0 0-1.1-1.67L7.72 5.14a1 1 0 0 0-.48.86v.15"></path><circle cx="7" cy="14" r="3"></circle><path d="M13 12h7"></path><path d="M13 16h7"></path></svg>
    </button>
    <div class="radio-content">
      <div class="radio-header">
        <h3 class="radio-title">Estações de Rádio</h3>
      </div>
      <div class="radio-display"></div>
      <div class="radio-stations"></div>
      <div class="radio-controls"></div>
    </div>
  `;
  
  // Adicionar ao container
  container.appendChild(radioPlayer);
  
  // Inicializar player
  initRadioPlayer();
  
  // Selecionar estação inicial se configurado
  if (config.autoPlay && config.initialStation) {
    setTimeout(() => {
      const radioToggle = radioPlayer.querySelector('.radio-toggle');
      if (radioToggle) {
        radioToggle.click();
        
        setTimeout(() => {
          const stationElement = radioPlayer.querySelector(`.radio-station[data-station-id="${config.initialStation}"]`);
          if (stationElement) {
            stationElement.click();
          }
        }, 500);
      }
    }, 1000);
  }
  
  return radioPlayer;
}
