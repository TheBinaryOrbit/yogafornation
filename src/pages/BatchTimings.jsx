import React, { useState, useEffect } from "react";

const BatchTiming = () => {
  const [instructions, setInstructions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingDay, setEditingDay] = useState(null);
  const [editInstruction, setEditInstruction] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Fetch instructions
  const fetchInstructions = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        "http://localhost/yogabackend/api/instructions"
      );
      const data = await response.json();

      if (data.success) {
        setInstructions(data.instructions);
      } else {
        setError("Failed to fetch instructions");
      }
    } catch (err) {
      setError("Error connecting to the server. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Update instruction
  const updateInstruction = async (dayName, instruction) => {
    try {
      const response = await fetch(
        "http://localhost/yogabackend/api/admin/instructions/day",
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ day_name: dayName, instruction }),
        }
      );

      const data = await response.json();

      if (data.success) {
        setSuccessMessage(`${dayName} instruction updated successfully!`);
        setTimeout(() => setSuccessMessage(""), 3000);
        fetchInstructions();
        setEditingDay(null);
        setEditInstruction("");
      } else {
        setError("Failed to update instruction");
      }
    } catch (err) {
      setError("Error updating instruction. Please try again.");
    }
  };

  // Edit flow
  const startEdit = (day) => {
    setEditingDay(day.day_name);
    setEditInstruction(day.instruction);
    setError("");
  };

  const cancelEdit = () => {
    setEditingDay(null);
    setEditInstruction("");
    setError("");
  };

  const saveEdit = (dayName) => {
    if (editInstruction.trim()) {
      updateInstruction(dayName, editInstruction);
    } else {
      setError("Instruction cannot be empty");
    }
  };

  useEffect(() => {
    fetchInstructions();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="bg-white shadow-md rounded-lg p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading instructions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen  p-6 ">
      {/* Page Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-800">
          Weekly Yoga Instructions
        </h1>
        <p className="text-sm text-gray-500">
          Admin &gt; Yoga Management &gt; Instructions
        </p>
      </div>

      {/* Alerts */}
      {error && (
        <div className="mb-6 p-4 rounded-md bg-red-50 border border-red-200 text-red-700">
          {error}
        </div>
      )}
      {successMessage && (
        <div className="mb-6 p-4 rounded-md bg-green-50 border border-green-200 text-green-700">
          {successMessage}
        </div>
      )}

      {/* Data Table */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="w-full text-sm text-left border-collapse">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-6 py-3 border-b">Day</th>
              <th className="px-6 py-3 border-b">Instruction</th>
              <th className="px-6 py-3 border-b">Last Updated</th>
              <th className="px-6 py-3 border-b text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {instructions.map((day) => (
              <tr
                key={day.id}
                className="hover:bg-gray-50 transition duration-150"
              >
                <td className="px-6 py-4 border-b font-medium text-gray-800">
                  {day.day_name}
                </td>

                <td className="px-6 py-4 border-b">
                  {editingDay === day.day_name ? (
                    <textarea
                      value={editInstruction}
                      onChange={(e) => setEditInstruction(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 text-sm"
                      rows="3"
                    />
                  ) : (
                    <p className="text-gray-700">{day.instruction}</p>
                  )}
                </td>

                <td className="px-6 py-4 border-b text-gray-500 text-sm">
                  {new Date(day.updated_at).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </td>

                <td className="px-6 py-4 border-b text-center">
                  {editingDay === day.day_name ? (
                    <div className="flex justify-center space-x-2">
                      <button
                        onClick={cancelEdit}
                        className="px-3 py-1 text-xs font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-md"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => saveEdit(day.day_name)}
                        className="px-3 py-1 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md"
                      >
                        Save
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => startEdit(day)}
                      className="px-3 py-1 text-xs font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-md"
                    >
                      Edit
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer Note */}
      <p className="mt-6 text-xs text-gray-500 text-center">
        Use the edit option to update daily yoga instructions.
      </p>
    </div>
  );
};

export default BatchTiming;
