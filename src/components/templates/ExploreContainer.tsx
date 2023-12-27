import "./ExploreContainer.css";

import { Button } from "@nextui-org/button";

interface ContainerProps {
  name: string;
}

const ExploreContainer: React.FC<ContainerProps> = ({ name }) => {
  return (
    <div id="container">
      <strong>{name}</strong>
      <p>
        Explore{" "}
        <Button color="primary">
          Button
        </Button>
      </p>

    </div>
  );
};

export default ExploreContainer;
