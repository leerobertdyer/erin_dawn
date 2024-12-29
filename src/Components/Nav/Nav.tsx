import { IoIosMenu } from "react-icons/io";
import "./Nav.css";

export default function Nav() {
    return (
        <div className="navMainDiv">
            <IoIosMenu size={50} />
            <div className="navText">
                <h1 className="navTitle">ERIn DaWn cAmPbELl</h1>
                <h2 className="navSubTitle">Handmade Clothing & Upcycled Vintage</h2>
                <h1 className="text-1xl font-bold underline text-slate-900">
      Hello world!
    </h1>
            </div>
        </div>
    )
}