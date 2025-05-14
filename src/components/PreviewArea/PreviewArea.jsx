import React, { useState } from "react";
import CatSprite from "../CatSprite/CatSprite";
import { useAnimationContext } from "../../context/useAnimationContext";

export default function PreviewArea() {
  const [spriteState, setSpriteState] = useState({
    x: 150,
    y: 150,
    rotation: 0,
  });
  const { midAreaAnimations } = useAnimationContext();
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlay = async () => {
    if (isPlaying) return;

    setIsPlaying(true);
    let newState = { ...spriteState };

    for (const animation of midAreaAnimations) {
      switch (animation.action.type) {
        case "move": {
          const radians = (newState.rotation * Math.PI) / 180;
          newState = {
            ...newState,
            x: newState.x + Math.cos(radians) * animation.action.value,
            y: newState.y + Math.sin(radians) * animation.action.value,
          };
          break;
        }
        case "turn": {
          newState = {
            ...newState,
            rotation: newState.rotation + animation.action.value,
          };
          break;
        }
        case "goto": {
          newState = {
            ...newState,
            x: animation.action.x + 150,
            y: animation.action.y + 150,
          };
          break;
        }
        case "repeat": {
          const count = animation.action.count || 1;

          for (let i = 0; i < count; i++) {
            newState = {
              ...newState,
              x: newState.x + 10,
            };
            setSpriteState(newState);
            await new Promise((resolve) => setTimeout(resolve, 100));

            newState = {
              ...newState,
              y: newState.y + 10,
            };
            setSpriteState(newState);
            await new Promise((resolve) => setTimeout(resolve, 100));

            newState = {
              ...newState,
              x: newState.x - 10,
            };
            setSpriteState(newState);
            await new Promise((resolve) => setTimeout(resolve, 100));

            newState = {
              ...newState,
              y: newState.y - 10,
            };
            setSpriteState(newState);
            await new Promise((resolve) => setTimeout(resolve, 100));
          }
          break;
        }
        default: {
          console.log("Unknown animation type:", animation.action.type);
        }
      }

      setSpriteState(newState);
      await new Promise((resolve) => setTimeout(resolve, 500));
    }

    setIsPlaying(false);
  };

  return (
    <div className="flex-none h-full overflow-y-auto p-2 w-full relative">
      <div className="mb-4">
        <button
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          onClick={handlePlay}
          disabled={isPlaying || midAreaAnimations.length === 0}
        >
          {isPlaying ? "Playing..." : "▶ Play"}
        </button>
      </div>
      <div className="w-full h-[400px] border border-gray-300 relative">
        <CatSprite
          x={spriteState.x}
          y={spriteState.y}
          rotation={spriteState.rotation}
        />
      </div>
    </div>
  );
}
