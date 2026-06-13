import Frame from "../Frame/Frame";
import AdminButtons from "../Buttons/AdminButtons";
import { useProductManagementContext } from "../../Context/ProductMgmtContext";
import { useUserContext } from "../../Context/UserContext";
import { useEffect, useState } from "react";
import { ICategory } from "../../Interfaces/ICategory";
import { useNavigate } from "react-router-dom";
import EditCategoryForm from "../Forms/EditCategoryForm";
import { getSeries } from "../../firebase/getFiles";
import EditSeriesForm from "../Forms/EditSeriesForm";
import { ISeries } from "../../Interfaces/ISeries";

export default function Main() {
  const { user } = useUserContext();
  const { allCategories } = useProductManagementContext();
  const { allProducts, setFilteredInventory } = useProductManagementContext();

  const navigate = useNavigate();

  const [showEditCategoryDialog, setShowEditCategoryDialog] = useState(false);
  const [categoryToEdit, setCategoryToEdit] = useState<ICategory | null>(null);
  const [series, setSeries] = useState<ISeries[]>([]);
  const [showEditSeriesDialog, setShowEditSeriesDialog] = useState(false);
  const [seriesToEdit, setSeriesToEdit] = useState<ISeries | null>(null);

  useEffect(() => {
    loadSeries();
  }, []);

  async function loadSeries() {
    const uniqueSeries = await getSeries();
    setSeries(uniqueSeries as ISeries[]);
  }

  function handleEditCategories(category: ICategory) {
    setShowEditCategoryDialog(true);
    setCategoryToEdit(category);
  }

  function handleEditSeries(series: ISeries) {
    setShowEditSeriesDialog(true);
    setSeriesToEdit(series);
  }

  async function handleClose() {
    setShowEditCategoryDialog(false);
    setShowEditSeriesDialog(false);
    setSeriesToEdit(null);
    setCategoryToEdit(null);
    await loadSeries();
  }

  function handleCategoryClick(category: string) {
    const filteredProducts = allProducts.filter((p) => p.category === category);
    setFilteredInventory(filteredProducts);
    const urlWithParams = "/shop?category=" + encodeURIComponent(category);
    navigate(urlWithParams);
  }

  function handleSeriesClick(series: string) {
    const filteredProducts = allProducts.filter(
      (p) => p.series === series && !p.hidden && !p.sold,
    );
    setFilteredInventory(filteredProducts);
    const urlWithParams = "/shop?series=" + encodeURIComponent(series);
    navigate(urlWithParams);
  }

  return (
    <div className="w-full h-fit bg-white bg-opacity-80 py-8 px-4 flex-wrap border-y-4 border-yellow-400 border-double border-opacity-40 flex flex-col sm:flex-row justify-center items-center gap-[2rem]">
      <div className="flex justify-around p-2 w-full h-fit">
        {allCategories.map((c, key) => (
          <div
            key={key}
            className="w-[42vw] md:w-[40vw] lg:w-[35vw] max-h-[65rem] max-w-[55rem] cursor-pointer
            flex flex-col items-center"
          >
            <div
              className="h-[70vh] w-full border-2 border-[#242424] rounded-lg relative"
              onClick={() => handleCategoryClick(c.name)}
            >
              <button className="text-center text-lg md:text-2xl tracking-[.2rem] font-retro w-full absolute top-0 left-0 text-edcPurple-80 bg-[#FFFFFF70]">
                {c.name.toLowerCase().includes("vintage")
                  ? "EMBELLISHED"
                  : c.name.toLowerCase().includes("handmade")
                    ? "HAND MADE"
                    : ""}
              </button>
              <img
                src={c.url}
                alt={c.name}
                className="rounded-md h-full w-full object-cover object-center"
                loading="lazy"
              />
              <button className="text-center text-lg md:text-2xl tracking-[.2rem] font-retro w-full absolute bottom-0 left-0 text-edcPurple-80 bg-[#FFFFFF70]">
                {c.name.toLowerCase().includes("vintage") ? "VINTAGE" : c.name.toLowerCase().includes("handmade") ?  "DESIGNS" : c.name}
              </button>
            </div>
            {user && (
              <AdminButtons handleEdit={() => handleEditCategories(c)} />
            )}
          </div>
        ))}
      </div>
      <h1 className="w-full flex flex-col items-center  text-center text-white bg-[#242424] rounded-md bg-opacity-30 text-[2rem] sm:text-[3.5rem] p-0 m-0">
        Shop by Series
      </h1>
      <p className="text-[#242424] bg-[#ffffff50] px-[2rem] rounded-md text-center text-small md:text-lg my-2">
        Handmade clothing | Vintage fabrics | Charlotte, North Carolina
      </p>
      <div>
        <div className="w-full h-fit flex flex-wrap justify-center items-center gap-[1rem]">
          {series.map((s, key) => (
            <Frame
              key={key}
              additionalClass="w-[14rem] m:w-[16rem] h-[16rem] md:h-[18rem] overflow-hidden pb-6"
              hover={true}
            >
              <div
                className="h-[10rem] w-[10rem]"
                onClick={() => handleSeriesClick(s.name)}
              >
                <img
                  src={s.photos[0].url}
                  alt={s.name}
                  className="rounded-md h-full w-full object-cover object-center"
                  loading="lazy"
                />
              </div>

              <p className="text-center text-xs md:text-sm lg:text-base">
                {s.name}
              </p>
              {user && <AdminButtons handleEdit={() => handleEditSeries(s)} />}
            </Frame>
          ))}
        </div>
      </div>
      {showEditCategoryDialog && (
        <EditCategoryForm
          categoryToEdit={categoryToEdit}
          onClose={handleClose}
        />
      )}
      {showEditSeriesDialog && (
        <EditSeriesForm seriesToEdit={seriesToEdit} onClose={handleClose} />
      )}
    </div>
  );
}
