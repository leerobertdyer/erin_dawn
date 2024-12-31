import BackgroundDiv from "../../Components/BackgroundDiv/BackgroundDiv";
import Hero from "../../Components/Hero/Hero";
import Main from "../../Components/Main/Main";

export function Home() {
    return (
        <>
            <BackgroundDiv image="images/background.jpg">
                <Hero />
            </BackgroundDiv>
            <BackgroundDiv image="images/background.jpg">
                <Main />
            </BackgroundDiv>

        </>
    )
}