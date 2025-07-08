import React from "react";

interface ConfirmModalProps {
  children?: React.ReactNode;
  onConfirm?: () => void;
}

const ConfirmModal = ({}: ConfirmModalProps) => {
  return <div>ConfirmModal</div>;
};

export default ConfirmModal;
