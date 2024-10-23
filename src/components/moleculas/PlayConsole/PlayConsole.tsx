import React, { useEffect, useState } from "react";
import ROSLIB from "roslib";
import { Card, CardBody, CardHeader } from "@nextui-org/card";
import { Slider } from "@nextui-org/slider";
import { Chip } from "@nextui-org/chip";

interface JointStates {
  joint1: number;
  joint2: number;
  joint3: number;
  joint4: number;
}

const PlayConsole = () => {
  const [connected, setConnected] = useState<boolean>(false);
  const [jointStates, setJointStates] = useState<JointStates>({
    joint1: 0,
    joint2: 0,
    joint3: 0,
    joint4: 0
  });

  useEffect(() => {
    // Initialize ROS connection
    const ros = new ROSLIB.Ros({
      url: 'ws://localhost:9090'
    });

    ros.on('connection', () => {
      setConnected(true);
      console.log('Connected to websocket server.');
    });

    ros.on('error', (error) => {
      console.log('Error connecting to websocket server:', error);
    });

    ros.on('close', () => {
      setConnected(false);
      console.log('Connection to websocket server closed.');
    });

    // Create joint states publisher
    const jointStatesPub = new ROSLIB.Topic({
      ros: ros,
      name: '/joint_states',
      messageType: 'sensor_msgs/JointState'
    });

    // Publish joint states whenever they change
    const intervalId = setInterval(() => {
      const msg = new ROSLIB.Message({
        header: {
          stamp: { sec: 0, nanosec: 0 },
          frame_id: ''
        },
        name: ['joint1', 'joint2', 'joint3', 'joint4'],
        position: Object.values(jointStates),
        velocity: [],
        effort: []
      });
      jointStatesPub.publish(msg);
    }, 100);

    return () => {
      clearInterval(intervalId);
      ros.close();
    };
  }, [jointStates]);

  const handleJointChange = (joint: keyof JointStates, value: number) => {
    setJointStates(prev => ({
      ...prev,
      [joint]: value
    }));
  };

  return (
    <Card className="mx-auto">
      <CardHeader className="flex justify-between items-center px-4 py-2">
        <div className="text-xl font-bold">ROS 2 Joint Controller</div>
        <Chip
          color={connected ? "success" : "danger"}
          variant="flat"
        >
          {connected ? "Connected" : "Disconnected"}
        </Chip>
      </CardHeader>
      <CardBody className="gap-6">
        {Object.entries(jointStates).map(([joint, value]) => (
          <div key={joint} className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm">{joint}</span>
              <span className="text-sm text-default-500">
                {value.toFixed(2)}
              </span>
            </div>
            <Slider
              label={joint}
              value={value as number}
              minValue={-3.14}
              maxValue={3.14}
              step={0.01}
              onChange={(value) => handleJointChange(joint as keyof JointStates, value as number)}
              className="max-w-full"
              showTooltip={true}
            />
          </div>
        ))}
      </CardBody>
    </Card>
  );
};

export default PlayConsole;