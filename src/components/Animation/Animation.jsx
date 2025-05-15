import React from "react";
import { Draggable } from "react-beautiful-dnd";

export default function Animation({ animation, index }) {
  const getBlockColor = () => {
    const type = animation.action.type;

    if (["move", "turn", "goto", "repeat"].includes(type)) {
      return "bg-blue-500 hover:bg-blue-600";
    }

    if (["say", "think"].includes(type)) {
      return "bg-purple-500 hover:bg-purple-600";
    }

    return "bg-blue-500 hover:bg-blue-600";
  };

  return (
    <Draggable draggableId={JSON.stringify(animation)} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`flex flex-row flex-wrap ${getBlockColor()} text-white px-2 py-1 my-2 text-sm cursor-pointer`}
        >
          {animation.label}
        </div>
      )}
    </Draggable>
  );
}
