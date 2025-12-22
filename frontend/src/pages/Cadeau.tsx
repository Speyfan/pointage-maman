// src/pages/ChildrenPage.tsx
import cadeau from '../../img/IMG_2921.jpeg'

export default function Cadeau() {
  return (
    <div className="space-y-4">
      <img
        src={cadeau}
        alt="Votre super cadeau surprise"
        className="mx-auto mt-4 mb-2 w-100 h-auto rounded-2xl shadow-xl"
        />
    </div>
  );
}
