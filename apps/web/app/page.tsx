"use client";

import { useAuth } from "@clerk/nextjs";
import { useState } from "react";

export default function Home() {
  const { isSignedIn, getToken } = useAuth();
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);

  const refreshToken = async () => {
    try {
      setLoading(true);

      const t = await getToken({ template: "template-1"});
      setToken(t ?? "");
    } catch (err) {
      console.error("Failed to get token:", err);
      setToken("");
    } finally {
      setLoading(false);
    }
  };

  if (!isSignedIn) {
    return <a href="/log">Login</a>;
  }

  return (
    <div className="p-8">
      <h1 className="text-xl font-bold">Logged In</h1>

      <button
        onClick={refreshToken}
        className="border px-4 py-2 mt-4"
        disabled={loading}
      >
        {loading ? "Refreshing..." : "Refresh Token"}
      </button>

      <textarea
        value={token}
        readOnly
        className="w-full h-64 border p-2 mt-4"
        placeholder="Click refresh to load token"
      />

      <button
        onClick={() => navigator.clipboard.writeText(token)}
        className="border px-4 py-2 mt-4"
        disabled={!token}
      >
        Copy Token
      </button>
    </div>
  );
}