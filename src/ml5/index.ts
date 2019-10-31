// @ts-ignore
import ml5 from 'ml5';
import { BodyPose } from './types'

export class PoseNet {
  static register(cb: (bodyPose: BodyPose[]) => void) {
    ml5.poseNet(document.querySelector('video'), () => {
      console.log('poseNet modal ready');
    }).on('pose', cb);
  }
}

