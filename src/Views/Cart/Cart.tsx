import { User } from "firebase/auth"
import { useEffect, useState } from "react";
import { getPhotos } from "../../firebase/getPhotos";
import { IProductInfo } from "../../Interfaces/IProduct";
import LoadPhotos from "../../Components/HeroPhotos/LoadPhotos";
import { useProductManagementContext } from "../../Context/ProductMgmtContext";



export default function Cart() {
    const { cartProducts } = useProductManagementContext();
    const [products, setProducts] = useState<IProductInfo[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchCart() {
            const resp = await getPhotos({ ids: cartProducts.map((p) => p.id), shuffle: false })
            if (resp) {
                setProducts(resp)
                setIsLoading(false)
            }
        }
        fetchCart();
    }, [])

    return (
        <div>
            {isLoading && <LoadPhotos />}
            {products.map((product, key) =>
                <div key={key} className="flex-grow-0 flex-shrink-0 w-[10rem] md:w-[12rem] lg:w-[14rem]">
                    {product.imageUrl}
                </div>
            )}
        </div>
    )
}