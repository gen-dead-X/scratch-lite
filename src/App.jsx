import Sidebar from "./components/Sidebar/Sidebar";
import MidArea from "./components/MidArea/MidArea";
import PreviewArea from "./components/PreviewArea/PreviewArea";

import { DragDropContext } from "react-beautiful-dnd";
import { useAnimationContext } from "./context/useAnimationContext";

export default function App() {
  const { moveAnimation } = useAnimationContext();

  const handleDragEnd = (result) => {
    const { source, destination, draggableId } = result;

    if (!destination) return;

    const animation = JSON.parse(draggableId);

    moveAnimation(source.droppableId, destination.droppableId, animation);
  };

  return (
    <div className="bg-blue-100 pt-6 font-sans">
      <div className="h-screen overflow-hidden flex flex-row  ">
        <div className="flex-1 h-screen overflow-hidden flex flex-row bg-white border-t border-r border-gray-200 rounded-tr-xl mr-2">
          <DragDropContext onDragEnd={handleDragEnd}>
            <Sidebar /> <MidArea />
          </DragDropContext>
        </div>
        <div className="w-1/3 h-screen overflow-hidden flex flex-row bg-white border-t border-l border-gray-200 rounded-tl-xl ml-2">
          <PreviewArea />
        </div>
      </div>
    </div>
  );
}
