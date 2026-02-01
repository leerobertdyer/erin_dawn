import { useNavigate } from "react-router-dom";
import MainFormTemplate from "./MainFormTemplate";
import { useState, useEffect } from "react";
import { useProductManagementContext } from "../../Context/ProductMgmtContext";
import { IProductInfo } from "../../Interfaces/IProduct";
import SubmitBtn from "../Buttons/SubmitBtn";
import { BACKEND_URL } from "../../util/constants";

export default function NewEmailForm() {
    const navigate = useNavigate();
    const [allSeriesNames, setAllSeriesNames] = useState([]);
    const [allSeriesPhotos, setAllSeriesPhotos] = useState([]);
    const [seriesToEdit, setSeriesToEdit] = useState("");
    const [featurePhoto1, setFeaturePhoto1] = useState("");
    const [featurePhoto2, setFeaturePhoto2] = useState("");
    const [featurePhoto3, setFeaturePhoto3] = useState("");
    const [showPhotos, setShowPhotos] = useState(false);
    const [currentPhotoIndex, setCurrentPhotoIndex] = useState(null);
    const [success, setSuccess] = useState(false);

    const { allProducts } = useProductManagementContext();

    useEffect(() => {
        if (!allProducts) return;
        const uniqueSeries = Array.from(new Set(allProducts.map(p => p.series)));
        setAllSeriesNames(uniqueSeries);
    }, [allProducts]);

    useEffect(() => {
        if (!allProducts) return;
        const seriesProducts = allProducts.filter(p => p.series === seriesToEdit);
        const flattenedPhotos = seriesProducts.flatMap((product: IProductInfo) =>
            Array.isArray(product.photos) ? product.photos : [product.photos]
        );
        setAllSeriesPhotos(flattenedPhotos);
    }, [seriesToEdit, allProducts]);

    function resetState() {
        setSeriesToEdit("");
        setFeaturePhoto1("");
        setFeaturePhoto2("");
        setFeaturePhoto3("");
        setShowPhotos(false);
        setCurrentPhotoIndex(null);
        setSuccess(false);
    }

    function handleShowPhotos(index: number) {
        setCurrentPhotoIndex(index);
        setShowPhotos(seriesToEdit !== "");
    }

    function handleBack() {
        setShowPhotos(false);
    }

    function handlePickPhoto(photoUrl: string) {
        if (currentPhotoIndex === 0) {
            setFeaturePhoto1(photoUrl);
        } else if (currentPhotoIndex === 1) {
            setFeaturePhoto2(photoUrl);
        } else if (currentPhotoIndex === 2) {
            setFeaturePhoto3(photoUrl);
        }
        setShowPhotos(false);
    }

    async function handleSubmit() {
        const resp = await fetch(`${BACKEND_URL}/edc/send-new-series-email`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                featureName: seriesToEdit,
                featurePhoto1,
                featurePhoto2,
                featurePhoto3
            })
        })
        if (resp.ok) {
            setSuccess(true);
        }
    }

    function handleFinish() {
        resetState();
        navigate("/admin");
    }

    if (success) {
        return (
            <div className="absolute h-screen w-screen inset-0 flex justify-center items-center bg-white">
            <div className="flex flex-col items-center justify-center gap-2">
                <h2 className="text-2xl font-bold">Success!</h2>
                <p className="text-lg">Email sent successfully</p>
                <button 
                    className="p-2 bg-rose-600 text-white rounded-md w-[15rem] h-[5rem]"
                    type="button" onClick={handleFinish}>Close</button>
            </div>
        </div>
        )
    }
    
    if (showPhotos) return (
        <div className="flex flex-row items-start flex-wrap justify-center gap-2">
            <div className="w-full fixed top-0 bg-white h-[7rem] z-[1000] flex justify-center items-center">
                <button 
                    className="p-2 bg-rose-600 text-white rounded-md w-[15rem] h-[5rem]"
                    type="button" onClick={handleBack}>Back</button>
            </div>

            <div className="mt-8 w-full h-fit flex flex-wrap justify-center items-center gap-2">
            {allSeriesPhotos.map((photo, index) => (
                <div className="flex flex-col items-center justify-center gap-2 p-2 border-2 rounded-md border-black w-fit h-fit">
                    <img 
                        key={photo.id} 
                        src={photo?.url} 
                        alt={`Product photo ${index}`} 
                        className="h-[9rem] md:h-[14rem] w-[9rem] md:w-[14rem] lg:w-[16rem] lg:h-[16rem] rounded-md object-cover m-2"
                        />
                    <button type="button" 
                        onClick={() => handlePickPhoto(photo?.url)} 
                        className="flex justify-center items-center p-2 bg-edcYellow-40 text-black rounded-md w-[9rem] md:w-[14rem] lg:w-[16rem] h-[2rem]">Select</button>
                </div>
            ))}
            </div>
        </div>
    )

    return (
        <MainFormTemplate 
            handleClickBack={() => navigate("/admin")}
            resetState={resetState}
            bigger
            >
            <h1>New Email Campaign Form</h1>
            
            <form onSubmit={handleSubmit} className="flex flex-col items-center justify-center gap-2">
                <label htmlFor="series" className="bg-white text-center px-2 rounded-sm w-fit min-w-[15rem]">
                    Select Series to Email</label>
                <select 
                    id="series"
                    className="text-center w-full p-2 border-[1px] border-black rounded-md"
                    value={seriesToEdit}
                    onChange={(e) => setSeriesToEdit(e.target.value)}>
                        <option disabled value="">Select a Series</option>
                    {allSeriesNames.map((series: string) => (
                        <option key={series} value={series}>{series}</option>
                    ))}
                </select>
            
            <div className="flex flex-col lg:flex-row justify-center items-center lg:items-start gap-2">

                <div className="flex flex-col items-center justify-center gap-2 border-2 border-black rounded-md p-2 m-2">
                    <button type="button" onClick={() => handleShowPhotos(0)} className="p-2 bg-rose-600 text-white rounded-md w-[15rem]">Select Main Photo</button>
                    {featurePhoto1 && <img src={featurePhoto1} alt="Main Photo" className="w-64 h-64 object-cover" />}
                </div>
                <div className="flex flex-col items-center justify-center gap-2 border-2 border-black rounded-md p-2 m-2">
                    <button type="button" onClick={() => handleShowPhotos(1)} className="p-2 bg-rose-600 text-white rounded-md w-[15rem]">Select Photo 2</button>
                    {featurePhoto2 && <img src={featurePhoto2} alt="Photo 2" className="w-64 h-64 object-cover" />}
                </div>
                <div className="flex flex-col items-center justify-center gap-2 border-2 border-black rounded-md p-2 m-2">
                    <button type="button" onClick={() => handleShowPhotos(2)} className="p-2 bg-rose-600 text-white rounded-md w-[15rem]">Select Photo 3</button>
                    {featurePhoto3 && <img src={featurePhoto3} alt="Photo 3" className="w-64 h-64 object-cover" />}
                </div>

            </div>

            <SubmitBtn progress={0} />
            </form>
        </MainFormTemplate>
    )
}