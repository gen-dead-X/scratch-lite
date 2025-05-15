import React, { useState, useRef, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import CatSprite from "../CatSprite/CatSprite";
import CatSpriteGreen from "../CatSpriteGreen/CatSpriteGreen";
import CatSpriteBlue from "../CatSpriteBlue/CatSpriteBlue";
import { useAnimationContext } from "../../context/useAnimationContext";

const SpeechBubble = ({ text, x, y }) => (
  <div
    style={{
      position: "absolute",
      top: y - 80,
      left: x + 40,
      backgroundColor: "white",
      padding: "8px 12px",
      borderRadius: "15px",
      border: "2px solid #333",
      maxWidth: "150px",
      zIndex: 20,
      filter: "drop-shadow(2px 2px 2px rgba(0,0,0,0.2))",
    }}
  >
    <div
      style={{
        position: "absolute",
        bottom: "-10px",
        left: "15px",
        width: "20px",
        height: "20px",
        backgroundColor: "white",
        border: "2px solid #333",
        borderTop: "none",
        borderLeft: "none",
        transform: "rotate(45deg)",
        zIndex: 19,
      }}
    />
    <p
      style={{ margin: 0, fontSize: "14px", zIndex: 21, position: "relative" }}
    >
      {text}
    </p>
  </div>
);

const ThoughtBubble = ({ text, x, y }) => (
  <div
    style={{
      position: "absolute",
      top: y - 90,
      left: x + 40,
      backgroundColor: "white",
      padding: "8px 12px",
      borderRadius: "20px",
      border: "2px solid #333",
      maxWidth: "150px",
      zIndex: 20,
      filter: "drop-shadow(2px 2px 2px rgba(0,0,0,0.2))",
    }}
  >
    <div
      style={{
        position: "absolute",
        bottom: "-25px",
        left: "15px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <div
        style={{
          width: "12px",
          height: "12px",
          backgroundColor: "white",
          borderRadius: "50%",
          border: "2px solid #333",
          margin: "2px 0",
        }}
      />
      <div
        style={{
          width: "8px",
          height: "8px",
          backgroundColor: "white",
          borderRadius: "50%",
          border: "2px solid #333",
        }}
      />
    </div>
    <p style={{ margin: 0, fontSize: "14px", fontStyle: "italic" }}>{text}</p>
  </div>
);

export default function Sprite({ sprite }) {
  const { type, x, y, rotation, id } = sprite;
  const {
    updateSpriteState,
    selectedSpriteId,
    selectSprite,
    collisionDetected,
  } = useAnimationContext();
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const spriteRef = useRef(null);
  const isSelected = selectedSpriteId === id;

  const handleMouseDown = useCallback(
    (e) => {
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

        const minX = 0;
        const minY = 0;
        const maxX = containerRect.width - 95;
        const maxY = containerRect.height - 100;

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
        transition: collisionDetected ? "none" : "transform 0.2s ease-in-out",
        transform: collisionDetected
          ? `scale(1.1) rotate(${Math.random() > 0.5 ? "10deg" : "-10deg"})`
          : "scale(1)",
      }}
      className={`${collisionDetected ? "animate-shake" : ""}`}
    >
      <div className={`${collisionDetected ? "animate-pulse relative" : ""}`}>
        <SpriteComponent x={x} y={y} rotation={rotation} />
        {collisionDetected && (
          <div
            style={{
              position: "absolute",
              top: y - 5,
              left: x - 5,
              width: "105px",
              height: "110px",
              pointerEvents: "none",
              borderRadius: "5px",
              border: "2px solid red",
              opacity: 0.7,
              animation: "flash 0.5s infinite alternate",
            }}
          />
        )}
      </div>
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
      {sprite.speech && <SpeechBubble text={sprite.speech.text} x={x} y={y} />}
      {sprite.thought && (
        <ThoughtBubble text={sprite.thought.text} x={x} y={y} />
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
    speech: PropTypes.shape({
      text: PropTypes.string.isRequired,
    }),
    thought: PropTypes.shape({
      text: PropTypes.string.isRequired,
    }),
  }).isRequired,
};
