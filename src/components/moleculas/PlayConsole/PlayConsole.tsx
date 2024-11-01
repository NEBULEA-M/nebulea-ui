import { Card, CardBody } from "@nextui-org/card";
import { Slider } from "@nextui-org/slider";
import React from "react";

import { JointStates } from "@/core/types/JointState";

interface PlayConsoleProps {
  jointStates: JointStates;
  onJointStatesChange: (newStates: Partial<JointStates>) => void;
}

const PlayConsole: React.FC<PlayConsoleProps> = ({ jointStates, onJointStatesChange }) => {
  const handleJointChange = (joint: keyof JointStates, value: number) => {
    onJointStatesChange({ [joint]: value });
  };

  return (
    <Card className="mx-auto">
      <CardBody className="gap-6">
        {Object.entries(jointStates).map(([joint, value]) => (
          <div key={joint} className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm">{joint}</span>
              <span className="text-sm text-default-500">{value.toFixed(2)}</span>
            </div>
            <Slider
              label={joint}
              value={value as number}
              minValue={-1.49}
              maxValue={1.5}
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
