import { useLocation, useNavigate } from "react-router-dom";
import { useProductManagementContext } from "../../Context/ProductMgmtContext";
import { IProductInfo } from "../../Interfaces/IProduct";
import {
  KEEPING_IT_CLEAN,
  KEEPING_IT_CLEAN_DETAILS,
} from "../../util/constants";
import Carousel from "../Carousel/Carousel";
import { useEffect } from "react";
import { viewItem_GA, addToCart_GA } from "../../util/analytics";

interface IProductDetails {
  product: IProductInfo;
  handleCloseProductDetails: () => void;
  handleAddToCart: (product: IProductInfo) => void;
}

export default function ProductDetails({
  product,
  handleCloseProductDetails,
  handleAddToCart,
}: IProductDetails) {
  const location = useLocation();
  const navigate = useNavigate();
  const { cartProducts, setCartProducts } = useProductManagementContext();
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    params.set("id", product.id);
    const newUrl = `${location.pathname}?${params.toString()}`;
    navigate(newUrl);
  }, [location.pathname, location.search, product.id, navigate]);

  useEffect(() => {
    viewItem_GA({ id: product.id, title: product.title, price: product.price });
  }, [product.id, product.title, product.price]);

  function handleAddToCartAndNavigate(product: IProductInfo) {
    setCartProducts([...cartProducts, product]);
    addToCart_GA({ id: product.id, title: product.title, price: product.price });
    handleAddToCart(product);
    navigate('/shop', { replace: true });
  }

  return (
    <div
      className="flex flex-col justify-start items-center lg:flex-row lg:justify-evenly lg:items-center gap-4
                    w-full m-auto my-4 border-y-black ">
        <div className="w-screen p-2 gap-4 text-edcPurple-80 fixed top-0 h-[6rem] pb-2 bg-white z-[1000] flex justify-center items-center">
          <button
            onClick={handleCloseProductDetails}
            className="p-2 hover:bg-edcPurple-20 bg-edcPurple-60 rounded-md text-white w-[8rem] h-[2rem] flex justify-center items-center">
            Go Back
          </button>
          <button
            onClick={() => handleAddToCartAndNavigate(product)}
            className="p-2 hover:bg-white bg-edcYellow-60 rounded-md w-[8rem] h-[2rem] text-edcPurple-80 border-2 border-edcPurple-60 flex justify-center items-center">
            Add to Cart
          </button>
        </div>

      <div className="w-[80%] lg:w-1/2 max-w-[650px]">
        <Carousel product={product} />
      </div>
      <div className="w-fit  lg:w-1/2 flex flex-col justify-between mt-4 h-full  border-edcPurple-80 border-4 items-center rounded-md ">
        <p className="text-3xl p-2 w-full rounded-t-sm text-black text-center border-b-4 border-black">
          "{product.title}"
        </p>
        <p className="text-xl p-4 w-full text-center">
          ${product.price}
          <span className="text-xs">.00</span>
        </p>
        <p className="text-lg p-6 w-full bg-white rounded-md whitespace-pre-line max-h-[550px] overflow-y-auto text-center">
          {product.description}
        </p>
        {product.size && (
          <p className="text-lg px-2 my-2 w-full text-center bg-white">
            Size: <br />
            <div className="bg-gray-300 px-2 rounded-md mb-2 w-fit m-auto">
              {product.size.toUpperCase()}
            </div>
          </p>
        )}
        <p className="text-lg px-2 my-2 w-full text-center bg-white">
          Dimensions: <br />
          <div className="bg-gray-300 px-2 rounded-md mb-2 text-md w-fit m-auto">
            {product.dimensions}
          </div>
        </p>
        <div className="mb-4 p-2 w-fit m-auto bg-white">
          <p className="text-lg p-2 w-full text-center">{KEEPING_IT_CLEAN}</p>
          <p className="text-lg w-full text-center bg-gray-300 p-2 rounded-md mb-2">
            {KEEPING_IT_CLEAN_DETAILS}
          </p>
        </div>
      </div>
    </div>
  );
}
