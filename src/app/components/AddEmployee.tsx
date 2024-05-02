import { useEffect, useState } from "react";
import axios from "axios";

interface Employee {
  email: string;
  username: string;
  password: string;
}

const AddEmployee: React.FC = () => {
  const [employee, setEmployee] = useState<Employee>({
    email: "",
    username: "",
    password: "",
  });
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState<Array<string>>([]);

  const addEmployee = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const successMessage = document.getElementById("success-message");
    const errorMessageElem = document.getElementById("error-message");

    const emailInput = document.getElementById(
      "email"
    ) as HTMLInputElement | null;
    const usernameInput = document.getElementById(
      "username"
    ) as HTMLInputElement | null;
    const passwordInput = document.getElementById(
      "password"
    ) as HTMLInputElement | null;

    if (errorMessage.length > 0) {
      return;
    }

    if (navigator.onLine) {
      axios
        .post("http://localhost:8081/AddEmployee", employee)
        .then((res) => {
          if (res.data.success) {
            setEmployee({
              email: "",
              username: "",
              password: "",
            });
            if (usernameInput && emailInput && passwordInput) {
              usernameInput.value = "";
              emailInput.value = "";
              passwordInput.value = "";
            }
            if (successMessage) {
              setSuccessMessage("Employee Added Successfully");
              setTimeout(() => {
                setSuccessMessage("");
              }, 3000);
            }
          } else {
            if (errorMessageElem) {
              setErrorMessage(["Employee Addition Failed"]);
              setTimeout(() => {
                setErrorMessage([]);
              }, 3000);
            }
          }
        })
        .catch((err) => {
          console.error(err);
          if (errorMessage) {
            setErrorMessage(["Employee Addition Failed"]);
            setTimeout(() => {
              setErrorMessage([]);
            }, 3000);
          }
        });
    } else {
    }
  };

  const validateUser = (value: string, name: string) => {
    switch (name) {
      case "username":
        if (value.length < 4) {
          setErrorMessage((e) =>
            [...e].filter(
              (msg) => msg !== "Username must be at most 14 characters"
            )
          );
          setErrorMessage((e) => [
            ...e,
            "Username must be at least 4 characters",
          ]);
          break;
        } else if (value.length > 14) {
          setErrorMessage((e) =>
            [...e].filter(
              (msg) => msg !== "Username must be at least 4 characters"
            )
          );
          setErrorMessage((e) => [
            ...e,
            "Username must be at most 14 characters",
          ]);
          break;
        } else {
          setErrorMessage((e) =>
            [...e].filter(
              (msg) =>
                msg !== "Username must be at least 4 characters" &&
                msg !== "Username must be at most 14 characters"
            )
          );
          break;
        }
      case "email":
        const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        if (!emailPattern.test(value)) {
          setErrorMessage((e) => [...e, "Invalid Email"]);
          break;
        } else {
          setErrorMessage((e) =>
            [...e].filter((msg) => msg !== "Invalid Email")
          );
          break;
        }
      case "password":
        const passwordPattern =
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[a-zA-Z\d!@#$%^&*]{8,}$/;
        if (value.length < 8) {
          setErrorMessage((e) =>
            [...e].filter(
              (msg) =>
                msg !==
                "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (!@#$%^&*)"
            )
          );
          setErrorMessage((e) => [
            ...e,
            "Password must be at least 8 characters",
          ]);
          break;
        } else {
          if (!passwordPattern.test(value)) {
            setErrorMessage((e) =>
              [...e].filter(
                (msg) => msg !== "Password must be at least 8 characters"
              )
            );
            setErrorMessage((e) => [
              ...e,
              "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (!@#$%^&*)",
            ]);
            break;
          }
          setErrorMessage((e) =>
            [...e].filter(
              (msg) =>
                msg !== "Password must be at least 8 characters" &&
                msg !==
                  "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (!@#$%^&*)"
            )
          );
          break;
        }
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEmployee((prevEmployee) => ({
      ...prevEmployee,
      [name]: value,
    }));
    validateUser(value, name);
  };

  return (
    <div className="p-5">
      <h2 className="text-2xl font-bold mb-4 text-white pl-4">Add Employee</h2>
      <form onSubmit={addEmployee}>
        <div className="grid grid-cols-3 gap-4">
          <div className="flex gap-4 mb-5 w-full">
            <div className="relative z-0 w-1/3">
              <input
                type="email"
                onChange={handleInput}
                name="email"
                placeholder=" "
                required
                className="block py-2.5 px-0 text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer w-full"
                id="email"
              />
              <label
                htmlFor="email"
                className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
              >
                Email
              </label>
            </div>
            <div className="relative z-0 w-1/3">
              <input
                type="text"
                onChange={handleInput}
                name="username"
                placeholder=" "
                required
                className="block py-2.5 px-0 text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer w-full"
                id="username"
              />
              <label
                htmlFor="username"
                className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
              >
                Username
              </label>
            </div>
            <div className="relative z-0 w-1/3">
              <input
                type="text"
                onChange={handleInput}
                name="password"
                placeholder=" "
                required
                className="block py-2.5 px-0 text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer w-full"
                id="password"
              />
              <label
                htmlFor="password"
                className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
              >
                Password
              </label>
            </div>
            <button
              type="submit"
              className="text-white bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-purple-300 dark:focus:ring-purple-800 shadow-lg shadow-purple-500/50 dark:shadow-lg dark:shadow-purple-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
            >
              Add
            </button>
          </div>
        </div>
      </form>
      <div id="success-message" className="text-green-500 font-bold">
        {successMessage}
      </div>
      <div id="error-message" className="text-red-500 font-bold">
        {errorMessage[0]}
      </div>
    </div>
  );
};

export default AddEmployee;
