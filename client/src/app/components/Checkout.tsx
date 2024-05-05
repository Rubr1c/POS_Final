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
  status: boolean;
}

const Checkout: React.FC<Props> = ({
  checkoutItems,
  setCheckoutItems,
  status,
}) => {
  const [productPrice, setProductPrice] = useState<number[]>([]);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    const fetchPrices = async () => {
      const prices = await Promise.all(
        checkoutItems.map(async (item) => {
          try {
            const response = await axios.get<{ Price: number }>(
              `http://localhost:${status ? '3001' : '8081'}/GetItemPrice`,
              {
                params: { product_id: item.product_id },
              }
            );
            return response.data.Price;
          } catch (error) {
            console.log(error);
            return 0;
          }
        })
      );
      setProductPrice(prices);
    };
  
    fetchPrices();
  }, [checkoutItems, status]);

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
    if (newQuantity < 1) {
      alert("Quantity must be at least 1");
      return;
    } 
    const updatedItems = [...checkoutItems];
    updatedItems[index].quantity = newQuantity;
    setCheckoutItems(updatedItems);
  };

  const sellProducts = async () => {
    if (!status) {
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
    } else {
      try {
        await axios.post("http://localhost:3001/Checkout", {
          items: checkoutItems,
        });
        alert("Checkout successful");
        setCheckoutItems([]);
        
      } catch (error) {
        console.error("Error checking out:", error);
        alert("Error checking out");
      }
    }
  };

  return (
    <div className="p-5">
      <h2 className="text-2xl font-bold mb-4 text-white pl-4">Checkout</h2>
      <div className="relative overflow-x-auto">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                Product ID
              </th>
              <th scope="col" className="px-6 py-3">
                Product Name
              </th>
              <th scope="col" className="px-6 py-3">
                Quantity
              </th>
              <th scope="col" className="px-6 py-3">
                Price
              </th>
              <th scope="col" className="px-6 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {checkoutItems.map((item, index) => (
              <tr
                key={index}
                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
              >
                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                  {item.product_id}
                </td>
                <td className="px-6 py-4">{item.productName}</td>
                <td className="px-6 py-4">
                  <input
                    type="number"
                    value={item.quantity}
                    min={1}
                    onChange={(e) =>
                      handleQuantityChange(index, parseInt(e.target.value))
                    }
                    className="w-16 border border-gray-400 rounded py-1 px-2 text-black"
                  />
                </td>
                <td className="px-6 py-4">
                  {productPrice[index] * item.quantity}
                </td>
                <td className="px-6 py-4">
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
      </div>

      <h2 className="text-2xl font-bold text-white">
        Total: {totalPrice.toFixed(2)}
      </h2>
      <br />
      <button
        onClick={sellProducts}
        className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
      >
        Checkout
      </button>
    </div>
  );
};

export default Checkout;
