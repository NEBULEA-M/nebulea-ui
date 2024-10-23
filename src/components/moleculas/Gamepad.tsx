import React, { useEffect, useRef, useState } from "react";
import ROSLIB from "roslib";
import { Card, CardBody, CardHeader } from "@nextui-org/card";
import { Select, SelectItem } from "@nextui-org/select";
import { Chip } from "@nextui-org/chip";
import { Tooltip } from "@nextui-org/tooltip";

// @ts-ignore
const JoystickComponent = ({ onMove, size = 100 }) => {
  const [dragging, setDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const joystickRef = useRef(null);
  const maxDistance = size / 3;

  const calculatePosition = (e: any) => {
    if (!joystickRef.current) return { x: 0, y: 0 };

    const rect = joystickRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    let x = (e.clientX - centerX) / maxDistance;
    let y = (centerY - e.clientY) / maxDistance;

    // Clamp values between -1 and 1
    const magnitude = Math.sqrt(x * x + y * y);
    if (magnitude > 1) {
      x /= magnitude;
      y /= magnitude;
    }

    return { x, y };
  };

  const handleMouseDown = (e) => {
    setDragging(true);
    const pos = calculatePosition(e);
    setPosition(pos);
    onMove(pos);
  };

  const handleMouseMove = (e) => {
    if (!dragging) return;
    const pos = calculatePosition(e);
    setPosition(pos);
    onMove(pos);
  };

  const handleMouseUp = () => {
    setDragging(false);
    setPosition({ x: 0, y: 0 });
    onMove({ x: 0, y: 0 });
  };

  useEffect(() => {
    if (dragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [dragging]);

  const stickStyle = {
    transform: `translate(${position.x * maxDistance}px, ${-position.y * maxDistance}px)`,
  };

  return (
    <div
      ref={joystickRef}
      className="relative rounded-full border-2 border-default-200 bg-default-100"
      style={{ width: size, height: size }}
      onMouseDown={handleMouseDown}
    >
      <div
        className="absolute top-1/2 left-1/2 w-1/2 h-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary cursor-grab active:cursor-grabbing transition-transform"
        style={stickStyle}
      />
    </div>
  );
};

const ROSGamepadController = () => {
  const [connected, setConnected] = useState(false);
  const [joints, setJoints] = useState({
    joint1: 0,
    joint2: 0,
    joint3: 0,
    joint4: 0
  });

  const [mappings, setMappings] = useState({
    leftX: 'joint1',
    leftY: 'joint2',
    rightX: 'joint3',
    rightY: 'joint4'
  });

  const [ros, setRos] = useState(null);
  const [publisher, setPublisher] = useState(null);

  useEffect(() => {
    // Initialize ROS connection
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

    // @ts-ignore
    setRos(newRos);

    // Create joint states publisher
    const newPublisher = new ROSLIB.Topic({
      ros: newRos,
      name: '/joint_states',
      messageType: 'sensor_msgs/JointState'
    });

    // @ts-ignore
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

  // @ts-ignore
  const handleLeftJoystick = ({ x, y }) => {
    setJoints(prev => ({
      ...prev,
      [mappings.leftX]: x * Math.PI,
      [mappings.leftY]: y * Math.PI
    }));
  };

  // @ts-ignore
  const handleRightJoystick = ({ x, y }) => {
    setJoints(prev => ({
      ...prev,
      [mappings.rightX]: x * Math.PI,
      [mappings.rightY]: y * Math.PI
    }));
  };

  const handleMapping = (axis: any, jointName: any) => {
    setMappings(prev => ({
      ...prev,
      [axis]: jointName
    }));
  };

  const jointOptions = Object.keys(joints).map(joint => ({
    label: joint,
    value: joint
  }));

  return (
    <Card className="max-w-3xl mx-auto">
      <CardHeader className="flex justify-between items-center px-4 py-2">
        <div className="text-xl font-bold">ROS 2 Gamepad Controller</div>
        <Chip
          color={connected ? "success" : "danger"}
          variant="flat"
        >
          {connected ? "Connected" : "Disconnected"}
        </Chip>
      </CardHeader>
      <CardBody className="gap-6">
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-8">
            {/* Left Joystick Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Left Joystick</h3>
              <div className="flex justify-center">
                <JoystickComponent onMove={handleLeftJoystick} size={150} />
              </div>
              <div className="space-y-2">
                <Select
                  label="X-Axis Control"
                  value={mappings.leftX}
                  onChange={(e) => handleMapping('leftX', e.target.value)}
                >
                  {jointOptions.map((joint) => (
                    <SelectItem key={joint.value} value={joint.value}>
                      {joint.label}
                    </SelectItem>
                  ))}
                </Select>
                <Select
                  label="Y-Axis Control"
                  value={mappings.leftY}
                  onChange={(e) => handleMapping('leftY', e.target.value)}
                >
                  {jointOptions.map((joint) => (
                    <SelectItem key={joint.value} value={joint.value}>
                      {joint.label}
                    </SelectItem>
                  ))}
                </Select>
              </div>
            </div>

            {/* Right Joystick Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Right Joystick</h3>
              <div className="flex justify-center">
                <JoystickComponent onMove={handleRightJoystick} size={150} />
              </div>
              <div className="space-y-2">
                <Select
                  label="X-Axis Control"
                  value={mappings.rightX}
                  onChange={(e) => handleMapping('rightX', e.target.value)}
                >
                  {jointOptions.map((joint) => (
                    <SelectItem key={joint.value} value={joint.value}>
                      {joint.label}
                    </SelectItem>
                  ))}
                </Select>
                <Select
                  label="Y-Axis Control"
                  value={mappings.rightY}
                  onChange={(e) => handleMapping('rightY', e.target.value)}
                >
                  {jointOptions.map((joint) => (
                    <SelectItem key={joint.value} value={joint.value}>
                      {joint.label}
                    </SelectItem>
                  ))}
                </Select>
              </div>
            </div>
          </div>

          {/* Joint Values Display */}
          <div className="grid grid-cols-2 gap-4 mt-4">
            {Object.entries(joints).map(([joint, value]) => (
              <Tooltip
                key={joint}
                content={`Current value: ${value.toFixed(3)} rad`}
              >
                <div className="flex justify-between items-center p-2 rounded bg-default-100">
                  <span className="font-medium">{joint}:</span>
                  <span className="text-default-500">{value.toFixed(3)}</span>
                </div>
              </Tooltip>
            ))}
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

export default ROSGamepadController;