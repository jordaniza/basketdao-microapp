import { useState } from "react";

export type ModalTools = {
  isOpen: boolean;
  closeModal(): void;
  openModal(): void;
};

export const useModalTools = (): ModalTools => {
  const [isOpen, setIsOpen] = useState(false);
  const closeModal = () => setIsOpen(false);
  const openModal = () => setIsOpen(true);
  return {
    isOpen,
    closeModal,
    openModal,
  };
};
