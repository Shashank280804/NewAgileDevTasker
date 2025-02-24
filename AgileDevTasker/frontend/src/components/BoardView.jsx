import React from "react";
import TaskCard from "./TaskCard";

const BoardView = ({ tasks, setTasks, onDeleteTask }) => {
  return (
    <div className='w-full py-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 2xl:gap-10'>
      {tasks.map((task, index) => (
        <TaskCard task={task} setTasks={setTasks} onDeleteTask={onDeleteTask}
          key={task._id || index} />
      ))}
    </div>
  );
};

export default BoardView;
