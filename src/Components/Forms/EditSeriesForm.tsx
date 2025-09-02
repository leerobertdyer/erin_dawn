import { useState } from "react";
import { handleFileChange, preventEnterFromSubmitting } from "./formUtil";
import MainFormTemplate from "./MainFormTemplate";
import { useProductManagementContext } from "../../Context/ProductMgmtContext";
import { IoIosCamera } from "react-icons/io";
import LoadingBar from "../LoadingBar/LoadingBar";
import CustomInput from "../CustomInput/CustomInput";
import editFile from "../../firebase/editfile";
import { resizeFile } from "../../util/resizeFile";
import { NEW_PRODUCT_IMAGE_QUALITY } from "../../util/constants";
import SubmitBtn from "../Buttons/SubmitBtn";
import { ISeries } from "../../Interfaces/ISeries";
import { editProductDoc, editSeriesDoc } from "../../firebase/editDoc";

interface ISeriesFormProps {
  seriesToEdit: ISeries;
  onClose: () => void;
}

export default function EditSeriesForm({
  seriesToEdit,
  onClose,
}: ISeriesFormProps) {
  const { allProducts, setAllProducts } = useProductManagementContext();

  const [background, setBackground] = useState(seriesToEdit?.photos[0].url ?? "");
  const [series, setSeries] = useState<ISeries>({ ...seriesToEdit });
  const [file, setFile] = useState<File | null>();
  const [progress, setProgress] = useState(0);

  function onProgress(percent: number) {
    setProgress(percent);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!seriesToEdit) return;

    // Create the updated category object
    const updatedSeries = { ...series };

    // Handle file upload if needed
    if (file) {
      const resizedFile = await resizeFile(file, {
        maxWidth: 1200,
        maxHeight: 1400,
        maintainAspectRatio: true,
        quality: NEW_PRODUCT_IMAGE_QUALITY,
      });

      const downloadUrl = await editFile({
        url: seriesToEdit.photos[0].url,
        file: resizedFile,
        title: seriesToEdit.name,
        onProgress,
      });

      if (!downloadUrl) throw new Error("Failed to upload file");
      setBackground(downloadUrl);
      updatedSeries.photos[0].url = downloadUrl;
    }

    // Update the category in Firestore
    await editSeriesDoc(updatedSeries);

    // Update products that use this series
    const productsWithSeries = allProducts.filter(
      (p) => p.series === seriesToEdit.name
    );
    for (const p of productsWithSeries) {
      if (p.series === seriesToEdit.name) {
        await editProductDoc({
          ...p,
          series: updatedSeries.name
        });
      }
    }

    // Update local state
    setAllProducts(
      allProducts.map((p) =>
        p.series === seriesToEdit.name
          ? { ...p, series: updatedSeries.name }
          : p
      )
    );


    onClose();
  }

  function resetState() {
    setBackground(seriesToEdit?.photos[0].url ?? "");
    setFile(null);
    setSeries({ ...seriesToEdit });
  }

  return (
    <MainFormTemplate
      handleClickBack={onClose}
      resetState={resetState}
    >
      <div className="fixed inset-0 flex flex-col items-center h-screen bg-gray-50 overflow-y-auto">
        <h2 className="text-2xl p-2 text-center bg-white sticky top-0 z-10 mb-4 w-full">
          Editing {series.name}
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
              label="Series Name"
              placeholder="Series Name"
              value={series.name}
              onChange={(e) =>
                setSeries({ ...series, name: e.target.value })
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
