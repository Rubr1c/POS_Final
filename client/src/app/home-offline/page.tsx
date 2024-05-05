"use client";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import SubTabs from "../components/Subtabs";

const OfflineHome: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("purchase");
  const [activeSubTab, setActiveSubTab] = useState<string>("scan-product-tab");
  const [name, setName] = useState<string>("");
  const offline = true;

  const tabButtonStyles =
    "relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-300";

  const tabSpanStyles =
    "relative px-5 py-2.5 transition-all ease-in duration-75 bg-white rounded-md group-hover:bg-opacity-0 text-black";

  const subtabButtonStyles =
    "relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-green-400 to-blue-600 group-hover:from-green-400 group-hover:to-blue-600 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-green-200";

  const subtabSpanStyles =
    "relative px-5 py-2.5 transition-all ease-in duration-75 bg-white rounded-md group-hover:bg-opacity-0 text-black";

  const router = useRouter();

  const handleLogout = () => {
    axios.get("http://localhost:3001/Logout").then((res) => {
      if (res.data.success) router.push("/Login");
    });
  };

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
      <div className="flex justify-between mx-5 mt-5">
        <h2 className="font-bold">Welcome {name}!</h2>
        <button
          onClick={handleLogout}
          className="text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
        >
          Logout
        </button>
      </div>
      <div className="tabs">
        <div className="flex justify-center">
          <button
            className={
              activeTab == "purchase"
                ? `${tabButtonStyles} bg-gradient-to-br from-purple-600 to-blue-500`
                : tabButtonStyles
            }
            onClick={() => openTab("purchase")}
          >
            <span
              className={
                activeTab == "purchase"
                  ? `${tabSpanStyles} bg-gradient-to-br from-purple-600 to-blue-500`
                  : tabSpanStyles
              }
            >
              {" "}
              Purchase{" "}
            </span>
          </button>
        </div>
        <div id="purchase" className="tabcontent">
          {activeTab === "purchase" && (
            <div className="flex justify-center">
              <button
                className={subtabButtonStyles}
                onClick={() => openSubTab("scan-product-tab")}
              >
                <span
                  className={
                    activeSubTab === "scan-product-tab"
                      ? `${subtabSpanStyles} bg-gradient-to-br from-green-400 to-blue-600`
                      : subtabSpanStyles
                  }
                >
                  Scan Product
                </span>
              </button>
              <button
                className={subtabButtonStyles}
                onClick={() => openSubTab("checkout-tab")}
              >
                <span
                  className={
                    activeSubTab === "checkout-tab"
                      ? `${subtabSpanStyles} bg-gradient-to-br from-green-400 to-blue-600`
                      : subtabSpanStyles
                  }
                >
                  Checkout
                </span>
              </button>
            </div>
          )}
        </div>
      </div>
      <SubTabs activeSubTab={activeSubTab} status={offline} />
    </div>
  );
};

export default OfflineHome;
