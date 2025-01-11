import { User } from "firebase/auth"
import { useEffect, useState } from "react";
import { getPhotos } from "../../firebase/getPhotos";
import { IProductInfo } from "../../Interfaces/IProduct";

interface iParams {
    u: User | null
    cartIds: string[]
}

export default function Cart({ u, cartIds }: iParams) {
    const [products, setProducts] = useState<IProductInfo[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchCart() {
            const resp = await getPhotos({ ids: cartIds, shuffle: false })
            if (resp) {
                setProducts(resp)
                setIsLoading(false)
            }
        }
        fetchCart();
    }, [])

    return (
        <div>
            CART
        </div>
    )
}