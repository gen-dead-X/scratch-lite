import React, { createContext, useState, useContext } from "react";

const AnimationContext = createContext();

export function AnimationProvider({ children }) {
  const [characters, setCharacters] = useState([]);
  const [selectedSpriteId, setSelectedSpriteId] = useState(null);

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

  return (
    <AnimationContext.Provider
      value={{
        characters,
        selectedSpriteId,
        selectSprite,
        addCharacter,
        addAnimationToCharacter,
        getAnimationsForSprite,
      }}
    >
      {children}
    </AnimationContext.Provider>
  );
}

export function useAnimationContext() {
  return useContext(AnimationContext);
}
