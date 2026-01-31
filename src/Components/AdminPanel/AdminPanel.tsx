import { signOut } from "firebase/auth"
import { auth } from "../../firebase/firebaseConfig";
import AddProductCard from "../AddProductCard/AddProductCard";
import { useEffect, useState } from "react";
import { getOrders } from "../../firebase/getFiles";
import { IoIosCopy } from "react-icons/io";
import { shipOrder } from "../../firebase/editDoc";
import NewProductForm from "../Forms/NewProductForm";
import Frame from "../Frame/Frame";
import { useNavigate } from "react-router-dom";

export default function AdminPanel() {
    const [allOrders, setAllOrders] = useState([]);
    const [unshippedOrders, setUnshippedOrders] = useState([]);
    const [showCopyMessage, setShowCopyMessage] = useState(false); 
    const [addressCopied, setAddressCopied] = useState("");
    const [showProductForm, setShowProductForm] = useState(false);
    const currentYear = new Date().getFullYear();
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchCurrentOrders() {
            const orders = await getOrders();
            console.log('All Orders:', orders);
            setAllOrders(orders);
            setUnshippedOrders(orders.filter((order: any) => !order.isShipped));
        }
        fetchCurrentOrders();
    }, [])

    useEffect(() => {
        if (showCopyMessage) {
            setTimeout(() => {
                setShowCopyMessage(false);
            }, 2000)
        }
    }, [showCopyMessage])

    async function logout() {
        await signOut(auth).then(() => {
            console.log("User signed out")
        }).catch((error) => {
            console.error("Error signing out: ", error)
        })
    }

    function handleClickCopy(address: string) {
        navigator.clipboard
            .writeText(address)
            .then(() => {
                setAddressCopied(address);
            })
            .then(() => {
                setShowCopyMessage(true);
            })
        }

        async function handleMarkAsShipped(customerName: string, sessionId: string) {
            const idToTarget = customerName.replace(/\s/g, "_")+"_"+sessionId
            console.log('Mark as Shipped:', idToTarget )
            shipOrder({ id: idToTarget });
            setUnshippedOrders(unshippedOrders.filter((order: any) => order.sessionId !== sessionId));
        }

    return (
        <>
        {showProductForm && <NewProductForm onClose={() => setShowProductForm(false)} />}
            <div
                className="
            flex flex-col sm:flex-row gap-4 flex-wrap
            justify-start items-center sm:justify-around w-[80%] h-fit m-auto 
            p-[2rem] max-w-[60rem] border-4 border-black mb-8 bg-[url('/images/catMad.jpg')] bg-cover bg-center bg-no-repeat">

                {/* Logout */}
                <div className="flex flex-col items-center justify-center w-full">
                    <button onClick={logout}
                        className="p-2 bg-rose-600 rounded-md text-white min-w-[10rem]">Log Out</button>
                </div>

                {/* Add New Product */}
                <div className="
                w-full sm:w-[18rem]
                flex justify-center items-center
                gap-4 mt-4">
                        <AddProductCard addProduct={() => setShowProductForm(true)}/>
                    </div>

                {/* Send Email Campaign */}
                <div onClick={() => navigate("/newemail")}
                className="
                w-full sm:w-[18rem]
                flex justify-center items-center
                gap-4 mt-4 bg-white rounded-md">
                    <Frame additionalClass="h-[27rem] w-full">
                        <div className="relative flex justify-center items-center w-full h-full py-2 rounded-xl overflow-hidden">
                            <img src="/images/background.jpg" alt="Decorative background" className="w-full h-full" />
                           <p className="absolute top-1/2 -translate-y-1/2 text-white text-sm p-2 bg-black bg-opacity-65 w-full text-center">
                            New Series || New Market
                            </p> 
                        </div>
                            <button className="px-2 bg-edcPurple-60 rounded-md text-white w-full">Send Email Campaign</button>
                    </Frame>
                </div>

            </div>

            {/* Orders */}
            <div className="flex flex-col items-center justify-center w-screen mb-[4rem]">
                <div className="h-fit bg-edcBlue-80 rounded-md p-4 w-[90%] sm:w-[30rem] md:w-[40rem] lg:w-[50rem]">
                    <p className="text-white text-center">Welcome to the Admin Panel</p>
                    <p className="text-white text-center">Total {currentYear} Website Sales: ${allOrders.reduce((acc, item) => {
                        // Handle Firestore Timestamp conversion
                        const itemDate = item.createdAt?.toDate?.() || new Date(item.createdAt);
                        const itemYear = itemDate.getFullYear();
                        if (itemYear === currentYear) {
                            return acc + item.grandTotal;
                        }
                        return acc;
                    }, 0)}</p>
                    <h1 className="text-2xl bg-white rounded-md w-fit p-2 mx-auto my-2">Current Unshipped Orders</h1>
                    {unshippedOrders.map((order: any) => {
                        return (
                            <div key={order.sessionId} className="bg-white flex flex-col items-center justify-center gap-2 p-2 text-center border-2 border-black rounded-md">
                                <p>TOTAL SALE: ${order.grandTotal}</p>
                                <p>CUSTOMER NAME: {order.customerName}</p>

                                <p className="
                                        flex justify-between items-center 
                                        gap-2 border-y-4 border-edcBlue-60 relative">
                                    SHIPPING ADDRESS: {order.shippingAddressString}
                                    <button onClick={() => handleClickCopy(order.shippingAddressString)} className="bg-edcBlue-80 text-white rounded-md p-2">
                                        <IoIosCopy />
                                    </button>
                                    {showCopyMessage && addressCopied === order.shippingAddressString 
                                    && <span className="absolute top-[-.4rem] right-[-5rem] bg-white p-2 rounded-md border-red-500 border-2">Copied!</span>}
                                </p>

                                <p className="text-wrap text-center">Item Sold: "{order.itemsSold}"</p>
                                <button className="p-2 bg-rose-600 text-white rounded-md"
                                    onClick={() => handleMarkAsShipped(order.customerName, order.sessionId)}>Mark as Shipped</button>
                            </div>
                        )
                    })}
                </div>
            </div>
        </>
    )
}