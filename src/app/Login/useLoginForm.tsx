import { useEffect, useState } from "react";
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
      const localDatabase = JSON.parse(localStorage.getItem('localDatabase') || '{}');
      let foundUser = localDatabase.admins?.find((admin : User) => admin.email === user.email && admin.password === user.password);
      let isAdmin = true;

      if (!foundUser) {
        // If not found in admins, search in employees
        foundUser = localDatabase.employees?.find((employee : User) => employee.email === user.email && employee.password === user.password);
        isAdmin = false;
      }

      if (foundUser) {
        // Set isAdmin in localStorage
        localStorage.setItem('LoggedInUser', foundUser.username);
        localStorage.setItem('isAdmin', JSON.stringify(isAdmin));
        // Navigate to the appropriate path
        const path = isAdmin ? "/home-admin" : "/home-employee";
        navigate(path);
      } else {
        // Set error if no matching user is found
        setErrors({ email: "No existing accounts or invalid password" });
      }
    }
  };

  return { user, errors, handleInput, handleSubmit };
};

export default useLoginForm;
