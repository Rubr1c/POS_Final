"use client";
import { useEffect } from "react";
import useSignUpForm from "./useSignUpForm";
import { useRouter } from "next/navigation";
import axios from "axios";

const SignUpClient: React.FC = () => {
  const { user, errors, handleInput, handleSubmit } = useSignUpForm();
  const router = useRouter();

  axios.defaults.withCredentials = true;

  useEffect(() => {
    axios
      .get("http://localhost:8081/")
      .then((res) => {
        if (res.data.valid) {
          if (res.data.admin) {
            router.push("/home-admin");
          } else {
            router.push("/home-employee");
          }
        }
      })
      .catch((err) => console.log(err));
  }, []);

  const handleNavigate = (path: string) => {
    router.push(path);
  };

  return (
    <div className="flex justify-center items-center bg-blue-500 min-h-screen">
      <div className="bg-white p-6 rounded w-1/4">
        <h2 className="text-center text-2xl font-bold mb-4 text-black">
          Sign Up
        </h2>
        <form onSubmit={(e) => handleSubmit(e, handleNavigate)}>
          <div className="mb-4">
            <label htmlFor="username" className="block font-bold mb-2 text-black">
              Username
            </label>
            <input
              type="text"
              placeholder="Enter Username..."
              name="username"
              value={user.username}
              onChange={handleInput}
              className="border-solid border-2 border-black p-2 w-full rounded-md text-black"
            />
            {errors.username && (
              <p className="text-red-500 text-sm">{errors.username}</p>
            )}
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block font-bold mb-2 text-black">
              Email
            </label>
            <input
              type="email"
              placeholder="Enter Email..."
              name="email"
              value={user.email}
              onChange={handleInput}
              className="border-solid border-2 border-black p-2 w-full rounded-md text-black"
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email}</p>
            )}
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block font-bold mb-2 text-black">
              Password
            </label>
            <input
              type="password"
              placeholder="Enter Password..."
              name="password"
              value={user.password}
              onChange={handleInput}
              className="border-solid border-2 border-black p-2 w-full rounded-md text-black"
            />
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password}</p>
            )}
          </div>
          <button
            type="submit"
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 w-full rounded"
          >
            Sign Up
          </button>
          <a
            href="/Login"
            className="block border border-gray-300 mt-3 bg-gray-100 text-center py-2 px-4 w-full rounded-md text-gray-700 hover:bg-gray-200"
          >
            Login
          </a>
        </form>
      </div>
    </div>
  );
};

export default SignUpClient;
