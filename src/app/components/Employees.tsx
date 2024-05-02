import { useState, useEffect } from "react";
import axios from "axios";

interface Employee {
  email: string;
  username: string;
  password: string;
}

const Employees: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [editEmployee, setEditEmployee] = useState<Employee | null>(null);

  useEffect(() => {
    fetchEmployees();
  });

  const fetchEmployees = () => {
    axios
      .get("http://localhost:8081/GetEmployees")
      .then((res) => {
        setEmployees(res.data);
      })
      .catch((err) => console.log(err));
  };

  const handleDeleteEmployee = async (email: string) => {
    try {
      const res = await axios.delete("http://localhost:8081/DeleteEmployee", {
        params: { email: email },
      });
      if (res.data.success) {
        setEmployees(employees.filter((employee) => employee.email !== email));
      }
    } catch (error) {
      console.error("Error deleting employee:", error);
    }
  };

  const openEditWindow = (employee: Employee) => {
    setEditEmployee(employee);
  };

  const closeEditWindow = () => {
    setEditEmployee(null);
  };

  const saveChanges = async () => {
    if (editEmployee) {
      try {
        const res = await axios.post("http://localhost:8081/EditEmployee", {
          email: editEmployee.email,
          username: editEmployee.username,
          password: editEmployee.password,
        });
        if (res.data.success) {
          closeEditWindow();
          fetchEmployees();
        } else {
          console.error("Error editing employee:", res.data.error);
        }
      } catch (error) {
        console.error("Error editing employee:", error);
      }
    }
  };

  return (
    <div className="p-5">
      <h2 className="text-2xl font-bold mb-4 text-white pl-4">Employees</h2>
      <div className="overflow-y-auto max-h-[calc(100vh-4rem)] pb-52">
        {employees.map((employee) => (
          <div
            key={employee.email}
            className="grid grid-cols-3 items-center justify-between p-5 bg-gray-700 m-3"
          >
            <div className="col-span-1 text-gray-300">
              <h5 className="font-bold ">{employee.email}</h5>
            </div>
            <div className="col-span-1 text-gray-300">
              <h5>{employee.username}</h5>
            </div>
            <div className="col-span-1 text-right">
              <button
                className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
                onClick={() => openEditWindow(employee)}
              >
                Edit
              </button>
              <button
                className="text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 shadow-lg shadow-red-500/50 dark:shadow-lg dark:shadow-red-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
                onClick={() => handleDeleteEmployee(employee.email)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
      {editEmployee && (
        <div
          id="edit-emp-window"
          className="fixed top-0 left-0 h-full w-full bg-gray-800 bg-opacity-50 flex items-center justify-center"
        >
          <div className="bg-white p-6 rounded shadow-md max-w-sm relative w-1/3">
            <h1 className="text-2xl mb-4">Edit Employee</h1>
            <button
              className="text-red-500 text-3xl absolute top-5 right-5"
              onClick={closeEditWindow}
            >
              &times;
            </button>
            <input
              type="text"
              className="mb-5 bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 cursor-not-allowed" 
              value={editEmployee.email}
              disabled
            />
            <input
              type="text"
              className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
              value={editEmployee.username}
              onChange={(e) =>
                setEditEmployee({ ...editEmployee, username: e.target.value })
              }
            />
            <input
              type="password"
              className="mt-5 bg-white border border-gray-300  text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 text-black"
              value={editEmployee.password}
              onChange={(e) =>
                setEditEmployee({ ...editEmployee, password: e.target.value })
              }
            />
            <button
              className="mt-5 text-white bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 shadow-lg shadow-green-500/50 dark:shadow-lg dark:shadow-green-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
              onClick={saveChanges}
            >
              Save
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Employees;
