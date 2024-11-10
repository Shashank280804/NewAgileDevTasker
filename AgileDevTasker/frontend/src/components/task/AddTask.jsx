import React, { useState, useEffect } from "react";
import ModalWrapper from "../ModalWrapper";
import { Dialog } from "@headlessui/react";
import Textbox from "../Textbox";
import { useForm } from "react-hook-form";
import SelectList from "../SelectList";
import { BiImages } from "react-icons/bi";
import Button from "../Button";
import axios from "axios";

const LISTS = ["todo", "in progress", "completed"]; // Changed to lowercase
const PRIORIRY = ["high", "medium", "normal"]; // Changed to lowercase

const AddTask = ({ open, setOpen }) => {
  const {
    register,
    handleSubmit,
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

  const submitHandler = async (data) => {
    try {
      const formData = {
        title: data.title,
        stage: stage.toLowerCase(), // Convert to lowercase to match enum values
        date: data.date,
        priority: priority.toLowerCase(), // Convert to lowercase to match enum values
        assignedMember, // Add assigned member to the form data
      };

      // Make a POST request to the backend
      const response = await axios.post("http://localhost:5000/tasks", formData);

      console.log(response.data); // Log the response from the server
      setOpen(false); // Close the modal after successful submission
      // You might want to update the state or refresh tasks after adding a new one
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
              setSelected={setStage}
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
              setSelected={setPriority}
              className="w-full"
            />
            <div className="w-full">
              <SelectList
                label="Assign Task"
                lists={teamMembers.map((member) => member.name)} // Assuming team members have a `name` field
                selected={assignedMember}
                setSelected={setAssignedMember}
                className="w-full" // Ensure the width matches the other fields
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
