import Frame from "../Frame/Frame";
import "./Hero.css";

export default function Hero() {
    return (
        <div className="mainHeroDiv">
            <Frame src="/hero/erin2.jpg" alt="Erin Dawn Campbell" />
            <div style={{transform: "rotate(19deg)"}} >

            <Frame src="/hero/erin2.jpg" alt="Erin Dawn Campbell" />
            </div>
            <Frame src="/hero/erin2.jpg" alt="Erin Dawn Campbell" />
        </div>
    )
}
