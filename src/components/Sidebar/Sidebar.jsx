import { useAnimationContext } from "../../context/useAnimationContext";
import { Droppable } from "react-beautiful-dnd";
import Animation from "../Animation/Animation";

export default function Sidebar() {
  const { sidebarAnimations, selectedSpriteId } = useAnimationContext();

  const motionAnimations = sidebarAnimations.filter((animation) =>
    ["move", "turn", "goto", "repeat"].includes(animation.action.type)
  );

  const looksAnimations = sidebarAnimations.filter((animation) =>
    ["say", "think"].includes(animation.action.type)
  );

  return (
    <div className="w-60 flex-none h-full overflow-y-auto flex flex-col items-start p-2 border-r border-gray-200">
      <div className="font-bold mb-2 text-lg">Motion Blocks</div>
      <div className="text-xs text-gray-500 mb-2">
        Drag these blocks to the right area to create animations.
      </div>
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
            {motionAnimations.map((animation, index) => (
              <Animation
                key={animation.id}
                animation={animation}
                index={index}
              />
            ))}

            <div className="font-bold mt-6 mb-2 text-lg">Looks Blocks</div>
            <div className="text-xs text-gray-500 mb-2">
              Make your sprite communicate with others.
            </div>

            {looksAnimations.map((animation, index) => (
              <Animation
                key={animation.id}
                animation={animation}
                index={index + motionAnimations.length}
              />
            ))}

            {provided.placeholder}
            {!selectedSpriteId && (
              <div className="mt-4 text-sm text-gray-500 p-2 bg-gray-100 rounded">
                Select a sprite to add animations
              </div>
            )}
          </div>
        )}
      </Droppable>
    </div>
  );
}
