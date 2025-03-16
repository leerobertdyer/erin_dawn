import { useState } from "react";
import { ICategory } from "../../Interfaces/ICategory";
import CustomInput from "../CustomInput/CustomInput";
import { IoIosCamera } from "react-icons/io";
import uploadFile from "../../firebase/uploadFile";
import { addNewProductDoc, addNewCategory } from "../../firebase/newDoc";
import { editCategoryDoc } from "../../firebase/editDoc";
import { createStripeProduct } from "../../Stripe/newStripe";
import LoadingBar from "../LoadingBar/LoadingBar";
import { handleMultipleFileChange, preventEnterFromSubmitting } from "./formUtil";
import MainFormTemplate from "./MainFormTemplate";
import { resizeFile } from "../../util/resizeFile";
import { NEW_PRODUCT_DEFAULT_HEIGHT, NEW_PRODUCT_DEFAULT_WIDTH, NEW_PRODUCT_IMAGE_QUALITY } from "../../util/constants";
import { useProductManagementContext } from "../../Context/ProductMgmtContext";
import getProductPhotosToUpload from "../../util/getProductPhotosToUpload";
import SubmitBtn from "../Buttons/SubmitBtn";

interface INewProductForm {
    onClose: () => void;
}

export default function NewProductForm({ onClose }: INewProductForm) {
    const { allProducts, setAllProducts, allCategories, setAllCategories } = useProductManagementContext();

    // Basic product info
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState<number | null>(null);
    const [size, setSize] = useState("");
    const [dimensions, setDimensions] = useState("");
    const [files, setFiles] = useState<File[] | null>(null);
    const [background, setBackground] = useState("");
    const [progress, setProgress] = useState(0);
    const [sizeChecked, setSizeChecked] = useState(false);

    // Category and Series handling
    const [selectedCategoryName, setSelectedCategoryName] = useState("");
    const [isAddingNewCategory, setIsAddingNewCategory] = useState(false);
    const [newCategory, setNewCategory] = useState<ICategory>({
        name: "",
        series: [],
        url: ""
    });
    const [selectedSeries, setSelectedSeries] = useState("");
    const [isAddingNewSeries, setIsAddingNewSeries] = useState(false);
    const [newSeriesName, setNewSeriesName] = useState("");

    // Direct category lookup
    const selectedCategory = allCategories.find(c => c.name === selectedCategoryName);
    const availableSeries = selectedCategory?.series || [];

    // Category handling
    const handleCategorySelection = (action: 'select' | 'add-new') => {
        if (action === 'add-new') {
            setIsAddingNewCategory(true);
            setSelectedCategoryName("");
            setNewCategory({ name: "", series: [], url: "" });
            // Reset series when switching to new category
            setSelectedSeries("");
            setIsAddingNewSeries(false);
            setNewSeriesName("");
        } else {
            setIsAddingNewCategory(false);
            setNewCategory({ name: "", series: [], url: "" });
        }
    };

    // Series handling
    const handleSeriesSelection = (action: 'select' | 'add-new') => {
        if (action === 'add-new') {
            setIsAddingNewSeries(true);
            setSelectedSeries("");
            setNewSeriesName("");
        } else {
            setIsAddingNewSeries(false);
            setNewSeriesName("");
        }
    };

    async function handleUploadCategoryPhoto(file: File) {
        const resizedFile = await resizeFile(file, {
            maxWidth: 1200,
            maxHeight: 1400,
            maintainAspectRatio: true,
            quality: NEW_PRODUCT_IMAGE_QUALITY
        });

        const fileToUpload = {
            reference: newCategory.name.replace(/\s/g, "_") + Date.now().toString(),
            file: resizedFile,
            onProgress
        }

        const downloadUrl = await uploadFile(fileToUpload);
        if (!downloadUrl) throw new Error("Error uploading category photo");
        
        // Update the newCategory object with the URL
        setNewCategory(prev => ({ ...prev, url: downloadUrl }));
        return downloadUrl;
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (!files) return;

        let categoryToUse = selectedCategory;
        let seriesToUse = selectedSeries;

        // Handle new category creation
        if (isAddingNewCategory && newCategory.name) {
            // Upload category photo first
            const downloadUrl = await handleUploadCategoryPhoto(files[0]);
            
            // Create the complete category object
            const completeCategory: ICategory = {
                name: newCategory.name,
                series: isAddingNewSeries && newSeriesName ? [newSeriesName] : [],
                url: downloadUrl
            };
            
            // Create category and update state
            await addNewCategory(completeCategory);
            setAllCategories([...allCategories, completeCategory]);
            categoryToUse = completeCategory;
            seriesToUse = newSeriesName;
        }
        
        // Handle new series for existing category
        if (!isAddingNewCategory && isAddingNewSeries && newSeriesName) {
            const updatedCategory = {
                ...selectedCategory!,
                series: [...selectedCategory!.series, newSeriesName]
            };
            await editCategoryDoc(updatedCategory);
            setAllCategories(allCategories.map(c => c.name === selectedCategoryName ? updatedCategory : c));
            categoryToUse = updatedCategory;
            seriesToUse = newSeriesName;
        }

        // Create product
        const photosUploaded = await getProductPhotosToUpload(files, title, ["edc", "inventory"], NEW_PRODUCT_DEFAULT_WIDTH, NEW_PRODUCT_DEFAULT_HEIGHT, setProgress);
        const { stripeProductId, stripePriceId } = await createStripeProduct(title, description, Number(price));

        const newProduct = {
            title,
            description,
            price: Number(price),
            size,
            dimensions,
            photos: photosUploaded,
            stripeProductId,
            stripePriceId,
            category: categoryToUse.name,
            series: seriesToUse,
            hidden: false,
            sold: false
        };

        const newProductId = await addNewProductDoc(newProduct);
        if (!newProductId) throw new Error("Failed to create product");

        setAllProducts([...allProducts, { ...newProduct, id: newProductId }]);
        onClose();
    }

    function resetState() {
        setTitle("");
        setNewCategory({
            id: "",
            name: "",
            url: "",
            series: []
        });
    }

    function onProgress(p: number) { setProgress(p) }

    return (
        <MainFormTemplate handleClickBack={onClose} resetState={resetState}> 
            <div className="fixed inset-0 flex flex-col items-center h-screen bg-gray-50 overflow-y-auto">
            <h2 className="text-2xl p-2 text-center bg-white sticky top-0 z-10 mb-4 w-full">Add Product</h2>

            <form onSubmit={handleSubmit} onKeyDown={preventEnterFromSubmitting}
                style={
                    {
                        backgroundImage: `url('${background}')`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                    }
                }
                className="bg-white flex flex-col justify-center m-auto items-center w-[85vw] md:w-[65vw] h-fit border-2 border-black rounded-md p-4 mt-4 mb-[7rem] gap-4 text-xs sm:text-sm md:text-base">
            <CustomInput 
                label="Product Name" 
                value={title} 
                onChange={(e) => setTitle(e.target.value)} 
                type="text" 
                placeholder="Product Name" 
                required 
            />

            {/* Category Selection */}
            <div className="flex flex-col w-full gap-4">
                <div className="flex gap-2 ">
                    <button 
                        type="button"
                        onClick={() => handleCategorySelection('select')}
                        className={`flex-1 p-2 rounded-md w-[13rem] ${!isAddingNewCategory ? 'bg-edcPurple-60 text-white' : 'bg-gray-200'}`}
                    >
                        Select Category
                    </button>
                    <button 
                        type="button"
                        onClick={() => handleCategorySelection('add-new')}
                        className={`flex-1 p-2 rounded-md w-[13rem] ${isAddingNewCategory ? 'bg-edcPurple-60 text-white' : 'bg-gray-200'}`}
                    >
                        Add New Category
                    </button>
                </div>

                {isAddingNewCategory ? (
                    <CustomInput 
                        label="New Category Name"
                        value={newCategory.name}
                        onChange={(e) => setNewCategory(prev => ({ ...prev, name: e.target.value }))}
                        type="text"
                        placeholder="Enter category name"
                        required
                    />
                ) : (
                    <select 
                        className="w-full p-2 border-2 border-black rounded"
                        value={selectedCategoryName}
                        onChange={(e) => setSelectedCategoryName(e.target.value)}
                        required
                    >
                        <option value="">Select a category</option>
                        {allCategories.map(cat => (
                            <option key={cat.name} value={cat.name}>
                                {cat.name}
                            </option>
                        ))}
                    </select>
                )}
            </div>

            {/* Series Selection - Only show if category is selected or being created */}
            {(selectedCategoryName || isAddingNewCategory) && (
                <div className="flex flex-col w-full gap-4">
                    <div className="flex gap-2">
                        <button 
                            type="button"
                            onClick={() => handleSeriesSelection('select')}
                            className={`flex-1 p-2 rounded-md w-[13rem] ${!isAddingNewSeries ? 'bg-edcPurple-60 text-white' : 'bg-gray-200'}`}
                        >
                            Select Series
                        </button>
                        <button 
                            type="button"
                            onClick={() => handleSeriesSelection('add-new')}
                            className={`flex-1 p-2 rounded-md w-[13rem] ${isAddingNewSeries ? 'bg-edcPurple-60 text-white' : 'bg-gray-200'}`}
                        >
                            Add New Series
                        </button>
                    </div>

                    {isAddingNewSeries ? (
                        <CustomInput 
                            label="New Series Name"
                            value={newSeriesName}
                            onChange={(e) => setNewSeriesName(e.target.value)}
                            type="text"
                            placeholder="Enter series name"
                            required
                        />
                    ) : (
                        <select 
                            className="w-full p-2 border-2 border-black rounded"
                            value={selectedSeries}
                            onChange={(e) => setSelectedSeries(e.target.value)}
                            required
                        >
                            <option value="">Select a series</option>
                            {availableSeries.map(series => (
                                <option key={series} value={series}>
                                    {series}
                                </option>
                            ))}
                        </select>
                    )}
                </div>
            )}

            <CustomInput 
                label="Price" 
                value={price ? price.toString() : ""} 
                onChange={(e) => setPrice(Number(e.target.value))} 
                min={.01} 
                type="number" 
                placeholder="Price" 
                required 
            />
            {Number(price) > 0 && <CustomInput 
                label="Description" 
                value={description} 
                onChange={(e) => setDescription(e.target.value)} 
                type="textarea" 
                placeholder="Description" 
                required 
            />}
            {description && <CustomInput 
                type="checkbox" 
                value={''} 
                label="Add Size Info?" 
                onChange={(e) => {
                    if ('checked' in e.target) {
                        setSizeChecked(e.target.checked);
                    }
                }} 
            />}

            {sizeChecked && 
                <select className="border-2 border-black rounded-md p-2 w-full" onChange={(e) => setSize(e.target.value)} value={size}>
                    <option value="" disabled>Select Size</option>
                    <option value="sm">Small</option>
                    <option value="md">Medium</option>
                    <option value="lg">Large</option>
                    <option value="xl">XL</option>
                    <option value="2xl">2XL</option>
                    <option value="3xl">3XL</option>
                </select>}

            <CustomInput 
                label="Dimensions" 
                value={dimensions} 
                onChange={(e) => setDimensions(e.target.value)} 
                type="text" 
                placeholder="Dimensions" 
                required 
            />
            
            <label htmlFor="fileInput" className="w-full bg-gray-200 p-2 rounded-md text-center cursor-pointer flex justify-center items-center gap-4 border-2 border-edcPurple-60">Select Photo<IoIosCamera /></label>
            <input id="fileInput" hidden multiple onChange={(e) => handleMultipleFileChange(e, setFiles, setBackground)} type="file" required={true} />
            {files && files.length > 0 && <SubmitBtn progress={progress} />}
            {progress > 0 && <LoadingBar progress={progress} />}
        </form>
        </div>

        </MainFormTemplate>
    )
}