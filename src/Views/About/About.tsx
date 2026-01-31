import { useEffect, useState } from "react";
import { useUserContext } from "../../Context/UserContext"
import { getAboutText } from "../../firebase/getFiles";
import { updateAboutText } from "../../firebase/editDoc";

export default function About() {
    const { user } = useUserContext();
    const [isEditingAbout, setIsEditingAbout] = useState(false);
    const [aboutShortText, setAboutShortText] = useState("");
    const [aboutLongText, setAboutLongText] = useState("")
    const [aboutLongHeader, setAboutLongHeader] = useState("");

    useEffect(() => {
        getAboutText().then((data) => {
            setAboutShortText(data.short);
            setAboutLongText(data.long);
            setAboutLongHeader(data.longHeader);
        })
    }, [])

    async function handleClickEdit() {
        setIsEditingAbout(!isEditingAbout);
        updateAboutText({ short: aboutShortText, long: aboutLongText, longHeader: aboutLongHeader });
    }
    function handleCancelEdit() {
        setIsEditingAbout(false);
        getAboutText().then((data) => {
            setAboutShortText(data.short);
            setAboutLongText(data.long);
            setAboutLongHeader(data.longHeader);
        })
    }

    return (
        <div className="bg-white w-screen h-fit flex flex-col items-center justify-start text-pink-300 py-4">
            <div className="w-full h-[80%] my-auto flex justify-evenly items-center bg-cover bg-center py-[5rem]"
                style={{ backgroundImage: 'url(images/background.jpg)' }}>
                <div className="w-[85%] bg-[#272727] bg-opacity-90 rounded-md p-8 flex flex-col justify-evenly items-center gap-2">

                    <h1 className="text-[1.5rem] md:text-[4rem] font-bold">Erin Dawn Campbell</h1>

                    <div className="w-full h-full flex flex-col sm:flex-row items-center justify-between gap-2">
                        <div className="overflow-hidden w-[15rem] h-[15rem] rounded-lg flex-shrink-0
                            sm:w-[22rem] sm:h-[22rem]">
                            <img src="images/erinCat.jpg" alt="Erin Campbell with cat" className="object-contain object-center" loading="lazy" />
                        </div>

                        {isEditingAbout
                            ? <textarea
                                className="w-full h-[22rem] bg-white text-black  rounded-md p-4"
                                value={aboutShortText}
                                onChange={(e) => setAboutShortText(e.target.value)}></textarea>
                            : <div className="text-white w-full sm:w-[40%] leading-9 tracking-wide text-center sm:text-start">
                                {aboutShortText}
                            </div>}

                    </div>
                    {user && <div className="w-full flex items-center justify-center gap-2">
                        <button
                            className="
                        text-white text-lg 
                        bg-edcPurple-60 mb-4
                        border-2 p-2 border-white
                        rounded-md w-[10rem]"
                            onClick={handleClickEdit}>{isEditingAbout ? "Submit" : "Edit"}</button>
                        {isEditingAbout && <button onClick={handleCancelEdit}
                            className="text-white text-lg bg-red-500 mb-4 border-2 p-2 border-white rounded-md w-[10rem]">Cancel</button>}

                    </div>}
                    <a className="text-blue-400 my-2" href="mailto:erin.d.campbell@gmail.com" target="_blank">erin.d.campbell@gmail.com</a>

                    <div className="w-full sm:w-[80%] text-white text-center border-t-white border-t-2 mt-2">
                        {isEditingAbout
                            ? <input type="text" className="w-full bg-white text-black p-2 rounded-md my-4"
                                value={aboutLongHeader}
                                onChange={(e) => setAboutLongHeader(e.target.value)} />
                            : <h2 className="text-pink-300 text-[1.4rem] sm:text-[2rem]">{aboutLongHeader}</h2>}
                        {isEditingAbout
                            ? <textarea
                                className="w-full h-[22rem] bg-white text-black rounded-md p-4"
                                value={aboutLongText}
                                onChange={(e) => setAboutLongText(e.target.value)}></textarea>
                            : <div className="leading-7 tracking-wide whitespace-pre-line">{aboutLongText}</div>}

                        {/* LINKS */}
                        <div className="w-full flex flex-col items-center justify-center bg-[#272727] bg-opacity-90 rounded-md p-4 mt-4">
                            ALSO!
                            <div className="sm:text-[1.2rem] flex flex-col items-center justify-center mt-6">Check out my band Aunt Vicki:
                                <a href="https://www.auntvicki.rocks/" target="_blank" className="w-[12rem] text-center text-blue-400">auntvicki.rocks</a>
                            </div>
                            <div className="sm:text-[1.2rem] flex flex-col items-center justify-center mt-6">My friend's business Grandmother Goods:
                                <a href="https://www.gmother.com/" target="_blank" className="w-[12rem] text-center text-blue-400">gmothergoods.com</a>
                            </div>
                            <div className="sm:text-[1.2rem] flex flex-col items-center justify-center mt-6">And my husband who built this website:
                                <a href="https://www.leedyer.com/" target="_blank" className="w-[12rem] text-center text-blue-400">leedyer.com</a>
                            </div>

                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}