import BackgroundDiv from "../../Components/BackgroundDiv/BackgroundDiv";
import Hero from "../../Components/Hero/Hero";
import Main from "../../Components/Main/Main";
import HeroPhotos from "../../Components/HeroPhotos/HeroPhotos";
import { useProductManagementContext } from "../../Context/ProductMgmtContext";
import { useEffect } from "react";


export function Home() {
    const { setIsEditing } = useProductManagementContext();
    useEffect(() => {
        setIsEditing(false)
    }, [])

    return (
        <>
            <BackgroundDiv image="images/background.jpg">
                <Hero>
                    <HeroPhotos />
                </Hero>
            </BackgroundDiv>
            <BackgroundDiv image="images/background.jpg">
                <Main />
            </BackgroundDiv>
        </>
    )
}