import Sidebar from "./components/Sidebar/Sidebar";
import MidArea from "./components/MidArea/MidArea";
import PreviewArea from "./components/PreviewArea/PreviewArea";
import { AnimationProvider } from "./context/AnimationContext";
import { DragDropContext } from "react-beautiful-dnd";

export default function App() {
  const handleDragEnd = (result) => {
    const { source, destination, draggableId } = result;

    console.log("Drag result:", result);

    if (!destination) return; // If dropped outside a droppable area, do nothing

    if (
      source.droppableId === "sidebar" &&
      destination.droppableId === "midArea"
    ) {
      // Handle moving an animation from Sidebar to MidArea
      const animation = JSON.parse(draggableId); // Parse the animation data
      console.log("Dropped animation:", animation);
    }
  };

  return (
    <AnimationProvider>
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
    </AnimationProvider>
  );
}
