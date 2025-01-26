import { useEffect, useState } from "react";
import { getCategories, ICategory } from "../../firebase/getProductInfo";
import CustomInput from "../CustomInput/CustomInput";
import { IoIosCamera } from "react-icons/io";
import uploadFile from "../../firebase/uploadFile";
import { newDoc, addNewCategory, addNewSeries } from "../../firebase/newDoc";
import { createStripeProduct } from "../../Stripe/newStripe";
import { usePhotosContext } from "../../Context/PhotosContext";
import LoadingBar from "../LoadingBar/LoadingBar";
import { useNavigate } from "react-router-dom";
import { handleFileChange, preventEnterFromSubmitting } from "./formUtil";
import MainFormTemplate from "./MainFormTemplate";

const defaultSeries = "--Select Series--";
const newSeries = "--NEW SERIES--";
const newCategorySelector: ICategory = {
    name: "--NEW CATEGORY--",
    series: []
}
const defaultCategory = {
    name: "--Select Category--",
    series: [defaultSeries]
}

export default function NewProductForm() {
    const { allPhotos, handleSetAllPhotos } = usePhotosContext();
    const navigate = useNavigate();

    const [categories, setCategories] = useState<ICategory[]>([defaultCategory]);
    const [allSeries, setAllSeries] = useState<string[]>([defaultCategory.series[0]]);
    const [title, setTitle] = useState("");
    const [category, setCategory] = useState(defaultCategory.name);
    const [newCategoryName, setNewCategoryName] = useState("");
    const [series, setSeries] = useState(defaultSeries);
    const [newSeriesName, setNewSeriesName] = useState("");
    const [price, setPrice] = useState<number | null>();
    const [description, setDescription] = useState("");
    const [sizing, setSizing] = useState("");
    const [file, setFile] = useState<File | null | undefined>();
    const [background, setBackground] = useState("");
    const [tags, setTags] = useState<string[]>(["edc", "inventory"]);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        async function setup() {
            //TODO: match how I store data in local storage so I am not making so many db calls....
            const c = await getCategories()
            setCategories([...categories, newCategorySelector, ...c]);
        }
        if (categories.length === 1) setup();
        else {
            for (const cat of categories) {
                if (cat.name !== "--Select Category--") {
                    if (category === cat.name) {
                        setAllSeries([defaultCategory.series[0], newSeries, ...cat.series]);
                        break
                    }
                    setAllSeries([defaultCategory.series[0]]);
                }
            }
        }
    }, [categories, category])


    function resetState() {
        setTitle("")
        setCategory(defaultCategory.name)
        setNewCategoryName("")
        setSeries(defaultSeries)
        setNewSeriesName("")
        setPrice(null)
        setDescription("")
        setSizing("")
        setFile(null)
        setBackground("")
        setTags(["edc", "inventory"])
        setProgress(0)
    }

    function onProgress(percent: number) {
        setProgress(percent)
    }

    async function handleNewCategory() {
        // Add new category to db
        const success = await addNewCategory({ category: newCategoryName, series: newSeriesName })
        if (success) console.log('Category added successfully')
        else throw new Error("Error adding new category")
    }

    async function handleNewSeries() {
        // Add series to db
        console.log("newCategoryName: ", newCategoryName)
        console.log("category: ", category)
        console.log(newCategoryName ?? category)
        const success = await addNewSeries({ category: newCategoryName.length > 0 ? newCategoryName : category, series: newSeriesName })
        if (success) console.log('Series added successfully')
        else throw new Error("Error adding new series")
        console.log('adding new series to db...')
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (!file) return;

        if (newCategoryName.length > 0) await handleNewCategory();
        if (newSeriesName.length > 0 && newCategoryName === newCategorySelector.name) await handleNewSeries();

        const fileToUpload = {
            reference: `${title.replace(/ /g, "_")}`,
            file: file as File,
            onProgress: onProgress,
        }

        // Upload file to storage return download url
        const downloadUrl = await uploadFile(fileToUpload);
        console.log("Download URL: ", downloadUrl)

        // Create new product in stripe account
        const { stripeProductId, stripePriceId } = await createStripeProduct(title, description, Number(price))

        // Create new product in firestore
        const newProductId = await newDoc({
            downloadUrl,
            title: title.replace(/ /g, "_"),
            description,
            price: Number(price),
            category: newCategoryName !== newCategorySelector.name ? newCategoryName : category,    
            tags: newCategoryName !== newCategorySelector.name ? ["edc", "mainPage", "inventory"] : tags,
            series: series === newSeries ? newSeriesName : series,
            itemName: title.replace(/ /g, "_"),
            itemOrder: 1, // new product is always first in series
            stripeProductId,
            stripePriceId,
        })
        if (!newProductId) throw new Error("Error creating new product");

        //Update the current photo state
        const updatedPhotos = [...allPhotos, {
            id: newProductId,
            imageUrl: downloadUrl,
            title,
            description,
            category: newCategoryName !== newCategorySelector.name ? newCategoryName : category,
            price: Number(price),
            tags: newCategoryName !== newCategorySelector.name ? ["edc", "mainPage", "inventory"] : tags,
            series: series === newSeries ? newSeriesName : series,
            itemName: title.replace(/ /g, "_"),
            itemOrder: 1, // new product is always first in series
            stripeProductId,
            stripePriceId,
        }]
        handleSetAllPhotos(updatedPhotos)

        navigate("/shop")
        //TODO: Clear form & success message
    }


    return (
        <form onSubmit={handleSubmit} onKeyDown={preventEnterFromSubmitting}
            className="bg-white flex flex-col justify-center m-auto items-center w-[85vw] border-2 border-black rounded-md p-4 mt-4 gap-4"
            style={{ backgroundImage: `url(${background})`, backgroundSize: "cover", backgroundPosition: "center" }}>
            <MainFormTemplate handleClickBack={() => navigate("/shop")} resetState={resetState} >

                <h2 className="text-2xl p-2 rounded-md bg-white">Add Product</h2>

                <CustomInput label="Product Name" value={title} onChange={(e) => setTitle(e.target.value)} type="text" placeholder="Product Name" required={true} />

                {title && <div className="w-full">
                    <label htmlFor="categorySelector" className="w-full select-none">Category</label>
                    <select className={`border-2 border-black rounded-md p-2 w-full 
            ${category !== defaultCategory.name && "bg-gray-200"}`}
                        onChange={(e) => setCategory(e.target.value)} id="categorySelector">
                        {categories.map((category, key) => {
                            return <option key={key} value={category.name}>{category.name}</option>
                        })}
                    </select>
                </div>}

                {category === newCategorySelector.name && <CustomInput label="New Category Name" value={newCategoryName} onChange={(e) => setNewCategoryName(e.target.value)} type="text" placeholder="New Category" required={true} />}
                {category !== defaultCategory.name && <>

                    {(newCategoryName || category !== newCategorySelector.name) && <div className="w-full">
                        <label htmlFor="seriesSelector" className="w-full select-none">Series</label>
                        <select
                            id="seriesSelector"
                            className={`border-2 border-black rounded-md p-2 w-full 
                            ${series !== defaultSeries && "bg-gray-200"}`}
                            onChange={(e) => setSeries(e.target.value)}>
                            {allSeries.map((s, key) => {
                                return <option key={key} value={s}>{s}</option>
                            })}
                        </select>
                    </div>}

                    {series === newSeries && <CustomInput label="New Series Name" value={newSeriesName} onChange={(e) => setNewSeriesName(e.target.value)} type="text" placeholder="New Series" required={true} />}
                    {series !== defaultSeries && (newSeriesName || series !== newSeriesName) &&
                        <>
                            <CustomInput label="Price" value={price ? price.toString() : ""} onChange={(e) => setPrice(Number(e.target.value))} min={1} step="1" type="number" placeholder="Price" required={true} />
                            {Number(price) > 0 && <CustomInput label="Description" value={description} onChange={(e) => setDescription(e.target.value)} type="text" placeholder="Description" required={true} />}
                            {description && <CustomInput label="Sizing (type 'na' if doesn't apply)" value={sizing} onChange={(e) => setSizing(e.target.value)} type="text" placeholder="Sizing" required={true} />}
                            {sizing &&
                                <>
                                    <label htmlFor="fileInput" className="w-full bg-gray-200 p-2 rounded-md text-center cursor-pointer flex justify-center items-center gap-4 border-2 border-edcPurple-60">Select Photo<IoIosCamera /></label>
                                    <input id="fileInput" hidden onChange={(e) => handleFileChange(e, setFile, setBackground)} type="file" required={true} />
                                </>}
                            {file && <button type="submit"
                                className="
                                    bg-edcPurple-60 text-white 
                                    hover:bg-yellow-500 hover:text-edcPurple-60 
                                    rounded-md p-2 w-full">
                                Submit</button>}
                        </>}
                </>}
                {progress > 0 && <LoadingBar progress={progress} />}
            </MainFormTemplate>
        </form>
    )
}