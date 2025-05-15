import React, { createContext, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { v4 as uuidv4 } from "uuid";
import { playCollisionSound } from "../utils/soundEffects";
import { trackAnimationExchange } from "../utils/statsTracking";

const AnimationContext = createContext();

const DEFAULT_ANIMATIONS = [
  { id: "1", label: "Move 10 steps", action: { type: "move", value: 10 } },
  { id: "2", label: "Turn 15 degrees", action: { type: "turn", value: 15 } },
  { id: "3", label: "Go to x: 0 y: 0", action: { type: "goto", x: 0, y: 0 } },
  {
    id: "4",
    label: "Repeat 10 times",
    action: { type: "repeat", count: 10 },
  },
  {
    id: "5",
    label: "Say hello for 5 seconds",
    action: { type: "say", text: "Hello!", duration: 5000 },
  },
  {
    id: "6",
    label: "Think for 5 seconds",
    action: { type: "think", text: "Hmm...", duration: 5000 },
  },
];

export function AnimationProvider({ children }) {
  const [sprites, setSprites] = useState([
    { id: uuidv4(), type: "cat", x: 150, y: 150, rotation: 0, animations: [] },
  ]);
  const [selectedSpriteId, setSelectedSpriteId] = useState(null);
  const [sidebarAnimations] = useState([...DEFAULT_ANIMATIONS]);
  const [spriteAnimations, setSpriteAnimations] = useState([]);
  const [collisionDetected, setCollisionDetected] = useState(false);
  const [heroEffect, setHeroEffect] = useState(false);
  const [collisionCount, setCollisionCount] = useState(0);

  useEffect(() => {
    if (sprites.length > 0 && !selectedSpriteId) {
      setSelectedSpriteId(sprites[0].id);
    }
  }, [sprites, selectedSpriteId]);

  useEffect(() => {
    if (selectedSpriteId) {
      const selectedSprite = sprites.find(
        (sprite) => sprite.id === selectedSpriteId
      );
      if (selectedSprite) {
        setSpriteAnimations(selectedSprite.animations || []);
      }
    }
  }, [selectedSpriteId, sprites]);

  const selectSprite = (id) => {
    setSelectedSpriteId(id);
  };

  const addSprite = (type) => {
    const newSprite = {
      id: uuidv4(),
      type,
      x: 150,
      y: 150,
      rotation: 0,
      animations: [],
    };
    setSprites((prev) => [...prev, newSprite]);
    return newSprite.id;
  };

  const resetSpriteAnimations = (spriteId) => {
    setSprites((prev) =>
      prev.map((sprite) =>
        sprite.id === spriteId ? { ...sprite, animations: [] } : sprite
      )
    );

    if (spriteId === selectedSpriteId) {
      setSpriteAnimations([]);
    }
  };

  const moveAnimation = (source, destination, animation) => {
    if (source === "sidebar" && destination === "midArea" && selectedSpriteId) {
      const newAnimation = { ...animation, id: uuidv4() };

      setSprites((prev) =>
        prev.map((sprite) =>
          sprite.id === selectedSpriteId
            ? { ...sprite, animations: [...sprite.animations, newAnimation] }
            : sprite
        )
      );

      setSpriteAnimations((prev) => [...prev, newAnimation]);
    } else if (
      source === "midArea" &&
      destination === "sidebar" &&
      selectedSpriteId
    ) {
      setSprites((prev) =>
        prev.map((sprite) =>
          sprite.id === selectedSpriteId
            ? {
                ...sprite,
                animations: sprite.animations.filter(
                  (anim) => anim.id !== animation.id
                ),
              }
            : sprite
        )
      );

      setSpriteAnimations((prev) =>
        prev.filter((anim) => anim.id !== animation.id)
      );
    }
  };

  const resetAllSprites = () => {
    setSprites((prev) =>
      prev.map((sprite) => ({
        ...sprite,
        x: 150,
        y: 150,
        rotation: 0,
      }))
    );

    setCollisionDetected(false);
    setHeroEffect(false);
  };

  const updateSpriteState = (id, newState) => {
    setSprites((prev) =>
      prev.map((sprite) =>
        sprite.id === id ? { ...sprite, ...newState } : sprite
      )
    );
  };

  const removeSprite = (id) => {
    setSprites((prev) => prev.filter((sprite) => sprite.id !== id));

    if (id === selectedSpriteId) {
      const remainingSprites = sprites.filter((sprite) => sprite.id !== id);
      if (remainingSprites.length > 0) {
        setSelectedSpriteId(remainingSprites[0].id);
      } else {
        setSelectedSpriteId(null);
      }
    }
  };

  const checkCollision = () => {
    if (sprites.length === 2) {
      const sprite1 = sprites[0];
      const sprite2 = sprites[1];

      const spriteWidth = 95;
      const spriteHeight = 100;

      const isColliding =
        sprite1.x < sprite2.x + spriteWidth &&
        sprite1.x + spriteWidth > sprite2.x &&
        sprite1.y < sprite2.y + spriteHeight &&
        sprite1.y + spriteHeight > sprite2.y;

      if (isColliding && !collisionDetected) {
        setCollisionDetected(true);
        setHeroEffect(true);
        setCollisionCount((prev) => prev + 1);

        setSprites((prev) => {
          const updatedSprites = [...prev];
          if (updatedSprites.length === 2) {
            const sprite1Animations = [...updatedSprites[0].animations];
            const sprite2Animations = [...updatedSprites[1].animations];

            updatedSprites[0].animations = sprite2Animations.map((anim) => ({
              ...anim,
              id: uuidv4(),
            }));

            updatedSprites[1].animations = sprite1Animations.map((anim) => ({
              ...anim,
              id: uuidv4(),
            }));

            trackAnimationExchange();
          }
          return updatedSprites;
        });

        if (window.navigator && window.navigator.vibrate) {
          window.navigator.vibrate([100, 50, 200]);
        }

        playCollisionSound();

        setTimeout(() => {
          setHeroEffect(false);
        }, 3000);

        setTimeout(() => {
          setCollisionDetected(false);
        }, 5000);
      } else if (!isColliding && collisionDetected) {
      }

      return isColliding;
    }

    return false;
  };

  const contextValue = React.useMemo(
    () => ({
      sprites,
      selectedSpriteId,
      selectSprite,
      addSprite,
      removeSprite,
      resetSpriteAnimations,
      resetAllSprites,
      sidebarAnimations,
      spriteAnimations,
      moveAnimation,
      updateSpriteState,
      collisionDetected,
      heroEffect,
      collisionCount,
      checkCollision,
    }),
    [
      sprites,
      selectedSpriteId,
      sidebarAnimations,
      spriteAnimations,
      moveAnimation,
      removeSprite,
      resetSpriteAnimations,
      collisionDetected,
      heroEffect,
      collisionCount,
      checkCollision,
    ]
  );

  return (
    <AnimationContext.Provider value={contextValue}>
      {children}
    </AnimationContext.Provider>
  );
}

AnimationProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export { AnimationContext };
