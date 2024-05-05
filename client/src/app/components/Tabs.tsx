import { useState } from "react";
import SubTabs from "./Subtabs";

interface TabsProps {}

const Tabs: React.FC<TabsProps> = () => {
  const [activeTab, setActiveTab] = useState<string>("sales");
  const [activeSubTab, setActiveSubTab] = useState<string>("sold-products-tab");

  const tabButtonStyles =
  "relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-300";

const tabSpanStyles =
  "relative px-5 py-2.5 transition-all ease-in duration-75 bg-white rounded-md group-hover:bg-opacity-0 text-black";


  const subtabButtonStyles =
    "relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-green-400 to-blue-600 group-hover:from-green-400 group-hover:to-blue-600 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-green-200";

  const subtabSpanStyles =
    "relative px-5 py-2.5 transition-all ease-in duration-75 bg-white rounded-md group-hover:bg-opacity-0 text-black";

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
      <div className="flex justify-center">
        <button
          className={
            activeTab == "sales"
              ? `${tabButtonStyles} bg-gradient-to-br from-purple-600 to-blue-500`
              : tabButtonStyles
          }
          onClick={() => openTab("sales")}
        >
          <span
            className={
              activeTab == "sales"
                ? `${tabSpanStyles} bg-gradient-to-br from-purple-600 to-blue-500`
                : tabSpanStyles
            }
          >
            Sales
          </span>
        </button>
        <button
          className={
            activeTab == "product"
              ? `${tabButtonStyles} bg-gradient-to-br from-purple-600 to-blue-500`
              : tabButtonStyles
          }
          onClick={() => openTab("product")}
        >
          <span
            className={
              activeTab == "product"
                ? `${tabSpanStyles} bg-gradient-to-br from-purple-600 to-blue-500`
                : tabSpanStyles
            }
          >
            Product
          </span>
        </button>
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
        <button
          className={
            activeTab == "employee"
              ? `${tabButtonStyles} bg-gradient-to-br from-purple-600 to-blue-500`
              : tabButtonStyles
          }
          onClick={() => openTab("employee")}
        >
          <span
            className={
              activeTab == "employee"
                ? `${tabSpanStyles} bg-gradient-to-br from-purple-600 to-blue-500`
                : tabSpanStyles
            }
          >
            Employee
          </span>
        </button>
      </div>
      <div id="sales" className="tabcontent">
        {activeTab === "sales" && (
          <div className="flex justify-center">
            <button
              className={
                 subtabButtonStyles
              }
              onClick={() => openSubTab("sold-products-tab")}
            >
              <span
                className={
                  activeSubTab === "sold-products-tab"
                    ? `${subtabSpanStyles} bg-gradient-to-br from-green-400 to-blue-600`
                    : subtabSpanStyles
                }
              >
                Sold Products History
              </span>
            </button>
            <button
              className={
                subtabButtonStyles
              }
              onClick={() => openSubTab("product-graph-tab")}
            >
              <span
                className={
                  activeSubTab === "product-graph-tab"
                    ? `${subtabSpanStyles} bg-gradient-to-br from-green-400 to-blue-600`
                    : subtabSpanStyles
                }
              >
                Products Graph
              </span>
            </button>
          </div>
        )}
      </div>

      <div id="product" className="tabcontent">
        {activeTab === "product" && (
          <div className="flex justify-center">
            <button
              className={
                subtabButtonStyles
              }
              onClick={() => openSubTab("add-product-tab")}
            >
              <span
                className={
                  activeSubTab === "add-product-tab"
                    ? `${subtabSpanStyles} bg-gradient-to-br from-green-400 to-blue-600`
                    : subtabSpanStyles
                }
              >
                Add Product
              </span>
            </button>
            <button
              className={
                subtabButtonStyles
              }
              onClick={() => openSubTab("existing-products-tab")}
            >
              <span
                className={
                  activeSubTab === "existing-products-tab"
                    ? `${subtabSpanStyles} bg-gradient-to-br from-green-400 to-blue-600`
                    : subtabSpanStyles
                }
              >
                Products
              </span>
            </button>
          </div>
        )}
      </div>
      <div id="employee" className="tabcontent">
        {activeTab === "employee" && (
          <div className="flex justify-center">
            <button
              className={
                subtabButtonStyles
              }
              onClick={() => openSubTab("add-employee-tab")}
            >
              <span
                className={
                  activeSubTab === "add-employee-tab"
                    ? `${subtabSpanStyles} bg-gradient-to-br from-green-400 to-blue-600`
                    : subtabSpanStyles
                }
              >
                Add Employee
              </span>
            </button>
            <button
              className={
                subtabButtonStyles
              }
              onClick={() => openSubTab("existing-employee-tab")}
            >
              <span
                className={
                  activeSubTab === "existing-employee-tab"
                    ? `${subtabSpanStyles} bg-gradient-to-br from-green-400 to-blue-600`
                    : subtabSpanStyles
                }
              >
                Employees
              </span>
            </button>
          </div>
        )}
      </div>
      <div id="purchase" className="tabcontent">
        {activeTab === "purchase" && (
          <div className="flex justify-center">
            <button
              className={
                subtabButtonStyles
              }
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
              className={
                subtabButtonStyles
              }
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

      <SubTabs activeSubTab={activeSubTab} status={false} />
    </div>
  );
};

export default Tabs;