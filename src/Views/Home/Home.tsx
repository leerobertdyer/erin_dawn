import Hero from "../../Components/Hero/Hero";
import Main from "../../Components/Main/Main";

export function Home() {
    return (
        <>
            <div className="bg-cover bg-no-repeat w-full h-fit flex flex-col items-center justify-start"
                style={{ backgroundImage: 'url(images/background.jpg)' }}
            >
                <Hero />
            </div>
            <div className="bg-cover bg-no-repeat w-full h-fit flex flex-col items-center justify-start border-y-4 border-double border-pink-400"
                style={{ backgroundImage: 'url(images/background.jpg)' }}
            >
                <Main />
            </div>
        </>
    )
}