import { createContext, useContext, ReactNode } from 'react';
import { useProductManagement } from '../Hooks/useProductMgmt';

import { IProductInfo } from '../Interfaces/IProduct';
import { IGeneralPhoto } from '../Interfaces/IPhotos';
import { ICategory } from '../Interfaces/ICategory';
import { IHero } from '../Interfaces/IHero';

interface ProductManagementContextType {
    isEditing: boolean;
    setIsEditing: (isEditing: boolean) => void;
    productToEdit: IProductInfo | null;
    setProductToEdit: (product: IProductInfo | null) => void;
    cartProducts: IProductInfo[];
    setCartProducts: (products: IProductInfo[]) => void;
    handleEditProduct: (product: IProductInfo) => void;
    handleDeletePhoto: (product: IProductInfo, photo: IGeneralPhoto) => Promise<boolean>; 
    previousUrl: string;
    setPreviousUrl: (url: string) => void;
    allProducts: IProductInfo[];
    setAllProducts: (products: IProductInfo[]) => void;
    filteredInventory: IProductInfo[];
    setFilteredInventory: (products: IProductInfo[]) => void;
    allCategories: ICategory[];
    setAllCategories: (categories: ICategory[]) => void;
    handleDeleteProduct: (product: IProductInfo) => void;
    heroPhotos: IHero[];
    setHeroPhotos: (photos: IHero[]) => void;
}

const defaultValue: ProductManagementContextType = {
    isEditing: false,
    setIsEditing: () => {},
    productToEdit: null,
    setProductToEdit: () => {},
    cartProducts: [], setCartProducts: () => {},
    handleEditProduct: () => {},
    handleDeletePhoto: async () => {return false},
    previousUrl: '/',
    setPreviousUrl: () => {},
    allProducts: [],
    setAllProducts: () => {},
    filteredInventory: [],
    setFilteredInventory: () => {},
    allCategories: [],
    setAllCategories: () => {},
    handleDeleteProduct: () => {},
    heroPhotos: [],
    setHeroPhotos: () => {},
};

const ProductManagementContext = createContext<ProductManagementContextType>(defaultValue);

export function ProductManagementProvider({ children }: { children: ReactNode }) {
    const productManagement = useProductManagement();
    return (
        <ProductManagementContext.Provider value={productManagement}>
            {children}
        </ProductManagementContext.Provider>
    );
}

export function useProductManagementContext() {
    return useContext(ProductManagementContext);
}