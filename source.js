// Canvas parameters
const CANVAS_WIDTH = 512;
const CANVAS_HEIGHT = 768;

const SQUARE_SIZE = 64;
const NUM_SQUARES = 8;
const ICON_WIDTH = 56;

// Global game variables
let pieces_ = [];
let selectedSquare_ = [0, 7];

function hideIntroduction() {
  document.getElementById("homeScreen").style.display = "none";
  document.getElementById("canvas").style.display = "inline";
}

function drawChessBoard(ctx) {
  drawSquares(ctx);
}

function drawSquares(ctx) {
  for (let i = 0; i < NUM_SQUARES; i++) {
    for (let j = 0; j < NUM_SQUARES; j++) {
      ctx.fillStyle = (i + j) % 2 == 0 ? "white" : "black";
      ctx.fillRect(i * SQUARE_SIZE, j * SQUARE_SIZE, SQUARE_SIZE, SQUARE_SIZE);
    }
  }
}

function drawHighlightedSquare(i, j, ctx) {
  ctx.fillStyle = "rgba(0, 222, 222, 0.5)";
  ctx.fillRect(i * SQUARE_SIZE, j * SQUARE_SIZE, SQUARE_SIZE, SQUARE_SIZE);
}

function getMousePosition(canvas, event) {
  const rect = canvas.getBoundingClientRect();
  const mouseX = event.clientX - rect.left;
  const mouseY = event.clientY - rect.top;
  const i = Math.floor(mouseX / SQUARE_SIZE);
  const j = Math.floor(mouseY / SQUARE_SIZE);
  if (0 <= i && i < 8 && 0 <= j && j < 8) {
    selectedSquare_ = [i, j];
  }
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

    drawChessBoard(ctx);

    for (let i = 0; i < pieces_.length; i++) {
      pieces_[i].draw();
    }

    if (selectedSquare_ != null) {
      drawHighlightedSquare(selectedSquare_[0], selectedSquare_[1], ctx);
    }

    // Request the next frame
    requestAnimationFrame(draw);
  }

  // Start the animation
  draw();
}
