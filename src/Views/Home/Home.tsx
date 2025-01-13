import { User } from "firebase/auth";
import BackgroundDiv from "../../Components/BackgroundDiv/BackgroundDiv";
import Hero from "../../Components/Hero/Hero";
import Main from "../../Components/Main/Main";
import HeroPhotos from "../../Components/HeroPhotos/HeroPhotos";
import { useProductManagementContext } from "../../Context/ProductMgmtContext";
import { usePhotosContext } from "../../Context/PhotosContext";

interface IHome {
    u: User | null
}
export function Home({ u }: IHome) {
    const { product, handleEdit, handleDelete, handleBack, handleFinishEdit, updateProduct, isEditing, isBatchEdit, } = useProductManagementContext();
    const { allPhotos, isLoading, } = usePhotosContext();

    return (
        <>
            <BackgroundDiv image="images/background.jpg">
                <Hero>
                    <HeroPhotos
                        u={u} product={product} handleBack={handleBack}
                        isEditing={isEditing} isBatchEdit={isBatchEdit} handleFinishEdit={handleFinishEdit}
                        updateProduct={updateProduct} handleDelete={handleDelete} handleEdit={handleEdit}
                        allPhotos={allPhotos} isLoading={isLoading} />
                </Hero>
            </BackgroundDiv>
            <BackgroundDiv image="images/background.jpg">
                <Main />
            </BackgroundDiv>
        </>
    )
}