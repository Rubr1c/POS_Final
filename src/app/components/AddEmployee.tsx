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

  const syncWithOnlineDatabase = async (userData: Employee) => {
    try {
      // Attempt to send the data to the online database
      const response = await axios.post("http://localhost:8081/SignUp", userData);
      if (response.data.success) {
        // If the user was successfully added to the online database, return true
        return true;
      } else {
        // If the server responded with an error (e.g., user already exists), return false
        return false;
      }
    } catch (error) {
      console.error(error);
      // If there was an error in the request, return false
      return false;
    }
  };
  

  useEffect(() => {
    // Function to be called when the user comes online
    const handleOnline = async () => {
      // Retrieve the local database
      const localDatabase = JSON.parse(localStorage.getItem("localDatabase") || "{}");
      // Check if there are any users to sync
      if (localDatabase.admins && localDatabase.admins.length > 0) {
        // Attempt to sync each user with the online database
        for (const admin of localDatabase.admins) {
          // Only sync users that haven't been synced yet
          if (!admin.synced) {
            const success = await syncWithOnlineDatabase(admin);
            if (success) {
              // Mark the user as synced
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
  

  const addEmployee = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  
    // Retrieve the admin's username from localStorage
    const adminUsername = localStorage.getItem('LoggedInUser');
  
    if (navigator.onLine) {
      // Online logic: Send the request to the server
      axios.post("http://localhost:8081/AddEmployee", { ...employee, admin: adminUsername })
        .then((res) => {
          if (res.data.success) {
            setEmployee({
              email: "",
              username: "",
              password: "",
            });
          }
        })
        .catch((err) => {
          console.error(err);
        });
    } else {
      // Offline logic: Save the employee data to localStorage
      const localDatabase = JSON.parse(localStorage.getItem('localDatabase') || '{}');
      
      if (!localDatabase.employees) {
        localDatabase.employees = [];
      }
  
      // Check if an employee with the same username already exists
      const employeeExists = localDatabase.employees.some((emp : Employee) => emp.username === employee.username);
  
      if (!employeeExists) {
        // Add the 'addedBy' field to store the admin's username
        const newEmployee = { ...employee, addedBy: adminUsername };
        localDatabase.employees.push(newEmployee);
  
        // Save the updated database back to localStorage
        localStorage.setItem('localDatabase', JSON.stringify(localDatabase));
      }
  
      // Reset the employee form
      setEmployee({
        email: "",
        username: "",
        password: "",
      });
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEmployee((prevEmployee) => ({
      ...prevEmployee,
      [name]: value,
    }));
  };

  return (
    <>
      <h2>Add Employee</h2>
      <form onSubmit={addEmployee}>
        <input
          type="text"
          name="email"
          value={employee.email}
          onChange={handleInput}
          placeholder="Enter Employee Email..."
          required
          className="m-4 p-2 border border-dark rounded-2"
        />
        <input
          type="text"
          name="username"
          value={employee.username}
          onChange={handleInput}
          placeholder="Create Username..."
          required
          className="m-4 p-2 border border-dark rounded-2"
        />
        <input
          type="text"
          name="password"
          value={employee.password}
          onChange={handleInput}
          placeholder="Create Password..."
          required
          className="m-4 p-2 border border-dark rounded-2"
        />
        <button type="submit" className="m-4 p-2 bg-gray-800 text-white rounded-lg">
          Add
        </button>
      </form>
    </>
  );
};

export default AddEmployee;
