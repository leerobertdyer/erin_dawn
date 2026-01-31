import CartItem from "../../Components/CartItem/CartItem";
import CheckoutButton from "../../Components/CheckoutButton/CheckoutButton";
import { useProductManagementContext } from "../../Context/ProductMgmtContext";

export default function Cart() {
  const { cartProducts } = useProductManagementContext();
  console.log(cartProducts);
  return (
    <div
      className="
        w-screen h-fit min-h-screen
        p-[2rem]
        flex flex-col items-center justify-start
        gap-4 bg-cover bg-center bg-no-repeat bg-fixed
        relative"
      style={{ backgroundImage: "url(images/background.jpg)" }}
    >
      <h1 className="text-white text-2xl md:text-3xl font-bold text-center py-4 drop-shadow-lg">Your cart</h1>
      <div className="flex flex-col items-center justify-center gap-4 w-[13rem]">
        <div className="w-full h-fit bg-white p-2 border-2 border-black rounded-md text-center">
          <p>
            Total: $
            {Number(
              cartProducts.reduce((acc, product) => acc + product.price, 0)
            ).toFixed(2)}
          </p>
        </div>
        {cartProducts.length > 0 && (
          <CheckoutButton
            salesItems={cartProducts.map((item) => ({
              id: item.id,
              quantity: 1,
              title: item.title,
              stripePriceId: item.stripePriceId,
              price: item.price,
            }))}
          />
        )}
        {cartProducts.length === 0 && (
          <p className="text-rose-300 bg-black p-2 bg-opacity-60 text-center w-[20rem] rounded-md">
            No items in cart :(
          </p>
        )}
      </div>
      <div className="w-full h-fit flex flex-col items-center justify-start gap-4">
        {cartProducts.map((product, key) => (
          <div
            key={key}
            className="
                w-full md:w-[60vw] md:m-auto 
                bg-white p-2 m-2 bg-opacity-90
                border-2 border-black
                flex items-center justify-evenly 
                rounded-md gap-2"
          >
            <CartItem item={product} />
          </div>
        ))}
      </div>
    </div>
  );
}
