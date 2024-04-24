"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import SubTabs from "../components/Subtabs";

const EmployeeHome: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("purchase");
  const [activeSubTab, setActiveSubTab] = useState<string>("scan-product-tab");
  const [name, setName] = useState<string>("");

  const router = useRouter();

  useEffect(() => {
    axios
      .get("http://localhost:8081/")
      .then((res) => {
        if (res.data.valid) setName(res.data.username);
        else router.push("/login");
      })
      .catch((err) => console.log(err));
  }, []);

  const handleLogout = () => {
    axios.get("http://localhost:8081/logout").then((res) => {
      if (res.data.success) router.push("/Login");
    });
  };

  // Define Tailwind CSS class names as variables
  const activeTabClass =
    "tablink active bg-white border border-gray-800 text-blue-500";
  const inactiveTabClass =
    "tablink bg-white border border-gray-800 text-blue-500";
  const activeSubTabClass = "subtablink active bg-white text-blue-500";
  const inactiveSubTabClass = "subtablink bg-white text-blue-500";

  const openTab = (tabName: string) => {
    setActiveTab(tabName);
    switch (tabName) {
      case "sales":
        setActiveSubTab("sold-products-tab");
        break;
      case "product":
        setActiveSubTab("add-product-tab");
        break;
      case "employee":
        setActiveSubTab("add-employee-tab");
        break;
      case "purchase":
        setActiveSubTab("scan-product-tab");
        break;
      default:
        setActiveSubTab("");
    }
  };

  const openSubTab = (subTabName: string) => {
    setActiveSubTab(subTabName);
  };

  return (
    <div>
      <div className="flex justify-between mx-5">
        <h2>Welcome {name}</h2>
        <button onClick={handleLogout} className="btn btn-danger">
          Logout
        </button>
      </div>
      <div className="tabs">
        <button
          className={
            activeTab === "purchase" ? activeTabClass : inactiveTabClass
          }
          onClick={() => openTab("purchase")}
        >
          Purchase
        </button>
      </div>
      <div id="purchase" className="tabcontent">
        {activeTab === "purchase" && (
          <div className="subtabs">
            <button
              className={
                activeSubTab === "scan-product-tab"
                  ? activeSubTabClass
                  : inactiveSubTabClass
              }
              onClick={() => openSubTab("scan-product-tab")}
            >
              Scan Product
            </button>
            <button
              className={
                activeSubTab === "checkout-tab"
                  ? activeSubTabClass
                  : inactiveSubTabClass
              }
              onClick={() => openSubTab("checkout-tab")}
            >
              Checkout
            </button>
          </div>
        )}
      </div>
      <SubTabs activeSubTab={activeSubTab} />
    </div>
  );
};

export default EmployeeHome;
