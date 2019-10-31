import 'p5';
import { body } from './body/index'
let style: any;
let video: p5.Element;
// const image = document.querySelector('img');

function setup() {
  createCanvas(640, 480);
  noStroke();
  video = createCapture(VIDEO);
  video.hide();
  // style = ml5.styleTransfer('./wave/', handleModalLoaded);
}

function draw() {
  image(video, 0, 0);
  if (body) {
    for (const [ partName, part ] of Object.entries(body)) {
      const { x, y } = part;
      fill(0, 255, 0);
      ellipse(x, y, 10, 10);
      text(partName, x, y);
    }
  }
}

// p5.js requires `setup` and `draw` to be methods of global object
window.setup = setup;
window.draw = draw;
