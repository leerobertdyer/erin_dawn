import { signOut } from "firebase/auth"
import { auth } from "../../firebase/firebaseConfig";
import AddProductCard from "../AddProductCard/AddProductCard";
import { useEffect, useState } from "react";
import { getOrders } from "../../firebase/getFiles";
import { IoIosCopy } from "react-icons/io";
import { shipOrder } from "../../firebase/editDoc";

export default function AdminPanel() {
    const [allOrders, setAllOrders] = useState([]);
    const [showCopyMessage, setShowCopyMessage] = useState(false); 

    useEffect(() => {
        async function fetchCurrentOrders() {
            const orders = await getOrders();
            console.log('All Orders:', orders);
            setAllOrders(orders);
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
            console.log("Error signing out: ", error)
        })
    }

    function handleClickCopy(address: string) {
        navigator.clipboard
            .writeText(address)
            .then(() => {
                setShowCopyMessage(true);
            })
        }

        async function handleMarkAsShipped(customerName: string, sessionId: string) {
            const idToTarget = customerName.replace(/\s/g, "_")+"_"+sessionId
            console.log('Mark as Shipped:', idToTarget )
            shipOrder({ id: idToTarget });
            setAllOrders(allOrders.filter((order: any) => order.sessionId !== sessionId));
        }

    return (
        <>
            <div
                className="
            flex flex-col sm:flex-row gap-4 flex-wrap
            justify-start items-center sm:justify-around w-[80%] h-fit m-auto 
            pb-[2rem] max-w-[60rem] ">

                {/* Logout and Add New Product */}
                <div className="flex flex-col items-center justify-center">
                    <button onClick={logout}
                        className="p-2 bg-rose-600 rounded-md text-white min-w-[10rem]">Log Out</button>
                    <div className="
                w-full sm:w-[18rem]
                flex justify-center items-center
                gap-4 mt-4">
                        <AddProductCard />
                    </div>
                </div>

                {/* CAT */}
                <div className="">
                    <img src="/images/catMad.jpg" alt="cat"
                        className="w-[18rem] h-[18rem] md:w-[22rem] md:h-[22rem] lg:w-[25rem] lg:h-[25rem] object-cover rounded-md mb-4" />
                </div>
            </div>

            {/* Orders */}
            <div className="flex flex-col items-center justify-center w-screen">
                <div className="h-fit bg-edcBlue-80 rounded-md p-4 w-[90%] sm:w-[30rem] md:w-[40rem] lg:w-[50rem]">
                    <p className="text-white text-center">Welcome to the Admin Panel</p>
                    <p className="text-white text-center">Total Sales: ${allOrders.reduce((acc, item) => acc + item.totalSales, 0)}</p>
                    <h1 className="text-2xl bg-white rounded-md w-fit p-2 mx-auto my-2">Current Unshipped Orders</h1>
                    {allOrders.map((order: any) => {
                        if (!order.isShipped) return (
                            <div key={order.sessionId} className="bg-white flex flex-col items-center justify-center gap-2 p-2 text-center border-2 border-black rounded-md">
                                <p>TOTAL SALE: ${order.totalSales}<span className="text-xs">.00</span></p>
                                <p>CUSTOMER NAME: {order.customerName}</p>

                                <p className="
                                        flex justify-between items-center 
                                        gap-2 border-y-4 border-edcBlue-60 relative">
                                    SHIPPING ADDRESS: {order.shippingAddressString}
                                    <button onClick={() => handleClickCopy(order.shippingAddressString)} className="bg-edcBlue-80 text-white rounded-md p-2">
                                        <IoIosCopy />
                                    </button>
                                    {showCopyMessage && <p className="absolute -top-6 bg-white p-2 rounded-md">Copied!</p>}
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