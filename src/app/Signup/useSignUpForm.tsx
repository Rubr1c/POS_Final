import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

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
  };

  useEffect(() => {
    // Function to be called when the user comes online
    const handleOnline = async () => {
      // Retrieve the local database
      const localDatabase = JSON.parse(
        localStorage.getItem("localDatabase") || "{}"
      );
      // Check if there are any admins to sync
      if (localDatabase.admins && localDatabase.admins.length > 0) {
        // Attempt to sync each admin with the online database
        for (const admin of localDatabase.admins) {
          // Only sync admins that haven't been synced yet
          if (!admin.synced) {
            const success = await syncWithOnlineDatabase(admin);
            if (success) {
              // Mark the admin as synced
              admin.synced = true;
            }
          }
        }
        // Save the updated database back to localStorage
        localStorage.setItem("localDatabase", JSON.stringify(localDatabase));
      }
    };

    // Add the event listener for the online event
    window.addEventListener("online", handleOnline);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener("online", handleOnline);
    };
  }, []);

  const saveToLocalDatabase = (userData: User) => {
    const localDatabase = JSON.parse(
      localStorage.getItem("localDatabase") || "{}"
    );

    if (!localDatabase.admins) {
      localDatabase.admins = [];
    }

    const userExists = localDatabase.admins.some(
      (admin : User) => admin.username === userData.username
    );

    if (!userExists) {
      // If the user does not exist, add them to the local database
      localDatabase.admins.push(userData);
      // Save the updated database back to localStorage
      localStorage.setItem("localDatabase", JSON.stringify(localDatabase));
      router.push("/Login")
    }
  };

  const syncWithOnlineDatabase = async (userData: User) => {
    try {
      // Attempt to send the data to the online database
      const response = await axios.post(
        "http://localhost:8081/SignUp",
        userData
      );
      return response.data.success;
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
    navigate: (path: string) => void
  ) => {
    e.preventDefault();
    setErrors({});

    if (navigator.onLine) {
      const success = await syncWithOnlineDatabase(user);
      if (success) {
        navigate("/Login");
      } else {
        saveToLocalDatabase(user);
      }
    } else {
      saveToLocalDatabase(user);
    }
  };

  return { user, errors, handleInput, handleSubmit };
};

export default useSignUpForm;
