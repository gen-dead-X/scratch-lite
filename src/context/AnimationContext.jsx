import React, { createContext, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { v4 as uuidv4 } from "uuid";

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
];

export function AnimationProvider({ children }) {
  const [sprites, setSprites] = useState([
    { id: uuidv4(), type: "cat", x: 150, y: 150, rotation: 0, animations: [] },
  ]);
  const [selectedSpriteId, setSelectedSpriteId] = useState(null);
  const [sidebarAnimations] = useState([...DEFAULT_ANIMATIONS]);
  const [spriteAnimations, setSpriteAnimations] = useState([]);

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
  };

  const updateSpriteState = (id, newState) => {
    setSprites((prev) =>
      prev.map((sprite) =>
        sprite.id === id ? { ...sprite, ...newState } : sprite
      )
    );
  };

  const contextValue = React.useMemo(
    () => ({
      sprites,
      selectedSpriteId,
      selectSprite,
      addSprite,
      resetSpriteAnimations,
      resetAllSprites,
      sidebarAnimations,
      spriteAnimations,
      moveAnimation,
      updateSpriteState,
    }),
    [sprites, selectedSpriteId, sidebarAnimations, spriteAnimations]
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
