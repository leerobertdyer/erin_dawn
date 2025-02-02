import { useNavigate } from "react-router-dom"
import { useProductManagementContext } from "../../Context/ProductMgmtContext";
import AdminButtonWrapper from "./AdminButtonWrapper";

interface IAdminButtons {
    handleEdit?: () => void
    addProduct?: boolean
    addPhotoToSeries?: () => void
    removePhotoFromSeries?: () => void
    onDelete? : () => void
    onKeyChange?: () => void
    moveProductLeft?: () => void
    moveProductRight?: () => void
}

export default function AdminButtons({ handleEdit, addProduct, addPhotoToSeries, removePhotoFromSeries, onDelete, onKeyChange, moveProductLeft, moveProductRight }: IAdminButtons) {
    const { setProduct } = useProductManagementContext();
    const navigate = useNavigate();

    function handleAddProduct() {
        setProduct({
            series: "",
            itemName: "",
            itemOrder: 0,
            price: 0,
            size: "",
            description: "",
            imageUrl: "",
            id: "",
            title: "",
            tags: [],
            stripePriceId: "",
            stripeProductId: ""
        })
        navigate('/add-product')
    }

    return (
        <div className="flex justify-center items-center w-full p-2 gap-4">
            {addProduct && <AdminButtonWrapper onclickFunction={handleAddProduct} content={"Add Product"} />}
            {onKeyChange && <AdminButtonWrapper onclickFunction={onKeyChange} content={"KEY"} />}
            {handleEdit && <AdminButtonWrapper onclickFunction={handleEdit} content={"Edit"} />}
            {moveProductLeft && <AdminButtonWrapper onclickFunction={moveProductLeft} content={"LEFT"} />}
            {moveProductRight && <AdminButtonWrapper onclickFunction={moveProductRight} content={"RIGHT"} />}
            {addPhotoToSeries && <AdminButtonWrapper onclickFunction={addPhotoToSeries} content={"SERIES"} />}
            {removePhotoFromSeries && <AdminButtonWrapper onclickFunction={removePhotoFromSeries} content={"REMOVE"} />}
            {onDelete && <AdminButtonWrapper onclickFunction={onDelete} content={"DELETE"} />}
        </div>
    )
}