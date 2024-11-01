import { Button } from "@nextui-org/button";
import { Card, CardBody } from "@nextui-org/card";
import { Maximize2, Minimize2 } from "lucide-react";
import React, { useCallback, useRef, useState } from "react";
import { Joystick } from "react-joystick-component";

import { JointStates } from "@/core/types/JointState";

interface GamepadControllerProps {
  jointStates: JointStates;
  onJointStatesChange: (newStates: Partial<JointStates>) => void;
}

const GamepadController: React.FC<GamepadControllerProps> = ({ jointStates, onJointStatesChange }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const lastLeftPosition = useRef({ x: 0, y: 0 });
  const lastRightPosition = useRef({ x: 0, y: 0 });

  const toggleFullscreen = useCallback(async () => {
    if (!document.fullscreenElement) {
      await containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      await document.exitFullscreen();
      setIsFullscreen(false);
    }
  }, []);

  const clampValue = (value: number): number => {
    return Math.max(-1.5, Math.min(1.5, value));
  };

  const handleLeftJoystick = (event: any) => {
    if (event.type === "move") {
      const updates: Partial<JointStates> = {};
      if (event.y !== undefined) {
        lastLeftPosition.current.y = event.y;
        updates.joint1 = clampValue(event.y * 1.5);
      }
      if (event.x !== undefined) {
        lastLeftPosition.current.x = event.x;
        updates.joint2 = clampValue(event.x * 1.5);
      }
      onJointStatesChange(updates);
    }
  };

  const handleRightJoystick = (event: any) => {
    if (event.type === "move") {
      const updates: Partial<JointStates> = {};
      if (event.y !== undefined) {
        lastRightPosition.current.y = event.y;
        updates.joint3 = clampValue(event.y * 1.5);
      }
      if (event.x !== undefined) {
        lastRightPosition.current.x = event.x;
        updates.joint4 = clampValue(event.x * 1.5);
      }
      onJointStatesChange(updates);
    }
  };

  return (
    <div ref={containerRef} className="w-full">
      <Card className="mx-auto bg-gradient-to-b from-gray-800 to-gray-900">
        <Button onClick={toggleFullscreen} variant="ghost" className="text-white hover:bg-gray-700">
          {isFullscreen ? <Minimize2 className="h-5 w-5" /> : <Maximize2 className="h-5 w-5" />}
        </Button>

        {isFullscreen && (
          <CardBody>
            <div className="flex flex-col gap-6">
              <div className="relative mx-auto w-full rounded-3xl shadow-xl p-8 border-t-40">
                <div className="flex justify-between items-center h-full px-12">
                  <div className="flex flex-col items-center gap-4">
                    <div className="p-6 rounded-full shadow-inner">
                      <Joystick
                        size={120}
                        baseColor="#374151"
                        stickColor="#9CA3AF"
                        move={handleLeftJoystick}
                        stop={handleLeftJoystick}
                      />
                    </div>
                    <div className="text-xs text-center">Joint 1 (↕) | Joint 2 (↔)</div>
                  </div>

                  <div className="flex flex-col gap-2 p-4 rounded-lg">
                    {Object.entries(jointStates).map(([joint, value]) => (
                      <div key={joint} className="flex gap-2 items-center">
                        <span className="text-xs font-medium">{joint}:</span>
                        <span className="text-xs text-blue-400">{value.toFixed(2)}</span>
                      </div>
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
                    <div className="text-xs text-center">Joint 3 (↕) | Joint 4 (↔)</div>
                  </div>
                </div>
              </div>
            </div>
          </CardBody>
        )}
      </Card>
    </div>
  );
};

export default GamepadController;
