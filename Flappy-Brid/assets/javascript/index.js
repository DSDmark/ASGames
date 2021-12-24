// ────────────────────────────────────────────────────────────────────  ──────────
//   :::::: M A I N   V A R I A B L E S : :  :   :    :     :        :          :
// ──────────────────────────────────────────────────────────────────────────────
const RAD = Math.PI / 180;
const canvas = document.getElementById("canvas");
const canvasTx = canvas.getContext("2d");
canvasTx.tabIndex = 1;
var screenFrame = 0;
const player = {
  gameActive: true,
  gamePlaying: false,
};

// ────────────────────────────────────────────────────────────────────────────────────────────────── I ──────────
//   :::::: M A I N   F U C N T I O N S   S E E   D O W N   B E L O W : :  :   :    :     :        :          :
// ────────────────────────────────────────────────────────────────────────────────────────────────────────────
["keydown", "click"].forEach((event) => {
  window.addEventListener(
    event,
    () => {
      player.gameActive = false;
      player.gamePlaying = true;
      playingObject.flying();
    },
    true
  );
});

// ─── DRAW AND ANIMETED THE BRID ──────────────────────────────────────────────────────────
const playingObject = {
  frames: 0,
  position: { x: 60, y: 50 },
  speed: 0,
  gravity: 0.125,
  thrust: 2.6,
  rotatation: 0,
  imgAnimation: [
    { playObjectImg: new Image() },
    { playObjectImg: new Image() },
    { playObjectImg: new Image() },
  ],
  drewPlayObject: function () {
    canvasTx.save();
    canvasTx.translate(this.position.x, this.position.y);
    canvasTx.rotate(this.rotatation * RAD);
    canvasTx.drawImage(
      this.imgAnimation[this.frames].playObjectImg,
      -(this.imgAnimation[this.frames].playObjectImg.width) / 2,
      -(this.imgAnimation[this.frames].playObjectImg.height) / 2
      );
      canvasTx.restore();
  },
  updateFrames: function () {
    if (player.gameActive) {
      this.frames += screenFrame % 10 == 0 ? 1 : 0; // * CONTROL FPS
      this.position.y += screenFrame % 8 == 0 ? Math.sin(screenFrame * RAD) : 0; // * TRANSLATE THE BRID
    } else if (player.gamePlaying) {
      this.frames += screenFrame % 10 == 0 ? 1 : 0; // * CONTROL FPS
      this.position.y += this.speed;
      this.speed += this.gravity;
      this.objectRotation();
    }
    // console.log(this.speed)

    this.frames = this.frames % this.imgAnimation.length; // ? CONTROL BRID ANIMETION
  },
  flying: function () {         // ? WHEN KEY PRESS THEN RUN
    if (this.position.y > 0) {
      this.speed = -this.thrust;
    }
  },
  objectRotation: function () {
    if (this.speed <= 0) {
      this.rotatation = Math.max(-25, (-25 * this.speed) / (-1 * this.thrust));
    } else if (this.speed > 0) {
      this.rotatation = Math.min(90, (90 * this.speed) / (this.thrust * 2));
    }
  },
};
// ─── DRAW THE BACKGROUND ────────────────────────────────────────────────────────
const background = {
  backgroundImg: new Image(),
  position: { x: 0, y: 0 },
  drewBackground: function () {
    canvasTx.drawImage(
      this.backgroundImg,
      this.position.x,
      parseFloat(canvas.height - this.backgroundImg.height)
    );
    // console.log(parseFloat(canvas.height - this.backgroundImg.height))
  },
};

// ─── DRAW THE GROUND ────────────────────────────────────────────────────────────
const ground = {
  groundImg: new Image(),
  dx: 2,
  position: { x: 0, y: 0 },
  drewGround: function () {
    canvasTx.drawImage(
      this.groundImg,
      this.position.x,
      parseFloat(canvas.height - this.groundImg.height)
    );
  },
  updateGround: function () {
    if (player.gamePlaying) {
      this.position.x -= this.dx;
      this.position.x = this.position.x % (this.groundImg.width / 14);
    }
  },
};

