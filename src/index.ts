import 'p5';
// @ts-ignore
import ml5 from 'ml5';

let style: any;
let video: p5.Element;
let poses: any[] = [];
let wristPositions: number[] = [];
// const image = document.querySelector('img');

function handleModalLoaded() {
  // style.transfer(image, (err: any, result: any) => {
  //   image.src = result.src;
  // })
}

function setup() {
  createCanvas(640, 480);
  noStroke();
  video = createCapture(VIDEO);
  video.hide();
  const poseNet = ml5.poseNet(video, () => {
    console.log('poseNet modal ready');
  });
  poseNet.on('pose', (results: any) => {
    poses = results;
  })
  // style = ml5.styleTransfer('./wave/', handleModalLoaded);
}

function draw() {
  image(video, 0, 0);
  const pose = poses[0];
  if (pose) {
    const keypoints = pose.pose.keypoints;
    for (const bodyPart of keypoints) {
      const { score, position, part } = bodyPart;
      const { x, y } = position;
      if (part === 'rightWrist') {
        if (wristPositions.length === 10) {
          wristPositions.shift();
        }
        wristPositions.push(x);
        const diff = wristPositions[wristPositions.length - 1] - wristPositions[0];
        if (diff > 100) {
          console.log('right');
        } else if (diff < -100) {
          console.log('left');
        }
      }
      if (score > 0) {
        fill(0, 255, 0);
        text(part, x, y);
        ellipse(x, y, 5, 5);
      }
    }
  }
}

// p5.js requires `setup` and `draw` to be methods of global object
window.setup = setup;
window.draw = draw;
