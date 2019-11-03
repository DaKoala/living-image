import { BodyPose } from '../ml5/types'
import { PoseNet } from '../ml5/index';
import { bodyManager } from './body';

function handlePoses(results: BodyPose[]) {
  const pose = results[0];
  if (!pose) {
    return;
  }
  bodyManager.readData(pose.pose.keypoints);
}
const registerTimer = window.setInterval(() => {
  const video = document.querySelector('video');
  if (video) {
    PoseNet.register(handlePoses);
    window.clearInterval(registerTimer);
  }
}, 100);
