import { useEffect, useState } from "react";
import { ICarouselPhoto } from "../../Interfaces/IPhotos"
import { usePhotosContext } from "../../Context/PhotosContext";

interface ICarouselParams {
    photos: ICarouselPhoto[];
    children: React.ReactNode;
}

export default function Carousel({ photos, children }: ICarouselParams) {
    const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
    const [isSpinning, setIsSpinning] = useState(false);
    const [loadedPhotos, setLoadedPhotos] = useState<ICarouselPhoto[]>([]);
    const [isFirstSpin, setIsFirstSpin] = useState(true);
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

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isSpinning && loadedPhotos.length > 1) {
            if (isFirstSpin) {
                setIsFirstSpin(false);
                setCurrentPhotoIndex(1);
            }
            interval = setInterval(() => {
                setCurrentPhotoIndex((prev) => { return prev + 1 < loadedPhotos.length ? prev + 1 : 0 });
            }, 1000);
            return () => {
                clearInterval(interval);
                setCurrentPhotoIndex(0);
                setIsSpinning(false);
                setIsFirstSpin(true);
            }
        }
        return () => {if (interval) clearInterval(interval)};
    }, [loadedPhotos, isSpinning]);

    function handleMouseEnter() {
        if (loadedPhotos.length > 1) {
            setIsSpinning(true);
        }
    }

    function handleMouseLeave() {
        setCurrentPhotoIndex(0);
        setIsSpinning(false);
    }

    return (
        <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} className="flex flex-col justify-between h-full w-full">
            {loadedPhotos.length > 0 && loadedPhotos[currentPhotoIndex] && (
                <div className="w-full h-[65%] rounded-md overflow-hidden">
                <img src={loadedPhotos[currentPhotoIndex].url} alt={loadedPhotos[currentPhotoIndex].title}
                className="h-full w-full object-cover object-center"/>
                </div>
            )}
            {children}
        </div>
    );
}