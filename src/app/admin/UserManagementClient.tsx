"use client";

import { useState, FormEvent } from "react";
import { IUser } from "@/app/models/user";

// Define more specific types for nested data to improve type safety
interface IWeightData {
  date: string;
  weight: number;
}

interface IMedication {
  type: string;
  dosage: string;
}

interface IShipment {
  date: string;
  status: string;
  tracking: string;
}

interface UserManagementClientProps {
  users: IUser[];
}

export default function UserManagementClient({
  users: initialUsers,
}: UserManagementClientProps) {
  const [users, setUsers] = useState<IUser[]>(initialUsers);
  const [isModalOpen, setIsModalOpen] = useState(false);
  // State to hold the user currently being edited
  const [editingUser, setEditingUser] = useState<IUser | null>(null);
  // State to manage the form fields within the modal
  const [formData, setFormData] = useState<Partial<IUser>>({});

  // --- Functions to manage array fields ---

  const handleArrayChange = (
    arrayName: "medications" | "weightData" | "shipments",
    index: number,
    field: string,
    value: string
  ) => {
    setFormData((prev) => {
      const newArray = [...(prev[arrayName] as any[])];
      newArray[index] = { ...newArray[index], [field]: value };
      return { ...prev, [arrayName]: newArray };
    });
  };

  const addArrayItem = (
    arrayName: "medications" | "weightData" | "shipments"
  ) => {
    let newItem;
    if (arrayName === "medications") {
      newItem = { type: "New Medication", dosage: "50mg" };
    } else if (arrayName === "weightData") {
      newItem = { date: new Date().toISOString(), weight: 0 };
    } else {
      // shipments
      newItem = {
        date: new Date().toISOString(),
        status: "Pending",
        tracking: "N/A",
      };
    }
    setFormData((prev) => ({
      ...prev,
      [arrayName]: [...((prev[arrayName] as any[]) || []), newItem],
    }));
  };

  const removeArrayItem = (
    arrayName: "medications" | "weightData" | "shipments",
    index: number
  ) => {
    setFormData((prev) => ({
      ...prev,
      [arrayName]: (prev[arrayName] as any[]).filter((_, i) => i !== index),
    }));
  };

  // --- Core handlers ---

  const handleEdit = (user: IUser) => {
    setEditingUser(user);
    // Deep copy the user object to avoid direct state mutation
    setFormData(JSON.parse(JSON.stringify(user)));
    setIsModalOpen(true);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleDelete = async (userId: string) => {
    if (!confirm("Are you sure you want to permanently delete this user?"))
      return;
    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setUsers((currentUsers) =>
          currentUsers.filter((user) => user._id !== userId)
        );
        alert("User deleted successfully!");
      } else {
        alert("Failed to delete user.");
      }
    } catch (error) {
      alert("An error occurred while deleting the user.");
    }
  };

  const handleUpdateUser = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!editingUser) return;

    try {
      const response = await fetch(`/api/users/${editingUser._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const updatedUserFromServer = await response.json();
        // --- THE FIX IS HERE ---
        // Replace the old user data with the complete, updated user object from the server
        setUsers((currentUsers) =>
          currentUsers.map((user) =>
            user._id === updatedUserFromServer._id
              ? updatedUserFromServer
              : user
          )
        );
        // ----------------------
        setIsModalOpen(false);
        setEditingUser(null);
        alert("User updated successfully!");
      } else {
        alert("Failed to update user.");
      }
    } catch (error) {
      alert("An error occurred while updating the user.");
    }
  };

  return (
    <div className="p-4 sm:p-8">
      <h1 className="text-2xl font-bold mb-6">User Management</h1>
      <div className="overflow-x-auto rounded-lg shadow-md">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-200">
            <tr>
              <th className="text-left py-3 px-4">Username</th>
              <th className="text-left py-3 px-4">Email</th>
              <th className="text-left py-3 px-4">Is Admin?</th>
              <th className="text-left py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id} className="border-b hover:bg-gray-50">
                <td className="py-3 px-4">{user.username}</td>
                <td className="py-3 px-4">{user.email}</td>
                <td className="py-3 px-4">{user.isAdmin ? "Yes" : "No"}</td>
                <td className="py-3 px-4">
                  <button
                    onClick={() => handleEdit(user)}
                    className="bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600 mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(user._id)}
                    className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Full-Featured Edit Modal */}
      {isModalOpen && editingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center p-4 z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-6">
              Edit User: {editingUser.username}
            </h2>
            <form onSubmit={handleUpdateUser} className="space-y-6">
              <fieldset className="border p-4 rounded-md">
                <legend className="text-lg font-semibold px-2">
                  User Info
                </legend>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Username
                    </label>
                    <input
                      type="text"
                      name="username"
                      value={formData.username || ""}
                      onChange={handleFormChange}
                      className="mt-1 block w-full input-style"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email || ""}
                      onChange={handleFormChange}
                      className="mt-1 block w-full input-style"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Goal Weight (lbs)
                    </label>
                    <input
                      type="number"
                      name="goalWeight"
                      value={formData.goalWeight || ""}
                      onChange={handleFormChange}
                      className="mt-1 block w-full input-style"
                    />
                  </div>
                  <div className="flex items-center pt-6">
                    <input
                      type="checkbox"
                      name="isAdmin"
                      checked={formData.isAdmin || false}
                      onChange={handleFormChange}
                      className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                    />
                    <label className="ml-2 text-sm text-gray-900">
                      Is Admin?
                    </label>
                  </div>
                </div>
              </fieldset>

              <fieldset className="border p-4 rounded-md">
                <legend className="text-lg font-semibold px-2">
                  Medications
                </legend>
                <div className="space-y-3">
                  {formData.medications?.map((med, index) => (
                    <div
                      key={index}
                      className="grid grid-cols-12 gap-2 items-center"
                    >
                      <input
                        type="text"
                        placeholder="Type"
                        value={med.type}
                        onChange={(e) =>
                          handleArrayChange(
                            "medications",
                            index,
                            "type",
                            e.target.value
                          )
                        }
                        className="col-span-5 input-style"
                      />
                      <input
                        type="text"
                        placeholder="Dosage"
                        value={med.dosage}
                        onChange={(e) =>
                          handleArrayChange(
                            "medications",
                            index,
                            "dosage",
                            e.target.value
                          )
                        }
                        className="col-span-5 input-style"
                      />
                      <button
                        type="button"
                        onClick={() => removeArrayItem("medications", index)}
                        className="col-span-2 bg-red-500 text-white rounded h-full"
                      >
                        X
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => addArrayItem("medications")}
                  className="mt-4 bg-green-500 text-white py-1 px-3 rounded hover:bg-green-600"
                >
                  Add Medication
                </button>
              </fieldset>

              <fieldset className="border p-4 rounded-md">
                <legend className="text-lg font-semibold px-2">
                  Weight History
                </legend>
                <div className="space-y-3">
                  {formData.weightData?.map((entry, index) => (
                    <div
                      key={index}
                      className="grid grid-cols-12 gap-2 items-center"
                    >
                      <input
                        type="date"
                        value={new Date(entry.date).toISOString().split("T")[0]}
                        onChange={(e) =>
                          handleArrayChange(
                            "weightData",
                            index,
                            "date",
                            new Date(e.target.value).toISOString()
                          )
                        }
                        className="col-span-5 input-style"
                      />
                      <input
                        type="number"
                        placeholder="Weight"
                        value={entry.weight}
                        onChange={(e) =>
                          handleArrayChange(
                            "weightData",
                            index,
                            "weight",
                            e.target.value
                          )
                        }
                        className="col-span-5 input-style"
                      />
                      <button
                        type="button"
                        onClick={() => removeArrayItem("weightData", index)}
                        className="col-span-2 bg-red-500 text-white rounded h-full"
                      >
                        X
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => addArrayItem("weightData")}
                  className="mt-4 bg-green-500 text-white py-1 px-3 rounded hover:bg-green-600"
                >
                  Add Weight Entry
                </button>
              </fieldset>

              <fieldset className="border p-4 rounded-md">
                <legend className="text-lg font-semibold px-2">
                  Shipments
                </legend>
                <div className="space-y-3">
                  {formData.shipments?.map((shipment, index) => (
                    <div
                      key={index}
                      className="grid grid-cols-12 gap-2 items-center"
                    >
                      <input
                        type="date"
                        value={
                          new Date(shipment.date).toISOString().split("T")[0]
                        }
                        onChange={(e) =>
                          handleArrayChange(
                            "shipments",
                            index,
                            "date",
                            new Date(e.target.value).toISOString()
                          )
                        }
                        className="col-span-3 input-style"
                      />
                      <input
                        type="text"
                        placeholder="Status"
                        value={shipment.status}
                        onChange={(e) =>
                          handleArrayChange(
                            "shipments",
                            index,
                            "status",
                            e.target.value
                          )
                        }
                        className="col-span-4 input-style"
                      />
                      <input
                        type="text"
                        placeholder="Tracking #"
                        value={shipment.tracking}
                        onChange={(e) =>
                          handleArrayChange(
                            "shipments",
                            index,
                            "tracking",
                            e.target.value
                          )
                        }
                        className="col-span-3 input-style"
                      />
                      <button
                        type="button"
                        onClick={() => removeArrayItem("shipments", index)}
                        className="col-span-2 bg-red-500 text-white rounded h-full"
                      >
                        X
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => addArrayItem("shipments")}
                  className="mt-4 bg-green-500 text-white py-1 px-3 rounded hover:bg-green-600"
                >
                  Add Shipment
                </button>
              </fieldset>

              <div className="flex justify-end space-x-4 pt-4 border-t mt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-gray-300 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700"
                >
                  Save All Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// Helper CSS for consistent input styling
const _ = (
  <style>{`.input-style { padding: 8px 12px; border: 1px solid #d1d5db; border-radius: 6px; width: 100%; } .input-style:focus { border-color: #4f46e5; outline: none; box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.3); }`}</style>
);
