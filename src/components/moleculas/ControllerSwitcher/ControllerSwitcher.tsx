import { Card, CardBody, CardHeader } from "@nextui-org/card";
import React, { useState } from "react";

import ArmBotSwitcher from "@/components/atoms/Switcher";
import GamepadController from "@/components/moleculas/Gamepad";
import PlayConsole from "@/components/moleculas/PlayConsole";

const ControllerSwitcher = () => {
  const [isGamepad, setIsGamepad] = useState(false);

  return (
    <div className="p-4 min-h-screen bg-gray-100 dark:bg-gray-900">
      <Card className="mx-auto">
        <CardHeader className="flex flex-col sm:flex-row justify-between items-center gap-4 px-6 py-4 bg-gray-50 dark:bg-gray-800">
          <div className="text-2xl font-bold">ROS 2 Robot Controller</div>
          <ArmBotSwitcher isSelected={isGamepad} onValueChange={setIsGamepad} />
        </CardHeader>
        <CardBody className="p-0 transition-all duration-300">
          {isGamepad ? <GamepadController /> : <PlayConsole />}
        </CardBody>
      </Card>
    </div>
  );
};

export default ControllerSwitcher;
