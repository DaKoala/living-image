import 'p5';
// @ts-ignore
import * as ml5 from 'ml5';
import './body/index';
import Face from './body/face';
import { bodyManager } from './body/body';
// @ts-ignore
import yosemite from './assets/yosemite.jpg';
// @ts-ignore
import sierra from './assets/sierra.jpg';
// @ts-ignore
import mojave from './assets/mojave.jpg';
// @ts-ignore
import catalina from './assets/catalina.jpg';

let style: any;
const imgEle = document.querySelector('img');
let face: Face | null = null;

let srcIndex = 0;
const srcList = [
  yosemite,
  sierra,
  mojave,
  catalina,
]

let isTransferReady = true;
let modelIndex = 0;
const modelList = [
  '',
  './wave',
  './udnie',
  './scream',
]

async function transferImage() {
  if (!isTransferReady) {
    return;
  }
  const model = modelList[modelIndex];
  if (!model) {
    isTransferReady = false;
    imgEle.src = srcList[srcIndex];
    return;
  }
  style = ml5.styleTransfer(model, () => {});
  await style.ready;
  style.transfer(imgEle, handleTransferImage);
  isTransferReady = false;
}

function handleTransferImage(err: any, resultImg: HTMLImageElement) {
  imgEle.src = resultImg.src;
}

function setup() {
  createCapture(VIDEO).hide();
  transferImage();
}

function draw() {
  const transformFunctions: string[] = [];
  const filterFunctions: string[] = [];
  const { body } = bodyManager;
  if (body) {
    if (!face) {
      face = new Face(body, () => {
        isTransferReady = true;
        modelIndex += 1;
        modelIndex %= modelList.length;
        transferImage();
      }, (direction) => {
        if (direction === 'left') {
          srcIndex -= 1;
        } else {
          srcIndex += 1;
        }
        if (srcIndex < 0) {
          srcIndex += srcList.length;
        } else if (srcIndex >= srcList.length) {
          srcIndex -= srcList.length;
        }
        imgEle.src = srcList[srcIndex];
        isTransferReady = true;
        transferImage();
      });
      bodyManager.registerBodyPart(face);
    } else {
      transformFunctions.push(face.getRotate());
      transformFunctions.push(face.getScale());
      filterFunctions.push(face.getBrightness());
    }
  }
  imgEle.setAttribute('style', `transform: ${transformFunctions.join(' ')}; filter: ${filterFunctions.join(' ')}`);
}

// p5.js requires `setup` and `draw` to be methods of global object
window.setup = setup;
window.draw = draw;
