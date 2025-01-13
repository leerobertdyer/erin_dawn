import { IProductToEdit } from "./IProduct"

export interface IProductMgmt {
    handleBack: () => void
    handleEdit: (id: string) => void
    isEditing: boolean
    isBatchEdit: boolean
    product: IProductToEdit | null
    updateProduct: (product: IProductToEdit) => void
    handleDelete: (url: string, id: string) => void
    handleFinishEdit: () => void
}