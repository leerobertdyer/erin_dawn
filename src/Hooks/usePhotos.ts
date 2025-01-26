import { useEffect, useState } from "react";
import { IProductInfo } from "../Interfaces/IProduct";
import { getPhotos } from "../firebase/getPhotos";

export function usePhotos() {
    const [allPhotos, setAllPhotos] = useState<IProductInfo[]>(() => {
        const savedPhotos = localStorage.getItem('allPhotos');
        return savedPhotos ? JSON.parse(savedPhotos) : [];
    });
    const [isLoading, setIsLoading] = useState(true);

    const cacheTime = import.meta.env.VITE_ENV === "development"
        ? 1000 // 1 second for testing
        : 1000 * 60 * 60 // 1 hour

    useEffect(() => {
        async function fetchPhotos() {
            const resp = await getPhotos({ tags: ["edc"], shuffle: false });
            if (resp) {
                setAllPhotos(resp);
                localStorage.setItem('allPhotos', JSON.stringify(resp));
                localStorage.setItem('lastFetch', Date.now().toString());
                if (resp.length > 0) {
                    setIsLoading(false);
                }
            }
        }
        if (
            allPhotos.length === 0 ||
            Date.now() - parseInt(localStorage.getItem('lastFetch') ?? "0") > cacheTime
        ) {
            fetchPhotos();
        } else {
            setIsLoading(false);
        }
    }, [allPhotos]);

    function handleSetAllPhotos(photos: IProductInfo[]) {
        setAllPhotos(photos);
        localStorage.setItem('allPhotos', JSON.stringify(photos));
    }

    return {
        allPhotos, handleSetAllPhotos,
        isLoading, setIsLoading,
    };
}