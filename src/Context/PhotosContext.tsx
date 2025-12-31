import { createContext, useContext, ReactNode } from 'react';
import { usePhotos } from '../Hooks/usePhotos';
import { IGeneralPhoto } from '../Interfaces/IPhotos';

interface PhotosContextType {
    generalPhotos: IGeneralPhoto[];
    setGeneralPhotos: (photos: IGeneralPhoto[]) => void;
    photoToEdit: IGeneralPhoto | null;
    setPhotoToEdit: (photo: IGeneralPhoto | null) => void;
    isLoading: boolean;
    setIsLoading: (isLoading: boolean) => void;
    handleEditPhoto: (photo: IGeneralPhoto) => void;
}

const defaultValue: PhotosContextType = {
    generalPhotos: [],
    setGeneralPhotos: (_: IGeneralPhoto[]) => {},
    photoToEdit: null,
    setPhotoToEdit: (_: IGeneralPhoto | null) => {},
    isLoading: true,
    setIsLoading: (_: boolean) => {},
    handleEditPhoto: (_: IGeneralPhoto) => {},
};

const PhotosContext = createContext(defaultValue);

export function PhotosProvider({ children }: { children: ReactNode }) {
    const photos = usePhotos();
    return (
        <PhotosContext.Provider value={photos}>
            {children}
        </PhotosContext.Provider>
    );
}

/* eslint-disable react-refresh/only-export-components */
export function usePhotosContext() {
    return useContext(PhotosContext);
}