import React, { useState } from "react";
import { Dialog } from "@headlessui/react";
import ModalWrapper from "../ModalWrapper";
import Button from "../Button";
import { toast } from 'sonner';

const AcceptTaskModal = ({ open, setOpen, taskData, onDecision }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleDecision = async (decision) => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const response = await fetch(`http://localhost:5000/tasks/${taskData._id}/${decision}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' }
      });

      if (!response.ok) throw new Error(`Failed to ${decision} task`);
      toast.success(`Task ${decision === 'accept' ? 'accepted' : 'rejected'} successfully!`);
      onDecision(decision, taskData._id); // notify parent
      setOpen(false);
    } catch (err) {
      toast.error(`Error: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ModalWrapper open={open} setOpen={setOpen}>
      <Dialog.Title as='h2' className='text-base font-bold leading-6 text-gray-900 mb-4'>
        Accept or Reject Task
      </Dialog.Title>
      <div className='mt-2 space-y-3'>
        <p className='text-sm text-gray-700'>
          <strong>Title:</strong> {taskData.title}
        </p>
        <p className='text-sm text-gray-700'>
          <strong>Description:</strong> {taskData.description}
        </p>
        <p className='text-sm text-gray-700'>
          <strong>Deadline:</strong> {taskData.deadline}
        </p>
      </div>
      <div className='py-4 mt-4 sm:flex sm:flex-row-reverse gap-3'>
        <Button
          type='button'
          className='bg-green-600 px-6 text-sm font-semibold text-white hover:bg-green-700 sm:w-auto'
          label={isSubmitting ? "Submitting..." : "Accept"}
          onClick={() => handleDecision('accept')}
          disabled={isSubmitting}
        />
        <Button
          type='button'
          className='bg-red-600 px-6 text-sm font-semibold text-white hover:bg-red-700 sm:w-auto'
          label='Reject'
          onClick={() => handleDecision('reject')}
          disabled={isSubmitting}
        />
        <Button
          type='button'
          className='bg-white px-5 text-sm font-semibold text-gray-900 sm:w-auto'
          label='Cancel'
          onClick={() => setOpen(false)}
        />
      </div>
    </ModalWrapper>
  );
};

export default AcceptTaskModal;
