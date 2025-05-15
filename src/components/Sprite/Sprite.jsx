import React from "react";
import PropTypes from "prop-types";
import CatSprite from "../CatSprite/CatSprite";
import CatSpriteGreen from "../CatSpriteGreen/CatSpriteGreen";
import CatSpriteBlue from "../CatSpriteBlue/CatSpriteBlue";

export default function Sprite({ sprite }) {
  const { type, x, y, rotation } = sprite;

  switch (type) {
    case "cat":
      return <CatSprite x={x} y={y} rotation={rotation} />;
    case "green-cat":
      return <CatSpriteGreen x={x} y={y} rotation={rotation} />;
    case "blue-cat":
      return <CatSpriteBlue x={x} y={y} rotation={rotation} />;
    default:
      return <CatSprite x={x} y={y} rotation={rotation} />;
  }
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
