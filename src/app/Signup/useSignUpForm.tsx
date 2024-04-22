import { useState } from "react";
import axios from "axios";

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
  const [user, setUser] = useState<User>({ username: "", email: "", password: "" });
  const [errors, setErrors] = useState<Errors>({});

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({ ...prevUser, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>, navigate: (path: string) => void) => {
    e.preventDefault();
    setErrors({});
    try {
      const response = await axios.post("http://localhost:8081/SignUp", user);
      if (response.data.success) {
        navigate("/Login");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return { user, errors, handleInput, handleSubmit };
};

export default useSignUpForm;
