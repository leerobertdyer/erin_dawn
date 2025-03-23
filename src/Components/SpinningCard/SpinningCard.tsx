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
              alt="Card"
              className="rounded-md h-full w-full object-cover object-center"
              onLoad={() => spinCard(photo)}
            />
          </div>

          {/* Back face (Card) */}
          <div className="w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)] relative">
            <img
              src="/images/card.jpg"
              alt="Card"
              className="rounded-md h-full w-full object-cover object-center"
            />
            {/* Centered recycling icon */}
            <div className="absolute inset-0 w-full h-full rounded-full flex z-[20] items-start mt-[2.75rem] ml-[.25rem] bg-opacity-0 justify-center">
              <div className="w-16 h-16 rounded-full overflow-hidden">
                <img
                  src="/images/recycle.gif"
                  alt="Loading"
                  className="w-full h-full"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
