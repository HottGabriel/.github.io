// Polyfills e ajustes para garantir compatibilidade cross-browser

// Polyfill para o método Array.from
if (!Array.from) {
  Array.from = function(arrayLike) {
    return Array.prototype.slice.call(arrayLike);
  };
}

// Polyfill para o método Element.matches
if (!Element.prototype.matches) {
  Element.prototype.matches = 
    Element.prototype.msMatchesSelector || 
    Element.prototype.webkitMatchesSelector;
}

// Polyfill para o método Element.closest
if (!Element.prototype.closest) {
  Element.prototype.closest = function(s) {
    var el = this;
    do {
      if (el.matches(s)) return el;
      el = el.parentElement || el.parentNode;
    } while (el !== null && el.nodeType === 1);
    return null;
  };
}

// Polyfill para o método CustomEvent
(function () {
  if (typeof window.CustomEvent === "function") return false;
  
  function CustomEvent(event, params) {
    params = params || { bubbles: false, cancelable: false, detail: null };
    var evt = document.createEvent('CustomEvent');
    evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
    return evt;
  }
  
  window.CustomEvent = CustomEvent;
})();

// Polyfill para o método requestAnimationFrame
(function() {
  var lastTime = 0;
  var vendors = ['webkit', 'moz', 'ms', 'o'];
  for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
    window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
    window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame'] || window[vendors[x]+'CancelRequestAnimationFrame'];
  }

  if (!window.requestAnimationFrame) {
    window.requestAnimationFrame = function(callback) {
      var currTime = new Date().getTime();
      var timeToCall = Math.max(0, 16 - (currTime - lastTime));
      var id = window.setTimeout(function() { callback(currTime + timeToCall); }, timeToCall);
      lastTime = currTime + timeToCall;
      return id;
    };
  }

  if (!window.cancelAnimationFrame) {
    window.cancelAnimationFrame = function(id) {
      clearTimeout(id);
    };
  }
}());

// Detecção de navegador para ajustes específicos
const browserDetection = {
  isChrome: !!window.chrome && (!!window.chrome.webstore || !!window.chrome.runtime),
  isFirefox: typeof InstallTrigger !== 'undefined',
  isSafari: /constructor/i.test(window.HTMLElement) || (function (p) { return p.toString() === "[object SafariRemoteNotification]"; })(!window['safari'] || (typeof safari !== 'undefined' && safari.pushNotification)),
  isEdge: !isIE && !!window.StyleMedia,
  isIE: /*@cc_on!@*/false || !!document.documentMode,
  isOpera: (!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0
};

// Ajustes específicos para cada navegador
document.addEventListener('DOMContentLoaded', function() {
  // Adiciona classe ao body com o nome do navegador para estilos específicos
  if (browserDetection.isChrome) document.body.classList.add('chrome');
  if (browserDetection.isFirefox) document.body.classList.add('firefox');
  if (browserDetection.isSafari) document.body.classList.add('safari');
  if (browserDetection.isEdge) document.body.classList.add('edge');
  if (browserDetection.isIE) document.body.classList.add('ie');
  if (browserDetection.isOpera) document.body.classList.add('opera');
  
  // Ajustes específicos para Safari
  if (browserDetection.isSafari) {
    // Corrige problemas com flexbox no Safari
    const flexElements = document.querySelectorAll('.flex-compatible');
    flexElements.forEach(el => {
      el.style.display = '-webkit-flex';
    });
    
    // Corrige problemas com backdrop-filter no Safari
    const blurElements = document.querySelectorAll('.backdrop-filter-compatible');
    blurElements.forEach(el => {
      el.style.webkitBackdropFilter = 'blur(10px)';
    });
  }
  
  // Ajustes específicos para IE
  if (browserDetection.isIE) {
    // Adiciona suporte a grid para IE
    if (window.CSS && window.CSS.supports && !CSS.supports('display', 'grid')) {
      const gridElements = document.querySelectorAll('.grid-container');
      gridElements.forEach(el => {
        // Fallback para flexbox
        el.style.display = 'flex';
        el.style.flexWrap = 'wrap';
      });
    }
  }
});

// Função para verificar suporte a recursos modernos
function checkFeatureSupport() {
  const support = {
    flexbox: typeof document.createElement('div').style.flexBasis !== 'undefined',
    grid: typeof document.createElement('div').style.grid !== 'undefined',
    webp: false,
    webgl: false,
    touchEvents: 'ontouchstart' in window,
    passiveEvents: false
  };
  
  // Verificar suporte a WebP
  const webpTest = new Image();
  webpTest.onload = function() { support.webp = true; };
  webpTest.onerror = function() { support.webp = false; };
  webpTest.src = 'data:image/webp;base64,UklGRiQAAABXRUJQVlA4IBgAAAAwAQCdASoBAAEAAwA0JaQAA3AA/vuUAAA=';
  
  // Verificar suporte a WebGL
  try {
    const canvas = document.createElement('canvas');
    support.webgl = !!(window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
  } catch(e) {
    support.webgl = false;
  }
  
  // Verificar suporte a Passive Events
  try {
    const opts = Object.defineProperty({}, 'passive', {
      get: function() {
        support.passiveEvents = true;
        return true;
      }
    });
    window.addEventListener('test', null, opts);
    window.removeEventListener('test', null, opts);
  } catch (e) {
    support.passiveEvents = false;
  }
  
  return support;
}

// Aplicar fallbacks com base no suporte do navegador
const featureSupport = checkFeatureSupport();

// Carregar imagens WebP ou fallback para JPG/PNG
function loadOptimizedImages() {
  const images = document.querySelectorAll('[data-src]');
  images.forEach(img => {
    const webpSrc = img.getAttribute('data-src-webp');
    const fallbackSrc = img.getAttribute('data-src');
    
    if (featureSupport.webp && webpSrc) {
      img.src = webpSrc;
    } else {
      img.src = fallbackSrc;
    }
  });
}

// Inicializar otimizações quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', function() {
  loadOptimizedImages();
  
  // Adicionar listeners com passive para melhor performance em dispositivos touch
  if (featureSupport.touchEvents && featureSupport.passiveEvents) {
    document.addEventListener('touchstart', function(){}, {passive: true});
    document.addEventListener('touchmove', function(){}, {passive: true});
  }
});

// Exportar utilitários para uso em outros scripts
window.GTAIVUtils = {
  browserDetection,
  featureSupport,
  loadOptimizedImages
};
