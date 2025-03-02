import CartItem from "../../Components/CartItem/CartItem";
import CheckoutButton from "../../Components/CheckoutButton/CheckoutButton";
import { useProductManagementContext } from "../../Context/ProductMgmtContext";

export default function Cart() {

    const { cartProducts } = useProductManagementContext();

    return (
        <div className="
        w-screen h-fit min-h-screen
        p-[2rem]
        flex flex-col items-center justify-start
        gap-4 bg-cover bg-center bg-no-repeat bg-fixed
        relative"
            style={{ backgroundImage: 'url(images/background.jpg)' }}>
            <div className="flex flex-col items-center justify-center gap-4 w-[13rem]">

                <div className="w-full h-fit bg-white p-2 border-2 border-black rounded-md text-center">
                    <p>Total: ${Number(cartProducts.reduce((acc, product) => acc + product.price, 0)).toFixed(2)}</p>
                </div>
                <CheckoutButton salesItems={cartProducts.map((item) => ({ id: item.id, quantity: 1, itemName: item.itemName, stripePriceId: item.stripePriceId, price: item.price }))} />
            </div>
            <div className="w-full h-fit flex flex-col items-center justify-start gap-4">

                {cartProducts.map((product, key) =>
                    <div key={key}
                        className="
                w-full md:w-[60vw] md:m-auto 
                bg-white p-2 m-2 bg-opacity-90
                border-2 border-black
                flex items-center justify-evenly 
                rounded-md gap-2">
                        <CartItem item={product} />
                    </div>
                )}
            </div>
        </div>
    )
}