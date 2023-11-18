"use client";

import { Crisp } from "crisp-sdk-web";
import { useEffect } from "react";

export const CrispChat = () => {
  useEffect(() => {
    Crisp.configure("c48d9ec5-8276-4d5a-8141-a4d1ef632556");
  }, []);

  return null;
};
