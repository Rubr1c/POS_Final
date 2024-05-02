import { useEffect, useState } from "react";
import axios from "axios";

interface SoldProduct {
  product_id: string;
  name: string;
  quantity: number;
  date_sold: string;
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
  });

  return (
    <div className="m-5">
      <h2 className="text-2xl font-bold mb-4 text-white pl-4">
        Sold Products History
      </h2>
      <table className="text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 border-collapse w-1/2">
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
            <th scope="col" className="px-6 py-3 ">
              Date Sold
            </th>
          </tr>
        </thead>
        <tbody>
          {soldProducts.map((item, index) => (
            <tr
              key={index}
              className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
            >
              <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                {item.product_id}
              </td>
              <td className="px-6 py-4">{item.name}</td>
              <td className="px-6 py-4">
                {item.quantity}
              </td>
              <td className="px-6 py-4">
                {item.date_sold}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SoldProducts;
