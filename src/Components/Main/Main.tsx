import { User } from "firebase/auth";
import Frame from "../Frame/Frame";
import AdminButtons from "../Buttons/AdminButtons";
import { useProductManagementContext } from "../../Context/ProductMgmtContext";
import { usePhotosContext } from "../../Context/PhotosContext";
import { useEffect, useState } from "react";
import { IProductInfo } from "../../Interfaces/IProduct";
import ProductForm from "../ProductForm/ProductForm";

export default function Main({ u }: { u: User | null }) {
    const { handleEdit, isEditing } = useProductManagementContext();
    const { allPhotos } = usePhotosContext();
    const [vintage, setVintage] = useState<IProductInfo>(
        {
            id: 'M2vdKSAHYtloXP15ahpd',
            imageUrl: "images/inventory/baroqueBlazer.jpg",
            title: "Embellished Vintage",
            tags: ["edc", "mainPageVintage"],
            series: "mainPageVintage",
            price: 0,
            description: "Embellished Vintage",
            stripePriceId: "",
            stripeProductId: "",
        });
    const [handMade, setHandMade] = useState<IProductInfo>(
        {
            imageUrl: "images/inventory/curtainDress.jpg",
            title: "Hand-Made Originals",
            tags: ["edc", "mainPageHandMade"],
            series: "mainPageHandMade",
            price: 0,
            description: "Hand-Made Originals",
            id: 'PegS4j5IeJtNS3hlDkjp',
            stripePriceId: "",
            stripeProductId: "",
        });

    useEffect(() => {
        const vintagePhoto = allPhotos.find(photo => photo.series === "mainPageVintage");
        const handMadePhoto = allPhotos.find(photo => photo.series === "mainPageHandMade");
        if (vintagePhoto) {
            setVintage(vintagePhoto)
        }
        if (handMadePhoto) {
            setHandMade(handMadePhoto)
        }
    }, [allPhotos])

    if (isEditing) { return <ProductForm /> }

    return (
        <div
            className="w-full h-fit
            bg-white bg-opacity-80 
            py-8 px-4 flex-wrap
            border-y-4 border-yellow-400 border-double border-opacity-40
            flex flex-col sm:flex-row justify-center items-center gap-[4rem] ">
            <div className="w-fit">
                <Frame additionalClass="w-[95vw] md:w-[45vw] lg:w-[35vw]" hover={true} >
                    <img src={vintage.imageUrl} alt="Embellished Vintage" className="rounded-md" />
                    <button className="text-center text-lg">{vintage.description}</button>
                    {u && <AdminButtons handleEdit={() => handleEdit(vintage.id)} />}
                </Frame>
            </div>
            <div className="w-fit">
                <Frame additionalClass="w-[95vw] md:w-[45vw] lg:w-[35vw]" hover={true} >
                    <img src={handMade.imageUrl} alt="Hand Made Clothing" className="rounded-md" />
                    <button className="text-center text-lg">{handMade.description}</button>
                    {u && <AdminButtons handleEdit={() => handleEdit(handMade.id)} />}
                </Frame>
            </div>
        </div>
    )
}