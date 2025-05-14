import CatSprite from "../CatSprite/CatSprite";
import { useAnimationContext } from "../../context/useAnimationContext";

export default function PreviewArea() {
  const { selectedSpriteId, addAnimationToCharacter } = useAnimationContext();

  const handleDrop = (animation) => {
    if (selectedSpriteId) {
      addAnimationToCharacter(selectedSpriteId, animation);
    }
  };

  return (
    <div
      className="flex-none h-full overflow-y-auto p-2 w-full"
      onDrop={(e) => {
        const animation = JSON.parse(e.dataTransfer.getData("animation"));
        handleDrop(animation);
      }}
      onDragOver={(e) => e.preventDefault()}
    >
      <CatSprite />
    </div>
  );
}
