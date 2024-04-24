import { useState } from "react";
import axios from "axios";

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
      checkId(generateProductId());
      try {
        const res = await axios.post("http://localhost:8081/AddProduct", product);
        if (res.data.success) {
          resetForm();
          successMessage.innerText = "Product Added Successfully";
        } else {
          errorMessage.innerText = "Product Addition Failed";
        }
      } catch (err) {
        errorMessage.innerText = "Product Addition Failed";
      }
    }
  };
  

  const generateProductId = (): string => {
    return (
      Date.now().toString(36) + Math.random().toString(36).substr(2, 10)
    );
  };

  const checkId = async (id: string) => {
    try {
      const res = await axios.get("http://localhost:8081/CheckProductID", {
        params: {
          product_id: id,
        },
      });
      if (res.data.exists) {
        checkId(generateProductId());
      } else {
        setProduct({
          ...product,
          product_id: id,
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProduct({
      ...product,
      [name]: value,
    });
  };

  const resetForm = () => {
    setProduct({
      product_id: "",
      name: "",
      price: 0.0,
      quantity: 0,
    });
  };

  return (
    <>
      <h2>Add Product</h2>
      <form onSubmit={addProduct} className="flex flex-col space-y-4">
        <input
          type="text"
          onChange={handleInput}
          name="name"
          placeholder="Enter Product Name..."
          required
          className="rounded-lg border border-gray-300 p-2"
        />
        <div className="flex space-x-2">
          <span className="input-group-text">$</span>
          <input
            type="number"
            onChange={handleInput}
            name="price"
            step="any"
            placeholder="Enter Product Price..."
            required
            className="rounded-lg border border-gray-300 p-2"
          />
        </div>
        <input
          type="number"
          onChange={handleInput}
          name="quantity"
          placeholder="Enter Product Quantity..."
          required
          className="rounded-lg border border-gray-300 p-2"
        />
        <button type="submit" className="bg-gray-800 text-white px-4 py-2 rounded-lg">
          Add Product
        </button>
        <div id="success-message" className="text-green-600"></div>
        <div id="error-message" className="text-red-600"></div>
      </form>
    </>
  );
};

export default AddProduct;
