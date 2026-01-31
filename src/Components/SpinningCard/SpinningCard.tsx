import { useEffect, useState } from "react";
import { IGeneralPhoto } from "../../Interfaces/IPhotos";

export default function SpinningCard({ photo }: { photo: IGeneralPhoto }) {
  const [isFlipped, setIsFlipped] = useState(false);

  function spinCard(photo: IGeneralPhoto) {
    const randomTime = Math.floor(Math.random() * 2000);
    setTimeout(() => {
      photo.hidden = !photo.hidden;
      setIsFlipped(!isFlipped);
    }, randomTime);
  }

  useEffect(() => {
    setIsFlipped(false);
  }, [photo]);

  return (
    <>
      {/* Card container with perspective */}
      <div className={`relative w-full h-full [perspective:1000px]`}>
        {/* Card that flips */}
        <div
          className={`relative w-full h-full transition-transform duration-700 [transform-style:preserve-3d] ${
            !isFlipped ? "[transform:rotateY(180deg)]" : ""
          }`}
        >
          {/* Front face (Card) */}
          <div className="absolute w-full h-full [backface-visibility:hidden]">
            <img
              src={photo.url}
              alt={photo.title ?? "Product image"}
              className="rounded-md h-full w-full object-cover object-center"
              loading="lazy"
              onLoad={() => spinCard(photo)}
            />
          </div>

          {/* Back face (Card) */}
          <div className="w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)] relative">
            <img
              src="/images/card.jpg"
              alt="Decorative card"
              className="rounded-md h-full w-full object-cover object-center"
              loading="lazy"
            />

          </div>
        </div>
      </div>
    </>
  );
}
