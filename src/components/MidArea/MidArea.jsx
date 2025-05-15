import { useAnimationContext } from "../../context/useAnimationContext";
import { Droppable } from "react-beautiful-dnd";
import Animation from "../Animation/Animation";
import { useEffect } from "react";

export default function MidArea() {
  const { spriteAnimations, selectedSpriteId, resetSpriteAnimations } =
    useAnimationContext();

  useEffect(() => {
    console.log({ selectedSpriteId, animationCount: spriteAnimations.length });
  }, [spriteAnimations, selectedSpriteId]);

  return (
    <div className="flex-1 h-full overflow-auto flex flex-col">
      <div className="p-2 flex justify-between items-center bg-gray-200">
        <h2 className="font-bold text-lg">Sprite Animations</h2>
        {selectedSpriteId && (
          <button
            onClick={() => resetSpriteAnimations(selectedSpriteId)}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded"
          >
            Reset Animations
          </button>
        )}
      </div>
      <Droppable
        droppableId="midArea"
        isCombineEnabled={false}
        isDropDisabled={!selectedSpriteId}
        ignoreContainerClipping
      >
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="flex-1 overflow-auto bg-gray-100 p-4"
          >
            {selectedSpriteId ? (
              spriteAnimations?.length > 0 ? (
                <>
                  <div className="text-xs text-gray-500 mb-2">
                    Drag animations back to the left panel to remove them.
                  </div>
                  {spriteAnimations.map((animation, index) => (
                    <Animation
                      key={animation.id}
                      animation={animation}
                      index={index}
                    />
                  ))}
                </>
              ) : (
                <div className="text-center text-gray-500 mt-4">
                  Drag animations from the left panel to add them to this
                  sprite.
                </div>
              )
            ) : (
              <div className="text-center text-gray-500 mt-4">
                Please select a sprite to add animations
              </div>
            )}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
}
