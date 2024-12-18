// Canvas parameters
const CANVAS_WIDTH = 512;
const CANVAS_HEIGHT = 768;

const SQUARE_SIZE = 64;
const NUM_SQUARES = 8;
const ICON_WIDTH = 56;

// Global game variables
let pieces_ = [];
let selectedSquare_ = null;

function hideIntroduction() {
  document.getElementById("homeScreen").style.display = "none";
  document.getElementById("canvas").style.display = "inline";
}

function drawChessBoard(ctx, canvas) {
  drawSquares(ctx, canvas);
}

function drawSquares(ctx, canvas) {
  for (let i = 0; i < NUM_SQUARES; i++) {
    for (let j = 0; j < NUM_SQUARES; j++) {
      ctx.fillStyle = (i + j) % 2 == 0 ? "white" : "black";
      ctx.fillRect(i * SQUARE_SIZE, j * SQUARE_SIZE, SQUARE_SIZE, SQUARE_SIZE);
    }
  }
}

function getMousePosition(canvas, event) {
  let rect = canvas.getBoundingClientRect();
  mouseX = event.clientX - rect.left;
  mouseY = event.clientY - rect.top;
  mouseClickThisFrame = true;
  //console.log("Coordinate x: " + mouseX, "Coordinate y: " + mouseY);
}

function coordsToSquareCenter(i, j) {
  return [i * SQUARE_SIZE + SQUARE_SIZE / 2, j * SQUARE_SIZE + SQUARE_SIZE / 2];
}

class Piece {
  constructor(context, i, j) {
    this.context = context;
    this.move(i, j);
  }
  move(i, j) {
    this.i = i;
    this.j = j;
    const pixelLocation = coordsToSquareCenter(i, j);
    this.x = pixelLocation[0];
    this.y = pixelLocation[1];
  }
  draw() {
    this.context.drawImage(
      this.icon,
      this.x - ICON_WIDTH / 2,
      this.y - ICON_WIDTH / 2,
      ICON_WIDTH,
      ICON_WIDTH
    );
  }
}

class Rook extends Piece {
  constructor(context, i, j) {
    super(context, i, j);
    this.icon = new Image();
    this.icon.src = "images/rookW.png";
  }
}

function startGame() {
  hideIntroduction();
  const canvas = document.getElementById("canvas");
  canvas.width = CANVAS_WIDTH;
  canvas.height = CANVAS_HEIGHT;
  if (!canvas) {
    console.error("Canvas element not found");
    return;
  }
  const ctx = canvas.getContext("2d");

  let canvasElem = document.querySelector("canvas");

  canvasElem.addEventListener("mousedown", function (e) {
    getMousePosition(canvasElem, e);
  });

  pieces_.push(new Rook(ctx, 0, 7));
  pieces_.push(new Rook(ctx, 7, 7));

  function draw() {
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawChessBoard(ctx, canvas);

    for (let i = 0; i < pieces_.length; i++) {
      pieces_[i].draw();
    }

    // Request the next frame
    requestAnimationFrame(draw);
  }

  // Start the animation
  draw();
}
