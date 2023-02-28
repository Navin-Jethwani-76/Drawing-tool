let isDrawing = false;
let drawingBoard = document.getElementById("drawing-board");

drawingBoard.addEventListener("mousedown", startDraw);
drawingBoard.addEventListener("mouseup", stopDraw);
drawingBoard.addEventListener("mousemove", draw);

function startDraw(e) {
  isDrawing = true;
  const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
  line.setAttribute("x1", e.clientX);
  line.setAttribute("y1", e.clientY);
  line.setAttribute("x2", e.clientX);
  line.setAttribute("y2", e.clientY);
  line.setAttribute("stroke", "#000");
  line.setAttribute("stroke-width", "3");
  drawingBoard.appendChild(line);
}

function draw(e) {
  if (!isDrawing) return;
  const line = drawingBoard.lastChild;
  line.setAttribute("x2", e.clientX);
  line.setAttribute("y2", e.clientY);
}

function stopDraw(e) {
  isDrawing = false;
}
    