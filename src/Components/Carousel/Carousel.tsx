import { useEffect, useState } from "react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { imageHeight } from "../../util/constants";
import { IProductInfo } from "../../Interfaces/IProduct";

interface ICarouselParams {
    product: IProductInfo;
    children: React.ReactNode;
    isMobile?: boolean;
}

export default function Carousel({ product, children }: ICarouselParams) {
    const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
    const [imageLoading, setImageLoading] = useState(true);
    const placeholderImage = "/images/card.jpg";
    
    // Reset loading state when changing images
    useEffect(() => {
        setImageLoading(true);
    }, [currentPhotoIndex]);

    function handleClick(direction: "left" | "right") {
        direction === "left"
            ? setCurrentPhotoIndex((prev) => {
                return prev - 1 >= 0 ? prev - 1 : product.photos.length - 1;
            })
            : setCurrentPhotoIndex((prev) => {
                return prev + 1 < product.photos.length ? prev + 1 : 0;
            })
    }

    return (
        <div
            className="flex flex-col justify-center gap-4 h-full w-full relative select-none">
            {product.photos.length > 1 && <>
                <div
                    className={`p-2 bg-black bg-opacity-35 rounded-md text-white absolute right-4 top-4 z-10`}>
                    {currentPhotoIndex + 1} / {product.photos.length}
                </div>
                <div
                    className="flex justify-between items-center 
                w-full p-2
                hover:cursor-pointer
                absolute top-1/4 z-10">
                    <IoIosArrowBack onClick={() => handleClick("left")} size={30} className="text-white bg-black bg-opacity-35 rounded-md" />
                    <IoIosArrowForward onClick={() => handleClick("right")} size={30} className="text-white bg-black bg-opacity-35 rounded-md" />
                </div>
            </>}
            {product.photos.length > 0  && (
                <div className={`w-full h-full ${imageHeight} rounded-md overflow-hidden border-2 border-black relative`}>
                    {product.hidden && (
                        <div className="absolute inset-0 bg-black bg-opacity-50 z-10 flex justify-center items-center text-white text-2xl">Hidden</div>
                    )}
                    
                    {/* Placeholder image shown while loading */}
                    {imageLoading && (
                        <img 
                            src={placeholderImage} 
                            alt="Loading..." 
                            className="w-full h-full object-cover object-center absolute inset-0"
                        />
                    )}
                    
                    {/* Actual product image with onLoad handler */}
                    <img 
                        src={product.photos[currentPhotoIndex].url} 
                        alt={product.title}
                        className={`w-full h-full object-cover object-center ${imageLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
                        onLoad={() => setImageLoading(false)}
                        onError={() => setImageLoading(false)} // In case image fails to load
                    />
                </div>
            )}
            {children}
        </div>
    );
}