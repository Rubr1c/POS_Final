import { useState } from "react";
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

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({ ...prevUser, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>, navigate: (path: string) => void) => {
    e.preventDefault();
    setErrors({});
    if (navigator.onLine) {
      try {
        const response = await axios.post("http://localhost:8081/Login", user);
        if (!response.data.Login) {
          const newErrors: Errors = {
            email: "",
            password: "",
          };
          if (response.data.error === "Invalid password") {
            newErrors.password = "Invalid password";
          } else if (response.data.error === "No existing accounts") {
            newErrors.email = "No existing accounts";
          }
          setErrors(newErrors);
        } else {
          const path = response.data.Admin ? "/home-admin" : "/home-employee";
          navigate(path);
          
        }
      } catch (error) {
        console.error(error);
      } 
    } else {
      
    }
  };

  return { user, errors, handleInput, handleSubmit };
};

export default useLoginForm;
