"use client";

import { useClerk } from "@clerk/nextjs";

export default function LoginPage() {
  const clerk = useClerk();

  return (
    <div>
      <button
        onClick={() => clerk.redirectToSignIn()}
      >
        Continue with Google
      </button>
    </div>
  );
}