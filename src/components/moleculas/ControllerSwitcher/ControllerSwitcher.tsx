import { Card, CardBody, CardHeader } from "@nextui-org/card";
import { Chip } from "@nextui-org/chip";
import React, { useCallback, useEffect, useRef, useState } from "react";

import ArmBotSwitcher from "@/components/atoms/Switcher";
import GamepadController from "@/components/moleculas/Gamepad";
import PlayConsole from "@/components/moleculas/PlayConsole";
import AuthService from "@/core/services/AuthService";
import { JointStateMessage, JointStates, JointStateTopic } from "@/core/types/JointState";
import { WEBSOCKET_SERVER_ENDPOINT } from "@/env";
import { useDebounce } from "@/hooks/useDebounce";

const ControllerSwitcher = () => {
  const [isGamepad, setIsGamepad] = useState(false);
  const [jointStates, setJointStates] = useState<JointStates>({
    joint1: 0,
    joint2: 0,
    joint3: 0,
    joint4: 0,
  });

  const [connected, setConnected] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  const wsRef = useRef<WebSocket | null>(null);
  const isMountedRef = useRef(true);

  // Initialize auth storage and cleanup
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  // WebSocket connection
  useEffect(() => {
    const connectWebSocket = async () => {
      try {
        const token = await AuthService.getAccessToken();
        if (!token) {
          setConnectionError("No authentication token available");
          return;
        }

        if (wsRef.current) {
          wsRef.current.close();
        }

        console.log("Connecting to WebSocket...");
        const ws = new WebSocket(`${WEBSOCKET_SERVER_ENDPOINT}`);
        wsRef.current = ws;

        ws.onopen = () => {
          console.log("WebSocket connected, sending authentication...");
          ws.send(JSON.stringify({ token }));
        };

        ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            if (data.type === "auth" || data.authenticated !== undefined) {
              setAuthenticated(true);
              setConnected(true);
              setConnectionError(null);
              console.log("Authentication successful");
            } else {
              console.log("Received message:", data);
            }
          } catch (error) {
            console.error("Error parsing WebSocket message:", error);
          }
        };

        ws.onclose = () => {
          setConnected(false);
          setAuthenticated(false);
          console.log("WebSocket connection closed");
        };

        ws.onerror = () => {
          setConnected(false);
          setAuthenticated(false);
          setConnectionError("WebSocket connection error");
          ws.close();
        };
      } catch (error) {
        console.error("Error in connectWebSocket:", error);
        setConnectionError(`Failed to establish connection: ${error}`);
      }
    };

    connectWebSocket();

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, []);

  const publishJointStatesImmediate = useCallback(
    (states: JointStates) => {
      if (!wsRef.current || !connected || !authenticated) {
        console.debug("Cannot publish: WebSocket not ready", {
          connected,
          authenticated,
        });
        return;
      }

      const jointStateMessage: JointStateMessage = {
        header: {
          stamp: {
            sec: Math.floor(Date.now() / 1000),
            nanosec: (Date.now() % 1000) * 1000000,
          },
          frame_id: "robot_base",
        },
        name: Object.keys(states),
        position: Object.values(states),
        velocity: Array(Object.keys(states).length).fill(0),
        effort: Array(Object.keys(states).length).fill(0),
      };

      const message: JointStateTopic = {
        topic: "/joint_commands",
        msg_type: "sensor_msgs/msg/JointState",
        msg: jointStateMessage,
      };

      try {
        wsRef.current.send(JSON.stringify(message));
      } catch (error) {
        console.error("Error sending message:", error);
      }
    },
    [connected, authenticated],
  );

  // Debounced version of publishJointStates
  const publishJointStates = useDebounce(publishJointStatesImmediate, 15);

  // Update joint states and publish with debounce
  const updateJointStates = useCallback(
    (newStates: Partial<JointStates>) => {
      setJointStates((prev) => {
        const updatedStates = { ...prev, ...newStates };
        publishJointStates(updatedStates);
        return updatedStates;
      });
    },
    [publishJointStates],
  );

  const getConnectionStatus = useCallback(() => {
    if (connectionError) return { status: `${connectionError}`, color: "danger" as const };
    if (!connected) return { status: "Disconnected", color: "danger" as const };
    if (!authenticated) return { status: "Authenticating...", color: "warning" as const };
    return { status: "Connected", color: "success" as const };
  }, [connected, authenticated, connectionError]);

  const { status, color } = getConnectionStatus();

  return (
    <div className="p-4">
      <Card className="mx-auto">
        <CardHeader className="flex flex-col sm:flex-row justify-between items-center gap-4 px-6 py-4">
          <div className="text-xl font-bold">ROS 2 Robot Controller</div>
          <ArmBotSwitcher isSelected={isGamepad} onValueChange={setIsGamepad} />
          <Chip color={color} variant="flat" className="whitespace-nowrap">
            {status}
          </Chip>
        </CardHeader>
        <CardBody className="p-0 transition-all duration-300">
          {isGamepad ? (
            <GamepadController jointStates={jointStates} onJointStatesChange={updateJointStates} />
          ) : (
            <PlayConsole jointStates={jointStates} onJointStatesChange={updateJointStates} />
          )}
        </CardBody>
      </Card>
    </div>
  );
};

export default ControllerSwitcher;
