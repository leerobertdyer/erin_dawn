import { useEffect, useState } from "react";
import { getPhotos } from "../firebase/getFiles";
import { IGeneralPhoto } from "../Interfaces/IPhotos";

export function usePhotos() {
    const [generalPhotos, setGeneralPhotos] = useState<IGeneralPhoto[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [photoToEdit, setPhotoToEdit] = useState<IGeneralPhoto | null>(null);

    useEffect(() => {
        async function fetchPhotos() {
            const resp = await getPhotos({ tags: ["edc"], shuffle: false });
            if (resp) {
                setGeneralPhotos(resp);
                setIsLoading(false);
            }
        }

        fetchPhotos();
    }, []);


    const handleEditPhoto = (Photo: IGeneralPhoto) => {
        setPhotoToEdit(Photo);
    }

    return {
        generalPhotos, setGeneralPhotos, 
        isLoading, setIsLoading,
        photoToEdit, setPhotoToEdit,
        handleEditPhoto
    };
}