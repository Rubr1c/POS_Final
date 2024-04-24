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
      const res = await axios.delete(`http://localhost:8081/DeleteEmployee`, {
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
    <>
      <h2>Employees</h2>
      {employees.map((employee) => (
        <div key={employee.email} className="flex items-center space-x-4">
          <h5>{employee.email}</h5>
          <h5>{employee.username}</h5>
          <button
            className="btn btn-primary"
            onClick={() => openEditWindow(employee)}
          >
            Edit
          </button>
          <button
            className="btn btn-danger"
            onClick={() => handleDeleteEmployee(employee.email)}
          >
            Delete
          </button>
        </div>
      ))}
      {editEmployee && (
        <div id="edit-emp-window" className="fixed top-0 left-0 h-full w-full bg-gray-800 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-md max-w-sm">
            <h1 className="text-2xl mb-4">Edit Employee</h1>
            <input
              type="text"
              className="form-input mb-4"
              value={editEmployee.email}
              readOnly
            />
            <input
              type="text"
              className="form-input mb-4"
              value={editEmployee.username}
              onChange={(e) =>
                setEditEmployee({ ...editEmployee, username: e.target.value })
              }
            />
            <input
              type="password"
              className="form-input mb-4"
              value={editEmployee.password}
              onChange={(e) =>
                setEditEmployee({ ...editEmployee, password: e.target.value })
              }
            />
            <button className="btn btn-success mr-2" onClick={saveChanges}>
              Save
            </button>
            <button className="btn btn-danger" onClick={closeEditWindow}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Employees;
