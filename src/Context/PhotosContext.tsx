import { createContext, useContext, ReactNode } from 'react';
import { usePhotos } from '../Hooks/usePhotos';

interface PhotosContextType {
    allPhotos: any[];
    isLoading: boolean;
}

const defaultValue: PhotosContextType = {
    allPhotos: [],
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