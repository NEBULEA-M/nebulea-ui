import React, { useEffect, useState } from "react";
import ROSLIB from "roslib";
import { Card, CardBody, CardHeader } from "@nextui-org/card";
import { Chip } from "@nextui-org/chip";
import { Tooltip } from "@nextui-org/tooltip";
import { Joystick } from "react-joystick-component";
import { IJoystickUpdateEvent } from "react-joystick-component/src/Joystick";

interface Joints {
  joint1: number;  // Left Joystick Vertical
  joint2: number;  // Left Joystick Horizontal
  joint3: number;  // Right Joystick Vertical
  joint4: number;  // Right Joystick Horizontal
}

const GamepadController = () => {
  const [connected, setConnected] = useState(false);
  const [joints, setJoints] = useState<Joints>({
    joint1: 0,
    joint2: 0,
    joint3: 0,
    joint4: 0
  });

  const [ros, setRos] = useState<ROSLIB.Ros | null>(null);
  const [publisher, setPublisher] = useState<ROSLIB.Topic | null>(null);

  useEffect(() => {
    const newRos = new ROSLIB.Ros({
      url: 'ws://localhost:9090'
    });

    newRos.on('connection', () => {
      setConnected(true);
      console.log('Connected to websocket server.');
    });

    newRos.on('error', (error) => {
      console.log('Error connecting to websocket server:', error);
      setConnected(false);
    });

    newRos.on('close', () => {
      setConnected(false);
      console.log('Connection to websocket server closed.');
    });

    setRos(newRos);

    const newPublisher = new ROSLIB.Topic({
      ros: newRos,
      name: '/joint_states',
      messageType: 'sensor_msgs/JointState'
    });

    setPublisher(newPublisher);

    return () => {
      if (newRos) {
        newRos.close();
      }
    };
  }, []);

  useEffect(() => {
    if (!publisher) return;

    const intervalId = setInterval(() => {
      const msg = new ROSLIB.Message({
        header: {
          stamp: { sec: 0, nanosec: 0 },
          frame_id: ''
        },
        name: Object.keys(joints),
        position: Object.values(joints),
        velocity: [],
        effort: []
      });
      publisher.publish(msg);
    }, 100);

    return () => clearInterval(intervalId);
  }, [joints, publisher]);

  const handleLeftJoystick = (event: IJoystickUpdateEvent) => {
    setJoints(prev => ({
      ...prev,
      joint1: event.y ? event.y * Math.PI : prev.joint1,  // Vertical axis
      joint2: event.x ? event.x * Math.PI : prev.joint2,  // Horizontal axis
    }));
  };

  const handleRightJoystick = (event: IJoystickUpdateEvent) => {
    setJoints(prev => ({
      ...prev,
      joint3: event.y ? event.y * Math.PI : prev.joint3,  // Vertical axis
      joint4: event.x ? event.x * Math.PI : prev.joint4,  // Horizontal axis
    }));
  };

  return (
    <Card className="mx-auto bg-gradient-to-b from-gray-800 to-gray-900">
      <CardHeader className="flex justify-between items-center px-4 py-2 bg-gray-900">
        <div className="text-xl font-bold text-white">ROS 2 Gamepad Controller</div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
          <Chip
            color={connected ? "success" : "danger"}
            variant="flat"
          >
            {connected ? "Connected" : "Disconnected"}
          </Chip>
        </div>
      </CardHeader>
      <CardBody>
        <div className="flex flex-col gap-6">
          {/* Gamepad Body */}
          <div className="relative mx-auto w-full h-96 bg-gray-700 rounded-3xl shadow-xl p-8 border-t-4 border-gray-600">
            {/* Center Light Bar */}
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-16 h-2 bg-gray-600 rounded-full">
              <div className="w-4 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            </div>

            {/* Joysticks Container */}
            <div className="flex justify-between items-center h-full px-12">
              {/* Left Joystick Section */}
              <div className="flex flex-col items-center gap-4">
                <div className="p-6 bg-gray-800 rounded-full shadow-inner">
                  <Joystick
                    size={120}
                    baseColor="#374151"
                    stickColor="#9CA3AF"
                    move={handleLeftJoystick}
                    stop={handleLeftJoystick}
                  />
                </div>
                <div className="text-xs text-gray-400 text-center">
                  Joint 1 (↕) | Joint 2 (↔)
                </div>
              </div>

              {/* Joint Values Display */}
              <div className="flex flex-col gap-2 bg-gray-800 p-4 rounded-lg">
                {Object.entries(joints).map(([joint, value]) => (
                  <Tooltip
                    key={joint}
                    content={`Current value: ${value.toFixed(3)} rad`}
                  >
                    <div className="flex gap-2 items-center">
                      <span className="text-xs font-medium text-gray-400">{joint}:</span>
                      <span className="text-xs text-blue-400">{value.toFixed(2)}</span>
                    </div>
                  </Tooltip>
                ))}
              </div>

              {/* Right Joystick Section */}
              <div className="flex flex-col items-center gap-4">
                <div className="p-6 bg-gray-800 rounded-full shadow-inner">
                  <Joystick
                    size={120}
                    baseColor="#374151"
                    stickColor="#9CA3AF"
                    move={handleRightJoystick}
                    stop={handleRightJoystick}
                  />
                </div>
                <div className="text-xs text-gray-400 text-center">
                  Joint 3 (↕) | Joint 4 (↔)
                </div>
              </div>
            </div>

            {/* Bottom Grip Sections */}
            <div className="absolute bottom-0 left-0 w-full flex justify-between px-4">
              <div className="w-24 h-16 bg-gray-800 rounded-t-3xl"></div>
              <div className="w-24 h-16 bg-gray-800 rounded-t-3xl"></div>
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

export default GamepadController;