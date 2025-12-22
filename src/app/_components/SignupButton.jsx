"use client";

import { track } from "@vercel/analytics";

export default function SignupButton({ className = "", children = "Sign Up" }) {
  const handleClick = () => {
    // Track custom event with optional properties
    track("Signup Clicked", {
      location: typeof window !== "undefined" ? window.location.pathname : "",
      timestamp: new Date().toISOString(),
    });
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`tst-btn ${className}`}
    >
      {children}
    </button>
  );
}
