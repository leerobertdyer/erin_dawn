import "./Frame.css";

export default function Frame({ src, alt }: { src: string, alt: string }) {
    return (
        <div className="frameMainDiv">
            <div className="middleDiv">
                <div className="innerFrameDiv">
                    <img src={src} alt={alt} />
                </div>
            </div>
        </div>
    )
}