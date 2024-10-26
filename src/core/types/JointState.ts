export interface JointStateMessage {
  header: {
    stamp: {
      sec: number;
      nanosec: number;
    };
    frame_id: string;
  };
  name: string[];
  position: number[];
  velocity: number[];
  effort: number[];
}

export interface JointStateTopic {
  topic: string;
  msg_type: string;
  msg: JointStateMessage;
}

export interface JointStates {
  joint1: number;
  joint2: number;
  joint3: number;
  joint4: number;
}
