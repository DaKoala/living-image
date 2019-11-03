import { Body, Part, SyncableBodyPart } from './types';

type NodHandler = () => void;
type TurnHandler = (turn: 'left' | 'right') => void;

export default class Face implements SyncableBodyPart {
  private leftEye: Part;
  private rightEye: Part;
  private leftEar: Part;
  private rightEar: Part;
  private nose: Part;
  private onNod: NodHandler;
  private onTurn: TurnHandler;
  private isNodding = false;
  private isTurning = false;
  private inclineAngle = 0;
  private scale = 1;
  private brightness = 1;
  private originEarDistance: number;

  constructor(body: Body, onNod: NodHandler, onTurn: TurnHandler) {
    this.onNod = onNod;
    this.onTurn = onTurn;
    this.sync(body);
    this.originEarDistance = dist(this.leftEar.x, this.leftEar.y, this.rightEar.x, this.rightEar.y);
  }

  sync(body: Body) {
    this.leftEye = body.leftEye;
    this.rightEye = body.rightEye;
    this.leftEar = body.leftEar;
    this.rightEar = body.rightEar;
    this.nose = body.nose;
    this.updateIncline();
    this.updateScale();
    this.updateBrightness();
    this.updateNod();
    this.updateTurning();
  }

  getBrightness() {
    const { brightness } = this;
    return `brightness(${brightness})`;
  }

  getRotate(): string {
    const { inclineAngle } = this;
    return `rotate(${Math.round(inclineAngle)}deg)`;
  }

  getScale(): string {
    return `scale(${this.scale})`;
  }

  private updateBrightness() {
    const { x } = this.nose;
    const brightness = x / 320;
    if (Math.abs(brightness - this.brightness) > 0.05) {
      this.brightness = brightness;
    }
  }  

  private updateScale() {
    const earDist = dist(this.leftEar.x, this.leftEar.y, this.rightEar.x, this.rightEar.y);
    const scale = earDist / this.originEarDistance;
    if (Math.abs(scale - this.scale) > 0.05) {
      this.scale = scale;
    }
  }

  private updateIncline() {
    const { x: rx, y: ry } = this.rightEye;
    const { x: lx, y: ly } = this.leftEye;
    const dy = ry - ly;
    const dx = rx - lx;
    let radian = Math.atan2(dy, dx);
    let inclineAngle = -radian * 180 / Math.PI + 180;
    if (inclineAngle > 180) {
      inclineAngle -= 360;
    }
    if (Math.abs(inclineAngle - this.inclineAngle) > 2) {
      this.inclineAngle = inclineAngle;
    }
  }

  private updateNod() {
    const { y: leftEyeY } = this.leftEye;
    const { y: rightEyeY } = this.rightEye;
    const { y: leftEarY } = this.leftEar;
    const { y: rightEarY } = this.rightEar;
    if (leftEyeY > leftEarY && leftEyeY > rightEarY && rightEyeY > leftEarY && rightEyeY > rightEarY) {
      if (!this.isNodding) {
        this.isNodding = true;
        this.onNod();
      }
    } else if (this.isNodding) {
      this.isNodding = false;
    }
  }

  private updateTurning() {
    const { x: noseX } = this.nose;
    const { x: leftEarX } = this.leftEar;
    const { x: rightEarX } = this.rightEar;
    const leftEarDist = Math.abs(noseX - leftEarX);
    const rightEarDist = Math.abs(noseX - rightEarX);
    const ratio = leftEarDist / rightEarDist;
    if (ratio < 0.2 || ratio > 5) {
      if (!this.isTurning) {
        this.isTurning = true;
        const direction = ratio < 0.2 ? 'left' : 'right';
        this.onTurn(direction);
      }
    } else if (this.isTurning) {
      this.isTurning = false;
    }
  }
}