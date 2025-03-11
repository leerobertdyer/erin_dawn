import { useState } from "react";
import { handleFileChange, preventEnterFromSubmitting } from "./formUtil";
import MainFormTemplate from "./MainFormTemplate";
import { useProductManagementContext } from "../../Context/ProductMgmtContext";
import { IoIosCamera } from "react-icons/io";
import LoadingBar from "../LoadingBar/LoadingBar";
import CustomInput from "../CustomInput/CustomInput";
import editFile from "../../firebase/editfile";
import { resizeFile } from "../../util/resizeFile";
import { editCategoryDoc, editProductDoc } from "../../firebase/editDoc";
import { NEW_PRODUCT_IMAGE_QUALITY } from "../../util/constants";
import { ICategory } from "../../Interfaces/ICategory";
import SubmitBtn from "../Buttons/SubmitBtn";

interface ICategeroyFormProps {
  categoryToEdit: ICategory;
  onClose: () => void;
}

export default function EditCategoryForm({
  categoryToEdit,
  onClose,
}: ICategeroyFormProps) {
  const { allProducts, setAllProducts, setAllCategories, allCategories } =
    useProductManagementContext();

  const [background, setBackground] = useState(categoryToEdit?.url ?? "");
  const [category, setCategory] = useState<ICategory>({ ...categoryToEdit });
  const [file, setFile] = useState<File | null>();
  const [progress, setProgress] = useState(0);

  function onProgress(percent: number) {
    setProgress(percent);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!categoryToEdit) return;

    // Create the updated category object
    const updatedCategory = { ...category };

    // Handle file upload if needed
    if (file) {
      const resizedFile = await resizeFile(file, {
        maxWidth: 1200,
        maxHeight: 1400,
        maintainAspectRatio: true,
        quality: NEW_PRODUCT_IMAGE_QUALITY,
      });

      const downloadUrl = await editFile({
        url: categoryToEdit.url,
        file: resizedFile,
        title: categoryToEdit.name,
        onProgress,
      });

      if (!downloadUrl) throw new Error("Failed to upload file");
      setBackground(downloadUrl);
      updatedCategory.url = downloadUrl;
    }

    // Update the category in Firestore
    await editCategoryDoc(updatedCategory);

    // Update products that use this category
    const productsWithCategory = allProducts.filter(
      (p) => p.category === categoryToEdit.name
    );
    for (const p of productsWithCategory) {
      if (p.category === categoryToEdit.name) {
        await editProductDoc({
          ...p,
          category: updatedCategory.name,
        });
      }
    }

    // Update local state
    setAllProducts(
      allProducts.map((p) =>
        p.category === categoryToEdit.name
          ? { ...p, category: updatedCategory.name }
          : p
      )
    );

    setAllCategories(
      allCategories.map((c) =>
        c.name === categoryToEdit.name ? updatedCategory : c
      )
    );

    onClose();
  }

  function resetState() {
    setBackground(categoryToEdit?.url ?? "");
    setFile(null);
    setCategory({ ...categoryToEdit });
  }

  return (
    <MainFormTemplate
      handleClickBack={onClose}
      resetState={resetState}
    >
      <div className="fixed inset-0 flex flex-col items-center h-screen bg-gray-50 overflow-y-auto">
        <h2 className="text-2xl p-2 text-center bg-white sticky top-0 z-10 mb-4 w-full">
          Editing {category.name}
        </h2>

        <form
          onSubmit={handleSubmit} onKeyDown={preventEnterFromSubmitting}
          className="bg-white flex flex-col justify-center m-auto items-center w-[85vw] md:w-[65vw] h-fit border-2 border-black rounded-md p-4 mt-4 gap-[4rem]"
          style={{
            backgroundImage: `url(${background})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
            
            <CustomInput
              type="text"
              label="Category Name"
              placeholder="Category Name"
              value={category.name}
              onChange={(e) =>
                setCategory({ ...category, name: e.target.value })
              }
            />
            <label
              htmlFor="file"
              className="p-4 bg-edcPurple-60 text-white cursor-pointer rounded-md flex justify-center gap-4"
            >
              Upload Image <IoIosCamera />
            </label>
            <input
              type="file"
              id="file"
              placeholder="Product Image"
              className="hidden"
              onChange={(e) => handleFileChange(e, setFile, setBackground)}
            />
            <p className="text-center w-full m-auto py-1 px-2 rounded-md text-xs text-gray-400 bg-white">
              {file ? file.name : "No File Selected"}
            </p>

          <SubmitBtn progress={progress} />

          {progress > 0 && <LoadingBar progress={progress} />}
        </form>
      </div>
    </MainFormTemplate>
  );
}
