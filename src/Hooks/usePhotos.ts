import { useEffect, useState } from "react";
import { IProductInfo } from "../Interfaces/IProduct";
import { getPhotos } from "../firebase/getPhotos";

export function usePhotos() {
    const [allPhotos, setAllPhotos] = useState<IProductInfo[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchPhotos() {
            const resp = await getPhotos({ tags: ["edc"], shuffle: false });
            if (resp) {
                setAllPhotos(resp);
                setIsLoading(false);
            }
        }

        fetchPhotos();
    }, []);

    return {
        allPhotos,
        isLoading,
        setAllPhotos,
    };
}