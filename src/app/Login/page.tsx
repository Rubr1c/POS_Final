"use client";

import useLoginForm from "./useLoginForm";
import { useRouter } from "next/navigation";

const LoginPage: React.FC = () => {
  const { user, errors, handleInput, handleSubmit } = useLoginForm();
  const router = useRouter();

  const handleNavigate = (path: string) => {
    router.push(path);
  };

  return (
    <div className="flex justify-center items-center bg-blue-500 min-h-screen">
      <div className="bg-white p-6 rounded w-1/4">
        <h2 className="text-center text-2xl font-bold mb-4 text-black">
          Login
        </h2>
        <form onSubmit={(e) => handleSubmit(e, handleNavigate)}>
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
            <label
              htmlFor="password"
              className="block font-bold mb-2 text-black"
            >
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
            Login
          </button>
          <a
            href="/Signup"
            className="block border border-gray-300 mt-3 bg-gray-100 text-center py-2 px-4 w-full rounded-md text-gray-700 hover:bg-gray-200"
          >
            SignUp
          </a>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;