const board = document.querySelector("svg");
const mode = document.getElementById("mode-select");
const boardText = document.getElementById("text");
var isPainting = false;
var isErasing = false;

board.addEventListener("mousedown", startDraw);
board.addEventListener("mouseup", stopDraw);
board.addEventListener("mousemove", draw);
mode.addEventListener('change', handleModeChange);

const svgRect = board.getBoundingClientRect();

function startDraw(e) {
  if(mode.value === 'pencil'){
    isPainting = true;
    isErasing = false;
    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute('x1', e.clientX - svgRect.left);
    line.setAttribute('y1', e.clientY - svgRect.top);
    line.setAttribute('x2', e.clientX - svgRect.left);
    line.setAttribute('y2', e.clientY - svgRect.top);
    line.setAttribute('style', "stroke:rgb(0,0,0);stroke-width:2")
    board.appendChild(line);
}
else if(mode.value === 'eraser'){
    isErasing = true;
    isPainting = false;
    const element = document.elementFromPoint(e.clientX, e.clientY);
    if(element.tagName === 'line'){
        element.remove();
    }
}
}

function draw(e) {
  if(isPainting === false) return;
    else if(isPainting === true){
        boardText.setAttribute('style', 'display: none;');
        const line = board.lastChild;
        line.setAttribute('x2', e.clientX - svgRect.left);
        line.setAttribute('y2', e.clientY - svgRect.top);
    }
}

function stopDraw(e) {
  isPainting = false;
  isErasing = false;
  
  if(!board.hasChildNodes()){
      boardText.setAttribute('style', '');
  }
}

function handleModeChange() {
  isDrawing = false;
  isErasing = false;
}