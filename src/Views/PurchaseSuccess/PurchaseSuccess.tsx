import { Link } from "react-router-dom";

export default function PurchaseSuccess() {
    return (
        <div style={{ backgroundImage: 'url(/images/background.jpg)' }} 
        className="bg-cover bg-center bg-no-repeat bg-fixed w-screen h-screen">
            <div className="bg-edcBlue-80 bg-opacity-50 text-white w-full h-screen flex flex-col items-center justify-center">
                <div className="w-[30rem] h-[20rem] border-4 bg-edcBlue-80 border-white rounded-md flex flex-col items-center justify-evenly">
                    <h1>Payment processed</h1>
                    <p>Thank you for your purchase!</p>
                    <Link to="/shop" className="text-white p-2 w-[2rem] h-[2rem] rounded-md flex justify-center items-center border-2 border-white">x</Link>
                </div>
            </div>
        </div>
    )
}

