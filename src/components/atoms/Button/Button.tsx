import { Button } from "@nextui-org/button";
import React from "react";

function ButtomCommon(props: any ) {
  const {isLoading, variant, children, color, onClick} = props;

  return (
    <Button
      isLoading={isLoading}
      color={color}
      variant={variant}>
      {children}
      onClick={onClick}
    </Button>
  )
}

ButtomCommon.defaultProps = {
  color: "primary",
  variant: "ghost"
}

export default React.memo(ButtomCommon);