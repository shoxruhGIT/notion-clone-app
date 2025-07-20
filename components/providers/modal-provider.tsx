"use client";

import React, { useEffect, useState } from "react";
import SettingModal from "../modals/setting-modal";

const ModalProvider = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <>
      <SettingModal />
    </>
  );
};

export default ModalProvider;
