import { useNavigate } from "react-router-dom"
import { useProductManagementContext } from "../../Context/ProductMgmtContext";
import AdminButtonWrapper from "./AdminButtonWrapper";

interface IAdminButtons {
    handleEdit?: () => void
    addProduct?: boolean
    addPhotoToSeries?: () => void
    removePhotoFromSeries?: () => void
    onDelete? : () => void
}

export default function AdminButtons({ handleEdit, addProduct, addPhotoToSeries, removePhotoFromSeries, onDelete }: IAdminButtons) {
    const { setProduct } = useProductManagementContext();
    const navigate = useNavigate();

    function handleAddProduct() {
        setProduct({
            series: "",
            itemName: "",
            itemOrder: 0,
            price: 0,
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
            {handleEdit && <AdminButtonWrapper onclickFunction={handleEdit} content={"Edit"} />}
            {addPhotoToSeries && <AdminButtonWrapper onclickFunction={addPhotoToSeries} content={"SERIES"} />}
            {removePhotoFromSeries && <AdminButtonWrapper onclickFunction={removePhotoFromSeries} content={"REMOVE"} />}
            {onDelete && <AdminButtonWrapper onclickFunction={onDelete} content={"DELETE"} />}
        </div>
    )
}