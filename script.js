/** @type {HTMLCanvasElement} */
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
canvas.width = 1000;
canvas.height = 700;

class Player {
  constructor() {
    this.width = 200;
    this.height = 200;
    this.x = 0;
    this.y = canvas.height - this.height;
    this.speed = 8;
    this.left = false;
  }

  // update player movements
  update(input) {
    // go right
    if (input.keys.includes("d")) {
      this.left = false;
      //   membuat player tidak keluar dari kanvas
      if (this.x <= canvas.width - this.width) this.x += this.speed;
    }
    // go left
    if (input.keys.includes("a")) {
      this.left = true;
      //   membuat player tidak keluar canvas
      if (this.x >= 0) this.x -= this.speed;
    }
  }

  draw(ctx) {
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}

class InputHandler {
  constructor() {
    this.keys = [];
    window.addEventListener("keydown", (e) => {
      if (e.key === "d" && this.keys.length === 0) {
        this.keys.push("d");
      } else if (e.key === "a" && this.keys.length === 0) {
        this.keys.push("a");
      }
    });
    window.addEventListener("keyup", (e) => {
      if (e.key === "d" && this.keys.length === 1) {
        this.keys.splice(this.keys.indexOf("d"), 1);
      } else if (e.key === "a" && this.keys.length === 1) {
        this.keys.splice(this.keys.indexOf("a"), 1);
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
