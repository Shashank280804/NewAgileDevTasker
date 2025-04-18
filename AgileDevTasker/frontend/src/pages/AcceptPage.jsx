import React, { useState } from "react";
import { Check, X, MoreVertical } from "lucide-react";
import { toast } from "sonner";

const initialTasks = [
  { id: 1, title: "Prepare report summary", priority: "NORMAL", date: "29-Jan-2025" },
  { id: 2, title: "Client call with team", priority: "HIGH", date: "30-Jan-2025" },
  { id: 3, title: "Design landing page", priority: "MEDIUM", date: "01-Feb-2025" },
  { id: 4, title: "Update pricing sheet", priority: "NORMAL", date: "03-Feb-2025" },
  { id: 5, title: "Research competitors", priority: "MEDIUM", date: "04-Feb-2025" },
  { id: 6, title: "Write blog draft", priority: "HIGH", date: "05-Feb-2025" },
  { id: 7, title: "Internal sync meeting", priority: "NORMAL", date: "06-Feb-2025" },
  { id: 8, title: "Revise onboarding flow", priority: "HIGH", date: "07-Feb-2025" },
];

const AssignedTasksDummy = () => {
  const [tasks, setTasks] = useState(initialTasks);

  const handleDecision = (taskId, decision) => {
    if (decision === "accept") {
      toast.success("Task accepted!");
    } else {
      toast.error("Task rejected.");
    }

    setTasks((prev) => prev.filter((task) => task.id !== taskId));
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-semibold mb-6 text-center text-gray-800">Assigned Tasks</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {tasks.length === 0 ? (
          <p className="text-center text-gray-500 col-span-full">No tasks assigned to you.</p>
        ) : (
          tasks.map((task) => (
            <div key={task.id} className="bg-white rounded-lg shadow p-4 relative">
              <div className="flex justify-between items-start mb-2">
                <span className="text-sm font-semibold text-gray-700">{task.priority} PRIORITY</span>
                <MoreVertical className="w-4 h-4 text-gray-400" />
              </div>
              <div className="flex items-center space-x-2 mb-1">
                <div className="w-3 h-3 bg-blue-600 rounded-full" />
                <p className="text-base font-medium text-gray-800">{task.title}</p>
              </div>
              <p className="text-sm text-gray-500 mb-3">{task.date}</p>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => handleDecision(task.id, "accept")}
                  className="flex items-center px-3 py-1 text-sm text-white bg-green-600 hover:bg-green-700 rounded"
                >
                  <Check className="w-4 h-4 mr-1" /> Accept
                </button>
                <button
                  onClick={() => handleDecision(task.id, "reject")}
                  className="flex items-center px-3 py-1 text-sm text-white bg-red-600 hover:bg-red-700 rounded"
                >
                  <X className="w-4 h-4 mr-1" /> Reject
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AssignedTasksDummy;
