## Drawing Board

### This is a simple web application that allows you to draw lines on the page using your mouse.

## How to Use
To use this application, simply open the index.html file in your web browser. You will see a blank white canvas that you can use to draw lines.
To draw a line, click and hold your mouse button on the canvas, move your mouse around, and then release the mouse button to stop drawing the line.

## Code Explanation

### HTML

The HTML code for this application contains a div element with an id of "canvas", and an svg element with an id of "drawing-board". The svg element is used to draw lines on the canvas.

### JavaScript

The JavaScript code for this application listens for mouse events on the drawing-board element. When the user clicks and holds the mouse button, a new line element is created and added to the drawing-board element. The line element is then updated as the user moves their mouse around, and is removed from the drawing-board element when the user releases the mouse button.

The lastChild property of the drawing-board element is used to retrieve the last line element that was added to the canvas, so that it can be updated with the latest mouse position.
