import { createContext, useContext, ReactNode } from 'react';
import { useProductManagement } from '../Hooks/useProductMgmt';

import { IProductToEdit, IProductInfo } from '../Interfaces/IProduct';

interface ProductManagementContextType {
    isEditing: boolean;
    isBatchEdit: boolean;
    product: IProductToEdit | null;
    cartProducts: IProductInfo[];
    setCartProducts: (products: IProductInfo[]) => void;
    updateProduct: (newProduct: IProductToEdit) => void;
    handleSetCartProducts: (products: IProductInfo[]) => void;
    handleEdit: (id: string) => void;
    handleDelete: (url: string, id: string) => void;
    handleBack: () => void;
    handleFinishEdit: () => void;
    }

const defaultValue: ProductManagementContextType = {
    isEditing: false,
    isBatchEdit: false,
    product: null,
    cartProducts: [], setCartProducts: () => {},
    updateProduct: () => {},
    handleSetCartProducts: () => {},
    handleEdit: () => {},
    handleDelete: () => {},
    handleBack: () => {},
    handleFinishEdit: () => {},
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