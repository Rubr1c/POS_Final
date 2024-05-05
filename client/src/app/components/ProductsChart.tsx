import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bar, Pie, Line } from "react-chartjs-2";
import {
  Chart,
  CategoryScale,
  LinearScale,
  TimeScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";
import "chartjs-adapter-date-fns";
import { format, parseISO } from "date-fns";


Chart.register(
  CategoryScale,
  LinearScale,
  TimeScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

interface Product {
  product_id: number;
  Name: string;
  Price: number;
}

interface SoldProduct {
  product_id: number;
  quantity: number;
  date_sold: string;
}

const ProductChart = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [soldProducts, setSoldProducts] = useState<SoldProduct[]>([]);
  const [productSalesData, setProductSalesData] = useState<any[]>([]);
  const [productRevenueData, setProductRevenueData] = useState<any[]>([]);

  const [selectedProduct, setSelectedProduct] = useState<number | null>(null);
  const [selectedProductSalesData, setSelectedProductSalesData] = useState<
    { date: string; quantity: number }[]
  >([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productsResponse = await axios.get<Product[]>(
          "http://localhost:8081/Products"
        );
        setProducts(productsResponse.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }

      try {
        const soldProductsResponse = await axios.get<SoldProduct[]>(
          "http://localhost:8081/SoldProducts"
        );
        setSoldProducts(soldProductsResponse.data);
      } catch (error) {
        console.error("Error fetching sold products:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const productSales: { [key: number]: number } = {};
    const productRevenue: { [key: number]: number } = {};

    soldProducts.forEach((soldProduct) => {
      const { product_id, quantity } = soldProduct;
      productSales[product_id] = (productSales[product_id] || 0) + quantity;

      const product = products.find((item) => item.product_id === product_id);
      if (product) {
        const revenue = product.Price * quantity;
        productRevenue[product_id] =
          (productRevenue[product_id] || 0) + revenue;
      }
    });

    const formattedProductSales = products.map((product) => ({
      product_id: product.product_id,
      name: product.Name,
      quantity_sold: productSales[product.product_id] || 0,
    }));

    setProductSalesData(formattedProductSales);

    const formattedProductRevenue = products.map((product) => ({
      product_id: product.product_id,
      name: product.Name,
      revenue: productRevenue[product.product_id] || 0,
    }));

    setProductRevenueData(formattedProductRevenue);
  }, [products, soldProducts]);

  useEffect(() => {
    if (selectedProduct !== null) {
      const salesData = soldProducts
        .filter((product) => product.product_id === selectedProduct)
        .map((product) => ({
          date: format(parseISO(product.date_sold), "yyyy-MM-dd"),
          quantity: product.quantity,
        }));

      setSelectedProductSalesData(salesData);
    }
  }, [selectedProduct, soldProducts]);

  return (
    <div className="container mx-auto px-4 max-w-screen-lg">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div
          className="lg:col-span-2 p-4 rounded-lg shadow-md"
          style={{ width: "100%" }}
        >
          <h1 className="text-2xl font-bold my-4 text-white">
            Top Selling Products
          </h1>
          <div className="chart-container" style={{ height: "600px" }}>
            <Bar
              data={{
                labels: productSalesData.map((product) => product.name),
                datasets: [
                  {
                    label: "Quantity Sold",
                    data: productSalesData.map(
                      (product) => product.quantity_sold
                    ),
                    backgroundColor: "rgba(75, 192, 192, 0.2)",
                    borderColor: "rgba(75, 192, 192, 1)",
                    borderWidth: 1,
                  },
                ],
              }}
              options={{
                maintainAspectRatio: false,
                scales: {
                  y: {
                    beginAtZero: true,
                  },
                  x: {
                    type: "category",
                  },
                },
              }}
            />
          </div>
        </div>
        <div
          className="lg:col-span-1 p-4 rounded-lg shadow-md"
          style={{ width: "100%" }}
        >
          <h1 className="text-2xl font-bold my-4 text-white">
            Revenue by Product
          </h1>
          <div className="chart-container" style={{ height: "600px" }}>
            <Pie
              data={{
                labels: productRevenueData.map((product) => product.name),
                datasets: [
                  {
                    label: "Revenue",
                    data: productRevenueData.map((product) => product.revenue),
                    backgroundColor: [
                      "rgba(255, 99, 132, 0.2)",
                      "rgba(54, 162, 235, 0.2)",
                      "rgba(255, 206, 86, 0.2)",
                      "rgba(75, 192, 192, 0.2)",
                      "rgba(153, 102, 255, 0.2)",
                      "rgba(255, 159, 64, 0.2)",
                    ],
                    borderColor: [
                      "rgba(255, 99, 132, 1)",
                      "rgba(54, 162, 235, 1)",
                      "rgba(255, 206, 86, 1)",
                      "rgba(75, 192, 192, 1)",
                      "rgba(153, 102, 255, 1)",
                      "rgba(255, 159, 64, 1)",
                    ],
                    borderWidth: 1,
                  },
                ],
              }}
              options={{
                maintainAspectRatio: false,
              }}
            />
          </div>
        </div>
        <div
          className="lg:col-span-2 p-4 rounded-lg shadow-md"
          style={{ width: "100%" }}
        >
          <h1 className="text-2xl font-bold my-4 text-white">
            Sales Over Time
          </h1>
          <select
            value={selectedProduct !== null ? selectedProduct.toString() : ""}
            onChange={(e) => {
              
              setSelectedProduct(
                e.target.value !== "" ? Number(e.target.value) : null
              );
            }}
          >
            <option value="">Select a product</option>
            {products.map((product) => (
              <option
                key={product.product_id} 
                value={product.product_id.toString()} 
              >
                {product.Name}
              </option>
            ))}
          </select>

          <div className="chart-container" style={{ height: "600px" }}>
            <Line
              data={{
                labels: selectedProductSalesData.map((data) => data.date),
                datasets: [
                  {
                    label: "Quantity Sold",
                    data: selectedProductSalesData.map((data) => data.quantity),
                    backgroundColor: "rgba(75, 192, 192, 0.2)",
                    borderColor: "rgba(75, 192, 192, 1)",
                    borderWidth: 1,
                  },
                ],
              }}
              options={{
                maintainAspectRatio: false,
                scales: {
                  y: {
                    beginAtZero: true,
                  },
                  x: {
                    type: "time",
                    time: {
                      unit: "day",
                    },
                  },
                },
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductChart;