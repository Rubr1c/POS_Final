"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Tabs from "../components/Tabs";

const AdminHome: React.FC = () => {
  const [name, setName] = useState<string>("");
  const router = useRouter();

  axios.defaults.withCredentials = true;

  useEffect(() => {
    if (navigator.onLine) {
      axios
        .get("http://localhost:8081/")
        .then((res) => {
          if (!res.data.valid) router.push("/Login");
          else if (res.data.admin) setName(res.data.username);
          else router.push("/home-employee");
        })
        .catch((err) => console.log(err));
    }
  }, [router]);

  const handleLogout = () => {
    if (navigator.onLine) {
      axios
        .get("http://localhost:8081/Logout")
        .then((res) => {
          if (res.data.success) router.push("/Login");
        })
        .catch((err) => console.log(err));
    }
  };

  return (
    <div>
      <div className="flex justify-between mx-5 mt-2">
        <h2 className="font-bold">Welcome {name}!</h2>
        <button
          onClick={handleLogout}
          className="text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
        >
          Logout
        </button>
      </div>
      <Tabs />
    </div>
  );
};

export default AdminHome;
