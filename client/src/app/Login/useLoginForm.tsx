import { useState } from "react";
import { useRouter } from "next/navigation";
import checkInternetConnection from "../CheckInternet";
import axios from "axios";

type User = {
  email: string;
  password: string;
};

type Errors = {
  email?: string;
  password?: string;
};

const useLoginForm = () => {
  const [user, setUser] = useState<User>({ email: "", password: "" });
  const [errors, setErrors] = useState<Errors>({});

  const router = useRouter();

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({...prevUser, [name]: value }));
  };

  const connectToDb = async (user: User) => {
    try {
      const response = await axios.post("http://localhost:8081/Login", user);

      if (!response.data.Login) {
        const newErrors: Errors = {
          email: "",
          password: "",
        };

        if (response.data.error === "Incorrect password") {
          newErrors.password = "Incorrect password";
        } else if (response.data.error === "No existing account") {
          newErrors.email = "No existing account";
        }
        setErrors(newErrors);
        return { success: false };
      } else {
        if (response.data.Admin) {
          return { admin: true, success: true };
        }
        return { success: true };
      }
    } catch (error) {
      console.error(error);
    }
  };

  const connectToJson = async (user: User) => {
    try {
      
      const response = await axios.post("http://localhost:3001/Login", user);
      if (!response.data.Login) {
        const newErrors: Errors = {
          email: "",
          password: "",
        };
        if (response.data.error === "Invalid username or password.") {
          newErrors.password = "Invalid username or password.";
        }
        setErrors(newErrors);
        return { success: false };
      } else {
        if (response.data.Admin) {
          return { admin: true, success: true };
        }
        return { success: true };
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
    navigate: (path: string) => void
  ) => {
    e.preventDefault();
    setErrors({});
    const isConnected = await checkInternetConnection();
    if (!isConnected) {
      const offlineDbCon = await connectToJson(user);
      const success = offlineDbCon?.success;
      if (!success) {
        return;
      }
      const path = "/home-offline";
      router.push(path);
    } else {
      const onlineDbCon = await connectToDb(user);
      const offlineDbCon = await connectToJson(user);
      const success = onlineDbCon?.success;
      if (!success) {
        return;
      }
      const admin = onlineDbCon?.admin;

      const path = admin ? "/home-admin" : "/home-employee";
      router.push(path);
    }
  };

  return { user, errors, handleInput, handleSubmit };
};

export default useLoginForm;
