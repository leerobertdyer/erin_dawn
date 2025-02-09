import { Link, useLocation } from "react-router-dom";
import { usePhotosContext } from "../../Context/PhotosContext";
import { useProductManagementContext } from "../../Context/ProductMgmtContext";
import { IProductInfo } from "../../Interfaces/IProduct";
import { editDoc } from "../../firebase/editDoc";
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

    const { allPhotos, setAllPhotos } = usePhotosContext();
    const { cartProducts, setCartProducts } = useProductManagementContext();

    const inventory = allPhotos.filter((photo: IProductInfo) => photo.tags.includes('inventory'));

    const [showConffeeti, setShowConfetti] = useState(true);

    useEffect(() => {
        async function handleSoldItems() {
            let allSeriesForAllProducts = [];
            for (const item of cartProducts) {

                const allProductPhotos = allPhotos
                    .filter((photo: IProductInfo) => photo.itemName === item.itemName);
                allSeriesForAllProducts = allSeriesForAllProducts.concat(allProductPhotos);
            }

            for (const item of allSeriesForAllProducts) {
                const nextTags = ['sold', 'edc']
                console.log('Editing item:', item.title);
                await editDoc({
                    ...item,
                    tags: nextTags
                });
            }
            const nextPhotos = allPhotos.filter((photo: IProductInfo) => !allSeriesForAllProducts.some(soldItem => soldItem.id === photo.id));
            setAllPhotos(nextPhotos);
            setCartProducts([]);
        }
        if (cartProducts.length > 0 && allPhotos.length > 0) handleSoldItems();
    }, [cartProducts, allPhotos]);

    useEffect(() => {
        // Fetch session details using the session ID
        async function getSessionDetails() {
            const resp = await fetch(`${BACKEND_URL}/checkout-session/${sessionId}`);
            if (resp) console.log('resp.status:', resp.status);
            const data = await resp.json();
            if (data) {
                console.log(data)
                const shippingAddress = data.shipping_details.address
                const customerName = data.shipping_details.name;
                const totalSales = Number(data.metadata.saleTotal);
                const itemsSold = data.metadata.items.split(',');
                const shippingAddressString = `${shippingAddress.line1}, ${shippingAddress.line2 ? shippingAddress.line2 + ' ' : ''}${shippingAddress.city}, ${shippingAddress.state} ${shippingAddress.postal_code} ${shippingAddress.country}`;
                await addNewSale({ customerName, shippingAddressString, sessionId, isShipped: false, totalSales, itemsSold });
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
                <div className="flex flex-row justify-center items-center w-screen p-2 bg-edcBlue-40 bg-opacity-45 overflow-auto flex-wrap">
                    {inventory.map((item: IProductInfo) => {
                        return (
                            <div className="w-[10rem] h-[10rem] border-white border-2 overflow-hidden relative" key={item.id}>
                                <img className="object-cover object-center" src={item.imageUrl} alt={item.title} />
                                <div className="absolute bottom-0 w-full">
                                </div>
                            </div>
                        )
                    })}

                </div>
            </div>
        </div>
    )
}

