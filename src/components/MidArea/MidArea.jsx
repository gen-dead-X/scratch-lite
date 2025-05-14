import { useAnimationContext } from "../../context/AnimationContext";
import { Droppable } from "react-beautiful-dnd";

export default function MidArea() {
  const { selectedSpriteId, addAnimationToCharacter } = useAnimationContext();

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
          <div className="text-gray-500">Drop animations here</div>
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
}
