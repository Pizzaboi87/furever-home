"use client";

import { Toaster } from "react-hot-toast";

export default function AppToaster() {
  return (
    <Toaster
      position="top-right"
      reverseOrder={false}
      containerStyle={{ pointerEvents: "none" }}
      toastOptions={{
        duration: 4500,
        style: {
          border: "1px solid var(--border)",
          borderRadius: "16px",
          background: "var(--background)",
          color: "var(--foreground)",
          boxShadow: "0 20px 45px rgb(15 23 42 / 0.16)",
          fontSize: "0.875rem",
          fontWeight: 600,
          maxWidth: "26rem",
          padding: "0.85rem 1rem",
        },
        success: {
          iconTheme: {
            primary: "#4f46e5",
            secondary: "#ffffff",
          },
        },
        error: {
          iconTheme: {
            primary: "#dc2626",
            secondary: "#ffffff",
          },
        },
      }}
    />
  );
}
