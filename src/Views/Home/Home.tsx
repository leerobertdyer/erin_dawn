import { User } from "firebase/auth";
import BackgroundDiv from "../../Components/BackgroundDiv/BackgroundDiv";
import Hero from "../../Components/Hero/Hero";
import Main from "../../Components/Main/Main";
import HeroPhotos from "../../Components/HeroPhotos/HeroPhotos";
import { useProductManagementContext } from "../../Context/ProductMgmtContext";
import ProductForm from "../../Components/ProductForm/ProductForm";


interface IHome {
    u: User | null
}
export function Home({ u }: IHome) {
    const { isEditing } = useProductManagementContext();

    if (isEditing) return <ProductForm />
    
    return (
        <>
            <BackgroundDiv image="images/background.jpg">
                <Hero>
                    <HeroPhotos u={u} />
                </Hero>
            </BackgroundDiv>
            <BackgroundDiv image="images/background.jpg">
                <Main u={u}/>
            </BackgroundDiv>
        </>
    )
}