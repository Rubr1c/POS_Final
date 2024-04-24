import { useState, useEffect } from "react";
import axios from "axios";

interface CheckoutItem {
  product_id: string;
  productName: string;
  quantity: number;
}

interface Props {
  checkoutItems: CheckoutItem[];
  setCheckoutItems: React.Dispatch<React.SetStateAction<CheckoutItem[]>>;
}

const Checkout: React.FC<Props> = ({ checkoutItems, setCheckoutItems }) => {
  const [productPrice, setProductPrice] = useState<number[]>([]);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    const fetchPrices = async () => {
      const prices = await Promise.all(
        checkoutItems.map(async (item) => {
          try {
            const response = await axios.get<{ Price: number }>(
              "http://localhost:8081/GetItemPrice",
              {
                params: { product_id: item.product_id },
              }
            );
            return response.data.Price;
          } catch (error) {
            console.log(error);
            return 0; // Default price if not found
          }
        })
      );
      setProductPrice(prices);
    };

    fetchPrices();
  }, [checkoutItems]);

  useEffect(() => {
    let total = 0;
    checkoutItems.forEach((item, index) => {
      total += productPrice[index] * item.quantity;
    });
    setTotalPrice(total);
  }, [checkoutItems, productPrice]);

  const handleRemoveItem = (index: number) => {
    const updatedItems = [...checkoutItems];
    updatedItems.splice(index, 1);
    setCheckoutItems(updatedItems);
  };

  const handleQuantityChange = (index: number, newQuantity: number) => {
    const updatedItems = [...checkoutItems];
    updatedItems[index].quantity = newQuantity;
    setCheckoutItems(updatedItems);
  };

  const sellProducts = async () => {
    try {
      await axios.post("http://localhost:8081/Checkout", {
        items: checkoutItems,
      });
      alert("Checkout successful");
      setCheckoutItems([]); 
    } catch (error) {
      console.error("Error checking out:", error);
      alert("Error checking out");
    }
  };

  return (
    <div className="p-5">
      <h2 className="mb-5 text-2xl font-bold">Checkout</h2>
      <table className="w-full mb-5">
        <thead>
          <tr>
            <th className="py-2">Product ID</th>
            <th className="py-2">Product Name</th>
            <th className="py-2">Quantity</th>
            <th className="py-2">Price</th>
            <th className="py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {checkoutItems.map((item, index) => (
            <tr key={index}>
              <td className="py-2">{item.product_id}</td>
              <td className="py-2">{item.productName}</td>
              <td className="py-2">
                <input
                  type="number"
                  value={item.quantity}
                  min={1}
                  className="w-16 border border-gray-400 rounded py-1 px-2"
                  onChange={(e) =>
                    handleQuantityChange(index, parseInt(e.target.value))
                  }
                />
              </td>
              <td className="py-2">
                {productPrice[index] * item.quantity}
              </td>
              <td className="py-2">
                <button
                  onClick={() => handleRemoveItem(index)}
                  className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded"
                >
                  Remove
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2 className="text-2xl font-bold">Total: {totalPrice.toFixed(2)}</h2>
      <br />
      <button
        onClick={sellProducts}
        className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-5 rounded"
      >
        Checkout
      </button>
    </div>
  );
};

export default Checkout;
