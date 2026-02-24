// ===============================
// 💛 bounce del minion
// ===============================
const container = document.querySelector(".minion-container");

function bounce(){
  container.style.transform = "scale(1.06)";
  setTimeout(()=>{
    container.style.transform = "";
  },200);
}

document.addEventListener("click", bounce);
document.addEventListener("touchstart", bounce, {passive:true});


// ===============================
// 🎨 CANVAS DE FONDO
// ===============================
const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");

canvas.style.position = "fixed";
canvas.style.top = "0";
canvas.style.left = "0";
canvas.style.pointerEvents = "none";
canvas.style.zIndex = "0";

document.body.appendChild(canvas);

// asegurar contenido arriba
document.querySelector(".scene").style.position = "relative";
document.querySelector(".scene").style.zIndex = "1";

function resize(){
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resize();
window.addEventListener("resize", resize);


// ===============================
// 💕 PARTÍCULAS
// ===============================
const particles = [];
const sparkles = [];

class Particle{
  constructor(){
    this.reset(true);
  }

  reset(initial=false){
    this.x = Math.random()*canvas.width;
    this.y = initial ? Math.random()*canvas.height : -20;
    this.size = Math.random()*14 + 6;
    this.speedY = Math.random()*1.2 + 0.4;
    this.speedX = Math.random()*0.8 - 0.4;
    this.type = Math.random()<0.55 ? "heart" : "petal";
    this.rotation = Math.random()*Math.PI;
    this.rotSpeed = Math.random()*0.03 - 0.015;
    this.alpha = Math.random()*0.5 + 0.5;
  }

  update(){
    this.y += this.speedY;
    this.x += this.speedX;
    this.rotation += this.rotSpeed;

    if(this.y > canvas.height + 40){
      this.reset();
    }
  }

  draw(){
    ctx.save();
    ctx.globalAlpha = this.alpha;
    ctx.translate(this.x,this.y);
    ctx.rotate(this.rotation);

    if(this.type === "heart"){
      ctx.shadowColor = "#ff6fa5";
      ctx.shadowBlur = 12;
      ctx.fillStyle = "#ff6fa5";
      drawHeart(0,0,this.size);
    }else{
      const g = ctx.createRadialGradient(0,0,0,0,0,this.size);
      g.addColorStop(0,"#ffc1e3");
      g.addColorStop(1,"rgba(255,255,255,0)");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.ellipse(0,0,this.size,this.size*0.6,0,0,Math.PI*2);
      ctx.fill();
    }

    ctx.restore();
  }
}

// ✨ glitter
class Sparkle{
  constructor(){
    this.x = Math.random()*canvas.width;
    this.y = Math.random()*canvas.height;
    this.size = Math.random()*2 + 1;
    this.alpha = Math.random();
    this.speed = Math.random()*0.02 + 0.01;
  }

  update(){
    this.alpha += this.speed;
    if(this.alpha>1 || this.alpha<0) this.speed *= -1;
  }

  draw(){
    ctx.globalAlpha = this.alpha;
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(this.x,this.y,this.size,0,Math.PI*2);
    ctx.fill();
    ctx.globalAlpha = 1;
  }
}

// 💖 dibujar corazón
function drawHeart(x,y,size){
  const s = size/2;
  ctx.beginPath();
  ctx.moveTo(x, y + s);
  ctx.bezierCurveTo(x - s, y, x - s, y - s, x, y - s/2);
  ctx.bezierCurveTo(x + s, y - s, x + s, y, x, y + s);
  ctx.fill();
}

// crear MÁS partículas (para que no se vea vacío)
for(let i=0;i<60;i++){
  particles.push(new Particle());
}

for(let i=0;i<80;i++){
  sparkles.push(new Sparkle());
}


// ===============================
// 🎬 ANIMACIÓN
// ===============================
function animate(){
  ctx.clearRect(0,0,canvas.width,canvas.height);

  sparkles.forEach(s=>{
    s.update();
    s.draw();
  });

  particles.forEach(p=>{
    p.update();
    p.draw();
  });

  requestAnimationFrame(animate);
}
animate();

// ===============================
// 🎵 AUDIO COMPATIBLE PC + CEL
// ===============================
const musica = document.getElementById("musica");

if (musica) {
  musica.volume = 0.4;

  // intento automático (PC y algunos móviles)
  window.addEventListener("load", () => {
    setTimeout(() => {
      musica.muted = false;
      musica.play().catch(()=>{});
    }, 400);
  });

  // 🔥 activación al primer toque en celular
  const activarAudio = () => {
    musica.muted = false;
    musica.play().catch(()=>{});
    document.removeEventListener("touchstart", activarAudio);
    document.removeEventListener("click", activarAudio);
  };

  document.addEventListener("touchstart", activarAudio, { once:true });
  document.addEventListener("click", activarAudio, { once:true });
}