const canvas = document.getElementById('network');
const ctx = canvas.getContext('2d');

const mouse = { x: null, y: null };
const maxDistance = 180; // maior distância para conectar partículas
let particlesArray;

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

// Partículas
class Particle {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.radius = Math.random() * 4 + 2;
    this.speedX = (Math.random() - 0.5) * 1;
    this.speedY = (Math.random() - 0.5) * 1;
    this.color = `rgba(255, ${200 + Math.random()*55}, 150, 1)`; // tom dourado
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;

    if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
    if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;

    this.draw();
  }
}

// Inicializa partículas
function init() {
  particlesArray = [];
  const numberOfParticles = Math.floor((canvas.width * canvas.height) / 8000);
  for (let i = 0; i < numberOfParticles; i++) {
    particlesArray.push(new Particle());
  }
}

// Conecta partículas próximas
function connectParticles() {
  for (let a = 0; a < particlesArray.length; a++) {
    for (let b = a + 1; b < particlesArray.length; b++) {
      const dx = particlesArray[a].x - particlesArray[b].x;
      const dy = particlesArray[a].y - particlesArray[b].y;
      const distance = Math.sqrt(dx*dx + dy*dy);
      if (distance < maxDistance) {
        ctx.beginPath();
        ctx.strokeStyle = `rgba(255,215,150,${1 - distance / maxDistance})`;
        ctx.lineWidth = 1;
        ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
        ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
        ctx.stroke();
      }
    }
  }
}

// Animação
function animate() {
  ctx.fillStyle = 'rgba(17,17,17,0.4)'; // fundo com leve transparência para efeito “rastro”
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  particlesArray.forEach(p => p.update());
  connectParticles();
  requestAnimationFrame(animate);
}

// Eventos
window.addEventListener('mousemove', e => { mouse.x = e.x; mouse.y = e.y; });
window.addEventListener('resize', () => { resizeCanvas(); init(); });

// Inicialização
resizeCanvas();
init();
animate();
