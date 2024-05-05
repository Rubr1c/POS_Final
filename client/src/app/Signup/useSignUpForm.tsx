import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import checkInternetConnection from "../CheckInternet"

type User = {
  username: string;
  email: string;
  password: string;
};

type Errors = {
  username?: string;
  email?: string;
  password?: string;
};

const useSignUpForm = () => {
  const [user, setUser] = useState<User>({
    username: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<Errors>({});

  const router = useRouter();

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({ ...prevUser, [name]: value }));
    validateUser(value, name);
  };

  const validateUser = (value: string, name: string) => {
    switch (name) {
      case "username":
        setErrors({});
        if (value.length < 4) {
          setErrors({ username: "Username must be at least 4 characters" });
          break;
        } else if (value.length > 14) {
          setErrors({ username: "Username must be at most 14 characters" });
          break;
        } else {
          setErrors({});
          break;
        }
      case "email":
        setErrors({});
        const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        if (!emailPattern.test(value)) {
          setErrors({ email: "Invalid Email" });
          break;
        } else {
          setErrors({});
          break;
        }
      case "password":
        setErrors({});
        const passwordPattern =
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[a-zA-Z\d!@#$%^&*]{8,}$/;
        if (value.length < 8) {
          setErrors({ password: "Password must be at least 8 characters" });
          break;
        } else {
          if (!passwordPattern.test(value)) {
            setErrors({
              password:
                "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (!@#$%^&*)",
            });
            break;
          }
          setErrors({});
          break;
        }
    }
  };

  const addToDb = async (userData: User) => {
    try {
      const response = await axios.post(
        "http://localhost:8081/SignUp",
        userData
      );

      if (response.data.error) {
        setErrors({ email: response.data.error });
        console.log(errors);
        return false;
      }
      return response.data.success;
    } catch (error: any) {
      if (error.response.status === 500) {
        console.log(error.response.status);
        setErrors({ email: "User Already Exists" });
      }
      console.error(error);
      return false;
    }
  };
  const addToJson = async (userData: User) => {
    try {
      const load = await axios.post("http://localhost:3001/loadData");
      const response = await axios.post(
        "http://localhost:3001/SignUp",
        userData
      );

      if (response.data.error) {
        setErrors({ email: response.data.error });
        console.log(errors);
        return false;
      }

      return response.data.success;
    } catch (error: any) {
      console.error(error);
      return false;
    }
  }

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
    navigate: (path: string) => void
  ) => {
    e.preventDefault();
    if (Object.keys(errors).length > 0) {
      return;
    }
    setErrors({});

    const isConnected = await checkInternetConnection();

    if (isConnected) {
      const onlineSuccess = await addToDb(user);
      const offlineSuccess = await addToJson(user);
      if (onlineSuccess && offlineSuccess) {
        router.push("/Login");
      }
    } else {
      const offlineSuccess = await addToJson(user);
      if (offlineSuccess) {
        router.push("/Login");
      }
    }
  };
  return { user, errors, handleInput, handleSubmit };
};

export default useSignUpForm;
