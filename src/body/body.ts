import { Body, SyncableBodyPart } from './types';
import { BodyPart } from '../ml5/types';

class BodyManager {
  body: Body | null = null;
  private syncableParts: SyncableBodyPart[] = [];

  readData(keypoints: BodyPart[]) {
    if (!this.body) {
      this.body = {} as Body;
    }
    for (const bodyPart of keypoints) {
      const { score, part, position: { x, y }  } = bodyPart;
      this.body[part] = {
        x,
        y,
        score,
      }
    }
    for (const part of this.syncableParts) {
      part.sync(this.body);
    }
  }

  registerBodyPart(part: SyncableBodyPart) {
    this.syncableParts.push(part);
  }
}

export const bodyManager = new BodyManager();
