import { Card, CardBody, CardHeader } from "@nextui-org/card";
import { Chip } from "@nextui-org/chip";
import { Tooltip } from "@nextui-org/tooltip";
import React, { useRef } from "react";
import { Joystick } from "react-joystick-component";
import { IJoystickUpdateEvent } from "react-joystick-component/src/Joystick";

import { JointStates } from "@/core/types/JointState";

interface GamepadControllerProps {
  status: string;
  color: any;
  jointStates: JointStates;
  onJointStatesChange: (newStates: Partial<JointStates>) => void;
}

const GamepadController: React.FC<GamepadControllerProps> = ({ status, color, jointStates, onJointStatesChange }) => {
  // Use refs to keep track of the last valid position for each joystick
  const lastLeftPosition = useRef({ x: 0, y: 0 });
  const lastRightPosition = useRef({ x: 0, y: 0 });

  // Helper function to clamp values between -1.5 and 1.5
  const clampValue = (value: number): number => {
    return Math.max(-1.5, Math.min(1.5, value));
  };

  const handleLeftJoystick = (event: IJoystickUpdateEvent) => {
    // Only update if there's actual movement (ignore the stop event)
    if (event.type === "move") {
      const updates: Partial<JointStates> = {};
      if (event.y !== undefined) {
        lastLeftPosition.current.y = event.y!;
        // Clamp the value to ±1.5 radians
        updates.joint1 = clampValue(event.y! * 1.5);
      }
      if (event.x !== undefined) {
        lastLeftPosition.current.x = event.x!;
        // Clamp the value to ±1.5 radians
        updates.joint2 = clampValue(event.x! * 1.5);
      }
      onJointStatesChange(updates);
    }
  };

  const handleRightJoystick = (event: IJoystickUpdateEvent) => {
    // Only update if there's actual movement (ignore the stop event)
    if (event.type === "move") {
      const updates: Partial<JointStates> = {};
      if (event.y !== undefined) {
        lastRightPosition.current.y = event.y!;
        // Clamp the value to ±1.5 radians
        updates.joint3 = clampValue(event.y! * 1.5);
      }
      if (event.x !== undefined) {
        lastRightPosition.current.x = event.x!;
        // Clamp the value to ±1.5 radians
        updates.joint4 = clampValue(event.x! * 1.5);
      }
      onJointStatesChange(updates);
    }
  };

  return (
    <Card className="mx-auto bg-gradient-to-b from-gray-800 to-gray-900">
      <CardHeader className="flex justify-between items-center px-4 py-2 bg-gray-900">
        <div className="text-xl font-bold text-white">ROS 2 Gamepad Controller</div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
          <Chip color={color} variant="flat">
            {status}
          </Chip>
        </div>
      </CardHeader>
      <CardBody>
        <div className="flex flex-col gap-6">
          <div className="relative mx-auto w-full h-96 bg-gray-700 rounded-3xl shadow-xl p-8 border-t-4 border-gray-600">
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-16 h-2 bg-gray-600 rounded-full">
              <div className="w-4 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            </div>

            <div className="flex justify-between items-center h-full px-12">
              <div className="flex flex-col items-center gap-4">
                <div className="p-6 bg-gray-800 rounded-full shadow-inner">
                  <Joystick
                    minDistance={1.5}
                    size={120}
                    baseColor="#374151"
                    stickColor="#9CA3AF"
                    move={handleLeftJoystick}
                    stop={handleLeftJoystick}
                  />
                </div>
                <div className="text-xs text-gray-400 text-center">Joint 1 (↕) | Joint 2 (↔)</div>
              </div>

              <div className="flex flex-col gap-2 bg-gray-800 p-4 rounded-lg">
                {Object.entries(jointStates).map(([joint, value]) => (
                  <Tooltip key={joint} content={`Current value: ${value.toFixed(3)} rad`}>
                    <div className="flex gap-2 items-center">
                      <span className="text-xs font-medium text-gray-400">{joint}:</span>
                      <span className="text-xs text-blue-400">{value.toFixed(2)}</span>
                    </div>
                  </Tooltip>
                ))}
              </div>

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
                <div className="text-xs text-gray-400 text-center">Joint 3 (↕) | Joint 4 (↔)</div>
              </div>
            </div>

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
