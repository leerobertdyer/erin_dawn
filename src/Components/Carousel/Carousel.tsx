import { useState } from "react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { IProductInfo } from "../../Interfaces/IProduct";
import SpinningCard from "../SpinningCard/SpinningCard";

interface ICarouselParams {
  product: IProductInfo;
  height?: string;
  width?: string;
  onClick?: (product: IProductInfo) => void;
}

export default function Carousel({
  product,
  height,
  width,
  onClick,
}: ICarouselParams) {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  function handleClick(direction: "left" | "right", e: React.MouseEvent) {
    e.stopPropagation();
    if (direction === "left")
      setCurrentPhotoIndex((prev) => {
        return prev - 1 >= 0 ? prev - 1 : product.photos.length - 1;
      });
    else
      setCurrentPhotoIndex((prev) => {
        return prev + 1 < product.photos.length ? prev + 1 : 0;
      });
  }

  return (
    <div
      className={`flex flex-col justify-center items-center gap-4 relative select-none w-full hover:cursor-pointer `}
      onClick={() => onClick?.(product)}
    >
      {/* Show arrows and count if more than one photo */}
      {product.photos.length > 1 && (
        <div className="w-full ">
          <div
            className={`p-2 bg-black bg-opacity-45 rounded-tl-md rounded-br-md text-white absolute top-4 left-1/2 -translate-x-1/2 z-10 text-[.5rem] `}
          >
            {currentPhotoIndex + 1} / {product.photos.length}
          </div>
          <div
            className="flex justify-between items-center
                w-full
                hover:cursor-pointer
                absolute top-4 z-[100]"
          >
            <IoIosArrowBack
              onClick={(e) => handleClick("left", e)}
              size={30}
              className="text-white bg-black bg-opacity-35 rounded-md"
            />
            <IoIosArrowForward
              onClick={(e) => handleClick("right", e)}
              size={30}
              className="text-white bg-black bg-opacity-35 rounded-md"
            />
          </div>
        </div>
      )}

      {/* Product image carousel */}
      {product.photos.length > 0 && (
        <div
          className={`${height ?? "h-full"} ${
            width ?? "w-full"
          } rounded-md overflow-hidden border-2 border-black relative`}
        >
          {product.hidden && (
            <div className="absolute inset-0 bg-black bg-opacity-50 z-10 flex justify-center items-center text-white text-2xl">
              Hidden
            </div>
          )}
          <SpinningCard photo={product.photos[currentPhotoIndex]} />
        </div>
      )}
    </div>
  );
}
