import { useEffect, useState } from "react";
import { ICarouselPhoto } from "../../Interfaces/IPhotos"
import { usePhotosContext } from "../../Context/PhotosContext";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

interface ICarouselParams {
    photos: ICarouselPhoto[];
    children: React.ReactNode;
    isMobile?: boolean;
}

export default function Carousel({ photos, children }: ICarouselParams) {
    const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
    const [loadedPhotos, setLoadedPhotos] = useState<ICarouselPhoto[]>([]);

    const { allPhotos } = usePhotosContext();

    useEffect(() => {
        // Load the first photo immediately
        setLoadedPhotos([photos[0]]);

        // Preload the rest of the images in the background
        photos.slice(1).forEach(photo => {
            const img = new Image();
            img.src = photo.url;
            img.onload = () => {
                setLoadedPhotos(prev => [...prev, photo]);
            };
        });
    }, [photos, allPhotos]);

    function handleClick(direction: "left" | "right") {
        direction === "left"
            ? setCurrentPhotoIndex((prev) => {
                return prev - 1 >= 0 ? prev - 1 : loadedPhotos.length - 1;
            })
            : setCurrentPhotoIndex((prev) => {
                return prev + 1 < loadedPhotos.length ? prev + 1 : 0;
            })
    }

    return (
        <div
            className="flex flex-col justify-center gap-4 h-full w-full relative max-w-[25rem] max-h-[30rem] select-none">
            {photos.length > 1 && <>
                <div
                    className="p-2 bg-black bg-opacity-15 rounded-md text-white absolute right-0 top-2">
                    {currentPhotoIndex + 1} / {loadedPhotos.length}
                </div>
                <div
                    className="flex justify-between items-center 
                w-full p-2
                hover:cursor-pointer
                absolute top-1/3">
                    <IoIosArrowBack onClick={() => handleClick("left")} size={30} className="text-white bg-black bg-opacity-15 rounded-md" />
                    <IoIosArrowForward onClick={() => handleClick("right")} size={30} className="text-white bg-black bg-opacity-15 rounded-md" />
                </div>
            </>}
            {loadedPhotos.length > 0 && loadedPhotos[currentPhotoIndex] && (
                <div className="rounded-md overflow-hidden">
                    <img src={loadedPhotos[currentPhotoIndex].url} alt={loadedPhotos[currentPhotoIndex].title}
                        className="h-full w-full object-cover object-center" />
                </div>
            )}
            {children}
        </div>
    );
}