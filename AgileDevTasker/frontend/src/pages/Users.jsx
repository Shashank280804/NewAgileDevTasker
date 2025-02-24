import React, { useEffect, useState } from "react";
import Title from "../components/Title";
import Button from "../components/Button";
import { IoMdAdd } from "react-icons/io";
import { getInitials } from "../utils";
import clsx from "clsx";
import axios from "axios";  // Import axios for API requests

import ConfirmatioDialog from "../components/Dialogs";
import AddUser from "../components/AddUser";

const Users = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [open, setOpen] = useState(false);
  const [users, setUsers] = useState([]); // Local state for users
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    // Load users from backend on component mount
    axios.get("http://localhost:5000/team-members")
      .then((response) => {
        // Debugging: Log the API response data
        console.log("API Response:", response.data);

        // Ensure that the response is an array before setting the state
        const usersData = Array.isArray(response.data) ? response.data : [];
        setUsers(usersData);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
      });
  }, []);
  
  const handleAddUser = (newUser) => {
    // Debugging: Log the data being sent to the backend
    console.log("Form Data before sending to backend:", newUser); // Log the form data before sending
  
    // Ensure the required fields are correctly passed
    const requestBody = {
      username: newUser.username,  // Ensure `username` exists
      title: newUser.title,
      email: newUser.email,
      role: newUser.role,
    };
  
    // Debugging: Log the request body
    console.log("Request Body being sent to backend:", requestBody);
  
    // Add a new user via the backend API (POST request)
    axios.post("http://localhost:5000/team-members", requestBody)
      .then((response) => {
        setUsers((prevUsers) => [...prevUsers, response.data]);
        setOpen(false);  // Close the modal after adding user
      })
      .catch((error) => {
        console.error("Error adding user:", error);
      });
  };
  
  

  const handleEditUser = (updatedUser) => {
    // Update the selected user via the backend API (PUT request)
    axios.put(`http://localhost:5000/team-members/${updatedUser._id}`, updatedUser)
      .then((response) => {
        // Update the user list in state with the updated user data
        setUsers((prevUsers) => 
          prevUsers.map((user) => (user._id === updatedUser._id ? updatedUser : user))
        );
        setOpen(false);  // Close the modal after updating user
      })
      .catch((error) => {
        console.error("Error updating user:", error);
      });
  };

  const deleteHandler = () => {
    // Delete user from backend
    axios.delete(`http://localhost:5000/team-members/${selected}`)
      .then(() => {
        setUsers((prevUsers) => prevUsers.filter((user) => user._id !== selected));
        setOpenDialog(false);
      })
      .catch((error) => {
        console.error("Error deleting user:", error);
      });
  };

  const deleteClick = (id) => {
    setSelected(id);
    setOpenDialog(true);
  };

  const editClick = (user) => {
    setSelected(user);
    setOpen(true);  // Open the modal with the selected user's data
  };

  const TableHeader = () => (
    <thead className="border-b border-gray-300">
      <tr className="text-black text-left">
        <th className="py-2">Full Name</th>
        <th className="py-2">Title</th>
        <th className="py-2">Email</th>
        <th className="py-2">Role</th>
        <th className="py-2">Active</th>
      </tr>
    </thead>
  );

  const TableRow = ({ user }) => (
    <tr className="border-b border-gray-200 text-gray-600 hover:bg-gray-400/10">
      <td className="p-2">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full text-white flex items-center justify-center text-sm bg-blue-700">
            <span className="text-xs md:text-sm text-center">
              {getInitials(user?.username)}  
            </span>
          </div>
          {user?.username}  
        </div>
      </td>
      <td className="p-2">{user?.title}</td>
      <td className="p-2">{user?.email || "user.email.com"}</td>
      <td className="p-2">{user?.role}</td>
      <td>
        <button
          className={clsx(
            "w-fit px-4 py-1 rounded-full",
            user.isActive ? "bg-blue-200" : "bg-yellow-100"
          )}
        >
          {user.isActive ? "Active" : "Disabled"}
        </button>
      </td>
      <td className="p-2 flex gap-4 justify-end">
        <Button
          className="text-blue-600 hover:text-blue-500 font-semibold sm:px-0"
          label="Edit"
          type="button"
          onClick={() => editClick(user)}
        />
        <Button
          className="text-red-700 hover:text-red-500 font-semibold sm:px-0"
          label="Delete"
          type="button"
          onClick={() => deleteClick(user._id)}
        />
      </td>
    </tr>
  );
  
  return (
    <>
      <div className="w-full md:px-1 px-0 mb-6">
        <div className="flex items-center justify-between mb-8">
          <Title title="Team Members" />
          <Button
            label="Add New User"
            icon={<IoMdAdd className="text-lg" />}
            className="flex flex-row-reverse gap-1 items-center bg-blue-600 text-white rounded-md 2xl:py-2.5"
            onClick={() => setOpen(true)}
          />
        </div>

        <div className="bg-white px-2 md:px-4 py-4 shadow-md rounded">
          <div className="overflow-x-auto">
            <table className="w-full mb-5">
              <TableHeader />
              <tbody>
                {Array.isArray(users) && users.length > 0 ? (
                  users.map((user) => (
                    <TableRow key={user._id} user={user} />
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center py-4">No users available.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <AddUser
        open={open}
        setOpen={setOpen}
        userData={selected}
        onAddUser={handleAddUser}
        onEditUser={handleEditUser}  // Pass the edit function to the modal
      />

      <ConfirmatioDialog
        open={openDialog}
        setOpen={setOpenDialog}
        onClick={deleteHandler}
      />
    </>
  );
};

export default Users;