// ─── DRAW THE PIPES TOP AND BOTTOM ──────────────────────────────────────────────
const pipe = {
  topPipe: { pipeImg: new Image() },
  bottomPipe: { pipeImg: new Image() },
  pipe: [],
  pipeGap: 85,
  drewPipe: function () {
    for (let i = 0; i < this.pipe.length; i++) {
      let p = this.pipe[i];
      canvasTx.drawImage(this.topPipe.pipeImg, p.x, p.y);
      canvasTx.drawImage(
        this.bottomPipe.pipeImg,
        p.x,
        p.y + this.topPipe.pipeImg.height + this.pipeGap
      );
    }
  },
  pipeUpdate: function () {
    if (player.gameActive) {
      if (screenFrame % 120 == 0) {
        // ? AUTOPLAYING
        let ren = -210 * Math.min(Math.random() + .9, 1.7);
        this.pipe.push({
          x: parseFloat(canvas.width),
          y: ren,
        });
        playingObject.position.y =
          ren + this.topPipe.pipeImg.height + this.pipeGap - 60;
      }
      this.pipe.forEach((pipe) => {
        pipe.x -= ground.dx;

      });
    } else if (player.gamePlaying) {
      if (screenFrame % 120 == 0) {
        // ? AUTOPLAYING
        let ren = -210 * Math.min(Math.random() + 0.9, 1.7);
        this.pipe.push({
          x: parseFloat(canvas.width),
          y: ren,
        });
      }
      this.pipe.forEach((pipe) => {
        pipe.x -= ground.dx;
      });
    }
    if (this.pipe.length && this.pipe[0].x < -this.topPipe.pipeImg.width) {
      this.pipe.shift();
    }
  },
};

// ─── START AND END UI DEGIN ─────────────────────────────────────────────────────
const UI = {
  frames:0,
  game: [{ start: new Image() }, { over: new Image() }],
  tap: [{ tapImg: new Image() }, { tapImg: new Image() }],
  drewUI: function () {
    if (player.gameActive) {
      canvasTx.fillStyle = "rgb(126 255 90 / 20%)";
      canvasTx.fillRect(0,0,canvas.width,canvas.height);
      canvasTx.drawImage(
        this.game[0].start,
        (canvas.width - this.game[0].start.width) / 2,
        (canvas.height - this.game[0].start.height) / 3
      );
      canvasTx.drawImage(
        this.tap[this.frames].tapImg,
        (canvas.width - this.tap[this.frames].tapImg.width) / 2,
        (canvas.height - this.tap[this.frames].tapImg.height) / 1.7
      );
    }
    if ((!player.gamePlaying) && (!player.gameActive)) {
       canvasTx.fillStyle = "rgb(60 100 20 / 20%)";
      canvasTx.fillRect(0,0,canvas.width,canvas.height);
      canvasTx.drawImage(
        this.game[1].over,
        (canvas.width - this.game[1].over.width) / 2,
        (canvas.height - this.game[1].over.height) / 2
      );
      canvasTx.drawImage(
        this.tap[this.frames].tapImg,
        (canvas.width - this.tap[this.frames].tapImg.width) / 2,
        (canvas.height - this.tap[this.frames].tapImg.height) / 1.7
      );
    }
  },
  updateUI: function () {
    this.frames += screenFrame % 20 == 0 ? 1 : 0;
    this.frames = this.frames % this.tap.length;
  }
};

// ────────────────────────────────────────────────────────────────────────────────
const updateElements = () => {
  playingObject.updateFrames();
  ground.updateGround();
  pipe.pipeUpdate();
  UI.updateUI();
};
const drewElements = () => {
  canvas.height = 450;
  canvas.width = 250;
  canvasTx.fillStyle = "#47f0a9";
  canvasTx.strokeStyle = "red";
  canvasTx.lineWidth = "2";
  canvasTx.fillRect(0, 0, canvas.width, canvas.height);
  background.drewBackground();
  pipe.drewPipe();
  ground.drewGround();
  playingObject.drewPlayObject();
  UI.drewUI();
};

function gameLoop() {
  // ? INCRESING FRAMES (fps)
  screenFrame++;
  updateElements();
  drewElements();
  requestAnimationFrame(gameLoop);
}

gameLoop();

// ─── ALL SOURCE SEE DOWN BELOW ──────────────────────────────────────────────────
// TODO BRID IMGS
playingObject.imgAnimation[0].playObjectImg.src =
  "assets/images/brid_img/1_brid.png";
playingObject.imgAnimation[1].playObjectImg.src =
  "assets/images/brid_img/2_brid.png";
playingObject.imgAnimation[2].playObjectImg.src =
  "assets/images/brid_img/3_brid.png";
// TODO BACKGROUND IMGS
background.backgroundImg.src = "assets/images/ground/background.png";
// TODO GROUND IMGS
ground.groundImg.src = "assets/images/ground/1_ground.png";
// TODO PIPE IMGS
pipe.topPipe.pipeImg.src = "assets/images/pipe_img/toppipe.png";
pipe.bottomPipe.pipeImg.src = "assets/images/pipe_img/botpipe.png";
// TODO UI IMGS
UI.game[0].start.src = "assets/images/start&over_game_img/getready.png";
UI.game[1].over.src = "assets/images/start&over_game_img/gameOver.png";
UI.tap[0].tapImg.src = "assets/images/start&over_game_img/1_tap.png";
UI.tap[1].tapImg.src = "assets/images/start&over_game_img/2_tap.png";
// ────────────────────────────────────────────────────────────────────────────────
