import { User } from "firebase/auth";
import BackgroundDiv from "../../Components/BackgroundDiv/BackgroundDiv";
import Hero from "../../Components/Hero/Hero";
import Main from "../../Components/Main/Main";
import Photos from "../../Components/Photos/Photos";

export function Home({ u }: { u: User | null }) {
    return (
        <>
            <BackgroundDiv image="images/background.jpg">
                <Hero>
                    <Photos u={u}/>
                </Hero>
            </BackgroundDiv>
            <BackgroundDiv image="images/background.jpg">
                <Main u={u}/>
            </BackgroundDiv>
        </>
    )
}