import { useAnimationContext } from "../../context/AnimationContext";
import { Draggable, Droppable } from "react-beautiful-dnd";

export default function Sidebar() {
  const { selectedSpriteId, getAnimationsForSprite } = useAnimationContext();

  const assignedAnimations = selectedSpriteId
    ? getAnimationsForSprite(selectedSpriteId).map((anim) => anim.type)
    : [];

  const motionFeatures = [
    { id: "1", label: "Move 10 steps", action: { type: "move", value: 10 } },
    { id: "2", label: "Turn 15 degrees", action: { type: "turn", value: 15 } },
    { id: "3", label: "Go to x: 0 y: 0", action: { type: "goto", x: 0, y: 0 } },
    {
      id: "4",
      label: "Repeat 10 times",
      action: { type: "repeat", count: 10 },
    },
  ].filter((feature) => !assignedAnimations.includes(feature.action.type));

  return (
    <div className="w-60 flex-none h-full overflow-y-auto flex flex-col items-start p-2 border-r border-gray-200">
      <div className="font-bold"> {"Motion"} </div>
      <Droppable
        droppableId="sidebar"
        isDropDisabled={false}
        isCombineEnabled={true}
        ignoreContainerClipping
      >
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="w-full"
          >
            {motionFeatures.map((feature, index) => (
              <Draggable
                key={feature.id}
                draggableId={feature.id}
                index={index}
              >
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className="flex flex-row flex-wrap bg-blue-500 text-white px-2 py-1 my-2 text-sm cursor-pointer"
                  >
                    {feature.label}
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
}
