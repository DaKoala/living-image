export type BodyPartName = 'leftAnkle' | 'leftEar' | 'leftElbow' | 'leftEye' | 'leftHip' | 'leftKnee' | 'leftShoulder' | 'leftWrist' |
'nose' | 'rightAnkle' | 'rightEar' | 'rightElbow' | 'rightEye' | 'rightHip' | 'rightKnee' | 'rightShoulder' | 'rightWrist';

export interface BodyPose {
  pose: Pose;
}

type Pose = PoseKeypoints & Record<BodyPartName, BodyPartPosition>;

type Keypoints = BodyPart[];

interface PoseKeypoints {
  keypoints: Keypoints;
}

export interface BodyPart {
  score: number;
  part: BodyPartName;
  position: {
    x: number;
    y: number;
  };
}

interface BodyPartPosition {
  x: number;
  y: number;
  confidence: number;
}
