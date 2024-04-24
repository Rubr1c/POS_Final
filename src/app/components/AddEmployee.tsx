import { useState } from "react";
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

  const addEmployee = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    axios
      .post("http://localhost:8081/AddEmployee", employee)
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
        console.log(err);
      });
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
