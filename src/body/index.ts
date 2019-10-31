import { BodyPartName, BodyPose } from '../ml5/types'
import { PoseNet } from '../ml5/index';
import { clearInterval } from 'timers';

interface Part {
  x: number;
  y: number;
  score: number;
}
type Body = Record<BodyPartName, Part>;

export let body: Body | null = null;
function handlePoses(results: BodyPose[]) {
  const pose = results[0];
  if (!pose) {
    return;
  }
  if (!body) {
    body = {} as Body;
  }
  for (const bodyPart of pose.pose.keypoints) {
    const { score, part, position: { x, y }  } = bodyPart;
    body[part] = {
      x,
      y,
      score,
    }
  }
}

const registerTimer = window.setInterval(() => {
  const video = document.querySelector('video');
  if (video) {
    PoseNet.register(handlePoses);
    window.clearInterval(registerTimer);
  }
}, 100);
