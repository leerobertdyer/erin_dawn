import AdminButtons from "../Buttons/AdminButtons";
import Frame from "../Frame/Frame";

export default function AddProductCard() {

    return (
        <Frame>
            <div className="h-fit md:h-[505px] flex flex-col justify-around items-center">
                <img src="/images/card.jpg" alt="Add a new product" className="rounded-md" />
                Add New Product
                <AdminButtons addProduct={true} />
            </div>
        </Frame>
    )
}