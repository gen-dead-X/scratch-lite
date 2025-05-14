import { useAnimationContext } from "../../context/useAnimationContext";
import { Droppable } from "react-beautiful-dnd";
import Animation from "../Animation/Animation";
import { useEffect } from "react";

export default function MidArea() {
  const { midAreaAnimations } = useAnimationContext();

  useEffect(() => {
    console.log({ animationDropped: midAreaAnimations });
  }, [midAreaAnimations]);

  return (
    <Droppable
      droppableId="midArea"
      isCombineEnabled={false}
      isDropDisabled={false}
      ignoreContainerClipping
    >
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          className="flex-1 h-full overflow-auto bg-gray-100 p-4"
        >
          {midAreaAnimations?.map((animation, index) => (
            <Animation key={animation.id} animation={animation} index={index} />
          ))}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
}
