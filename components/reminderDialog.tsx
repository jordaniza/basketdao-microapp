import { TransitionDialog } from "./dialog";
import { useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import React, { Fragment } from "react";


import { useModalTools } from "hooks/useModalTools";
import Image from "next/image";
import Button from "./button";

export const ReminderDialog = () => {
    const modalTools = useModalTools();
    useEffect(() => modalTools.openModal(), []);
    return (
    <Transition appear show={modalTools.isOpen} as={Fragment}>
        <div className="bg-black h-screen w-screen fixed opacity-40" onClick={modalTools.closeModal}>
        <Dialog
        as="div"
        className="relative z-10"
        onClose={modalTools.closeModal}
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
                    <Dialog.Panel className="
                        w-full lg:w-1/2 aspect-[5/3] 
                        transform overflow-hidden rounded-2xl 
                        p-6 align-middle 
                        transition-all
                        "
                    >
                        <Image 
                            src="/bdi-reminder.png"
                            layout="fill"
                            alt="Reminder to deposit BDI tokens for DEFI++"
                        />
                        <Button 
                            onClick={modalTools.closeModal}
                            className="
                                z-20 absolute right-0 top-0 
                                rounded-none rounded-bl-xl
                                bg-pink-500 border-pink-500 
                                hover:bg-pink-200 hover:border-pink-200 hover:text-pink-500
                                ">
                                    &times;
                                </Button>
                    </Dialog.Panel>
                </Transition.Child>
            </div>
        </div>
        </Dialog>
        </div>
    </Transition>        
    );
}

