import { createContext, useContext, ReactNode } from 'react';
import { useProductManagement } from '../Hooks/useProductMgmt';

import { IProductInfo } from '../Interfaces/IProduct';

interface ProductManagementContextType {
    isEditing: boolean;
    setIsEditing: (isEditing: boolean) => void;
    isBatchEdit: boolean;
    setIsBatchEdit: (isBatchEdit: boolean) => void;
    product: IProductInfo | null;
    setProduct: (product: IProductInfo | null) => void;
    cartProducts: IProductInfo[];
    setCartProducts: (products: IProductInfo[]) => void;
    handleEdit: (id: string) => void;
    handleDelete: (url: string, id: string) => void;
    handleBack: () => void;
    previousUrl: string;
    setPreviousUrl: (url: string) => void;
    setFilteredInventory: (inventory: IProductInfo[]) => void;
    filteredInventory: IProductInfo[];
    }

const defaultValue: ProductManagementContextType = {
    isEditing: false,
    setIsEditing: () => {},
    setIsBatchEdit: () => {},
    isBatchEdit: false,
    product: null,
    setProduct: () => {},
    cartProducts: [], setCartProducts: () => {},
    handleEdit: () => {},
    handleDelete: () => {},
    handleBack: () => {},
    previousUrl: '/',
    setPreviousUrl: () => {},
    setFilteredInventory: () => {},
    filteredInventory: []
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