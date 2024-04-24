import { useState } from "react";
import SoldProducts from "./SoldProducts";
import ProductChart from "./ProductsChart";
import Products from "./Products";
import AddProduct from "./AddProduct";
import AddEmployee from "./AddEmployee";
import Employees from "./Employees";
import ProductScanner from "./ProductScanner";
import Checkout from "./Checkout";

interface SubTabsProps {
  activeSubTab: string;
}

const SubTabs: React.FC<SubTabsProps> = ({ activeSubTab }) => {
  const [checkoutItems, setCheckoutItems] = useState<any[]>([]);

  return (
    <div className="subtab bg-light border border-dark mx-5 pb-vh">
      <div
        className="subtabcontent"
        id="sold-products-tab"
        style={{ display: activeSubTab === "sold-products-tab" ? "block" : "none" }}
      >
        <SoldProducts />
      </div>
      <div
        className="subtabcontent"
        id="product-graph-tab"
        style={{ display: activeSubTab === "product-graph-tab" ? "block" : "none" }}
      >
        <ProductChart />
      </div>
      <div
        className="subtabcontent"
        id="add-product-tab"
        style={{ display: activeSubTab === "add-product-tab" ? "block" : "none" }}
      >
        <AddProduct />
      </div>
      <div
        className="subtabcontent"
        id="existing-products-tab"
        style={{ display: activeSubTab === "existing-products-tab" ? "block" : "none" }}
      >
        <h2>Products</h2>
        <Products />
      </div>
      <div
        className="subtabcontent"
        id="add-employee-tab"
        style={{ display: activeSubTab === "add-employee-tab" ? "block" : "none" }}
      >
        <AddEmployee />
      </div>
      <div
        className="subtabcontent"
        id="existing-employee-tab"
        style={{ display: activeSubTab === "existing-employee-tab" ? "block" : "none" }}
      >
        <Employees />
      </div>
      <div
        className="subtabcontent"
        id="scan-product-tab"
        style={{ display: activeSubTab === "scan-product-tab" ? "block" : "none" }}
      >
        <ProductScanner setCheckoutItems={setCheckoutItems} />
      </div>
      <div
        className="subtabcontent"
        id="checkout-tab"
        style={{ display: activeSubTab === "checkout-tab" ? "block" : "none" }}
      >
        <Checkout checkoutItems={checkoutItems} setCheckoutItems={setCheckoutItems} />
      </div>
    </div>
  );
};

export default SubTabs;
