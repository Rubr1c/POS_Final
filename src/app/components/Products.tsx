import { useState, useEffect } from "react";
import axios from "axios";
import Barcode from "react-barcode";
import { toPng } from "html-to-image";

interface Product {
  product_id: string;
  Name: string;
  Price: number;
  Quantity: number;
}

function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isEditWindowVisible, setIsEditWindowVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    axios
      .get<Product[]>("http://localhost:8081/Products")
      .then((res) => {
        setProducts(res.data);
      })
      .catch((err) => console.log(err));
  });

  const downloadBarcode = (id: string) => {
    const node = document.getElementById(id);
    if (node) {
      toPng(node)
        .then((dataUrl: string) => {
          const link = document.createElement("a");
          link.download = `barcode-${id}.png`;
          link.href = dataUrl;
          link.click();
        })
        .catch((error: Error) => {
          console.error("Error generating barcode image:", error);
        });
    }
  };

  const generateBarcode = (id: string) => (
    <div id={id}>
      <Barcode value={id} width={1} height={50} />
    </div>
  );

  const openEditWindow = (product: Product) => {
    const productToEdit: Product = {
      product_id: product.product_id,
      Name: product.Name,
      Price: product.Price,
      Quantity: product.Quantity,
    };

    setSelectedProduct(product);
    setIsEditWindowVisible(true);
    setErrorMessage("");
  };

  const closeEditWindow = () => {
    setIsEditWindowVisible(false);
  };

  const saveChanges = async () => {
    if (selectedProduct) {
      try {
        const response = await axios.post(
          "http://localhost:8081/EditProduct",
          selectedProduct
        );
        if (response.data.success) {
          closeEditWindow();
        } else {
          setErrorMessage(response.data.error);
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const deleteProduct = () => {
    const productId = selectedProduct?.product_id;

    axios
      .delete("http://localhost:8081/DeleteProduct", {
        params: {
          product_id: productId,
        },
      })
      .then((res) => {
        if (res.data.success) return closeEditWindow();

        const errorMessageElement = document.getElementById("error-message");
        if (errorMessageElement) {
          errorMessageElement.innerText = res.data.error;
          errorMessageElement.classList.remove("hidden");
        }
      });
  };

  return (
    <>
      <h2 className="text-white text-2xl font-bold p-4"> Products </h2>

      <div className="overflow-y-auto max-h-[calc(100vh-4rem)] pb-52">
        {products.map((product) => (
          <div
            key={product.product_id}
            className="bg-gradient-to-b from-white to-[#9d9d9d] text-center inline-flex flex-col p-2 m-3 border-2 border-dark rounded-lg border-black shadow-lg shadow-purple-500/50 dark:shadow-lg dark:shadow-purple-800/80"
          >
            <h3 className="font-bold text-2xl mb-5">{product.Name}</h3>
            <p>Price: ${product.Price}</p>
            <p className="mb-5">Quantity: {product.Quantity}</p>
            {generateBarcode(product.product_id)}
            <button
              className="mt-5 text-white bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 shadow-lg shadow-green-500/50 dark:shadow-lg dark:shadow-green-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
              onClick={() => downloadBarcode(product.product_id)}
            >
              Download
            </button>
            <button
              className="mt-2 text-white bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-teal-300 dark:focus:ring-teal-800 shadow-lg shadow-teal-500/50 dark:shadow-lg dark:shadow-teal-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
              onClick={() => openEditWindow(product)}
            >
              Edit
            </button>
          </div>
        ))}
      </div>
      {isEditWindowVisible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="flex justify-between items-center">
              <h1 className="text-xl font-bold">Edit Product</h1>
              <button
                onClick={closeEditWindow}
                className="text-red-500 text-3xl"
              >
                
              </button>
            </div>
            <input
              type="text"
              value={selectedProduct?.Name}
              onChange={(e) =>
                setSelectedProduct(
                  selectedProduct
                    ? { ...selectedProduct, Name: e.target.value }
                    : null
                )
              }
              className="mt-3 mb-3 block w-full px-4 py-2 border rounded-md"
            />
            <input
              type="number"
              step="any"
              value={selectedProduct?.Price}
              onChange={(e) =>
                setSelectedProduct(
                  selectedProduct
                    ? {
                        ...selectedProduct,
                        Price: parseFloat(e.target.value) || 0,
                      }
                    : null
                )
              }
              className="mt-3 mb-3 block w-full px-4 py-2 border rounded-md"
            />
            <input
              type="number"
              value={selectedProduct?.Quantity}
              onChange={(e) =>
                setSelectedProduct(
                  selectedProduct
                    ? {
                        ...selectedProduct,
                        Price: parseFloat(e.target.value) || 0,
                      }
                    : null
                )
              }
              className="mt-3 mb-3 block w-full px-4 py-2 border rounded-md"
            />
            <div className="flex justify-end space-x-3">
              <button
                onClick={saveChanges}
                className="text-white bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 shadow-lg shadow-green-500/50 dark:shadow-lg dark:shadow-green-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
              >
                Save
              </button>
              <button
                onClick={deleteProduct}
                className="text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 shadow-lg shadow-red-500/50 dark:shadow-lg dark:shadow-red-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
              >
                Delete
              </button>
            </div>
            {errorMessage && <p className="text-red-500">{errorMessage}</p>}
          </div>
        </div>
      )}
    </>
  );
}

export default Products;
