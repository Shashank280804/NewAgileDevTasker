import React, { useState, useEffect } from "react";
import ModalWrapper from "../ModalWrapper";
import { Dialog } from "@headlessui/react";
import Textbox from "../Textbox";
import { useForm } from "react-hook-form";
import SelectList from "../SelectList";
import { BiImages } from "react-icons/bi";
import Button from "../Button";
import axios from "axios";
import { toast } from "sonner";



const LISTS = ["todo", "in progress", "completed"]; // Changed to lowercase
const PRIORIRY = ["high", "medium", "normal"]; // Changed to lowercase

const AddTask = ({ open, setOpen, refreshTasks }) => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();
  const [stage, setStage] = useState(LISTS[0]);
  const [priority, setPriority] = useState(PRIORIRY[2]);
  const [teamMembers, setTeamMembers] = useState([]); // State to hold team members
  const [assignedMember, setAssignedMember] = useState(""); // State to hold the selected team member

  useEffect(() => {
    // Fetch team members from the backend when the component mounts
    const fetchTeamMembers = async () => {
      try {
        const response = await axios.get("http://localhost:5000/team-members"); // Adjust this URL as needed

        setTeamMembers(response.data); // Assuming the API returns an array of team members
      } catch (error) {
        console.error("Error fetching team members:", error);
      }
    };

    fetchTeamMembers();
  }, []);

  useEffect(() => {
    setValue("stage", stage); // Sync stage with react-hook-form
  }, [stage, setValue]);

  useEffect(() => {
    setValue("priority", priority); // Sync priority with react-hook-form
  }, [priority, setValue]);

  useEffect(() => {
    setValue("assignedTo", assignedMember); // Sync assignedMember with react-hook-form
  }, [assignedMember, setValue]);


  const submitHandler = async (data) => {


    try {

      if (!data.title || !data.date || !data.assignedTo?._id) { // Ensure _id exists
        console.error("Missing required fields:", data);
        return;
      }
      const formData = {
        title: data.title,
        stage: data.stage?.toLowerCase() || "todo", // Default to 'todo' if not provided
        date: data.date,
        priority: data.priority?.toLowerCase() || "normal", // Default to 'normal' if not provided
        assignedTo: data.assignedTo?._id, // Extract _id from assignedTo object
      };

      // Make a POST request to the backend
      const response = await axios.post("http://localhost:5000/tasks", formData);
      toast.success("Task created successfully!"); 

      setOpen(false);

      if (typeof refreshTasks === "function") {  // Ensure it's a function before calling
        refreshTasks();
      } else {
        console.error("refreshTasks is not a function", refreshTasks);
      }
    } catch (error) {
      console.error("Error creating task:", error);
      // Handle error if submission fails
    }
  };

  const handleSelect = (e) => {
    // handle file select
  };

  return (
    <ModalWrapper open={open} setOpen={setOpen}>
      <form onSubmit={handleSubmit(submitHandler)}>
        <Dialog.Title
          as="h2"
          className="text-base font-bold leading-6 text-gray-900 mb-4"
        >
          Add Task
        </Dialog.Title>

        <div className="mt-2 flex flex-col gap-6">
          {/* Task Title */}
          <Textbox
            placeholder="Task Title"
            type="text"
            name="title"
            label="Task Title"
            className="w-full rounded"
            register={register("title", { required: "Title is required" })}
            error={errors.title ? errors.title.message : ""}
          />

          {/* Task Stage and Task Date */}
          <div className="flex gap-4">
            <SelectList
              label="Task Stage"
              lists={LISTS}
              selected={stage}
              setSelected={(value) => {
                setStage(value);
                setValue("stage", value); // Ensure form state updates
              }}
              className="w-full"
            />
            <div className="w-full">
              <Textbox
                placeholder="Date"
                type="date"
                name="date"
                label="Task Date"
                className="w-full rounded"
                register={register("date", {
                  required: "Date is required!",
                })}
                error={errors.date ? errors.date.message : ""}
              />
            </div>
          </div>

          {/* Priority Level and Assign Task */}
          <div className="flex gap-4">
            <SelectList
              label="Priority Level"
              lists={PRIORIRY}
              selected={priority}
              setSelected={(value) => {
                setPriority(value);
                setValue("priority", value); // Ensure form state updates
              }}
              className="w-full"
            />
            <div className="w-full">
              <SelectList
                label="Assign Task"
                lists={teamMembers}
                selected={assignedMember}
                setSelected={(value) => {
                  setAssignedMember(value);
                  setValue("assignedTo", value); // Ensure form state updates
                }} // Pass setValue from react-hook-form
                className="w-full"
              />

            </div>

          </div>

          {/* Add Assets Section */}
          <div className="w-full flex items-center justify-center mt-4">
            <label
              className="flex items-center gap-1 text-base text-ascent-2 hover:text-ascent-1 cursor-pointer my-4"
              htmlFor="imgUpload"
            >
              <input
                type="file"
                className="hidden"
                id="imgUpload"
                onChange={(e) => handleSelect(e)}
                accept=".jpg, .png, .jpeg"
                multiple={true}
              />
              <BiImages />
              <span>Add Assets</span>
            </label>
          </div>
        </div>

        <div className="bg-gray-50 py-6 sm:flex sm:flex-row-reverse gap-4">
          <Button
            type="submit"
            label="Submit"
            className="bg-blue-600 px-8 text-sm font-semibold text-white hover:bg-blue-700 sm:w-auto"
          />
          <Button
            type="button"
            onClick={() => setOpen(false)}
            label="Cancel"
            className="bg-white px-5 text-sm font-semibold text-gray-900 sm:w-auto"
          />
        </div>
      </form>
    </ModalWrapper>
  );
};

export default AddTask;
