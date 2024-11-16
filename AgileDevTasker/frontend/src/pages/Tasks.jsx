import React, { useState, useEffect } from "react";
import { FaList } from "react-icons/fa";
import { MdGridView } from "react-icons/md";
import { useParams } from "react-router-dom";
import Loading from "../components/Loader";
import Title from "../components/Title";
import Button from "../components/Button";
import { IoMdAdd } from "react-icons/io";
import Tabs from "../components/Tabs";
import TaskTitle from "../components/TaskTitle";
import BoardView from "../components/BoardView";
import Table from "../components/task/Table";
import AddTask from "../components/task/AddTask";

const TABS = [
  { title: "Board View", icon: <MdGridView /> },
  { title: "List View", icon: <FaList /> },
];

const TASK_TYPE = {
  todo: "bg-blue-600",
  "in progress": "bg-yellow-600",
  completed: "bg-green-600",
};

const Tasks = () => {
  const { status = "" } = useParams();
  const [selectedTab, setSelectedTab] = useState(0);
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState([]);

  // Fetch tasks when the component mounts and when tasks change
  const fetchTasks = async () => {
    try {
      const response = await fetch("http://localhost:5000/tasks");
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []); // Initial fetch on mount



  // Filter tasks based on their stage
  const filteredTasks = status ? tasks.filter(task => task.stage === status) : tasks;

  // Function to create a new task
  const handleAddTask = async (newTask) => {
    try {
      const response = await fetch("http://localhost:5000/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTask),
      });
      const createdTask = await response.json();
      setTasks((prevTasks) => [...prevTasks, createdTask]);
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  // Function to delete a task
  const handleDeleteTask = async (id) => {
    try {
      await fetch(`http://localhost:5000/tasks/${id}`, { method: "DELETE" });
      setTasks((prevTasks) => prevTasks.filter(task => task._id !== id));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  if (loading) {
    return (
      <div className="py-10">
        <Loading />
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <Title title={status ? `${status} Tasks` : "Tasks"} />
        {!status && (
          <Button
            onClick={() => setIsAddTaskOpen(true)}
            label="Create Task"
            icon={<IoMdAdd className="text-lg" />}
            className="flex flex-row-reverse gap-1 items-center bg-blue-600 text-white rounded-md py-2 2xl:py-2.5"
          />
        )}
      </div>

      <Tabs tabs={TABS} setSelected={setSelectedTab}>
        {!status && (
          <div className="w-full flex justify-between gap-4 md:gap-x-12 py-4">
            <TaskTitle label="To Do" className={TASK_TYPE.todo} />
            <TaskTitle label="In Progress" className={TASK_TYPE["in progress"]} />
            <TaskTitle label="Completed" className={TASK_TYPE.completed} />
          </div>
        )}

        {selectedTab !== 1 ? (
          <BoardView tasks={filteredTasks} onDeleteTask={handleDeleteTask} />
        ) : (
          <div className="w-full">
            <Table tasks={filteredTasks} onDeleteTask={handleDeleteTask} />
          </div>
        )}
      </Tabs>

      <AddTask open={isAddTaskOpen} setOpen={setIsAddTaskOpen} onAddTask={handleAddTask} />
    </div>
  );
};

export default Tasks;
