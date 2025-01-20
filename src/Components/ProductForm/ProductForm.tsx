import { useEffect, useState } from "react";
import uploadFile from "../../firebase/uploadFile";
import editFile from "../../firebase/editfile";
import newDoc from "../../firebase/newDoc";
import { IoIosArrowBack, IoIosRefresh, IoIosTrash } from "react-icons/io";
import editDoc from "../../firebase/editDoc";
import Info from "../Info/Info";
import { useProductManagementContext } from "../../Context/ProductMgmtContext";
import { usePhotosContext } from "../../Context/PhotosContext";
import { useLocation } from "react-router-dom";

export default function ProductForm() {
    const { product, isEditing, setIsEditing, handleDelete } = useProductManagementContext();
    const { allPhotos, handleSetAllPhotos } = usePhotosContext();
    const [title, setTitle] = useState<string>(product?.title || "");
    const [description, setDescription] = useState<string>(product?.description || "");
    const [price, setPrice] = useState<number>(product?.price || 0);
    const [nextTag, setNextTag] = useState<string>("");
    const [tags, setTags] = useState<string[]>(product?.tags || ["edc"]);
    const [file, setFile] = useState<File | null>(null);
    const [disabled, setDisabled] = useState<boolean>(true);
    const [progress, setProgress] = useState(0)
    const [background, setBackground] = useState<string>(product?.imageUrl || "")
    const [series, setSeries] = useState<string | undefined>(product?.series || "")
    const [seriesOrder, setSeriesOrder] = useState<number | undefined>(product?.seriesOrder || 1)
    const [isInventory, setIsInventory] = useState<boolean>(true)
    const [isHero, setIsHero] = useState<boolean>(false)

    const location = useLocation();

    useEffect(() => {
        if (product) {
            setTitle(product.title);
            setDescription(product.description);
            setPrice(product.price);
            setTags(product.tags);
            setBackground(product.imageUrl);
            setSeries(product.series);
            setSeriesOrder(product.seriesOrder);
            if (product.tags.includes('hero')) {
                setIsHero(true)
                setIsInventory(false)
            }
            if (
                product.tags.includes('mainPageVintage') ||
                product.tags.includes('mainPageHandMade')) {
                setIsInventory(false)
            }
        }
    }, [product, isEditing, location]);

    useEffect(() => {
        if (isEditing) {
            if (!isInventory && product && isEditing) {
                if (product.title !== title || product.description !== description || file) {
                    setDisabled(false);
                }
            }
            else if (title && description && tags.length > 0 && price && price >= 0) {
                setDisabled(false);
            } else {
                setDisabled(true);
            }
        } else {
            if (title && description && tags.length > 0 && price && price >= 0 && file) {
                setDisabled(false);
            } else {
                setDisabled(true);
            }
        }
    }, [title, description, tags, price, file, isEditing, isInventory])

    function onProgress(percent: number) {
        setProgress(percent)
    }
    const BACKEND = import.meta.env.VITE_BACKEND_URL

    async function createStripeProduct() {
        const stripeProduct = {
            name: title,
            description: description,
            price: price,
        }
        const createProductEndpoint = `${BACKEND}/create-product`
        console.log("sending fetch to : ", createProductEndpoint)
        const resp = await fetch(createProductEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(stripeProduct)
        })
        if (resp.ok) {
            console.log("Product created successfully")
            const { stripeProductId, stripePriceId } = await resp.json()
            return { stripeProductId, stripePriceId }
        } else {
            console.log("Error creating product: ", resp)
            throw new Error("Error creating stripe product and price")
        }
    }

    async function editStripeProduct() {
        const stripeProduct = {
            stripeProductId: product?.stripeProductId,
            name: title,
            description: description,
            newPrice: price,
        }
        const editProductEndpoint = `${BACKEND}/edit-product`
        console.log("sending fetch to : ", editProductEndpoint)
        const resp = await fetch(editProductEndpoint, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(stripeProduct)
        }); if (resp.ok) {
            console.log("Product edited successfully")
            const { stripeProductId, stripePriceId } = await resp.json()
            return { stripeProductId, stripePriceId }
        } else {
            console.log("Error editing Stripe Product/Price: ", resp)
            throw new Error("Error editing stripe product and price")
        }
    }

    function handleKeyDown(event: React.KeyboardEvent<HTMLFormElement>) {
        if (event.key === 'Enter') {
            event.preventDefault();
            handleAddTag();
        }
    };

    function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        if (e.target.files) {
            const selectedFile = e.target.files[0];
            setFile(selectedFile);
            const fileURL = URL.createObjectURL(selectedFile);
            setBackground(fileURL);
        }
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        if (!file && !isEditing) return // On new products a file is required

        const fileToUpload = {
            reference: `photos/${title.replace(" ", "_")}`,
            title: title,
            description: description,
            tags: tags,
            file: file as File,
            price: price,
            series: series,
            seriesOrder: seriesOrder,
            onProgress: onProgress,
        }

        // Set download url based on editing vs new upload
        let downloadURL = null;
        if (isEditing && product && file) { // if image included use editFile()
            console.log("Editing product with new image")
            downloadURL = await editFile({
                id: product.id,
                title: title,
                description: description,
                tags: tags,
                file: file,
                price: price,
                url: product.imageUrl,
                series: series,
                seriesOrder: seriesOrder,
                onProgress: onProgress,
            })
        } else if (isEditing && product) { // Otherwise we use the current url and editDoc()
            console.log("Editing product without changing image")
            downloadURL = product.imageUrl
            const { stripeProductId, stripePriceId } = await editStripeProduct()
            await editDoc({ id: product.id, title, description, tags, price, series, seriesOrder, imageUrl: downloadURL, stripeProductId, stripePriceId })
        }
        else {
            console.log("Uploading new product")
            downloadURL = await uploadFile(fileToUpload)
        }

        // Handle success or error dependant on downloadURLd
        if (downloadURL) {
            console.log("Product uploaded successfully: ", downloadURL)

            // Update the db with new url, if necessary
            if (!isEditing) {
                const { stripeProductId, stripePriceId } = await createStripeProduct()
                newDoc({ ...fileToUpload, downloadURL, series: series ?? "", seriesOrder: seriesOrder ?? 1, stripeProductId, stripePriceId })
            }

            // update UI to show updated product
            if (product) {
                console.log('updating product in allPhotos')
                const updatedPhotos = allPhotos.map((photo) =>
                    photo.id === product.id ? { ...photo, imageUrl: downloadURL, title, description, tags, price, series, seriesOrder } : photo
                );
                handleSetAllPhotos(updatedPhotos)
            }
            resetState();
            setIsEditing(false);

            // TODO: show success message with image and option to edit...
        }
        else {
            console.log("Error uploading photo: ")
            // TODO: show error modal
        }
    }

    function resetState() {
        setTitle("")
        setDescription("")
        setPrice(0.00)
        setTags(["edc"])
        setFile(null)
        setNextTag("")
        setBackground("")
        setSeries("")
        setSeriesOrder(1)
        setProgress(0)
    }

    function handleAddTag() {
        if (nextTag === "" || tags.includes(nextTag)) return
        setTags([...tags, nextTag])
        setNextTag("")
    }

    function handleRemoveTag(tag: string) {
        return () => {
            setTags(tags.filter((t) => t !== tag))
        }
    }

    return (
        <div className="w-screen h-screen min-h-fit overflow-scroll">
            <form onSubmit={handleSubmit} onKeyDown={handleKeyDown}
                className="bg-white flex flex-col justify-center m-auto items-center w-[85vw] border-2 border-black rounded-md p-4 mt-4 gap-4"
                style={{ backgroundImage: `url(${background})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>

                <h2 className="text-2xl p-2 rounded-md bg-white">Add Product</h2>

                <div className="flex flex-col w-[80%] justify-between items-center">
                    <label className="text-xs p-1 rounded-t-md w-[10rem] text-center bg-white">Product Name</label>
                    <input type="text" placeholder="Product Name" value={title}
                        className=" border-2 border-black rounded-md p-2 w-full" onChange={(e) => setTitle(e.target.value)} />
                </div>

                {!isHero && // Show description only if this is not a hero item
                    <div className="w-[80%] relative">
                        <input type="text" placeholder="Product Description" value={description}
                            className=" border-2 border-black rounded-md p-2 w-full" onChange={(e) => setDescription(e.target.value)} />
                        <Info information="Product Description. This is displayed when user clicks 'more info' on any product." />
                    </div>
                }

                {isInventory && // Show Tags Series & price only if this is an inventory item
                    <>
                        <div className="flex flex-col items-between w-[80%] ">

                            <div className="w-full relative">
                                <input type="text" placeholder="Product Tags" value={nextTag}
                                    className=" border-2 border-black rounded-md p-2 w-[100%]" onChange={(e) => setNextTag(e.target.value.trim())} />
                                <Info information="Product Tags. These are used to group products together. 'hero' adds this to the top of the main page, 'inventory' makes this appear in the store! 'vintage' updates the 'Embellished Vintage' category, and 'handmade' updates the 'Hand-Made Originals' category" />
                            </div>

                            <div className="w-full flex flex-wrap justify-start items-start">
                                {tags.map((tag, index) => tag === "edc" ? null : (
                                    <div
                                        onClick={handleRemoveTag(tag)}
                                        className="
                            hover:bg-rose-600 hover:cursor-pointer hover:text-white
                            bg-white text-gray-400
                            border-[1px] border-gray-400 
                            rounded-md p-[2px] m-[2px] 
                            flex items-center"
                                        key={index}>
                                        <p className="text-xs inline" >{tag}</p>
                                        <button type="button" className="text-xs mx-1 " >x</button>
                                    </div>))}
                            </div>
                            <button type="button" className="p-2 bg-green-500 text-white rounded-md mt-2"
                                onClick={handleAddTag} >Add Tag+</button>
                        </div>

                        <div className="w-[80%] flex relative">
                            <Info information="Product Series are used to group products together. Series Order is used to determine the order in which products are displayed in a series." />
                            <input placeholder="Product Series" value={series} className=" border-2 border-black rounded-md p-2 w-[60%] inline" onChange={(e) => setSeries(e.target.value)} />
                            <div className="w-[40%] relative">
                                <input value={seriesOrder} type="number" min={1} step="1" className="border-2 border-black rounded-md p-2 w-full z-4" onChange={(e) => setSeriesOrder(parseInt(e.target.value))} />
                                <label htmlFor="seriesOrder" className="text-xs text-gray-400 absolute top-1/3 right-4 md:right-10">Order</label>
                            </div>
                        </div>

                        <input type="number" min={0} step="1" placeholder="Product Price" value={price || ""}
                            className=" border-2 border-black rounded-md p-2 w-[80%]" onChange={(e) => setPrice(Number(Number((e.target.value)).toFixed(0)))} />
                    </>}

                <div className="flex flex-col gap-2">
                    <label htmlFor="file"
                        className="p-4 bg-green-500 text-white cursor-pointer rounded-md text-center">Upload Image+
                    </label>
                    <input type="file" id="file" placeholder="Product Image"
                        className="hidden" onChange={(e) => handleFileChange(e)} />
                    {file ? <p className="text-center w-full m-auto py-1 px-2 rounded-md text-xs text-gray-400 bg-white">{file.name}</p> : <p className="text-xs text-gray-400">No file selected</p>}
                </div>

                <button type="submit" disabled={disabled} className={`p-2 ${disabled ? 'bg-gray-400' : 'bg-blue-500'} text-white w-[90%] h-full rounded-md p-2 max-w-[75%]`}>{isEditing ? "Edit" : "Add"} Product</button>

                <div className="w-[100%] h-10 m-auto flex justify-center items-center gap-4">
                    {product && location.pathname !== "/admin" && <button type="button"
                        onClick={() => setIsEditing(false)} className="p-2 bg-blue-500 h-full text-white rounded-md flex justify-around items-center w-[20%]">
                        <IoIosArrowBack /></button>}
                    <button type="button" onClick={resetState}
                        className={'bg-yellow-400 text-black w-[20%] h-full rounded-md flex p-2 flex-col justify-center items-center '}>
                        <IoIosRefresh /></button>
                    {product && isInventory && location.pathname !== "/admin" && <button type="button" onClick={() => handleDelete(product.imageUrl, product.id)} className="p-2 bg-rose-600 h-full text-white rounded-md flex justify-around items-center w-[20%] ">
                        <IoIosTrash /></button>}
                </div>

            </form>

            {/* TODO: Update this progress bar */}
            {progress > 0 &&
                <div className="absolute bottom-0 w-full p-2 text-center"
                    style={{ background: `linear-gradient(to right, #4CAF50 ${progress}%, #f1f1f1 ${progress}%)` }}>
                    <p>Upload Progress: {progress}%</p>
                </div>
            }
        </div>
    )
}