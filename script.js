class Draw {
  constructor(id) {
    this.element = document.getElementById(id);
    this.shapes = [];
    this.currentShape = null;
    this.mode = "popup";
    this.iconPopup = document.getElementById('icon-popup');
		this.selectedIcon = '';


    const pencilSelect = document.getElementById("pencil-select");
    pencilSelect.addEventListener("click", () => {

      if(eraseSelect.classList.contains('clicked')){
        eraseSelect.classList.remove('clicked');
      }

      if (this.mode == "draw"){
        this.mode = "popup";
        pencilSelect.classList.remove('clicked');
      }
      else{
        this.mode = "draw";
        console.log(`mode -> ${this.mode}`);
        pencilSelect.classList.add('clicked');
      }
      
    });
    const eraseSelect = document.getElementById("eraser-select");
    eraseSelect.addEventListener("click", () => {

      if (pencilSelect.classList.contains('clicked')){
        pencilSelect.classList.remove('clicked');
      }

      if (this.mode == "eraser"){
        this.mode = "popup";
        eraseSelect.classList.remove('clicked');
      }
      else{
        this.mode = "eraser";
        console.log(`mode -> ${this.mode}`);
        eraseSelect.classList.add('clicked');
      }
    });


    this.element.addEventListener("mousedown", (event) => {
      if (this.mode === "draw") {
        this.startShape(event.offsetX, event.offsetY);
      } else if (this.mode === "eraser") {
        this.eraseShapes(event.offsetX, event.offsetY);
      }
      else{
        this.iconPopup.classList.toggle('show');
      }
    });

    this.element.addEventListener("mousemove", (event) => {
      if (this.mode === "draw") {
        this.updateShape(event.offsetX, event.offsetY);
      } else if (this.mode === "eraser") {
        this.highlightLines(event.offsetX, event.offsetY);
      }
    });
    this.element.addEventListener("mouseup", (event) => {
      this.endShape();
      this.deleteShortLines();
    });

    document.querySelectorAll('.icon').forEach((icon) => {
			icon.addEventListener('click', (event)=>{
        this.selectedIcon = event.target.getAttribute('src');
        console.log(this.selectedIcon);
        this.iconPopup.classList.toggle('show');
      });
		});
  }
  
  deleteShortLines() {
  const lines = this.element.querySelectorAll("line");
  lines.forEach(line => {
    const x1 = parseInt(line.getAttribute("x1"));
    const y1 = parseInt(line.getAttribute("y1"));
    const x2 = parseInt(line.getAttribute("x2"));
    const y2 = parseInt(line.getAttribute("y2"));
    const length = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    if (length < 2) {
      line.remove();
      this.iconPopup.classList.toggle('show');
    }
  });
}

  highlightLines(x, y) {
    for (const shape of this.shapes) {
      const element = shape.element;
      const x1 = Number(element.getAttribute("x1"));
      const y1 = Number(element.getAttribute("y1"));
      const x2 = Number(element.getAttribute("x2"));
      const y2 = Number(element.getAttribute("y2"));
      const distance = this.getPerpendicularDistance(x, y, x1, y1, x2, y2);
      if (distance <= 15) {
        element.classList.add("highlight");
      } else {
        element.classList.remove("highlight");
      }
    }
  }

  getPerpendicularDistance(x, y, x1, y1, x2, y2) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const length = Math.sqrt(dx * dx + dy * dy);
    const dotProduct = (x - x1) * (x2 - x1) + (y - y1) * (y2 - y1);
    const projection = dotProduct / (length * length);
  
    let distance;
    //if projection is before line
    if (projection < 0) {
      distance = Math.sqrt((x - x1) * (x - x1) + (y - y1) * (y - y1));
    }
    //if projection is after line
    else if (projection > 1) {
      distance = Math.sqrt((x - x2) * (x - x2) + (y - y2) * (y - y2));
    }
    //if projection is on the line
    else {
      const projectionX = x1 + projection * (x2 - x1);
      const projectionY = y1 + projection * (y2 - y1);
      distance = Math.sqrt((x - projectionX) * (x - projectionX) + (y - projectionY) * (y - projectionY));
    }
  
    return distance;
  }
  
  startShape(x, y) {
    this.currentShape = new Shape(x, y);
    this.element.appendChild(this.currentShape.element);
  }
  updateShape(x, y) {
    if (this.currentShape !== null) {
      this.currentShape.addPoint(x, y);
    }
  }
  endShape() {
    if (this.currentShape !== null) {
      this.shapes.push(this.currentShape);
      this.currentShape = null;
    }
  }
  eraseShapes(x, y) {
    const shapeElementsToRemove = [];
    for (const shape of this.shapes) {
      const element = shape.element;
      const x1 = Number(element.getAttribute("x1"));
      const y1 = Number(element.getAttribute("y1"));
      const x2 = Number(element.getAttribute("x2"));
      const y2 = Number(element.getAttribute("y2"));
      const distance = this.getPerpendicularDistance(x, y, x1, y1, x2, y2);
      //console.log(distance);
      if (distance <= 20) {
        shapeElementsToRemove.push(shape.element);
        //console.log(shapeElementsToRemove);
      }
    }

    for (const element of shapeElementsToRemove) {
      element.remove();
      const index = this.shapes.findIndex((shape) => shape.element === element);
      if (index !== -1) {
        this.shapes.splice(index, 1);
      }
    }
  }

}

class Shape {
  constructor(x, y) {
    this.element = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "line"
    );
    this.element.setAttribute("x1", x);
    this.element.setAttribute("y1", y);
    this.element.setAttribute("x2", x);
    this.element.setAttribute("y2", y);

    this.boardText = document.getElementById("board-text");
    const lines = document.querySelectorAll("line");
    for (let i = 0; i < lines.length; i++) {
      const x1Other = lines[i].getAttribute("x1");
      const y1Other = lines[i].getAttribute("y1");
      const x2Other = lines[i].getAttribute("x2");
      const y2Other = lines[i].getAttribute("y2");
      const distanceStart = Math.sqrt((x - x1Other) ** 2 + (y - y1Other) ** 2);
      const distanceEnd = Math.sqrt((x - x2Other) ** 2 + (y - y2Other) ** 2);
      if (distanceStart <= 10) {
        this.element.setAttribute("x1", x1Other);
        this.element.setAttribute("y1", y1Other);
      }
      if (distanceEnd <= 10) {
        this.element.setAttribute("x1", x2Other);
        this.element.setAttribute("y1", y2Other);
      }
    }
  }

  addPoint(x, y) {
    this.element.setAttribute("x2", x);
    this.element.setAttribute("y2", y);
    this.boardText.setAttribute("style", "display: none;");
    const lines = document.querySelectorAll("line");
    for (let i = 0; i < lines.length; i++) {
      const x1Other = lines[i].getAttribute("x1");
      const y1Other = lines[i].getAttribute("y1");
      const x2Other = lines[i].getAttribute("x2");
      const y2Other = lines[i].getAttribute("y2");
      const distanceStart = Math.sqrt((x - x1Other) ** 2 + (y - y1Other) ** 2);
      const distanceEnd = Math.sqrt((x - x2Other) ** 2 + (y - y2Other) ** 2);
      if (distanceStart <= 10) {
        this.element.setAttribute("x2", x1Other);
        this.element.setAttribute("y2", y1Other);
      }
      if (distanceEnd <= 10) {
        this.element.setAttribute("x2", x2Other);
        this.element.setAttribute("y2", y2Other);
      }
    }
  }

  remove() {
    this.element.remove();
  }
}

const drawingBoard = new Draw("board");
