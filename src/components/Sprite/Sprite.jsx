import React, { useState, useRef, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import CatSprite from "../CatSprite/CatSprite";
import CatSpriteGreen from "../CatSpriteGreen/CatSpriteGreen";
import CatSpriteBlue from "../CatSpriteBlue/CatSpriteBlue";
import { useAnimationContext } from "../../context/useAnimationContext";

export default function Sprite({ sprite }) {
  const { type, x, y, rotation, id } = sprite;
  const { updateSpriteState, selectedSpriteId, selectSprite } =
    useAnimationContext();
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const spriteRef = useRef(null);
  const isSelected = selectedSpriteId === id;

  const handleMouseDown = useCallback(
    (e) => {
      // If we click on a sprite, select it
      if (!isSelected) {
        selectSprite(id);
      }

      if (spriteRef.current) {
        const rect = spriteRef.current.getBoundingClientRect();
        setDragOffset({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        });
        setIsDragging(true);
      }
    },
    [id, isSelected, selectSprite]
  );

  const handleMouseMove = useCallback(
    (e) => {
      if (isDragging && spriteRef.current) {
        const containerRect =
          spriteRef.current.parentElement.getBoundingClientRect();
        let newX = e.clientX - containerRect.left - dragOffset.x;
        let newY = e.clientY - containerRect.top - dragOffset.y;

        // Make sure sprite stays within the container
        const minX = 0;
        const minY = 0;
        const maxX = containerRect.width - 95; // approximate width of sprite
        const maxY = containerRect.height - 100; // approximate height of sprite

        newX = Math.max(minX, Math.min(newX, maxX));
        newY = Math.max(minY, Math.min(newY, maxY));

        updateSpriteState(id, { ...sprite, x: newX, y: newY });
      }
    },
    [isDragging, dragOffset, id, sprite, updateSpriteState]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    } else {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  const SpriteComponent = (() => {
    switch (type) {
      case "cat":
        return CatSprite;
      case "green-cat":
        return CatSpriteGreen;
      case "blue-cat":
        return CatSpriteBlue;
      default:
        return CatSprite;
    }
  })();

  return (
    <div
      ref={spriteRef}
      onMouseDown={handleMouseDown}
      style={{
        cursor: isDragging ? "grabbing" : "grab",
        position: "absolute",
        left: 0,
        top: 0,
        zIndex: isSelected ? 10 : 1,
      }}
    >
      <SpriteComponent x={x} y={y} rotation={rotation} />
      {isSelected && (
        <div
          style={{
            position: "absolute",
            border: "2px dashed #3366ff",
            borderRadius: "5px",
            top: y - 5,
            left: x - 5,
            width: "105px",
            height: "110px",
            pointerEvents: "none",
            boxShadow: "0 0 5px rgba(0, 102, 255, 0.5)",
          }}
        />
      )}
    </div>
  );
}

Sprite.propTypes = {
  sprite: PropTypes.shape({
    id: PropTypes.string.isRequired,
    type: PropTypes.oneOf(["cat", "green-cat", "blue-cat"]).isRequired,
    x: PropTypes.number,
    y: PropTypes.number,
    rotation: PropTypes.number,
  }).isRequired,
};

Sprite.propTypes = {
  sprite: PropTypes.shape({
    id: PropTypes.string.isRequired,
    type: PropTypes.oneOf(["cat", "green-cat", "blue-cat"]).isRequired,
    x: PropTypes.number,
    y: PropTypes.number,
    rotation: PropTypes.number,
  }).isRequired,
};
