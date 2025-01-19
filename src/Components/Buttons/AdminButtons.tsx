import { useNavigate } from "react-router-dom"
import { useProductManagementContext } from "../../Context/ProductMgmtContext";

interface IAdminButtons {
    handleEdit?: () => void
    addProduct?: boolean
}

export default function AdminButtons({ handleEdit, addProduct }: IAdminButtons) {
    const { setProduct } = useProductManagementContext();
    const navigate = useNavigate();

    function handleAddProduct() {
        setProduct({
            series: "",
            seriesOrder: 0,
            price: 0,
            description: "",
            imageUrl: "",
            id: "",
            title: "",
            tags: []
        })
        navigate('/admin')
    }
    return (
        <div className="flex justify-center items-center w-full p-2 gap-4">
            <button
                className="
                            transition:all duration-[10ms]
                            hover:bg-yellow-500 hover:text-black
                            bg-edcPurple-60 text-white px-2 rounded-md w-[100%]"
                onClick={
                    addProduct ? () => handleAddProduct() : handleEdit}>
                {addProduct ? "Add" : "Edit"}
            </button>
        </div>
    )
}