/** @type {HTMLCanvasElement} */
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
canvas.width = 1000;
canvas.height = 700;

const playerMovements = [];

const movementsState = [
  {
    name: "idle",
    frames: 20,
    path: "assets/00_idle/",
  },
  {
    name: "run",
    frames: 18,
    path: "assets/01_run/",
  },
  {
    name: "jump",
    frames: 10,
    path: "assets/02_jump/",
  },
];

let imgLoaded = 0;
let imgOnLoad = 0;

// fungsi memastikan semua gambar terload
const checkAllLoaded = () => {
  imgLoaded === imgOnLoad
    ? console.log("image done loaded")
    : setTimeout(checkAllLoaded, 1000);
};

// memasukkan source tiap gambar ke dalam masing" movement
movementsState.forEach((state) => {
  let framesR = {
    loc: [],
  };
  let framesL = {
    loc: [],
  };

  for (let i = 0; i < state.frames; i++) {
    const img = new Image();
    img.src = `${state.path}${i}.png`;
    // memastikan gambar diload sebelum dipush
    imgLoaded++;
    img.onload = () => {
      imgOnLoad++;
      checkAllLoaded;
    };
    framesR.loc.push(img);
  }
  for (let i = state.frames; i >= 0; i--) {
    const img = new Image();
    img.src = `${state.path}${i}.png`;
    // memastikan gambar diload sebelum dipush
    imgLoaded++;
    img.onload = () => {
      imgOnLoad++;
      checkAllLoaded;
    };
    framesL.loc.push(img);
  }
  imgLoaded = 0;
  imgOnLoad = 0;
  playerMovements[`${state.name}Right`] = framesR;
  playerMovements[`${state.name}Left`] = framesL;
});

class Player {
  constructor() {
    this.width = 200;
    this.height = 200;
    this.x = 0;
    this.y = canvas.height - this.height;
    this.movements = playerMovements;
    this.speed = 8;
    this.left = false;
    this.moveState = "idle";
    this.direction = "";
    this.gameFrame = 0;
    this.stagger = 2;
    this.moving = false;
    this.vy = 0;
    this.jumpStrength = 40;
    this.gravity = 1;
    this.isJumping = false;
    this.canJump = true;
  }

  // update player movements
  update(input) {
    if (input.keys.length === 0 && this.y === canvas.height - this.height) {
      this.moving = false;
    }
    // go right
    if (input.keys.includes("ArrowRight")) {
      this.left = false;
      this.moving = true;
      this.moveState = "run";
      //   membuat player tidak keluar dari kanvas
      if (this.x <= canvas.width - this.width) this.x += this.speed;
    }
    // go left
    if (input.keys.includes("ArrowLeft")) {
      this.left = true;
      this.moving = true;
      this.moveState = "run";
      //   membuat player tidak keluar canvas
      if (this.x >= 0) this.x -= this.speed;
    }
    // go jump
    if (input.keys.includes("ArrowUp") && this.canJump) {
      this.isJumping = true;
      this.moving = true;
      this.canJump = false;
      this.moveState = "jump";
      this.vy = -this.jumpStrength;
    }

    // logic lompat
    if (this.isJumping) {
      this.y += this.vy;
      this.vy += this.gravity;
      if (this.y <= 0) {
        this.vy = this.gravity;
        this.y = 0;
      }
    }

    if (this.y >= canvas.height - this.height) {
      this.y = canvas.height - this.height;
      this.isJumping = false;
      this.canJump = true;
      this.vy = 0;
    }
  }

  draw(ctx) {
    if (!this.moving) this.moveState = "idle";
    if (this.isJumping) this.moveState = "jump";
    this.left === true ? (this.direction = "Left") : (this.direction = "Right");
    let position =
      Math.floor(this.gameFrame / this.stagger) %
      this.movements[this.moveState + this.direction].loc.length;
    ctx.strokeRect(this.x, this.y, this.width, this.height);
    ctx.drawImage(
      this.movements[this.moveState + this.direction].loc[position],
      0,
      0,
      796,
      719,
      this.x,
      this.y,
      this.width,
      this.height
    );
    this.gameFrame++;
  }
}

class InputHandler {
  constructor() {
    this.keys = [];
    window.addEventListener("keydown", (e) => {
      if (
        (e.key === "ArrowRight" ||
          e.key === "ArrowLeft" ||
          e.key === "ArrowUp") &&
        !this.keys.includes(e.key)
      ) {
        this.keys.push(e.key);
      }
    });
    window.addEventListener("keyup", (e) => {
      if (e.key === "ArrowRight" && this.keys.length >= 1) {
        this.keys.splice(this.keys.indexOf("ArrowRight"), 1);
      } else if (e.key === "ArrowLeft" && this.keys.length >= 1) {
        this.keys.splice(this.keys.indexOf("ArrowLeft"), 1);
      } else if (e.key === "ArrowUp" && this.keys.length >= 1) {
        this.keys.splice(this.keys.indexOf("ArrowUp"), 1);
      }
    });
  }
}

const player = new Player();
const input = new InputHandler();

const animate = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  player.update(input);
  player.draw(ctx);
  requestAnimationFrame(animate);
};

animate();
