"use client";
import { useEffect } from "react";
import useLoginForm from "./useLoginForm";
import { useRouter } from "next/navigation";
import axios from "axios";
import checkInternetConnection from "../CheckInternet";

const LoginPage: React.FC = () => {
  const { user, errors, handleInput, handleSubmit } = useLoginForm();
  const router = useRouter();

  axios.defaults.withCredentials = true;

  useEffect(() => {
    const checkConnectionAndRedirect = async () => {
      const isConnected = await checkInternetConnection();
      if (isConnected) {
        try {
          const res = await axios.get("http://localhost:8081/");
          if (res.data.valid) {
            if (res.data.admin) {
              router.push("/home-admin");
            } else {
              router.push("/home-employee");
            }
          }
        } catch (err) {
          console.log(err);
        }
      } else {
        try {
          await axios.post("http://localhost:3001/loadData");
          const res = await axios.get("http://localhost:3001/");
          if (res.data.Login) {
            if (res.data.Admin) {
              router.push("/home-admin");
            } else {
              router.push("/home-employee");
            }
          }
        } catch (err) {
          console.log(err);
        }
      }
    };
  
    checkConnectionAndRedirect();
  }, []);

  const handleNavigate = (path: string) => {
    router.push(path);
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="bg-gradient-to-t from-[#818181] to-white p-6 rounded-lg w-1/4">
        <h2 className="text-center text-2xl font-bold mb-4 text-black">
          Login
        </h2>
        <form onSubmit={(e) => handleSubmit(e, handleNavigate)}>
          <div className="mb-4">
            <div className="mb-4 relative z-0 group w-full">
              <input
                type="text"
                name="email"
                placeholder=" "
                value={user.email}
                onChange={handleInput}
                className="block py-2.5 px-0 text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer w-full"
                id="email"
              />
              <label
                htmlFor="email"
                className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
              >
                Email
              </label>
              {errors.email && (
                <p className="text-red-500 text-sm font-bold">{errors.email}</p>
              )}
            </div>
            <div className="mb-4 relative z-0 group w-full">
              <input
                type="password"
                name="password"
                placeholder=" "
                value={user.password}
                onChange={handleInput}
                className="block py-2.5 px-0 text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer w-full"
                id="password"
              />
              <label
                htmlFor="password"
                className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
              >
                Password
              </label>
              {errors.password && (
                <p className="text-red-500 text-sm font-bold">
                  {errors.password}
                </p>
              )}
            </div>
          </div>
          <button
            type="submit"
            className="text-white bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 shadow-lg shadow-green-500/50 dark:shadow-lg dark:shadow-green-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 w-full"
          >
            Login
          </button>
          <a
            href="/Signup"
            className="g-screen flex items-center justify-center text-white bg-[#a7a7a7] hover:bg-[#818181] focus:ring-4 focus:outline-none focus:ring-[#bebebe] dark:focus:ring-[#5a5a5a] shadow-lg shadow-[#a7a7a7]/50 dark:shadow-lg dark:shadow-[#5a5a5a]/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 w-full"
            style={{ marginTop: "10px" }}
          >
            SignUp
          </a>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
