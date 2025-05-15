import React, { useState } from "react";
import Sprite from "../Sprite/Sprite";
import { useAnimationContext } from "../../context/useAnimationContext";

export default function PreviewArea() {
  const {
    sprites,
    selectedSpriteId,
    selectSprite,
    addSprite,
    removeSprite,
    resetAllSprites,
    updateSpriteState,
  } = useAnimationContext();
  const [isPlaying, setIsPlaying] = useState(false);

  const handleAddSprite = (type) => {
    const newSpriteId = addSprite(type);
    selectSprite(newSpriteId);
  };

  const handleRemoveSprite = (id) => {
    if (window.confirm("Are you sure you want to remove this sprite?")) {
      removeSprite(id);
    }
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
            const totalDistance = animation.action.value;
            const stepSize = 1; // Move 1 pixel at a time for smoother animation
            const steps = Math.abs(totalDistance) / stepSize;
            const directionFactor = totalDistance >= 0 ? 1 : -1;

            // Staggered movement animation
            for (let i = 0; i < steps; i++) {
              newState = {
                ...newState,
                x: newState.x + Math.cos(radians) * stepSize * directionFactor,
                y: newState.y + Math.sin(radians) * stepSize * directionFactor,
              };
              updateSpriteState(sprite.id, newState);
              await new Promise((resolve) => setTimeout(resolve, 30)); // Short delay between steps
            }
            break;
          }
          case "turn": {
            const totalRotation = animation.action.value;
            const stepSize = 1; // Rotate 1 degree at a time for smoother animation
            const steps = Math.abs(totalRotation) / stepSize;
            const directionFactor = totalRotation >= 0 ? 1 : -1;

            // Staggered rotation animation
            for (let i = 0; i < steps; i++) {
              newState = {
                ...newState,
                rotation: newState.rotation + stepSize * directionFactor,
              };
              updateSpriteState(sprite.id, newState);
              await new Promise((resolve) => setTimeout(resolve, 30)); // Short delay between steps
            }
            break;
          }
          case "goto": {
            const targetX = animation.action.x + 150;
            const targetY = animation.action.y + 150;
            const startX = newState.x;
            const startY = newState.y;
            const dx = targetX - startX;
            const dy = targetY - startY;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const stepSize = 5; // Move in increments of 5 pixels
            const steps = Math.ceil(distance / stepSize);

            if (steps > 0) {
              const xIncrement = dx / steps;
              const yIncrement = dy / steps;

              // Staggered movement to target position
              for (let i = 0; i < steps; i++) {
                newState = {
                  ...newState,
                  x: startX + xIncrement * (i + 1),
                  y: startY + yIncrement * (i + 1),
                };
                updateSpriteState(sprite.id, newState);
                await new Promise((resolve) => setTimeout(resolve, 30));
              }
            }
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

        <button
          className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded disabled:bg-gray-400 disabled:cursor-not-allowed"
          onClick={resetAllSprites}
          disabled={isPlaying}
        >
          🔄 Reset Positions
        </button>

        <div className="flex gap-2 ml-4 border-l pl-4">
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
          <div key={sprite.id} className="flex items-center">
            <button
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
              {selectedSpriteId === sprite.id && (
                <span className="ml-2 text-xs opacity-75">
                  x:{Math.round(sprite.x)},y:{Math.round(sprite.y)}
                </span>
              )}
            </button>
            <button
              className="ml-1 bg-red-500 hover:bg-red-700 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
              onClick={() => handleRemoveSprite(sprite.id)}
              title="Remove sprite"
            >
              ×
            </button>
          </div>
        ))}
      </div>

      <div className="w-full flex-grow border border-gray-300 relative bg-white">
        {sprites.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center text-gray-400">
            Add sprites to get started
          </div>
        )}
        {sprites.map((sprite) => (
          <Sprite key={sprite.id} sprite={sprite} />
        ))}
        {sprites.length > 0 && (
          <div className="absolute bottom-2 right-2 text-xs text-gray-500 bg-white bg-opacity-75 p-1 rounded">
            <span role="img" aria-label="Drag hint">
              ✋
            </span>{" "}
            Drag to position sprites
          </div>
        )}
      </div>
    </div>
  );
}
