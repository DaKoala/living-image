import { BodyPartName } from '../ml5/types';

export interface Part {
  x: number;
  y: number;
  score: number;
}
export type Body = Record<BodyPartName, Part>;
export interface SyncableBodyPart {
  sync(body: Body): void;
}