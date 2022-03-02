// ──────────────────────────────────────────────────────────────────────────── I ──────────
//   :::::: A L L   M A I N   V A R I A B L E S : :  :   :    :     :        :          :
// ──────────────────────────────────────────────────────────────────────────────────────
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
canvas.height = 400;
canvas.widht = 660;
// ────────────────────────────────────────────────────────────────────────────  ──────────
//   :::::: A L L   M A I N   F U N C T I O N S : :  :   :    :     :        :          :
// ──────────────────────────────────────────────────────────────────────────────────────

// ─── CRATE THE CENTER LINE ──────────────────────────────────────────────────────
const centerLine = {
  posi: {
    x: canvas.width / 2 + 3,
    y: 0,
  },
  style: { height: canvas.height, width: 3, color: "#fff" },
  draw() {
    ctx.fillStyle = this.style.color;
    ctx.fillRect(
      this.posi.x,
      this.posi.y,
      this.style.width,
      this.style.height,
    );
  },
};

// ─── CRATE THE PLAYER AND AI ────────────────────────────────────────────────────
const players = {
  aPlayer: {
    posi: {
      x: canvas.widht - centerLine.style.width * 2,
      y: canvas.height / 2,
    },
    style: {
      height: canvas.height / 4,
      widht: centerLine.style.width * 2,
      color: "#fff",
      score:0,
    },
  },
  mPlayer: {
    player: {
      ArrowUp: false,
      ArrowDown: false,
    },
    posi: {
      x: 0,
      y: canvas.height / 3,
    },
    style: {
      height: canvas.height / 4,
      widht: centerLine.style.width * 2,
      color: "#fff",
      score: 0,
    },
  },
  draw() {
    ctx.fillStyle = this.aPlayer.style.color;
    ctx.fillRect(
      this.aPlayer.posi.x,
      this.aPlayer.posi.y,
      this.aPlayer.style.widht,
      this.aPlayer.style.height,
    );
    ctx.fillStyle = this.mPlayer.style.color;
    ctx.fillRect(
      this.mPlayer.posi.x,
      this.mPlayer.posi.y,
      this.mPlayer.style.widht,
      this.mPlayer.style.height,
    );
  },
  update() {
    const lowLimit = canvas.height - this.mPlayer.style.height;
    window.addEventListener("keydown", (event) => {
      if (event.keyCode === 38 || event.keyCode === 87) {
        players.mPlayer.player.ArrowUp = true;
      } else if (event.keyCode === 40 || event.keyCode === 83) {
        players.mPlayer.player.ArrowDown = true;
      }
    });
    if (this.mPlayer.player.ArrowUp && this.mPlayer.posi.y > 0) {
      this.mPlayer.posi.y -= 15;
    } else if (this.mPlayer.player.ArrowDown && this.mPlayer.posi.y < lowLimit - 2) {
      this.mPlayer.posi.y += 15;
    }
    this.mPlayer.player.ArrowUp = false;
    this.mPlayer.player.ArrowDown = false;
  },
  collision(player, ball) {
    // eslint-disable-next-line
    player.top = player.posi.y;
    // eslint-disable-next-line
    player.left = player.posi.x;
    // eslint-disable-next-line
    player.right = player.style.widht + player.posi.x;
    // eslint-disable-next-line
    player.bottom = player.posi.y + player.style.height;
    // eslint-disable-next-line
    ball.top = ball.posi.y - ball.ballPro.radius;
    // eslint-disable-next-line
    ball.right = ball.posi.x + ball.ballPro.radius;
    // eslint-disable-next-line
    ball.bottom = ball.posi.y + ball.ballPro.radius;
    // eslint-disable-next-line
    ball.left = ball.posi.x - ball.ballPro.radius;
    return (
      ball.left < player.right
      && ball.top < player.bottom
      && ball.right > player.left
      && ball.bottom > player.top
    );
  },
  score(x,y,score) {
    ctx.fillStyle = this.mPlayer.style.color;
  ctx.font = "35px sans-serif";
    ctx.fillText(score,x,y);
  },
};

// ─── CREATE PLAYING BALL ────────────────────────────────────────────────────────
const playingBall = {
  ballPro: {
    speed: 4,
    veloX: 2,
    veloY: 2,
    radius: 10,
    color: "#fff",
  },
  posi: {
    x: canvas.widht / 2,
    y: canvas.height / 2,
  },
  draw() {
    ctx.fillStyle = this.ballPro.color;
    ctx.beginPath();
    ctx.arc(this.posi.x, this.posi.y, this.ballPro.radius, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.fill();
  },
  update() {
    const cPlayer = this.posi.x < canvas.widht ? players.mPlayer : players.aPlayer;
    if (this.posi.y >= canvas.height || this.posi.y <= 0) {
      this.ballPro.veloY = -this.ballPro.veloY;
    }  if (this.posi.x - this.ballPro.radius <= 0){
       players.aPlayer.style.score++; 
        this.reset();
      }
if (this.posi.x - this.ballPro.radius >= canvas.widht){
       players.mPlayer.style.score++; 
        this.reset();
      }
    if (players.collision(cPlayer, this)) {
      let angle = 0;
      if (this.posi.y < cPlayer.posi.y + cPlayer.style.height / 2) {
        angle = (-1 * Math.PI) / 4;
      } else {
        angle = Math.PI / 4;
      }
     
      // eslint-disable-next-line
      // eslint-disable-next-line
      this.ballPro.veloX = (cPlayer === players.mPlayer ? 1 : -1) * this.ballPro.speed * Math.cos(angle);
      this.ballPro.speed += 0.2;
    }
    this.posi.y += this.ballPro.veloY;
    this.posi.x += this.ballPro.veloX;
    
    // eslint-disable-next-line
    players.aPlayer.posi.y += (this.posi.y - (players.aPlayer.posi.y + players.aPlayer.style.height / 2)) * 0.9;
    // console.log(players.aPlayer.posi)
  },
  reset() {
    this.ballPro.speed = 4;
    this.posi.x = canvas.widht / 2;
    this.posi.y = canvas.height / 2;
    this.ballPro.veloX = -this.ballPro.veloX;
    this.ballPro.veloY = -this.ballPro.veloY;
  },
};

// ! ───  MAIN FUNCTION LOAD THE ELEMENTS ────────────────────────────────────────────
const drawElements = () => {
  players.draw();
  centerLine.draw();
  playingBall.draw();
  players.score(canvas.widht / 4, canvas.height / 6, players.mPlayer.style.score);
  players.score(( 3 * canvas.widht) / 4, canvas.height / 6, players.aPlayer.style.score);
};

const updateElement = () => {
  players.update();
  playingBall.update();
};

function render() {
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, canvas.widht, canvas.height);
  drawElements();
  updateElement();
}

const gameLoop = () => {
  render();
};

// !─── LOADING THE ALL ELEMENTS ───────────────────────────────────────────────────
window.onload = () => {
  setInterval(gameLoop, 10);
};
