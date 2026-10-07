"use client";

import { useEffect } from "react";
import { captureAttribution } from "@/lib/attribution";

// Rendered once in the root layout so first touch is recorded on whichever
// page the session starts, before any tracked tap can fire.
export function Attribution() {
  useEffect(() => {
    captureAttribution();
  }, []);
  return null;
}
