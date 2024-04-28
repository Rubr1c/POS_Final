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
      <div className="flex justify-between mx-5">
        <h2>Welcome {name}</h2>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
        >
          Logout
        </button>
      </div>
      <Tabs />
    </div>
  );
};

export default AdminHome;
