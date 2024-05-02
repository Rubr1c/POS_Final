import { useState } from "react";
import axios from "axios";
import { error } from "console";

const AddProduct: React.FC = () => {
  const [product, setProduct] = useState({
    product_id: "",
    name: "",
    price: 0.0,
    quantity: 0,
  });

  axios.defaults.withCredentials = true;

  const addProduct = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const successMessage = document.getElementById("success-message");
    const errorMessage = document.getElementById("error-message");

    if (successMessage && errorMessage) {
      try {
        const productId = await generateUniqueProductId();
        const res = await axios.post("http://localhost:8081/AddProduct", {
          ...product,
          product_id: productId,
        });

        if (res.data.success) {
          resetForm();
          successMessage.innerText = "Product Added Successfully";
          setTimeout(() => {
            successMessage.innerText = "";
          }, 3000);
        } else {
          errorMessage.innerText = "Product Addition Failed";
          setTimeout(() => {
            errorMessage.innerText = "";
          }, 3000);
        }
      } catch (err) {
        errorMessage.innerText = "Product Addition Failed";
        setTimeout(() => {
          errorMessage.innerText = "";
        }, 3000);
      }
    }
  };

  const generateUniqueProductId = async (): Promise<string> => {
    const newId = generateProductId();
    try {
      const res = await axios.get("http://localhost:8081/CheckProductID", {
        params: {
          product_id: newId,
        },
      });

      if (res.data.exists) {
        return await generateUniqueProductId();
      } else {
        return newId;
      }
    } catch (err) {
      console.log(err);
      throw new Error("Error generating product ID");
    }
  };

  const generateProductId = (): string => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 10);
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProduct({
      ...product,
      [name]: value,
    });
  };

  const resetForm = () => {
    const nameInput = document.getElementById(
      "name"
    ) as HTMLInputElement | null;
    const priceInput = document.getElementById(
      "price"
    ) as HTMLInputElement | null;
    const quantityInput = document.getElementById(
      "quantity"
    ) as HTMLInputElement | null;

    if (nameInput && priceInput && quantityInput) {
      nameInput.value = "";
      priceInput.value = "";
      quantityInput.value = "";
    }
    setProduct({
      product_id: "",
      name: "",
      price: 0.0,
      quantity: 0,
    });
  };

  return (
    <>
      <h2 className="text-white text-2xl font-bold p-4">Add Product</h2>
      <form onSubmit={addProduct} className="flex flex-col space-y-4 mx-4">
        <div className="relative z-0 mb-5 group w-1/3">
          <input
            type="text"
            onChange={handleInput}
            name="name"
            placeholder=" "
            required
            className="block py-2.5 px-0 text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer w-full"
            id="name"
          />
          <label
            htmlFor="name"
            className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
          >
            Name
          </label>
        </div>
        <div className="relative z-0 mb-5 group w-1/3">
          <input
            type="number"
            onChange={handleInput}
            name="price"
            step="any"
            placeholder=" "
            required
            className="block py-2.5 px-0 text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer w-full"
            id="price"
          />
          <label
            htmlFor="price"
            className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
          >
            Price
          </label>
        </div>

        <div className="relative z-0 mb-5 group w-1/3">
          <input
            type="number"
            onChange={handleInput}
            name="quantity"
            placeholder=" "
            required
            className="block py-2.5 px-0 text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer w-full"
            id="quantity"
          />
          <label
            htmlFor="quantity"
            className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
          >
            Quantity
          </label>
        </div>
        <div className="flex justify-center w-1/3">
          <button
            type="submit"
            className="m-5 text-white bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-purple-300 dark:focus:ring-purple-800 shadow-lg shadow-purple-500/50 dark:shadow-lg dark:shadow-purple-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
          >
            Add Product
          </button>
        </div>
        <div id="success-message" className="text-green-600 font-bold"></div>
        <div id="error-message" className="text-red-600 font-bold"></div>
      </form>
    </>
  );
};

export default AddProduct;
