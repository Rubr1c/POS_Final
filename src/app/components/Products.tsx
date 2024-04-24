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
        .then((dataUrl : string) => {
          const link = document.createElement("a");
          link.download = "barcode.png";
          link.href = dataUrl;
          link.click();
        })
        .catch((error : Error) => {
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
    const editNameInput = document.getElementById("editName") as HTMLInputElement | null;
    const editPriceInput = document.getElementById("editPrice") as HTMLInputElement | null;
    const editQuantityInput = document.getElementById("editQuantity") as HTMLInputElement | null;
    const productIdElement = document.getElementById("productID");

    if (editNameInput && editPriceInput && editQuantityInput && productIdElement) {
      editNameInput.value = product.Name;
      editPriceInput.value = product.Price.toString();
      editQuantityInput.value = product.Quantity.toString();
      productIdElement.innerText = product.product_id;
      document.getElementById("error-message")?.classList.add("hidden");

      document.getElementById("edit-window")?.classList.remove("hidden");
    }
  };

  const closeEditWindow = () => {
    document.getElementById("edit-window")?.classList.add("hidden");
  };

  const saveChanges = () => {
    const productIdElement = document.getElementById("productID");
    const editNameInput = document.getElementById("editName") as HTMLInputElement | null;
    const editPriceInput = document.getElementById("editPrice") as HTMLInputElement | null;
    const editQuantityInput = document.getElementById("editQuantity") as HTMLInputElement | null;

    if (productIdElement && editNameInput && editPriceInput && editQuantityInput) {
      const productId = productIdElement.innerText;
      const editName = editNameInput.value;
      const editPrice = parseFloat(editPriceInput.value);
      const editQuantity = parseInt(editQuantityInput.value);

      const updatedProduct = {
        product_id: productId,
        Name: editName,
        Price: editPrice,
        Quantity: editQuantity,
      };

      axios
        .post("http://localhost:8081/EditProduct", updatedProduct)
        .then((res) => {
          if (res.data.success) return closeEditWindow();

          const errorMessageElement = document.getElementById("error-message");
          if (errorMessageElement) {
            errorMessageElement.innerText = res.data.error;
            errorMessageElement.classList.remove("hidden");
          }
        })
        .catch((err) => console.log(err));
    }
  };

  const deleteProduct = () => {
    const productIdElement = document.getElementById("productID");
    if (productIdElement) {
      const productId = productIdElement.innerText;
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
    }
  };

  return (
    <>
      {products.map((product) => (
        <div
          key={product.product_id}
          className="bg-info bg-gradient text-center inline-flex flex-col p-2 m-3 border border-dark rounded-3"
        >
          <h3>{product.Name}</h3>
          <p>Price: {product.Price}</p>
          <p>Quantity: {product.Quantity}</p>
          {generateBarcode(product.product_id)}
          <button
            className="mt-2 btn btn-dark"
            onClick={() => downloadBarcode(product.product_id)}
          >
            Download
          </button>
          <button
            className="mt-2 btn btn-dark"
            onClick={() => openEditWindow(product)}
          >
            Edit
          </button>
        </div>
      ))}
      <div id="edit-window" className="hidden">
        <div className="flex items-center justify-between">
          <h1 className="">Edit Product</h1>
          <button
            id="close-button"
            onClick={closeEditWindow}
            className="text-danger bg-transparent border-0 text-3xl p-0"
          >
            ✘
          </button>
        </div>
        <input type="text" className="m-3" id="editName" name="Name" />
        <input
          type="number"
          step="any"
          className="m-3"
          id="editPrice"
          name="Price"
        />
        <input
          type="number"
          className="m-3"
          id="editQuantity"
          name="Quantity"
        />
        <br />
        <button className="m-3 btn btn-success" onClick={saveChanges}>
          Save
        </button>
        <button className="m-3 btn btn-danger" onClick={deleteProduct}>
          Delete
        </button>
        <p className="hidden" id="productID"></p>
        <p className="hidden" id="error-message"></p>
      </div>
    </>
  );
}

export default Products;
