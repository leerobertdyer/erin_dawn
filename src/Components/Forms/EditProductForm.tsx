import { useEffect, useState } from "react";
import { useProductManagementContext } from "../../Context/ProductMgmtContext";
import { preventEnterFromSubmitting } from "./formUtil";
import MainFormTemplate from "./MainFormTemplate";
import CustomInput from "../CustomInput/CustomInput";
import WarningDialogue from "../WarningDialogue/WarningDialogue";
import {
  editProductDoc,
  editCategoryDoc,
  addNewSeries,
} from "../../firebase/editDoc";
import { addNewCategory, safeName } from "../../firebase/newDoc";
import { BACKEND_URL } from "../../util/constants";
import PhotoManager from "../PhotoManager/PhotoManager";
import { IProductInfo } from "../../Interfaces/IProduct";
import { IGeneralPhoto } from "../../Interfaces/IPhotos";
import SubmitBtn from "../Buttons/SubmitBtn";
import { ICategory } from "../../Interfaces/ICategory";

interface IEditProductFormProps {
  onClose: () => void;
  product: IProductInfo;
}

export default function EditProductForm({
  onClose,
  product,
}: IEditProductFormProps) {
  const {
    handleDeleteProduct,
    allProducts,
    setAllProducts,
    allCategories,
    setAllCategories,
  } = useProductManagementContext();

  const [title, setTitle] = useState(product.title ?? "");
  const [description, setDescription] = useState(product.description ?? "");
  const [price, setPrice] = useState(product.price ?? 0.0);
  const [size, setSize] = useState(product.size ?? "");
  const [dimensions, setDimensions] = useState(product.dimensions ?? "");
  const [background, setBackground] = useState(product.photos[0].url ?? "");
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPhotoManager, setShowPhotoManager] = useState(false);
  const [categoryName, setCategoryName] = useState(product.category ?? "");
  const [series, setSeries] = useState(product.series ?? "");
  const [hidden, setHidden] = useState(product.hidden ?? false);
  const [sold, setSold] = useState(product.sold ?? false);
  const [productToEdit, setProductToEdit] = useState(product);
  const [allSeries, setAllSeries] = useState([]);
  const [allCurrentCategories, setAllCurrentCategories] = useState([]);
  const [newSeriesName, setNewSeriesName] = useState("");
  const [isNewSeries, setIsNewSeries] = useState(false);
  const [isNewCategory, setIsNewCategory] = useState(false);

  const newSeriesSelector = "--NEW SERIES--";

  useEffect(() => {
    const newCategorySelector: ICategory = {
      name: "--NEW CATEGORY--",
      series: [newSeriesSelector],
      url: "",
    };
    const currentCategory = allCategories.find(
      (cat) => cat.name === categoryName
    );
    console.log(currentCategory, allCategories, categoryName);
    setAllCurrentCategories([...allCategories, newCategorySelector]);
    const allSeries = currentCategory?.series
      ? [...currentCategory.series, newSeriesSelector]
      : [newSeriesSelector];
    setAllSeries(allSeries ?? [newSeriesSelector]);
    // Reset series state when category changes
    setIsNewSeries(false);
    setNewSeriesName("");
    if (categoryName === newCategorySelector.name) setIsNewCategory(true);
  }, [categoryName, allCategories]);

  async function handleAddCategory(c: ICategory) {
    if (!isNewCategory) return;
    await addNewCategory(c);
    setAllCategories([...allCategories, c]);
  }

  async function handleEditCategory(c: ICategory) {
    if (!isNewSeries) return;
    const currentCategory = allCategories.find((cat) => cat.name === c.name);
    if (!currentCategory) return;
    const updatedCategory = {
      ...currentCategory,
      series: [...currentCategory.series, series],
    };
    await editCategoryDoc(updatedCategory);
  }
  async function editStripeProduct() {
    const stripeProduct = {
      stripeProductId: productToEdit?.stripeProductId,
      name: title,
      description: description,
      newPrice: price,
    };
    const editProductEndpoint = `${BACKEND_URL}/edc/edit-product`;
    console.log("sending fetch to : ", editProductEndpoint);
    const resp = await fetch(editProductEndpoint, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(stripeProduct),
    });
    if (resp.ok) {
      console.log("Product edited successfully");
      const { stripeProductId, stripePriceId } = await resp.json();
      return { stripeProductId, stripePriceId };
    } else {
      console.error("Error editing Stripe Product/Price: ", resp);
      throw new Error("Error editing stripe product and price");
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);

    if (!productToEdit) {
      setIsSubmitting(false);
      return;
    }

    if (isNewSeries) {
      await addNewSeries({
        id: safeName(series),
        name: series,
        photos: productToEdit.photos,
      });
    }

    if (isNewCategory)
      await handleAddCategory({
        name: categoryName,
        series: [series],
        url: productToEdit.photos[0].url,
      });

    if (isNewSeries && !isNewCategory)
      await handleEditCategory({
        name: categoryName,
        series: [series],
        url: productToEdit.photos[0].url,
      });

    const { stripeProductId, stripePriceId } = await editStripeProduct();

    const productUpdate = {
      id: productToEdit.id,
      title,
      description,
      price,
      size,
      dimensions,
      photos: productToEdit.photos,
      stripeProductId,
      stripePriceId,
      sold,
      category: categoryName,
      series,
      hidden,
    };

    await editProductDoc(productUpdate);

    const nextProducts = allProducts.map((product) => {
      return product.id === productToEdit.id ? productUpdate : product;
    });

    setAllProducts(nextProducts);
    // if isNewCategory, add new category to allCategories
    // if isNewSeries !isNewCategory editCategoryDoc
    onClose();
  }

  function resetState() {
    setTitle(productToEdit?.title ?? "");
    setDescription(productToEdit?.description ?? "");
    setPrice(productToEdit?.price ?? 0.0);
    setBackground(productToEdit?.photos[0].url ?? "");
    setProductToEdit(product);
    setIsSubmitting(false);
    setCategoryName(productToEdit?.category ?? "");
    setSeries(productToEdit?.series ?? "");
    setSize(productToEdit?.size ?? "");
    setDimensions(productToEdit?.dimensions ?? "");
    setSold(productToEdit?.sold ?? false);
    setHidden(productToEdit?.hidden ?? false);
  }

  function onClickDelete() {
    setIsDeleting(true);
  }

  function onFinalDelete(productToDelete: IProductInfo) {
    setAllProducts(allProducts.filter((p) => p.id !== productToDelete.id));
    handleDeleteProduct(productToDelete);
    setIsDeleting(false);
    onClose();
  }

  // PhotoManager callback
  function handlePhotoUpdate(updatedPhotos: IGeneralPhoto[]) {
    setProductToEdit({ ...productToEdit, photos: updatedPhotos });
    setShowPhotoManager(false);
  }

  // Handle edit category

  // Handle edit series

  if (showPhotoManager) {
    return (
      <PhotoManager
        product={productToEdit}
        handleBack={() => setShowPhotoManager(false)}
        onSave={handlePhotoUpdate}
      />
    );
  }

  if (isDeleting)
    return (
      <WarningDialogue
        closeDialogue={() => setIsDeleting(false)}
        onYes={() => onFinalDelete(productToEdit)}
      />
    );

  return (
    <MainFormTemplate
      product={productToEdit}
      handleClickBack={onClose}
      resetState={resetState}
      handleDelete={onClickDelete}
    >
      <div className="fixed inset-0 flex flex-col items-center h-screen bg-gray-50 overflow-y-auto">
        <h2 className="text-2xl p-2 text-center bg-white sticky top-0 z-10 mb-4 w-full">
          Edit Product
        </h2>

        <form
          onSubmit={handleSubmit}
          onKeyDown={preventEnterFromSubmitting}
          className="relative flex flex-col justify-center items-center w-[85vw] md:w-[65vw] h-fit border-2 border-black rounded-md p-4 mt-4 mb-[7rem] gap-4"
        >
          <div className="relative z-10 flex flex-col w-full gap-4">
            <CustomInput
              type="text"
              label="Product Name"
              placeholder="Product Name"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <CustomInput
              type="textarea"
              label="Product Description"
              placeholder="Product Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <CustomInput
              type="number"
              label="Product Price"
              placeholder="Product Price"
              value={price.toString()}
              onChange={(e) =>
                setPrice(Number(Number(e.target.value).toFixed(2)))
              }
            />
            <select
              className="border-2 border-black rounded-md p-2 w-full"
              onChange={(e) => setSize(e.target.value)}
              value={size}
            >
              <option value="" disabled>
                Select Size
              </option>
              <option value="sm">Small</option>
              <option value="md">Medium</option>
              <option value="lg">Large</option>
              <option value="xl">XL</option>
              <option value="2xl">2XL</option>
              <option value="3xl">3XL</option>
            </select>
            <CustomInput
              type="text"
              label="Dimensions"
              placeholder="Dimensions"
              value={dimensions}
              onChange={(e) => setDimensions(e.target.value)}
            />

            <CustomInput
              type="checkbox"
              label="Hidden"
              value={hidden.toString()}
              checked={hidden}
              onChange={(e) => setHidden(e.target.value === "true")}
            />

            <CustomInput
              type="checkbox"
              label="Sold"
              value={sold.toString()}
              checked={sold}
              onChange={(e) => setSold(e.target.value === "true")}
            />

            {/* Categories */}
            <select
              className="border-2 border-black rounded-md p-2 w-full"
              onChange={(e) => setCategoryName(e.target.value)}
              value={categoryName}
            >
              {allCurrentCategories.map((category) => (
                <option key={category.name} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>

            {/* Series */}
            <select
              className="border-2 border-black rounded-md p-2 w-full"
              onChange={(e) => setSeries(e.target.value)}
              value={series}
            >
              {allSeries.map((series) => (
                <option key={series} value={series}>
                  {series}
                </option>
              ))}
            </select>

            {series === newSeriesSelector && (
              <CustomInput
                type="text"
                label="Series"
                placeholder="Series"
                value={newSeriesName}
                onChange={(e) => setNewSeriesName(e.target.value)}
              />
            )}

            {/* Preview current photos with manage button */}
            <div className="relative w-full mb-4">
              <img
                src={background}
                alt={title}
                className="w-full h-64 object-cover rounded-md"
              />
              <button
                onClick={() => setShowPhotoManager(true)}
                className="absolute bottom-4 right-4 bg-black bg-opacity-50 text-white px-4 py-2 rounded-md hover:bg-opacity-75"
              >
                Manage Photos ({productToEdit.photos.length})
              </button>
            </div>

            <SubmitBtn progress={isSubmitting ? 1 : 0} />
          </div>
        </form>
      </div>
    </MainFormTemplate>
  );
}
