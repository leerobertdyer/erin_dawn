import { createContext, useContext, ReactNode } from 'react';
import { usePhotos } from '../Hooks/usePhotos';
import { IProductInfo } from '../Interfaces/IProduct';

interface PhotosContextType {
    allPhotos: IProductInfo[];
    setAllPhotos: (photos: IProductInfo[]) => void;
    isLoading: boolean;
}

const defaultValue: PhotosContextType = {
    allPhotos: [],
    setAllPhotos: (_: IProductInfo[]) => {},
    isLoading: true,
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

export function usePhotosContext() {
    return useContext(PhotosContext);
}