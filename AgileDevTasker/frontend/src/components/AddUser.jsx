import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import ModalWrapper from "./ModalWrapper";
import { Dialog } from "@headlessui/react";
import Textbox from "./Textbox";
import Loading from "./Loader";
import Button from "./Button";
import { toast } from 'sonner';


const AddUser = ({ open, setOpen, userData, onAddUser }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const defaultValues = typeof userData === 'object' && userData !== null ? userData : {};
  const { user } = useSelector((state) => state.auth);

  const isLoading = false; // Update this based on actual loading state
  const isUpdating = false; // Update this based on actual updating state

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ defaultValues });

  useEffect(() => {
    if (typeof userData === "string") {
      console.error("Invalid userData format:", userData);
    }
  }, [userData]);


  useEffect(() => {
    console.log("userData:", userData, "Type:", typeof userData);
    reset(userData && typeof userData === "object" ? userData : {});
  }, [userData, reset]);


  const handleOnSubmit = async (data) => {
    if (isSubmitting) {
      console.warn("Form is already submitting, preventing duplicate submission");
      return;
    }

    console.log("handleOnSubmit triggered with data:", data);
    setIsSubmitting(true);

    try {
      if (userData && userData._id) {
        console.log("Updating user with ID:", userData._id);


        const requestBody = {
          username: data.username,  // Ensure correct field names
          title: data.title,
          email: data.email,
          role: data.role,
        };

        console.log("Sending PUT request with data:", requestBody);

        const response = await fetch(`http://localhost:5000/team-members/${userData._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestBody),
        });

        if (!response.ok) throw new Error("Failed to update user");
        toast.success("User updated successfully!");
      } else {
        // Add new user
        console.log("Creating new user:", data);

        const response = await fetch("http://localhost:5000/team-members", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });

        const result = await response.json();
        if (!response.ok) {
          console.error("Error creating team member:", result.message);
          toast.error("Error creating user!");
        } else {
          console.log("Team member created successfully:", result.teamMember);

          // Make sure result.teamMember has a unique _id
          if (result.teamMember && result.teamMember._id) {
            onAddUser(result.teamMember); // Add new user to the state
            toast.success("User added successfully!");
          } else {
            console.warn("Received user data is missing _id:", result.teamMember);
          }
        }

      }
      console.log("Closing modal and resetting form");

      reset();
      setOpen(false); // Close modal after submission
    } catch (error) {
      console.error("Error:", error);
      toast.error(`Error: ${error.message}`);
    }
    finally {
      console.log("Re-enabling submit button");

      setIsSubmitting(false); // Re-enable the submit button
    }
  };

  return (
    <ModalWrapper open={open} setOpen={setOpen}>
      <form onSubmit={handleSubmit(handleOnSubmit)}>
        <Dialog.Title as='h2' className='text-base font-bold leading-6 text-gray-900 mb-4'>
          {userData ? "UPDATE PROFILE" : "ADD NEW USER"}
        </Dialog.Title>
        <div className='mt-2 flex flex-col gap-6'>
          <Textbox
            placeholder='Full name'
            type='text'
            name='username'
            label='Full Name'
            className='w-full rounded'
            register={register("username", { required: "Full name is required!" })}
            error={errors.username ? errors.username.message : ""}
          />
          <Textbox
            placeholder='Title'
            type='text'
            name='title'
            label='Title'
            className='w-full rounded'
            register={register("title", { required: "Title is required!" })}
            error={errors.title ? errors.title.message : ""}
          />
          <Textbox
            placeholder='Email Address'
            type='email'
            name='email'
            label='Email Address'
            className='w-full rounded'
            register={register("email", { required: "Email Address is required!" })}
            error={errors.email ? errors.email.message : ""}
          />
          <Textbox
            placeholder='Role'
            type='text'
            name='role'
            label='Role'
            className='w-full rounded'
            register={register("role", { required: "User role is required!" })}
            error={errors.role ? errors.role.message : ""}
          />
        </div>
        {isLoading || isUpdating ? (
          <div className='py-5'>
            <Loading />
          </div>
        ) : (
          <div className='py-3 mt-4 sm:flex sm:flex-row-reverse'>
            <Button
              type='submit'
              className='bg-blue-600 px-8 text-sm font-semibold text-white hover:bg-blue-700 sm:w-auto'
              label={isSubmitting ? "Submitting..." : "Submit"} // Update button label
              disabled={isSubmitting}
            />
            <Button
              type='button'
              className='bg-white px-5 text-sm font-semibold text-gray-900 sm:w-auto'
              label='Cancel'
              onClick={() => setOpen(false)}
            />
          </div>
        )}
      </form>
    </ModalWrapper>
  );
};

export default AddUser;
