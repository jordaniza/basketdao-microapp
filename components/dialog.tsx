import { Dialog, Transition } from "@headlessui/react";
import { ModalTools } from "hooks/useModalTools";
import React, { Fragment } from "react";

export const TransitionDialog = (props: {
  children: React.ReactNode;
  modalTools: ModalTools;
  title: string;
}) => {
  return (
    <Transition appear show={props.modalTools.isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        onClose={props.modalTools.closeModal}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-2xl font-bold text-center text-gray-600 my-5"
                >
                  {props.title}
                </Dialog.Title>
                {props.children}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};
