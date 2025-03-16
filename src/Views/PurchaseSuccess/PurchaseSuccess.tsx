import { Link, useLocation } from "react-router-dom";
import { useProductManagementContext } from "../../Context/ProductMgmtContext";
import { IProductInfo } from "../../Interfaces/IProduct";
import { editProductDoc } from "../../firebase/editDoc";
import { useEffect, useState } from "react";
import { BACKEND_URL } from "../../util/constants";
import { addNewSale } from "../../firebase/newDoc";
import { IoIosClose } from "react-icons/io";
import { useWindowSize } from 'react-use'
import ReactConfetti from "react-confetti";

export default function PurchaseSuccess() {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const sessionId = queryParams.get('session');
    const { width, height } = useWindowSize();

    const { cartProducts, setCartProducts, allProducts, setAllProducts } = useProductManagementContext();
    const [inventoryPhotos, setInventoryPhotos] = useState<IProductInfo[]>([]);

    const [showConffeeti, setShowConfetti] = useState(true);

    useEffect(() => {
        async function handleSoldItems() {
            const allProductsToUpdate = [...cartProducts];

            for (const cartItem of allProductsToUpdate) {
                console.log('Editing item:', cartItem.title);
                await editProductDoc({
                    ...cartItem,
                    sold: true
                });
            }
            const nextProducts = allProducts.filter((p: IProductInfo) => !cartProducts.some(cartItem => cartItem.id === p.id));
            setInventoryPhotos(nextProducts.filter((p: IProductInfo) => !p.sold && !p.hidden));
            setAllProducts(nextProducts);
            setCartProducts([]);
        }
        if (cartProducts.length > 0 && allProducts.length > 0) handleSoldItems();
    }, [cartProducts, allProducts]);

    useEffect(() => {
        // Fetch session details using the session ID
        async function getSessionDetails() {
            const resp = await fetch(`${BACKEND_URL}/checkout-session/${sessionId}`);
            if (resp) console.log('resp.status:', resp.status);
            const data = await resp.json();
            if (data) {
                // console.log(data)
                const shippingAddress = data.shipping_details.address
                const customerName = data.shipping_details.name;
                const totalSales = Number(data.metadata.saleTotal);
                const itemsSold = data.metadata.items.split(',');
                const shippingAddressString = `${shippingAddress.line1}, ${shippingAddress.line2 ? shippingAddress.line2 + ' ' : ''}${shippingAddress.city}, ${shippingAddress.state} ${shippingAddress.postal_code} ${shippingAddress.country}`;
                await addNewSale({ customerName, shippingAddressString, sessionId, isShipped: false, totalSales, itemsSold });
                await sendEmailNotification({ customerName, shippingAddressString, itemsSold});
            }

        }
        if (sessionId) {
            getSessionDetails();
        }
    }, [sessionId]);

    useEffect(() => {
        setTimeout(() => {
            setShowConfetti(false);
        }, 4000);
    }, [])

    async function sendEmailNotification({ customerName, shippingAddressString, itemsSold}: { customerName: string, shippingAddressString: string, itemsSold: string[] }) {
        const resp = await fetch(`${BACKEND_URL}/send-email`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ customerName, shippingAddressString, itemsSold }),
        });
        if (resp) console.log('resp.status:', resp.status);
    }

    return (
        <div style={{ backgroundImage: 'url(/images/background.jpg)' }}
            className="bg-cover bg-center bg-no-repeat bg-fixed w-screen h-screen">
            {showConffeeti && <ReactConfetti width={width} height={height} />}
            <div className="bg-[#242424] bg-opacity-50 text-white w-full h-screen flex flex-col items-center justify-center">
                <div className="w-[30rem] h-[20rem] border-4 bg-edcBlue-80 bg-opacity-80 border-white rounded-md flex flex-col items-center justify-evenly">
                    <h1>Payment processed</h1>
                    <p>Thank you!</p>
                    <Link to="/shop"
                        className="
                        p-2 w-[2rem] h-[2rem] rounded-md 
                        text-white 
                        flex justify-center items-center 
                        border-2 border-white"><IoIosClose size={80} /></Link>
                </div>
                {inventoryPhotos.length > 0 && <div className="flex flex-row justify-center items-center w-screen p-2 bg-edcBlue-40 bg-opacity-45 overflow-auto flex-wrap">
                    <p className="w-full p-2 text-center">Here are a few other items in stock:</p>
                    {inventoryPhotos.map((product: IProductInfo) => {
                        return (
                            <div className="w-[10rem] h-[10rem] border-white border-2 overflow-hidden relative" key={product.id}>
                                <img className="w-full h-full object-cover object-center" src={product.photos[0].url} alt={product.title} />
                                <div className="absolute bottom-0 w-full">
                                </div>
                            </div>
                        )
                    })}
                </div>}
            </div>
        </div>
    )
}

