import { UseSwitchProps } from "@nextui-org/switch/dist/use-switch";
import { useSwitch, VisuallyHidden } from "@nextui-org/react";
import { Gamepad2, Sliders } from "lucide-react";
import React from "react";

const ArmBotSwitcher = (props: UseSwitchProps | undefined) => {
  const {
    Component,
    slots,
    isSelected,
    getBaseProps,
    getInputProps,
    getWrapperProps
  } = useSwitch(props);

  return (
    <div className="flex flex-col items-center gap-2">
      <Component {...getBaseProps()}>
        <VisuallyHidden>
          <input {...getInputProps()} />
        </VisuallyHidden>
        <div
          {...getWrapperProps()}
          className={slots.wrapper({
            class: [
              "w-12 h-12",
              "flex items-center justify-center",
              "rounded",
              "transition-all duration-200",
              isSelected
                ? "bg-green-100 hover:bg-green-200 dark:bg-green-900 dark:hover:bg-green-800"
                : "bg-blue-100 hover:bg-blue-200 dark:bg-blue-900 dark:hover:bg-blue-800",
            ],
          })}
        >
          {isSelected ? (
            <Gamepad2 className="w-6 h-6 text-green-500" />
          ) : (
            <Sliders className="w-6 h-6 text-blue-500" />
          )}
        </div>
      </Component>
      <p className="text-default-500 select-none font-medium">
        {isSelected ? "Gamepad Controller" : "Play Console"}
      </p>
    </div>
  );
};

export default React.memo(ArmBotSwitcher);
