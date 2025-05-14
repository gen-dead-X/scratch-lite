import React, { createContext, useState } from "react";
import PropTypes from "prop-types";

const AnimationContext = createContext();

export function AnimationProvider({ children }) {
  const [characters, setCharacters] = useState([]);
  const [selectedSpriteId, setSelectedSpriteId] = useState(null);
  const [sidebarAnimations, setSidebarAnimations] = useState([
    { id: "1", label: "Move 10 steps", action: { type: "move", value: 10 } },
    { id: "2", label: "Turn 15 degrees", action: { type: "turn", value: 15 } },
    { id: "3", label: "Go to x: 0 y: 0", action: { type: "goto", x: 0, y: 0 } },
    {
      id: "4",
      label: "Repeat 10 times",
      action: { type: "repeat", count: 10 },
    },
  ]);
  const [midAreaAnimations, setMidAreaAnimations] = useState([]);

  const selectSprite = (id) => setSelectedSpriteId(id);

  const addCharacter = (character) => {
    setCharacters((prev) => [...prev, { ...character, animations: [] }]);
  };

  const addAnimationToCharacter = (spriteId, animation) => {
    setCharacters((prev) =>
      prev.map((char) =>
        char.id === spriteId
          ? { ...char, animations: [...char.animations, animation] }
          : char
      )
    );
  };

  const getAnimationsForSprite = (spriteId) => {
    const character = characters.find((char) => char.id === spriteId);
    return character ? character.animations : [];
  };

  const moveAnimation = (source, destination, animation) => {
    if (source === "sidebar" && destination === "midArea") {
      setSidebarAnimations((prev) =>
        prev.filter((anim) => anim.id !== animation.id)
      );
      setMidAreaAnimations((prev) => [...prev, animation]);
    } else if (source === "midArea" && destination === "sidebar") {
      setMidAreaAnimations((prev) =>
        prev.filter((anim) => anim.id !== animation.id)
      );
      setSidebarAnimations((prev) => [...prev, animation]);
    }
  };

  const contextValue = React.useMemo(
    () => ({
      characters,
      selectedSpriteId,
      selectSprite,
      addCharacter,
      addAnimationToCharacter,
      getAnimationsForSprite,
      sidebarAnimations,
      midAreaAnimations,
      moveAnimation,
    }),
    [characters, selectedSpriteId, sidebarAnimations, midAreaAnimations]
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
