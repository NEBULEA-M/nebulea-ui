import { IonContent } from "@ionic/react";
import { useEffect, useState } from "react";
import { Joystick } from "react-joystick-component";
import ROSLIB from "roslib";

interface JoystickControlProps {
  ros2ConnectionUrl: string;
  topicName: string;
}

function ControlTemplate({ ros2ConnectionUrl, topicName }: JoystickControlProps) {
  const [ros, setRos] = useState<ROSLIB.Ros | null>(null);

  useEffect(() => {
    const accessToken =
      "eyJhbGciOiJSUzI1NiIsImtpZCI6IjQ1NmI1MmM4MWUzNmZlYWQyNTkyMzFhNjk0N2UwNDBlMDNlYTEyNjIiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJhY2NvdW50cy5nb29nbGUuY29tIiwiYXpwIjoiMzY4MTE4MDUyOTg3LTg5cjYyc2IxNXBibTdhdmJ1dG1mYTBkamlzbmtxanRzLmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29tIiwiYXVkIjoiMzY4MTE4MDUyOTg3LTg5cjYyc2IxNXBibTdhdmJ1dG1mYTBkamlzbmtxanRzLmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29tIiwic3ViIjoiMTExMDIxNTg3Mzk0MzEyNjgyNjM2IiwiZW1haWwiOiJyZWdhcHAuc3B0QGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJhdF9oYXNoIjoiYXZPOTl3RE9fM0Nic0JEckRuUjgydyIsImlhdCI6MTcwNDAyMzkwOSwiZXhwIjoxNzA0MDI3NTA5fQ.p32rldy_XwV1DHXITJOrNKqJtRcToOyrhRkYyb100d8_6_CpUBTPQN0ltA1qVUnNAr0zLs5_S9GC2DNZ7N1n0D21t7ECaSFRop04DFdEuVfVPciux3fBkdHejuHhbFHdUh6YLKCBRlOL5AnV9VSRBcB3Rl1FaYH8r0pb7HjV0nnlfIgw_iJbgRLXL5pkHZeYprcRBANrVu0a6G7PatE2G3hi0MelUk-gGGj1PPeI951ULfGptbR7lDZKJhLB7bHPvum9SDHL8VpdUMJ18EWTHOCjw3hkvmwIkbbVzxWam3gIODdIU5aR3k8fW3GaEsYozPzDJEHW-n1KpMEnNt7QFw";

    // Initialize ROS connection
    const rosConnection = new ROSLIB.Ros({
      url: `${ros2ConnectionUrl}?accessToken=${accessToken}`,
    });

    setRos(rosConnection);

    return () => {
      // Close ROS connection on component unmount
      if (rosConnection) {
        rosConnection.close();
      }
    };
  }, [ros2ConnectionUrl]);

  const handleJoystickMove = (event: any) => {
    if (ros) {
      // Create and publish a message based on joystick data
      const twist = new ROSLIB.Message({
        linear: {
          x: event.y,
          y: 0,
          z: 0,
        },
        angular: {
          x: 0,
          y: 0,
          z: event.x,
        },
      });

      const cmdVel = new ROSLIB.Topic({
        ros: ros,
        name: topicName,
        messageType: "geometry_msgs/msg/Twist",
      });

      cmdVel.publish(twist);
    }
  };

  return (
    <IonContent class="ion-padding">
      <Joystick size={100} baseColor="#333" stickColor="#fff" move={handleJoystickMove} />
    </IonContent>
  );
}

export default ControlTemplate;
