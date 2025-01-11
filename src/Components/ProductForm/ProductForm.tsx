import { useEffect, useState } from "react";
import uploadFile from "../../firebase/uploadFile";
import editFile from "../../firebase/editfile";
import newDoc from "../../firebase/newDoc";
import { IoIosArrowBack, IoIosRefresh, IoIosTrash } from "react-icons/io";
import editDoc from "../../firebase/editDoc";
import { IProductToEdit } from "../../Interfaces/IProduct";
import Info from "../Info/Info";

export default function ProductForm({ product }: { product?: IProductToEdit}) {
    const [title, setTitle] = useState<string>(product?.title || "");
    const [description, setDescription] = useState<string>(product?.description || "");
    const [price, setPrice] = useState<number | null>(product?.price || null);
    const [nextTag, setNextTag] = useState<string>("");
    const [tags, setTags] = useState<string[]>(product?.tags || ["edc"]);
    const [file, setFile] = useState<File | null>(null);
    const [disabled, setDisabled] = useState<boolean>(true);
    const [progress, setProgress] = useState(0)
    const [isEditing, setIsEditing] = useState<boolean>(false)
    const [background, setBackground] = useState<string>(product?.url || "")
    const [series, setSeries] = useState<string>(product?.series || "")
    const [seriesOrder, setSeriesOrder] = useState<number>(product?.seriesOrder || 1)

    //TODO: Simplify this form. 
    //Remove the tags in favor of a dropdown to select where the product should be displayed (ie hero, inventory, vintageCard, handmadeCard)


    function onProgress(percent: number) {
        setProgress(percent)
    }

    useEffect(() => {
        if (isEditing) {
            if (title && description && tags.length > 0 && price && price >= 0) {
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
    }, [title, description, tags, price, file, isEditing])

    useEffect(() => {
        if (product) {
            setIsEditing(true)
        }
    }, [product])


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
        if (!title || !description || !price) return
        if (!file && !isEditing) return

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
        if (isEditing && product && file) {
            downloadURL = await editFile({
                id: product.id,
                title: title,
                description: description,
                tags: tags,
                file: file,
                price: price,
                url: product.url,
                series: series,
                seriesOrder: seriesOrder,
                onProgress: onProgress,
            })
        } else if (isEditing && product) {
            downloadURL = product.url
            await editDoc({ id: product.id, title, description, tags, price, series, seriesOrder })
        }
        else {
            downloadURL = await uploadFile(fileToUpload)
        }

        // Handle success or error dependant on downloadURLd
        if (downloadURL) {
            console.log("Product uploaded successfully: ", downloadURL)
            setIsEditing(false)
            product && product.onProductUpdate({ imageUrl: downloadURL, title, price, description, tags });
            resetState();
            
            // Update the db with new url, if necessary
            if (!isEditing) {
                newDoc({ ...fileToUpload, downloadURL })
            }

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
        <>
            <form onSubmit={handleSubmit} onKeyDown={handleKeyDown}
                className="bg-white flex flex-col justify-center items-center w-[85vw] border-2 border-black rounded-xl p-4 mt-4 gap-4"
                style={{ backgroundImage: `url(${background})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>

                <h2 className="text-2xl">Add Product</h2>

                <input type="text" placeholder="Product Name" value={title}
                    className=" border-2 border-black rounded-md p-2 w-[80%]" onChange={(e) => setTitle(e.target.value)} />


                <div className="w-[80%] relative">
                    <input type="text" placeholder="Product Description" value={description}
                        className=" border-2 border-black rounded-md p-2 w-full" onChange={(e) => setDescription(e.target.value)} />
                    <Info information="Product Description. This is displayed when user clicks 'more info' on any product." />
                </div>

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
                            hover:bg-red-500 hover:cursor-pointer hover:text-white
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

                <div className="flex flex-col gap-2">
                    <label htmlFor="file"
                        className="p-4 bg-green-500 text-white cursor-pointer rounded-md text-center">Upload Image+
                    </label>
                    <input type="file" id="file" placeholder="Product Image"
                        className="hidden" onChange={(e) => handleFileChange(e)} />
                    {file ? <p className="text-center w-full m-auto py-1 px-2 rounded-md text-xs text-gray-400 bg-white">{file.name}</p> : <p className="text-xs text-gray-400">No file selected</p>}
                </div>

                <button type="submit" disabled={disabled} className={`p-2 ${disabled ? 'bg-gray-400' : 'bg-blue-500'} text-white w-[90%] h-full rounded-md p-2 max-w-[75%]`}>{isEditing ? "Edit" : "Add"} Product</button>
                <div className="w-[100%] h-10 m-auto flex justify-between items-center gap-4">
                    {product && <button type="button" onClick={() => product.onProductUpdate({ imageUrl: product.url, title: product.title, price: product.price, description: product.description, tags: product.tags })} className="p-2 bg-blue-500 h-full text-white rounded-md flex justify-around items-center w-[20%]"><IoIosArrowBack /></button>}
                    <button type="button" onClick={resetState} className={'bg-yellow-400 $p-2 text-black w-[20%] h-full rounded-md flex p-2 flex-col justify-center items-center flex-grow max-w-[50%] m-auto'}><IoIosRefresh />Refresh</button>
                    {product && <button type="button" onClick={() => product.onPruductDelete(product.url)} className="p-2 bg-red-600 h-full text-white rounded-md flex justify-around items-center w-[20%] "><IoIosTrash /></button>}
                </div>
            </form>

            {/* TODO: Update this progress bar */}
            {progress > 0 &&
                <div className="absolute bottom-0 w-full p-2 text-center"
                    style={{ background: `linear-gradient(to right, #4CAF50 ${progress}%, #f1f1f1 ${progress}%)` }}>
                    <p>Upload Progress: {progress}%</p>
                </div>
            }
        </>
    )
}