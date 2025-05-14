import React from "react";
import { Draggable } from "react-beautiful-dnd";

export default function Animation({ animation, index }) {
  return (
    <Draggable draggableId={JSON.stringify(animation)} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className="flex flex-row flex-wrap bg-blue-500 text-white px-2 py-1 my-2 text-sm cursor-pointer"
        >
          {animation.label}
        </div>
      )}
    </Draggable>
  );
}
