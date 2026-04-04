"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    const res = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();

    if (data.success) {
      localStorage.setItem("admin", "true");
      router.push("/dashboard");
    } else {
      alert("❌ Invalid login");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f172a] text-white">

      <div className="bg-[#1e293b] p-6 rounded-xl w-80 space-y-4">

        <h2 className="text-xl font-semibold text-center">Admin Login</h2>

        <input
          placeholder="Username"
          className="w-full p-2 text-black rounded"
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 text-black rounded"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleLogin}
          className="w-full bg-blue-500 py-2 rounded hover:bg-blue-600"
        >
          Login
        </button>

      </div>

    </div>
  );
}