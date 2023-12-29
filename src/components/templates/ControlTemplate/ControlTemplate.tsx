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
    // Initialize ROS connection
    const rosConnection = new ROSLIB.Ros({
      url: ros2ConnectionUrl
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
          z: 0
        },
        angular: {
          x: 0,
          y: 0,
          z: event.x
        }
      });

      const cmdVel = new ROSLIB.Topic({
        ros: ros,
        name: topicName,
        messageType: "geometry_msgs/Twist"
      });

      cmdVel.publish(twist);
    }
  };

  return (
    <IonContent class="ion-padding">
      <Joystick
        size={100}
        baseColor="#333"
        stickColor="#fff"
        move={handleJoystickMove}
      />

    </IonContent>
  );
}

export default ControlTemplate;