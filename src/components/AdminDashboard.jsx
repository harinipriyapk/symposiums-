import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/users");
        setUsers(res.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchUsers();
  }, []);

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4">Admin Dashboard</h2>
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th className="border px-4 py-2">Name</th>
            <th className="border px-4 py-2">Email</th>
            <th className="border px-4 py-2">College</th>
            <th className="border px-4 py-2">Session</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td className="border px-4 py-2">{user.name}</td>
              <td className="border px-4 py-2">{user.email}</td>
              <td className="border px-4 py-2">{user.college}</td>
              <td className="border px-4 py-2">{user.session}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminDashboard;