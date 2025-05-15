import React, { useState } from "react";
import Sprite from "../Sprite/Sprite";
import { useAnimationContext } from "../../context/useAnimationContext";

export default function PreviewArea() {
  const {
    sprites,
    selectedSpriteId,
    selectSprite,
    addSprite,
    resetAllSprites,
    updateSpriteState,
  } = useAnimationContext();
  const [isPlaying, setIsPlaying] = useState(false);

  const handleAddSprite = (type) => {
    const newSpriteId = addSprite(type);
    selectSprite(newSpriteId);
  };

  const handlePlay = async () => {
    if (isPlaying) return;
    setIsPlaying(true);

    const spriteStates = [...sprites];

    const maxAnimations = Math.max(
      ...spriteStates.map((sprite) => sprite.animations.length)
    );

    if (maxAnimations === 0) {
      setIsPlaying(false);
      return;
    }

    resetAllSprites();

    for (let step = 0; step < maxAnimations; step++) {
      for (const sprite of spriteStates) {
        const animation = sprite.animations[step];
        if (!animation) continue;

        const currentSprite = sprites.find((s) => s.id === sprite.id);
        if (!currentSprite) continue;

        let newState = { ...currentSprite };

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
              updateSpriteState(sprite.id, newState);
              await new Promise((resolve) => setTimeout(resolve, 100));

              newState = {
                ...newState,
                y: newState.y + 10,
              };
              updateSpriteState(sprite.id, newState);
              await new Promise((resolve) => setTimeout(resolve, 100));

              newState = {
                ...newState,
                x: newState.x - 10,
              };
              updateSpriteState(sprite.id, newState);
              await new Promise((resolve) => setTimeout(resolve, 100));

              newState = {
                ...newState,
                y: newState.y - 10,
              };
              updateSpriteState(sprite.id, newState);
              await new Promise((resolve) => setTimeout(resolve, 100));
            }
            break;
          }
          default: {
            console.log("Unknown animation type:", animation.action.type);
          }
        }

        updateSpriteState(sprite.id, newState);
      }

      await new Promise((resolve) => setTimeout(resolve, 500));
    }

    setIsPlaying(false);
  };

  return (
    <div className="flex-none h-full overflow-y-auto p-2 w-full relative flex flex-col">
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <button
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded disabled:bg-gray-400 disabled:cursor-not-allowed"
          onClick={handlePlay}
          disabled={
            isPlaying ||
            sprites.every((sprite) => sprite.animations.length === 0)
          }
        >
          {isPlaying ? "Playing..." : "▶ Play"}
        </button>

        <div className="flex gap-2 ml-4">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => handleAddSprite("cat")}
          >
            Add Cat
          </button>
          <button
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => handleAddSprite("green-cat")}
          >
            Add Green Cat
          </button>
          <button
            className="bg-blue-400 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
            onClick={() => handleAddSprite("blue-cat")}
          >
            Add Blue Cat
          </button>
        </div>
      </div>

      <div className="flex mb-4 flex-wrap gap-2">
        {sprites.map((sprite) => (
          <button
            key={sprite.id}
            className={`py-1 px-3 rounded ${
              selectedSpriteId === sprite.id
                ? "bg-blue-600 text-white"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
            onClick={() => selectSprite(sprite.id)}
          >
            {sprite.type
              .replace("-", " ")
              .replace(/(^\w{1})|(\s+\w{1})/g, (letter) =>
                letter.toUpperCase()
              )}
          </button>
        ))}
      </div>

      <div className="w-full flex-grow border border-gray-300 relative bg-white">
        {sprites.map((sprite) => (
          <Sprite key={sprite.id} sprite={sprite} />
        ))}
      </div>
    </div>
  );
}
