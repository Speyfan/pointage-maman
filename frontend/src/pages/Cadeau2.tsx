// src/pages/ChildrenPage.tsx
import image1 from "../../img/Capture d'écran 2025-12-24 174154.png";
import image2 from "../../img/Capture d'écran 2025-12-24 174221.png";

export default function Cadeau2() {
  return (
    <div className="flex flex-col">
      <img
        src={image1}
        alt="Votre super cadeau surprise"
        className="mx-auto w-100 h-auto  shadow-xl block"
      />

      <img
        src={image2}
        alt="Votre super cadeau surprise"
        className="mx-auto w-100 h-auto shadow-xl block"
      />
    </div>
  );
}
