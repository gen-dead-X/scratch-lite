import { useAnimationContext } from "../../context/useAnimationContext";
import { Droppable } from "react-beautiful-dnd";
import Animation from "../Animation/Animation";

export default function Sidebar() {
  const { sidebarAnimations } = useAnimationContext();

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
            {sidebarAnimations.map((animation, index) => (
              <Animation
                key={animation.id}
                animation={animation}
                index={index}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
}
