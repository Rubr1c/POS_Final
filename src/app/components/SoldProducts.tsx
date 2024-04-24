import { useEffect, useState } from "react";
import axios from "axios";

interface SoldProduct {
  product_id: string;
  name: string;
  quantity: number;
}

const SoldProducts: React.FC = () => {
  const [soldProducts, setSoldProducts] = useState<SoldProduct[]>([]);

  useEffect(() => {
    axios
      .get<SoldProduct[]>("http://localhost:8081/SoldProducts")
      .then((res) => {
        setSoldProducts(res.data);
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <div className="mt-5">
      <h2 className="text-2xl font-bold mb-4">Sold Products History</h2>
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border border-gray-300 px-4 py-2">Product ID</th>
            <th className="border border-gray-300 px-4 py-2">Product Name</th>
            <th className="border border-gray-300 px-4 py-2">Quantity</th>
          </tr>
        </thead>
        <tbody>
          {soldProducts.map((item, index) => (
            <tr key={index} className={index % 2 === 0 ? "bg-gray-100" : ""}>
              <td className="border border-gray-300 px-4 py-2">{item.product_id}</td>
              <td className="border border-gray-300 px-4 py-2">{item.name}</td>
              <td className="border border-gray-300 px-4 py-2">{item.quantity}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SoldProducts;
