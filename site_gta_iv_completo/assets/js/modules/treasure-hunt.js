// Módulo de minijogo de caça ao tesouro para o site GTA IV

/**
 * Inicializa o minijogo de caça ao tesouro temático de GTA IV
 */
export function initTreasureHunt() {
  // Selecionar o container do jogo
  const gameContainer = document.querySelector('.treasure-hunt');
  if (!gameContainer) return;
  
  // Estado do jogo
  const game = {
    isActive: false,
    currentClue: 0,
    foundLocations: [],
    totalLocations: 10,
    startTime: null,
    endTime: null
  };
  
  // Definir locais e pistas
  const treasureLocations = [
    {
      id: 'broker-bridge',
      name: 'Ponte de Broker',
      clue: 'Onde Niko primeiro vê a cidade ao chegar. Esta estrutura conecta Broker e Algonquin.',
      hint: 'É uma ponte icônica que você cruza no início do jogo.',
      image: '/assets/images/locations/broker-bridge.jpg',
      coordinates: { x: 73, y: 42 }
    },
    {
      id: 'roman-taxi',
      name: 'Empresa de Táxis do Roman',
      clue: 'O negócio do seu primo que "não é exatamente como ele descreveu" nas cartas.',
      hint: 'Fica em Broker, onde você encontra Roman pela primeira vez.',
      image: '/assets/images/locations/roman-taxi.jpg',
      coordinates: { x: 65, y: 58 }
    },
    {
      id: 'middle-park',
      name: 'Middle Park',
      clue: 'O pulmão verde de Algonquin, inspirado em um famoso parque de NYC.',
      hint: 'É uma grande área verde no centro de Algonquin.',
      image: '/assets/images/locations/middle-park.jpg',
      coordinates: { x: 45, y: 35 }
    },
    {
      id: 'star-junction',
      name: 'Star Junction',
      clue: 'Luzes brilhantes, telões gigantes e muitos turistas neste cruzamento famoso.',
      hint: 'É a versão do jogo para Times Square.',
      image: '/assets/images/locations/star-junction.jpg',
      coordinates: { x: 48, y: 28 }
    },
    {
      id: 'happiness-island',
      name: 'Ilha da Felicidade',
      clue: 'Uma pequena ilha com uma grande estátua verde segurando um copo de café.',
      hint: 'É a versão do jogo para a Ilha da Liberdade.',
      image: '/assets/images/locations/happiness-island.jpg',
      coordinates: { x: 32, y: 68 }
    },
    {
      id: 'alderney-casino',
      name: 'Casino de Alderney',
      clue: 'Um estabelecimento de jogos abandonado onde uma missão importante acontece.',
      hint: 'Fica em Alderney e é cenário de um tiroteio intenso.',
      image: '/assets/images/locations/alderney-casino.jpg',
      coordinates: { x: 15, y: 40 }
    },
    {
      id: 'bowling-alley',
      name: 'Pista de Boliche',
      clue: '"Hey Niko, it\'s Roman! Let\'s go..." para este lugar frequentemente.',
      hint: 'Roman sempre quer te levar para jogar aqui.',
      image: '/assets/images/locations/bowling-alley.jpg',
      coordinates: { x: 58, y: 45 }
    },
    {
      id: 'perestroika',
      name: 'Clube Perestroika',
      clue: 'Clube noturno russo em Broker onde você encontra Mikhail Faustin.',
      hint: 'É um clube com shows de cabaret administrado pela máfia russa.',
      image: '/assets/images/locations/perestroika.jpg',
      coordinates: { x: 67, y: 38 }
    },
    {
      id: 'hospital-bohan',
      name: 'Hospital de Bohan',
      clue: 'Instituição médica onde você acorda após um evento traumático na história.',
      hint: 'Fica em Bohan, após uma traição importante na história.',
      image: '/assets/images/locations/hospital-bohan.jpg',
      coordinates: { x: 52, y: 22 }
    },
    {
      id: 'mansion-deal',
      name: 'Mansão do Acordo Final',
      clue: 'Grande propriedade onde um dos finais do jogo pode acontecer.',
      hint: 'É onde o acordo com Dimitri pode acontecer no final do jogo.',
      image: '/assets/images/locations/mansion-deal.jpg',
      coordinates: { x: 25, y: 75 }
    }
  ];
  
  // Inicializar interface do jogo
  initGameInterface();
  
  /**
   * Inicializa a interface do jogo
   */
  function initGameInterface() {
    // Limpar conteúdo existente
    gameContainer.innerHTML = '';
    
    // Criar elementos da interface
    const gameHeader = document.createElement('div');
    gameHeader.className = 'treasure-hunt__header';
    
    const gameTitle = document.createElement('h3');
    gameTitle.className = 'treasure-hunt__title';
    gameTitle.textContent = 'Caça ao Tesouro em Liberty City';
    
    const gameDescription = document.createElement('p');
    gameDescription.className = 'treasure-hunt__description';
    gameDescription.textContent = 'Encontre os locais icônicos de GTA IV baseados nas pistas. Clique no mapa para marcar sua resposta.';
    
    gameHeader.appendChild(gameTitle);
    gameHeader.appendChild(gameDescription);
    
    // Criar área de jogo
    const gameArea = document.createElement('div');
    gameArea.className = 'treasure-hunt__area';
    
    // Criar painel de pistas
    const cluePanel = document.createElement('div');
    cluePanel.className = 'treasure-hunt__clue-panel';
    
    const clueTitle = document.createElement('h4');
    clueTitle.className = 'treasure-hunt__clue-title';
    clueTitle.textContent = 'Pista Atual';
    
    const clueText = document.createElement('p');
    clueText.className = 'treasure-hunt__clue-text';
    clueText.textContent = 'Clique em "Iniciar Jogo" para começar a caça ao tesouro.';
    
    const clueHint = document.createElement('div');
    clueHint.className = 'treasure-hunt__hint';
    
    const hintButton = document.createElement('button');
    hintButton.className = 'treasure-hunt__hint-button';
    hintButton.textContent = 'Mostrar Dica';
    hintButton.addEventListener('click', showHint);
    
    const hintText = document.createElement('p');
    hintText.className = 'treasure-hunt__hint-text';
    hintText.style.display = 'none';
    
    clueHint.appendChild(hintButton);
    clueHint.appendChild(hintText);
    
    cluePanel.appendChild(clueTitle);
    cluePanel.appendChild(clueText);
    cluePanel.appendChild(clueHint);
    
    // Criar mapa
    const mapContainer = document.createElement('div');
    mapContainer.className = 'treasure-hunt__map-container';
    
    const mapImage = document.createElement('div');
    mapImage.className = 'treasure-hunt__map';
    mapImage.style.backgroundImage = 'url(/assets/images/maps/liberty-city-map.jpg)';
    mapImage.addEventListener('click', handleMapClick);
    
    // Adicionar marcadores para locais encontrados
    const markersContainer = document.createElement('div');
    markersContainer.className = 'treasure-hunt__markers';
    
    mapContainer.appendChild(mapImage);
    mapContainer.appendChild(markersContainer);
    
    // Adicionar painel de progresso
    const progressPanel = document.createElement('div');
    progressPanel.className = 'treasure-hunt__progress';
    
    const progressTitle = document.createElement('h4');
    progressTitle.className = 'treasure-hunt__progress-title';
    progressTitle.textContent = 'Progresso';
    
    const progressBar = document.createElement('div');
    progressBar.className = 'treasure-hunt__progress-bar';
    
    const progressFill = document.createElement('div');
    progressFill.className = 'treasure-hunt__progress-fill';
    progressFill.style.width = '0%';
    
    const progressText = document.createElement('p');
    progressText.className = 'treasure-hunt__progress-text';
    progressText.textContent = '0/' + game.totalLocations + ' locais encontrados';
    
    progressBar.appendChild(progressFill);
    
    progressPanel.appendChild(progressTitle);
    progressPanel.appendChild(progressBar);
    progressPanel.appendChild(progressText);
    
    // Adicionar botões de controle
    const controlsPanel = document.createElement('div');
    controlsPanel.className = 'treasure-hunt__controls';
    
    const startButton = document.createElement('button');
    startButton.className = 'treasure-hunt__start-button';
    startButton.textContent = 'Iniciar Jogo';
    startButton.addEventListener('click', startGame);
    
    const resetButton = document.createElement('button');
    resetButton.className = 'treasure-hunt__reset-button';
    resetButton.textContent = 'Reiniciar';
    resetButton.addEventListener('click', resetGame);
    resetButton.style.display = 'none';
    
    controlsPanel.appendChild(startButton);
    controlsPanel.appendChild(resetButton);
    
    // Montar área de jogo
    gameArea.appendChild(cluePanel);
    gameArea.appendChild(mapContainer);
    
    // Montar container do jogo
    gameContainer.appendChild(gameHeader);
    gameContainer.appendChild(gameArea);
    gameContainer.appendChild(progressPanel);
    gameContainer.appendChild(controlsPanel);
    
    // Adicionar painel de resultados (inicialmente oculto)
    const resultsPanel = document.createElement('div');
    resultsPanel.className = 'treasure-hunt__results';
    resultsPanel.style.display = 'none';
    
    gameContainer.appendChild(resultsPanel);
  }
  
  /**
   * Inicia o jogo
   */
  function startGame() {
    // Atualizar estado do jogo
    game.isActive = true;
    game.currentClue = 0;
    game.foundLocations = [];
    game.startTime = new Date();
    
    // Atualizar interface
    updateGameInterface();
    
    // Mostrar primeiro local
    showNextClue();
    
    // Atualizar botões
    const startButton = gameContainer.querySelector('.treasure-hunt__start-button');
    const resetButton = gameContainer.querySelector('.treasure-hunt__reset-button');
    
    if (startButton) startButton.style.display = 'none';
    if (resetButton) resetButton.style.display = 'block';
    
    // Disparar evento
    const event = new CustomEvent('treasurehuntstart');
    document.dispatchEvent(event);
  }
  
  /**
   * Reinicia o jogo
   */
  function resetGame() {
    // Confirmar reset
    if (game.foundLocations.length > 0) {
      if (!confirm('Tem certeza que deseja reiniciar o jogo? Todo o progresso será perdido.')) {
        return;
      }
    }
    
    // Limpar marcadores
    const markersContainer = gameContainer.querySelector('.treasure-hunt__markers');
    if (markersContainer) markersContainer.innerHTML = '';
    
    // Esconder resultados
    const resultsPanel = gameContainer.querySelector('.treasure-hunt__results');
    if (resultsPanel) resultsPanel.style.display = 'none';
    
    // Reiniciar jogo
    startGame();
  }
  
  /**
   * Mostra a próxima pista
   */
  function showNextClue() {
    if (game.currentClue >= treasureLocations.length) {
      endGame();
      return;
    }
    
    // Obter local atual
    const location = treasureLocations[game.currentClue];
    
    // Atualizar texto da pista
    const clueText = gameContainer.querySelector('.treasure-hunt__clue-text');
    const hintText = gameContainer.querySelector('.treasure-hunt__hint-text');
    
    if (clueText) clueText.textContent = location.clue;
    if (hintText) {
      hintText.textContent = location.hint;
      hintText.style.display = 'none';
    }
  }
  
  /**
   * Mostra a dica para a pista atual
   */
  function showHint() {
    if (!game.isActive || game.currentClue >= treasureLocations.length) return;
    
    // Mostrar texto da dica
    const hintText = gameContainer.querySelector('.treasure-hunt__hint-text');
    if (hintText) hintText.style.display = 'block';
  }
  
  /**
   * Manipula clique no mapa
   * @param {MouseEvent} e - Evento de clique
   */
  function handleMapClick(e) {
    if (!game.isActive || game.currentClue >= treasureLocations.length) return;
    
    // Obter coordenadas do clique
    const map = gameContainer.querySelector('.treasure-hunt__map');
    const rect = map.getBoundingClientRect();
    
    const x = Math.round(((e.clientX - rect.left) / rect.width) * 100);
    const y = Math.round(((e.clientY - rect.top) / rect.height) * 100);
    
    // Verificar se acertou o local
    const location = treasureLocations[game.currentClue];
    const distance = calculateDistance(x, y, location.coordinates.x, location.coordinates.y);
    
    // Considerar acerto se estiver dentro de uma distância razoável
    const isCorrect = distance <= 10;
    
    // Adicionar marcador
    addMarker(x, y, isCorrect);
    
    // Processar resultado
    if (isCorrect) {
      // Adicionar à lista de locais encontrados
      game.foundLocations.push(location.id);
      
      // Atualizar progresso
      updateProgress();
      
      // Mostrar feedback positivo
      showFeedback(true, location);
      
      // Avançar para próxima pista
      game.currentClue++;
      
      // Verificar se o jogo acabou
      if (game.currentClue >= treasureLocations.length) {
        endGame();
      } else {
        // Mostrar próxima pista após um breve delay
        setTimeout(showNextClue, 2000);
      }
    } else {
      // Mostrar feedback negativo
      showFeedback(false);
    }
  }
  
  /**
   * Adiciona um marcador no mapa
   * @param {number} x - Coordenada X (0-100)
   * @param {number} y - Coordenada Y (0-100)
   * @param {boolean} isCorrect - Se o marcador indica um acerto
   */
  function addMarker(x, y, isCorrect) {
    const markersContainer = gameContainer.querySelector('.treasure-hunt__markers');
    if (!markersContainer) return;
    
    const marker = document.createElement('div');
    marker.className = `treasure-hunt__marker ${isCorrect ? 'treasure-hunt__marker--correct' : 'treasure-hunt__marker--wrong'}`;
    marker.style.left = `${x}%`;
    marker.style.top = `${y}%`;
    
    markersContainer.appendChild(marker);
    
    // Adicionar animação
    setTimeout(() => {
      marker.classList.add('treasure-hunt__marker--animated');
    }, 10);
    
    // Remover marcadores de erro após um tempo
    if (!isCorrect) {
      setTimeout(() => {
        marker.classList.add('treasure-hunt__marker--fade-out');
        setTimeout(() => {
          marker.remove();
        }, 500);
      }, 2000);
    }
  }
  
  /**
   * Mostra feedback após uma tentativa
   * @param {boolean} isCorrect - Se a tentativa foi correta
   * @param {Object} location - Local encontrado (se correto)
   */
  function showFeedback(isCorrect, location) {
    // Criar elemento de feedback
    const feedback = document.createElement('div');
    feedback.className = `treasure-hunt__feedback ${isCorrect ? 'treasure-hunt__feedback--correct' : 'treasure-hunt__feedback--wrong'}`;
    
    if (isCorrect) {
      feedback.innerHTML = `
        <h4>Local Encontrado!</h4>
        <h5>${location.name}</h5>
        <div class="treasure-hunt__feedback-image">
          <img src="${location.image}" alt="${location.name}">
        </div>
      `;
    } else {
      feedback.innerHTML = `
        <h4>Tente Novamente</h4>
        <p>Esse não é o local correto. Leia a pista com atenção.</p>
      `;
    }
    
    // Adicionar ao container
    gameContainer.appendChild(feedback);
    
    // Mostrar com animação
    setTimeout(() => {
      feedback.classList.add('treasure-hunt__feedback--active');
    }, 10);
    
    // Remover após um tempo
    setTimeout(() => {
      feedback.classList.remove('treasure-hunt__feedback--active');
      setTimeout(() => {
        feedback.remove();
      }, 500);
    }, isCorrect ? 2000 : 1500);
  }
  
  /**
   * Atualiza o progresso do jogo
   */
  function updateProgress() {
    const progressFill = gameContainer.querySelector('.treasure-hunt__progress-fill');
    const progressText = gameContainer.querySelector('.treasure-hunt__progress-text');
    
    if (progressFill && progressText) {
      const progress = (game.foundLocations.length / game.totalLocations) * 100;
      progressFill.style.width = `${progress}%`;
      progressText.textContent = `${game.foundLocations.length}/${game.totalLocations} locais encontrados`;
    }
  }
  
  /**
   * Atualiza a interface do jogo
   */
  function updateGameInterface() {
    // Atualizar progresso
    updateProgress();
  }
  
  /**
   * Finaliza o jogo
   */
  function endGame() {
    // Atualizar estado
    game.isActive = false;
    game.endTime = new Date();
    
    // Calcular tempo total
    const totalTime = Math.floor((game.endTime - game.startTime) / 1000);
    const minutes = Math.floor(totalTime / 60);
    const seconds = totalTime % 60;
    
    // Mostrar resultados
    const resultsPanel = gameContainer.querySelector('.treasure-hunt__results');
    if (resultsPanel) {
      resultsPanel.style.display = 'block';
      resultsPanel.innerHTML = `
        <h3 class="treasure-hunt__results-title">Parabéns!</h3>
        <p class="treasure-hunt__results-text">Você encontrou todos os ${game.totalLocations} locais em Liberty City.</p>
        <p class="treasure-hunt__results-time">Tempo total: ${minutes}m ${seconds}s</p>
        <div class="treasure-hunt__results-locations">
          <h4>Locais Encontrados:</h4>
          <ul class="treasure-hunt__results-list">
            ${treasureLocations.map(location => `
              <li class="treasure-hunt__results-item">
                <img src="${location.image}" alt="${location.name}">
                <span>${location.name}</span>
              </li>
            `).join('')}
          </ul>
        </div>
        <button class="treasure-hunt__results-share">Compartilhar Resultado</button>
      `;
      
      // Adicionar listener para compartilhar
      const shareButton = resultsPanel.querySelector('.treasure-hunt__results-share');
      if (shareButton) {
        shareButton.addEventListener('click', () => {
          shareResults(totalTime);
        });
      }
    }
    
    // Atualizar botões
    const resetButton = gameContainer.querySelector('.treasure-hunt__reset-button');
    if (resetButton) resetButton.textContent = 'Jogar Novamente';
    
    // Disparar evento
    const event = new CustomEvent('treasurehuntcomplete', {
      detail: {
        locationsFound: game.foundLocations.length,
        totalTime: totalTime
      }
    });
    document.dispatchEvent(event);
  }
  
  /**
   * Compartilha os resultados do jogo
   * @param {number} totalTime - Tempo total em segundos
   */
  function shareResults(totalTime) {
    const minutes = Math.floor(totalTime / 60);
    const seconds = totalTime % 60;
    
    const text = `Completei a Caça ao Tesouro de GTA IV encontrando todos os ${game.totalLocations} locais em Liberty City em ${minutes}m ${seconds}s!`;
    
    // Tentar usar a API de compartilhamento se disponível
    if (navigator.share) {
      navigator.share({
        title: 'Meu resultado na Caça ao Tesouro de GTA IV',
        text: text,
        url: window.location.href
      }).catch(err => {
        console.log('Erro ao compartilhar:', err);
        // Fallback: copiar para a área de transferência
        copyToClipboard(text);
      });
    } else {
      // Fallback: copiar para a área de transferência
      copyToClipboard(text);
    }
  }
  
  /**
   * Copia texto para a área de transferência
   * @param {string} text - Texto a ser copiado
   */
  function copyToClipboard(text) {
    // Criar elemento temporário
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'absolute';
    textarea.style.left = '-9999px';
    
    document.body.appendChild(textarea);
    textarea.select();
    
    try {
      document.execCommand('copy');
      alert('Resultado copiado para a área de transferência!');
    } catch (err) {
      console.error('Erro ao copiar texto:', err);
      alert('Não foi possível copiar o resultado.');
    }
    
    document.body.removeChild(textarea);
  }
  
  /**
   * Calcula a distância entre dois pontos
   * @param {number} x1 - Coordenada X do primeiro ponto
   * @param {number} y1 - Coordenada Y do primeiro ponto
   * @param {number} x2 - Coordenada X do segundo ponto
   * @param {number} y2 - Coordenada Y do segundo ponto
   * @returns {number} - Distância entre os pontos
   */
  function calculateDistance(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
  }
}

/**
 * Cria um minijogo de caça ao tesouro dinamicamente
 * @param {Object} options - Opções de configuração
 * @param {string} containerId - ID do container onde adicionar o jogo
 * @returns {HTMLElement} - Elemento do jogo criado
 */
export function createTreasureHunt(options, containerId) {
  const defaultOptions = {
    title: 'Caça ao Tesouro em Liberty City',
    showHints: true
  };
  
  const config = { ...defaultOptions, ...options };
  const container = document.getElementById(containerId);
  
  if (!container) return null;
  
  // Criar elemento do jogo
  const gameContainer = document.createElement('div');
  gameContainer.className = 'treasure-hunt';
  
  // Adicionar ao container
  container.appendChild(gameContainer);
  
  // Inicializar jogo
  initTreasureHunt();
  
  return gameContainer;
}
