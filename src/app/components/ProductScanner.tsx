import { useState } from "react";
import axios from "axios";

interface CheckoutItem {
  product_id: string;
  productName: string;
  quantity: number;
}

interface ProductScannerProps {
  setCheckoutItems: React.Dispatch<React.SetStateAction<CheckoutItem[]>>;
}

const ProductScanner: React.FC<ProductScannerProps> = ({ setCheckoutItems }) => {
  const [product_id, setProduct_ID] = useState<string>("");
  const [productName, setProductName] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(0);

  const handleBarcodeDetected = (result: any) => {
    const barcode = result.codeResult.code;
    setProduct_ID(barcode);
    findItemID();
  };

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
      .catch((err) => console.log(err));
  };

  const addToCheckout = () => {
    if (product_id && quantity > 0) {
      const newItem = { product_id, productName, quantity };
      setCheckoutItems((prevItems) => [...prevItems, newItem]);
      setProduct_ID(""); // Clear product ID input
      setProductName(""); // Clear product name display
      setQuantity(0); // Reset quantity input
    }
  };

  return (
    <div className="p-5">
      <h2 className="text-xl font-bold mb-4">Scan Product</h2>
      <input
        type="text"
        placeholder="Enter Product ID..."
        id="product-id"
        value={product_id}
        onChange={addItemID}
        className="w-full border border-gray-400 rounded-md p-2 mb-4"
      />
      <button onClick={findItemID} className="btn btn-primary mr-4">
        Find Item
      </button>
      
      
      <p id="found-item" className="text-green-600 mt-4 font-semibold">
        {productName}
      </p>
      <input
        type="number"
        id="quantity"
        placeholder="Quantity..."
        value={quantity}
        onChange={(e) => setQuantity(parseInt(e.target.value))}
        className="w-full border border-gray-400 rounded-md p-2 mt-4"
      />
      <button onClick={addToCheckout} className="btn btn-primary">
        Add to Checkout
      </button>
    </div>
  );
};

export default ProductScanner;
