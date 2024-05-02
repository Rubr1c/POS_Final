import React, { useState, useEffect } from "react";
import axios from "axios";

interface CheckoutItem {
  product_id: string;
  productName: string;
  quantity: number;
}

interface ProductScannerProps {
  setCheckoutItems: React.Dispatch<React.SetStateAction<CheckoutItem[]>>;
}

const ProductScanner: React.FC<ProductScannerProps> = ({
  setCheckoutItems,
}) => {
  const [product_id, setProduct_ID] = useState<string>("");
  const [productName, setProductName] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(0);

  const addItemID = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProduct_ID(e.target.value);
  };

  const findItemID = () => {
    axios
      .get("http://localhost:8081/CheckProductIDs", {
        params: {
          product_id: product_id,
        },
      })
      .then((res) => {
        if (res.data.exists) {
          setProduct_ID(product_id);
          setProductName(res.data.product);
        } else {
          setProductName("Product Not Found");
        }
      })
      .catch((err: any) => console.log(err));
  };

  const addToCheckout = () => {
    if (product_id && quantity > 0) {
      const newItem = { product_id, productName, quantity };
      setCheckoutItems((prevItems) => [...prevItems, newItem]);
      setProduct_ID("");
      setProductName("");
      setQuantity(0);
    }
  };

  return (
    <div className="p-5">
      <h2 className="text-2xl font-bold mb-4 text-white pl-4">Scan Product</h2>
      <div className="relative z-0 mb-5 group w-1/3">
        <input
          type="text"
          onChange={addItemID}
          name="product-id"
          placeholder=" "
          value={product_id}
          required
          className="block py-2.5 px-0 text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer w-full"
          id="product-id"
        />
        <label
          htmlFor="product-id"
          className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
        >
          Enter Product ID...
        </label>
      </div>
      <button
        onClick={findItemID}
        className="text-white bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 shadow-lg shadow-green-500/50 dark:shadow-lg dark:shadow-green-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
      >
        Find
      </button>
      <br />
      <button className="m-5 text-white bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-purple-300 dark:focus:ring-purple-800 shadow-lg shadow-purple-500/50 dark:shadow-lg dark:shadow-purple-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">
        Scan
      </button>

      <p id="found-item" className="text-green-600 mt-4 font-semibold mb-4">
        {productName}
      </p>

      <div className="relative z-0 mb-5 group w-1/3">
        <input
          type="number"
          onChange={(e) => setQuantity(parseInt(e.target.value))}
          name="quantity"
          placeholder=" "
          value={quantity}
          required
          className="block py-2.5 px-0 text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer w-full"
          id="quantity"
        />
        <label
          htmlFor="quantity"
          className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
        >
          Quantity...
        </label>
      </div>

      <button
        onClick={addToCheckout}
        className="text-white bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 shadow-lg shadow-green-500/50 dark:shadow-lg dark:shadow-green-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
      >
        Add to Checkout
      </button>
    </div>
  );
};

export default ProductScanner;
