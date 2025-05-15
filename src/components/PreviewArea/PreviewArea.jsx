import React, { useState, useEffect } from "react";
import Sprite from "../Sprite/Sprite";
import SpriteSelector from "../SpriteSelector/SpriteSelector";
import { useAnimationContext } from "../../context/useAnimationContext";
import HeroEffect from "../HeroEffect/HeroEffect";
import { trackAnimation } from "../../utils/statsTracking";

export default function PreviewArea() {
  const {
    sprites,
    selectedSpriteId,
    selectSprite,
    addSprite,
    removeSprite,
    resetAllSprites,
    updateSpriteState,
    checkCollision,
    collisionDetected,
    heroEffect,
    collisionCount,
  } = useAnimationContext();
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const collisionInterval = setInterval(() => {
      if (sprites.length === 2 && isPlaying) {
        checkCollision();
      }
    }, 100);

    return () => clearInterval(collisionInterval);
  }, [sprites, isPlaying, checkCollision]);

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

    const hasTwoSprites = sprites.length === 2;
    let collisionOccurred = false;

    for (let step = 0; step < maxAnimations; step++) {
      for (const sprite of spriteStates) {
        const animation = sprite.animations[step];
        if (!animation) continue;

        const currentSprite = sprites.find((s) => s.id === sprite.id);
        if (!currentSprite) continue;

        let newState = { ...currentSprite };

        if (hasTwoSprites && collisionDetected && !collisionOccurred) {
          collisionOccurred = true;

          await addShakeEffect(currentSprite);
        }

        switch (animation.action.type) {
          case "move": {
            trackAnimation("move");

            const radians = (newState.rotation * Math.PI) / 180;
            const totalDistance = animation.action.value;
            const stepSize = 1;
            const steps = Math.abs(totalDistance) / stepSize;
            const directionFactor = totalDistance >= 0 ? 1 : -1;

            for (let i = 0; i < steps; i++) {
              newState = {
                ...newState,
                x: newState.x + Math.cos(radians) * stepSize * directionFactor,
                y: newState.y + Math.sin(radians) * stepSize * directionFactor,
              };
              updateSpriteState(sprite.id, newState);
              await new Promise((resolve) => setTimeout(resolve, 30));
            }
            break;
          }
          case "turn": {
            trackAnimation("turn");

            const totalRotation = animation.action.value;
            const stepSize = 1;
            const steps = Math.abs(totalRotation) / stepSize;
            const directionFactor = totalRotation >= 0 ? 1 : -1;

            for (let i = 0; i < steps; i++) {
              newState = {
                ...newState,
                rotation: newState.rotation + stepSize * directionFactor,
              };
              updateSpriteState(sprite.id, newState);
              await new Promise((resolve) => setTimeout(resolve, 30));
            }
            break;
          }
          case "goto": {
            trackAnimation("goto");

            const targetX = animation.action.x + 150;
            const targetY = animation.action.y + 150;
            const startX = newState.x;
            const startY = newState.y;
            const dx = targetX - startX;
            const dy = targetY - startY;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const stepSize = 5;
            const steps = Math.ceil(distance / stepSize);

            if (steps > 0) {
              const xIncrement = dx / steps;
              const yIncrement = dy / steps;

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
          case "say": {
            trackAnimation("say");

            newState = {
              ...newState,
              speech: { text: animation.action.text },
            };
            updateSpriteState(sprite.id, newState);

            await new Promise((resolve) =>
              setTimeout(resolve, animation.action.duration || 5000)
            );

            newState = {
              ...newState,
              speech: null,
            };
            updateSpriteState(sprite.id, newState);
            break;
          }
          case "think": {
            trackAnimation("think");

            newState = {
              ...newState,
              thought: { text: animation.action.text },
            };
            updateSpriteState(sprite.id, newState);

            await new Promise((resolve) =>
              setTimeout(resolve, animation.action.duration || 5000)
            );

            newState = {
              ...newState,
              thought: null,
            };
            updateSpriteState(sprite.id, newState);
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

  const addShakeEffect = async (sprite) => {
    const originalX = sprite.x;
    const originalY = sprite.y;
    const shakeAmount = 5;

    for (let i = 0; i < 10; i++) {
      const offsetX = (Math.random() - 0.5) * shakeAmount * 2;
      const offsetY = (Math.random() - 0.5) * shakeAmount * 2;

      updateSpriteState(sprite.id, {
        ...sprite,
        x: originalX + offsetX,
        y: originalY + offsetY,
      });

      await new Promise((resolve) => setTimeout(resolve, 50));
    }

    updateSpriteState(sprite.id, {
      ...sprite,
      x: originalX,
      y: originalY,
    });

    return Promise.resolve();
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
          {isPlaying ? (
            <span className="flex items-center">
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Playing...
            </span>
          ) : (
            <span>▶ Play</span>
          )}
        </button>

        <button
          className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded disabled:bg-gray-400 disabled:cursor-not-allowed"
          onClick={resetAllSprites}
          disabled={isPlaying}
          title="Reset all sprites to their starting positions"
        >
          🔄 Reset Positions
        </button>

        <div className="flex gap-2 ml-4 border-l pl-4">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => handleAddSprite("cat")}
            title="Add a standard orange cat sprite"
          >
            Add Cat
          </button>
          <button
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => handleAddSprite("green-cat")}
            title="Add a green cat sprite"
          >
            Add Green Cat
          </button>
          <button
            className="bg-blue-400 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
            onClick={() => handleAddSprite("blue-cat")}
            title="Add a blue cat sprite"
          >
            Add Blue Cat
          </button>
        </div>
      </div>

      {sprites.length === 2 && (
        <div className="mb-2 text-xs bg-yellow-100 p-2 rounded border border-yellow-300">
          <span className="text-yellow-600 font-bold">
            💥 Collision Detection:
          </span>{" "}
          When these two sprites collide, their animations will swap and a HERO
          effect will appear!
          {collisionCount > 0 && (
            <span className="ml-2 bg-yellow-300 text-yellow-800 px-2 py-1 rounded-full text-xs font-bold">
              Collisions: {collisionCount}
            </span>
          )}
        </div>
      )}

      {sprites.length === 0 && (
        <div className="mb-2 text-xs bg-blue-100 p-2 rounded border border-blue-300">
          <span className="text-blue-600 font-bold">🐱 Getting Started:</span>{" "}
          Add sprites using the buttons above, then drag them to position!
        </div>
      )}

      {sprites.length === 1 && (
        <div className="mb-2 text-xs bg-green-100 p-2 rounded border border-green-300">
          <span className="text-green-600 font-bold">💡 Tip:</span> Add another
          sprite to enable collision detection!
        </div>
      )}

      <div className="flex mb-4 flex-wrap gap-2">
        {sprites.map((sprite) => (
          <SpriteSelector
            key={sprite.id}
            sprite={sprite}
            isSelected={selectedSpriteId === sprite.id}
            onSelect={() => selectSprite(sprite.id)}
            onRemove={() => handleRemoveSprite(sprite.id)}
          />
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

        {/* Simple stats display */}
        <div className="absolute bottom-2 left-2 text-xs text-gray-600 bg-white bg-opacity-75 p-1 rounded">
          <div className="flex flex-col">
            <span>Collisions: {collisionCount}</span>
            <span>Sprites: {sprites.length}</span>
          </div>
        </div>
      </div>

      {/* Hero effect overlay */}
      <HeroEffect show={heroEffect} />
    </div>
  );
}
