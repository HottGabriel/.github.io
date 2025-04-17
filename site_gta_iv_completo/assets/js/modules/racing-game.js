// Módulo de minijogo de corrida para o site GTA IV

/**
 * Inicializa o minijogo de corrida temático de GTA IV
 */
export function initRacingGame() {
  // Selecionar o container do jogo
  const gameContainer = document.querySelector('.racing-game');
  if (!gameContainer) return;
  
  // Criar canvas se não existir
  let canvas = gameContainer.querySelector('canvas');
  if (!canvas) {
    canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 500;
    gameContainer.appendChild(canvas);
  }
  
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  
  // Configuração do jogo
  const game = {
    isRunning: false,
    isPaused: false,
    score: 0,
    distance: 0,
    speed: 5,
    maxSpeed: 15,
    acceleration: 0.05,
    roadWidth: 2000,
    cameraDepth: 0.84,
    playerX: 0,
    playerY: 0,
    steerSpeed: 0.02,
    centrifugal: 0.3,
    cars: [],
    obstacles: [],
    segments: [],
    segmentLength: 200,
    rumbleLength: 3,
    trackLength: null,
    lanes: 3,
    fieldOfView: 100,
    cameraHeight: 1000,
    drawDistance: 300,
    fogDensity: 5,
    background: null,
    sprites: {},
    resolution: null,
    roadWidth: 2000,
    keys: {
      left: false,
      right: false,
      up: false,
      down: false
    }
  };
  
  // Carregar recursos
  loadResources(() => {
    // Inicializar jogo
    resetGame();
    
    // Adicionar listeners de teclado
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    
    // Adicionar controles touch para dispositivos móveis
    addTouchControls();
    
    // Adicionar botões de controle
    addGameControls();
    
    // Iniciar loop do jogo
    gameLoop();
  });
  
  /**
   * Carrega recursos do jogo (imagens, sons)
   * @param {Function} callback - Função a ser chamada quando todos os recursos estiverem carregados
   */
  function loadResources(callback) {
    let loadedResources = 0;
    const totalResources = 8;
    
    // Função para verificar se todos os recursos foram carregados
    function resourceLoaded() {
      loadedResources++;
      if (loadedResources === totalResources) {
        callback();
      }
    }
    
    // Carregar imagens de fundo
    game.background = new Image();
    game.background.onload = resourceLoaded;
    game.background.src = '/assets/images/games/racing/background.png';
    
    // Carregar sprites
    const spriteNames = ['player', 'car1', 'car2', 'car3', 'obstacle1', 'obstacle2', 'tree'];
    
    spriteNames.forEach(name => {
      game.sprites[name] = new Image();
      game.sprites[name].onload = resourceLoaded;
      game.sprites[name].src = `/assets/images/games/racing/${name}.png`;
    });
  }
  
  /**
   * Reseta o jogo para o estado inicial
   */
  function resetGame() {
    game.isRunning = false;
    game.isPaused = false;
    game.score = 0;
    game.distance = 0;
    game.speed = 5;
    game.playerX = 0;
    game.cars = [];
    game.obstacles = [];
    
    // Criar pista
    createTrack();
    
    // Adicionar carros de IA
    addAICars();
    
    // Adicionar obstáculos
    addObstacles();
  }
  
  /**
   * Cria a pista de corrida
   */
  function createTrack() {
    game.segments = [];
    
    // Criar segmentos retos
    for (let i = 0; i < 100; i++) {
      addSegment(0);
    }
    
    // Criar curva para a direita
    for (let i = 0; i < 50; i++) {
      addSegment(0.5);
    }
    
    // Criar segmentos retos
    for (let i = 0; i < 50; i++) {
      addSegment(0);
    }
    
    // Criar curva para a esquerda
    for (let i = 0; i < 50; i++) {
      addSegment(-0.5);
    }
    
    // Criar segmentos retos
    for (let i = 0; i < 50; i++) {
      addSegment(0);
    }
    
    // Criar curva para a direita
    for (let i = 0; i < 30; i++) {
      addSegment(0.7);
    }
    
    // Criar segmentos retos
    for (let i = 0; i < 50; i++) {
      addSegment(0);
    }
    
    // Criar curva para a esquerda
    for (let i = 0; i < 30; i++) {
      addSegment(-0.7);
    }
    
    // Criar segmentos retos finais
    for (let i = 0; i < 100; i++) {
      addSegment(0);
    }
    
    // Calcular comprimento total da pista
    game.trackLength = game.segments.length * game.segmentLength;
  }
  
  /**
   * Adiciona um segmento à pista
   * @param {number} curve - Curvatura do segmento
   */
  function addSegment(curve) {
    const n = game.segments.length;
    
    game.segments.push({
      index: n,
      p1: { world: { z: n * game.segmentLength }, camera: {}, screen: {} },
      p2: { world: { z: (n + 1) * game.segmentLength }, camera: {}, screen: {} },
      curve: curve,
      color: Math.floor(n / game.rumbleLength) % 2 ? 1 : 0
    });
  }
  
  /**
   * Adiciona carros controlados por IA
   */
  function addAICars() {
    // Adicionar carros em posições aleatórias
    for (let i = 0; i < 10; i++) {
      const offset = Math.random() * 2 - 1; // -1 a 1
      const z = Math.floor(Math.random() * game.trackLength);
      const sprite = `car${Math.floor(Math.random() * 3) + 1}`;
      const speed = game.maxSpeed / 2 + Math.random() * game.maxSpeed / 2;
      
      game.cars.push({
        offset: offset,
        z: z,
        sprite: game.sprites[sprite],
        speed: speed
      });
    }
  }
  
  /**
   * Adiciona obstáculos na pista
   */
  function addObstacles() {
    // Adicionar obstáculos em posições aleatórias
    for (let i = 0; i < 20; i++) {
      const offset = Math.random() * 2.5 - 1.25; // -1.25 a 1.25
      const z = Math.floor(Math.random() * game.trackLength);
      const sprite = `obstacle${Math.floor(Math.random() * 2) + 1}`;
      
      // Evitar obstáculos muito próximos
      let tooClose = false;
      for (let j = 0; j < game.obstacles.length; j++) {
        if (Math.abs(game.obstacles[j].z - z) < 500) {
          tooClose = true;
          break;
        }
      }
      
      if (!tooClose) {
        game.obstacles.push({
          offset: offset,
          z: z,
          sprite: game.sprites[sprite]
        });
      }
    }
    
    // Adicionar árvores nas laterais
    for (let i = 0; i < 200; i++) {
      const side = Math.random() < 0.5 ? -1 : 1;
      const offset = side * (2 + Math.random() * 5); // Longe da pista
      const z = Math.floor(Math.random() * game.trackLength);
      
      game.obstacles.push({
        offset: offset,
        z: z,
        sprite: game.sprites.tree
      });
    }
  }
  
  /**
   * Manipula evento de tecla pressionada
   * @param {KeyboardEvent} e - Evento de teclado
   */
  function handleKeyDown(e) {
    switch (e.key) {
      case 'ArrowLeft':
        game.keys.left = true;
        break;
      case 'ArrowRight':
        game.keys.right = true;
        break;
      case 'ArrowUp':
        game.keys.up = true;
        break;
      case 'ArrowDown':
        game.keys.down = true;
        break;
      case ' ':
        if (!game.isRunning) {
          startGame();
        } else {
          togglePause();
        }
        break;
    }
  }
  
  /**
   * Manipula evento de tecla solta
   * @param {KeyboardEvent} e - Evento de teclado
   */
  function handleKeyUp(e) {
    switch (e.key) {
      case 'ArrowLeft':
        game.keys.left = false;
        break;
      case 'ArrowRight':
        game.keys.right = false;
        break;
      case 'ArrowUp':
        game.keys.up = false;
        break;
      case 'ArrowDown':
        game.keys.down = false;
        break;
    }
  }
  
  /**
   * Adiciona controles touch para dispositivos móveis
   */
  function addTouchControls() {
    // Criar elementos de controle
    const touchControls = document.createElement('div');
    touchControls.className = 'racing-touch-controls';
    
    touchControls.innerHTML = `
      <div class="racing-touch-left"></div>
      <div class="racing-touch-right"></div>
      <div class="racing-touch-up"></div>
      <div class="racing-touch-down"></div>
    `;
    
    gameContainer.appendChild(touchControls);
    
    // Adicionar listeners
    const leftBtn = touchControls.querySelector('.racing-touch-left');
    const rightBtn = touchControls.querySelector('.racing-touch-right');
    const upBtn = touchControls.querySelector('.racing-touch-up');
    const downBtn = touchControls.querySelector('.racing-touch-down');
    
    // Função para manipular eventos touch
    function handleTouch(element, key, isDown) {
      const touchStart = () => {
        game.keys[key] = isDown;
      };
      
      const touchEnd = () => {
        game.keys[key] = !isDown;
      };
      
      element.addEventListener('touchstart', touchStart, { passive: true });
      element.addEventListener('touchend', touchEnd, { passive: true });
      element.addEventListener('touchcancel', touchEnd, { passive: true });
    }
    
    // Configurar controles
    handleTouch(leftBtn, 'left', true);
    handleTouch(rightBtn, 'right', true);
    handleTouch(upBtn, 'up', true);
    handleTouch(downBtn, 'down', true);
    
    // Adicionar listener para iniciar/pausar jogo
    canvas.addEventListener('touchstart', () => {
      if (!game.isRunning) {
        startGame();
      } else {
        togglePause();
      }
    }, { passive: true });
  }
  
  /**
   * Adiciona botões de controle do jogo
   */
  function addGameControls() {
    // Criar elementos de controle
    const gameControls = document.createElement('div');
    gameControls.className = 'racing-game-controls';
    
    gameControls.innerHTML = `
      <button class="racing-start-btn">Iniciar Corrida</button>
      <button class="racing-reset-btn">Reiniciar</button>
    `;
    
    gameContainer.appendChild(gameControls);
    
    // Adicionar listeners
    const startBtn = gameControls.querySelector('.racing-start-btn');
    const resetBtn = gameControls.querySelector('.racing-reset-btn');
    
    startBtn.addEventListener('click', () => {
      if (!game.isRunning) {
        startGame();
      } else {
        togglePause();
      }
      
      // Atualizar texto do botão
      startBtn.textContent = game.isRunning && !game.isPaused ? 'Pausar' : 'Continuar';
    });
    
    resetBtn.addEventListener('click', () => {
      resetGame();
      startBtn.textContent = 'Iniciar Corrida';
    });
  }
  
  /**
   * Inicia o jogo
   */
  function startGame() {
    game.isRunning = true;
    game.isPaused = false;
  }
  
  /**
   * Alterna o estado de pausa do jogo
   */
  function togglePause() {
    game.isPaused = !game.isPaused;
  }
  
  /**
   * Loop principal do jogo
   */
  function gameLoop() {
    // Limpar canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Desenhar tela inicial se o jogo não estiver rodando
    if (!game.isRunning) {
      drawStartScreen();
    } 
    // Desenhar tela de pausa se o jogo estiver pausado
    else if (game.isPaused) {
      drawPauseScreen();
    } 
    // Atualizar e renderizar o jogo
    else {
      update();
      render();
    }
    
    // Continuar loop
    requestAnimationFrame(gameLoop);
  }
  
  /**
   * Atualiza o estado do jogo
   */
  function update() {
    // Atualizar posição do jogador
    updatePlayer();
    
    // Atualizar carros de IA
    updateAICars();
    
    // Verificar colisões
    checkCollisions();
    
    // Atualizar distância percorrida
    game.distance += game.speed;
    
    // Atualizar pontuação
    game.score = Math.floor(game.distance / 100);
  }
  
  /**
   * Atualiza a posição do jogador
   */
  function updatePlayer() {
    // Acelerar/desacelerar
    if (game.keys.up) {
      game.speed = Math.min(game.speed + game.acceleration, game.maxSpeed);
    } else if (game.keys.down) {
      game.speed = Math.max(game.speed - game.acceleration * 2, 0);
    } else {
      game.speed = Math.max(game.speed - game.acceleration / 2, 0);
    }
    
    // Calcular posição na curva
    const playerSegment = findSegment(game.distance);
    const speedPercent = game.speed / game.maxSpeed;
    const dx = game.speed * speedPercent * playerSegment.curve * game.centrifugal;
    
    // Virar para esquerda/direita
    if (game.keys.left) {
      game.playerX = Math.max(game.playerX - game.steerSpeed * speedPercent, -1);
    } else if (game.keys.right) {
      game.playerX = Math.min(game.playerX + game.steerSpeed * speedPercent, 1);
    }
    
    // Aplicar força centrífuga
    game.playerX = game.playerX - dx;
  }
  
  /**
   * Atualiza os carros controlados por IA
   */
  function updateAICars() {
    for (let i = 0; i < game.cars.length; i++) {
      const car = game.cars[i];
      
      // Mover carro
      car.z = (car.z + car.speed) % game.trackLength;
    }
  }
  
  /**
   * Verifica colisões entre o jogador e outros objetos
   */
  function checkCollisions() {
    // Encontrar segmento atual do jogador
    const playerSegment = findSegment(game.distance);
    const playerW = 0.5; // Largura do jogador (normalizada)
    
    // Verificar colisão com carros
    for (let i = 0; i < game.cars.length; i++) {
      const car = game.cars[i];
      const carSegment = findSegment(car.z);
      
      // Se o carro está no mesmo segmento que o jogador
      if (carSegment.index === playerSegment.index) {
        // Verificar colisão horizontal
        if (Math.abs(car.offset - game.playerX) < playerW) {
          // Colisão!
          game.speed = Math.max(game.speed / 2, 0);
          
          // Deslocar jogador
          game.playerX = car.offset > game.playerX ? car.offset - playerW : car.offset + playerW;
        }
      }
    }
    
    // Verificar colisão com obstáculos
    for (let i = 0; i < game.obstacles.length; i++) {
      const obstacle = game.obstacles[i];
      const obstacleSegment = findSegment(obstacle.z);
      
      // Se o obstáculo está no mesmo segmento que o jogador
      if (obstacleSegment.index === playerSegment.index) {
        // Verificar colisão horizontal
        if (Math.abs(obstacle.offset - game.playerX) < playerW) {
          // Colisão!
          game.speed = Math.max(game.speed / 3, 0);
        }
      }
    }
    
    // Verificar saída da pista
    if (Math.abs(game.playerX) > 1.5) {
      game.speed = Math.max(game.speed / 4, 0);
      game.playerX = game.playerX > 0 ? 1.5 : -1.5;
    }
  }
  
  /**
   * Renderiza o jogo
   */
  function render() {
    // Desenhar céu
    ctx.drawImage(game.background, 0, 0, canvas.width, canvas.height / 2);
    
    // Desenhar pista
    renderRoad();
    
    // Desenhar HUD
    renderHUD();
  }
  
  /**
   * Renderiza a pista e os objetos nela
   */
  function renderRoad() {
    // Configurações de renderização
    const baseSegment = findSegment(game.distance);
    const cameraHeight = game.cameraHeight;
    const maxy = canvas.height;
    
    // Desenhar segmentos
    for (let n = 0; n < game.drawDistance; n++) {
      const segmentIndex = (baseSegment.index + n) % game.segments.length;
      const segment = game.segments[segmentIndex];
      
      // Projetar segmento na tela
      project(segment, game.playerX, cameraHeight, game.distance, game.fieldOfView, canvas.width, canvas.height);
      
      // Desenhar segmento
      const x1 = segment.p1.screen.x;
      const y1 = segment.p1.screen.y;
      const w1 = segment.p1.screen.w;
      const x2 = segment.p2.screen.x;
      const y2 = segment.p2.screen.y;
      const w2 = segment.p2.screen.w;
      
      // Cores da pista
      const grass = segment.color ? '#10AA10' : '#009A00';
      const road = segment.color ? '#6B6B6B' : '#696969';
      const rumble = segment.color ? '#555555' : '#BBBBBB';
      
      // Desenhar apenas se visível
      if (y2 >= maxy) continue;
      
      // Desenhar grama
      ctx.fillStyle = grass;
      ctx.fillRect(0, y1, canvas.width, y2 - y1);
      
      // Desenhar pista
      drawPolygon(ctx, x1 - w1, y1, x1 + w1, y1, x2 + w2, y2, x2 - w2, y2, road);
      
      // Desenhar linhas de marcação
      const rumbleW1 = w1 * 0.15;
      const rumbleW2 = w2 * 0.15;
      drawPolygon(ctx, x1 - w1 - rumbleW1, y1, x1 - w1, y1, x2 - w2, y2, x2 - w2 - rumbleW2, y2, rumble);
      drawPolygon(ctx, x1 + w1, y1, x1 + w1 + rumbleW1, y1, x2 + w2 + rumbleW2, y2, x2 + w2, y2, rumble);
      
      // Desenhar linha central
      if (segment.color === 0) {
        const lineW1 = w1 * 0.02;
        const lineW2 = w2 * 0.02;
        drawPolygon(ctx, x1 - lineW1, y1, x1 + lineW1, y1, x2 + lineW2, y2, x2 - lineW2, y2, '#FFFFFF');
      }
      
      // Desenhar carros neste segmento
      for (let i = 0; i < game.cars.length; i++) {
        const car = game.cars[i];
        if (car.z >= segment.p1.world.z && car.z < segment.p2.world.z) {
          // Projetar posição do carro
          const scale = interpolate(segment.p1.screen.scale, segment.p2.screen.scale, (car.z - segment.p1.world.z) / game.segmentLength);
          const x = interpolate(segment.p1.screen.x, segment.p2.screen.x, (car.z - segment.p1.world.z) / game.segmentLength);
          const y = interpolate(segment.p1.screen.y, segment.p2.screen.y, (car.z - segment.p1.world.z) / game.segmentLength);
          
          // Desenhar carro
          drawSprite(ctx, x + car.offset * scale * canvas.width / 2, y, scale, car.sprite, -0.5, -1);
        }
      }
      
      // Desenhar obstáculos neste segmento
      for (let i = 0; i < game.obstacles.length; i++) {
        const obstacle = game.obstacles[i];
        if (obstacle.z >= segment.p1.world.z && obstacle.z < segment.p2.world.z) {
          // Projetar posição do obstáculo
          const scale = interpolate(segment.p1.screen.scale, segment.p2.screen.scale, (obstacle.z - segment.p1.world.z) / game.segmentLength);
          const x = interpolate(segment.p1.screen.x, segment.p2.screen.x, (obstacle.z - segment.p1.world.z) / game.segmentLength);
          const y = interpolate(segment.p1.screen.y, segment.p2.screen.y, (obstacle.z - segment.p1.world.z) / game.segmentLength);
          
          // Desenhar obstáculo
          drawSprite(ctx, x + obstacle.offset * scale * canvas.width / 2, y, scale, obstacle.sprite, -0.5, -1);
        }
      }
    }
    
    // Desenhar jogador
    drawSprite(ctx, canvas.width / 2, canvas.height - 100, 1, game.sprites.player, -0.5, -1);
  }
  
  /**
   * Renderiza a interface do usuário (HUD)
   */
  function renderHUD() {
    // Configurar estilo
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, canvas.width, 40);
    
    // Desenhar pontuação
    ctx.font = '20px Arial';
    ctx.fillStyle = '#FFFFFF';
    ctx.textAlign = 'left';
    ctx.fillText(`Pontuação: ${game.score}`, 20, 30);
    
    // Desenhar velocidade
    const speed = Math.round(game.speed * 10);
    ctx.textAlign = 'right';
    ctx.fillText(`Velocidade: ${speed} km/h`, canvas.width - 20, 30);
  }
  
  /**
   * Desenha a tela inicial do jogo
   */
  function drawStartScreen() {
    // Desenhar fundo
    ctx.drawImage(game.background, 0, 0, canvas.width, canvas.height);
    
    // Configurar estilo
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Desenhar título
    ctx.font = '40px Arial';
    ctx.fillStyle = '#FFFFFF';
    ctx.textAlign = 'center';
    ctx.fillText('GTA IV Racing', canvas.width / 2, canvas.height / 3);
    
    // Desenhar instruções
    ctx.font = '20px Arial';
    ctx.fillText('Pressione ESPAÇO ou clique para iniciar', canvas.width / 2, canvas.height / 2);
    ctx.fillText('Use as setas para controlar o carro', canvas.width / 2, canvas.height / 2 + 40);
  }
  
  /**
   * Desenha a tela de pausa do jogo
   */
  function drawPauseScreen() {
    // Desenhar jogo em segundo plano
    render();
    
    // Configurar estilo
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Desenhar texto de pausa
    ctx.font = '40px Arial';
    ctx.fillStyle = '#FFFFFF';
    ctx.textAlign = 'center';
    ctx.fillText('PAUSADO', canvas.width / 2, canvas.height / 2);
    
    // Desenhar instruções
    ctx.font = '20px Arial';
    ctx.fillText('Pressione ESPAÇO ou clique para continuar', canvas.width / 2, canvas.height / 2 + 40);
  }
  
  /**
   * Encontra o segmento da pista em uma posição específica
   * @param {number} z - Posição na pista
   * @returns {Object} - Segmento encontrado
   */
  function findSegment(z) {
    return game.segments[Math.floor(z / game.segmentLength) % game.segments.length];
  }
  
  /**
   * Projeta um segmento da pista na tela
   * @param {Object} segment - Segmento a ser projetado
   * @param {number} cameraX - Posição X da câmera
   * @param {number} cameraY - Posição Y da câmera
   * @param {number} cameraZ - Posição Z da câmera
   * @param {number} fieldOfView - Campo de visão
   * @param {number} width - Largura da tela
   * @param {number} height - Altura da tela
   */
  function project(segment, cameraX, cameraY, cameraZ, fieldOfView, width, height) {
    // Projetar primeiro ponto
    project3D(segment.p1, cameraX, cameraY, cameraZ, fieldOfView, width, height);
    
    // Projetar segundo ponto
    project3D(segment.p2, cameraX, cameraY, cameraZ, fieldOfView, width, height);
  }
  
  /**
   * Projeta um ponto 3D na tela 2D
   * @param {Object} point - Ponto a ser projetado
   * @param {number} cameraX - Posição X da câmera
   * @param {number} cameraY - Posição Y da câmera
   * @param {number} cameraZ - Posição Z da câmera
   * @param {number} fieldOfView - Campo de visão
   * @param {number} width - Largura da tela
   * @param {number} height - Altura da tela
   */
  function project3D(point, cameraX, cameraY, cameraZ, fieldOfView, width, height) {
    // Calcular posição relativa à câmera
    const transX = point.world.x - cameraX;
    const transY = point.world.y - cameraY;
    const transZ = point.world.z - cameraZ;
    
    // Projetar para coordenadas de câmera
    point.camera.x = transX;
    point.camera.y = transY;
    point.camera.z = transZ;
    
    // Projetar para coordenadas de tela
    const scale = fieldOfView / point.camera.z;
    point.screen.scale = scale;
    point.screen.x = Math.round(width / 2 + scale * point.camera.x * width / 2);
    point.screen.y = Math.round(height / 2 - scale * point.camera.y);
    point.screen.w = Math.round(scale * game.roadWidth * width / 2);
  }
  
  /**
   * Desenha um polígono no canvas
   * @param {CanvasRenderingContext2D} ctx - Contexto do canvas
   * @param {number} x1 - Coordenada X do primeiro ponto
   * @param {number} y1 - Coordenada Y do primeiro ponto
   * @param {number} x2 - Coordenada X do segundo ponto
   * @param {number} y2 - Coordenada Y do segundo ponto
   * @param {number} x3 - Coordenada X do terceiro ponto
   * @param {number} y3 - Coordenada Y do terceiro ponto
   * @param {number} x4 - Coordenada X do quarto ponto
   * @param {number} y4 - Coordenada Y do quarto ponto
   * @param {string} color - Cor do polígono
   */
  function drawPolygon(ctx, x1, y1, x2, y2, x3, y3, x4, y4, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.lineTo(x3, y3);
    ctx.lineTo(x4, y4);
    ctx.closePath();
    ctx.fill();
  }
  
  /**
   * Desenha um sprite no canvas
   * @param {CanvasRenderingContext2D} ctx - Contexto do canvas
   * @param {number} x - Coordenada X do sprite
   * @param {number} y - Coordenada Y do sprite
   * @param {number} scale - Escala do sprite
   * @param {Image} sprite - Imagem do sprite
   * @param {number} offsetX - Deslocamento X (0 = centro, -0.5 = esquerda, 0.5 = direita)
   * @param {number} offsetY - Deslocamento Y (0 = centro, -1 = topo, 1 = base)
   */
  function drawSprite(ctx, x, y, scale, sprite, offsetX, offsetY) {
    const w = sprite.width * scale;
    const h = sprite.height * scale;
    const destX = x + (offsetX || 0) * w;
    const destY = y + (offsetY || 0) * h;
    
    ctx.drawImage(sprite, destX, destY, w, h);
  }
  
  /**
   * Interpola entre dois valores
   * @param {number} a - Primeiro valor
   * @param {number} b - Segundo valor
   * @param {number} t - Fator de interpolação (0-1)
   * @returns {number} - Valor interpolado
   */
  function interpolate(a, b, t) {
    return a + (b - a) * t;
  }
}

/**
 * Cria um minijogo de corrida dinamicamente
 * @param {Object} options - Opções de configuração
 * @param {string} containerId - ID do container onde adicionar o jogo
 * @returns {HTMLElement} - Elemento do jogo criado
 */
export function createRacingGame(options, containerId) {
  const defaultOptions = {
    width: 800,
    height: 500,
    showControls: true
  };
  
  const config = { ...defaultOptions, ...options };
  const container = document.getElementById(containerId);
  
  if (!container) return null;
  
  // Criar elemento do jogo
  const gameContainer = document.createElement('div');
  gameContainer.className = 'racing-game';
  
  // Criar canvas
  const canvas = document.createElement('canvas');
  canvas.width = config.width;
  canvas.height = config.height;
  gameContainer.appendChild(canvas);
  
  // Adicionar ao container
  container.appendChild(gameContainer);
  
  // Inicializar jogo
  initRacingGame();
  
  return gameContainer;
}
