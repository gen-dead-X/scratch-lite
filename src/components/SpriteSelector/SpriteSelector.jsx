import React from "react";
import PropTypes from "prop-types";

export default function SpriteSelector({
  sprite,
  isSelected,
  onSelect,
  onRemove,
}) {
  return (
    <div className="flex items-center">
      <button
        className={`py-1 px-3 rounded transition-all duration-200 transform hover:scale-105 ${
          isSelected
            ? "bg-blue-600 text-white shadow-md"
            : "bg-gray-200 hover:bg-gray-300"
        }`}
        onClick={onSelect}
      >
        {sprite.type
          .replace("-", " ")
          .replace(/(^\w{1})|(\s+\w{1})/g, (letter) => letter.toUpperCase())}
        {isSelected && (
          <span className="ml-2 text-xs opacity-75">
            x:{Math.round(sprite.x)},y:{Math.round(sprite.y)}
          </span>
        )}
        {sprite.animations.length > 0 && (
          <span className="ml-1 bg-green-500 text-white text-xs px-1 rounded-full">
            {sprite.animations.length}
          </span>
        )}
      </button>
      <button
        className="ml-1 bg-red-500 hover:bg-red-700 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
        onClick={onRemove}
        title="Remove sprite"
      >
        ×
      </button>
    </div>
  );
}

SpriteSelector.propTypes = {
  sprite: PropTypes.shape({
    id: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
    animations: PropTypes.array.isRequired,
  }).isRequired,
  isSelected: PropTypes.bool.isRequired,
  onSelect: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
};
