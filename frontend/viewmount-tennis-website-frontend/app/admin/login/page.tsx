"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async () => {
    setMessage("");

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error){
      setMessage("Invalid Email or Password. Please try again.");
      return;
    }

    setMessage("Login successful!");

    console.log("Login data:", data);
    console.log("Login error:", error);
  };

  const handleLogout = async () => {
    setMessage("");
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      setMessage("Logout error occurred");
      console.error("Logout error:", error);
      return;
    }

    setMessage("Logout successful!");
    console.log("Logged out");
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 p-6">
     <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-md">
      <h1 className="mb-2 text-center text-3xl font-bold text-green-900">
        Admin Login
      </h1>
      <p className="mb-6 text-center text-sm text-gray-500">
        Sign in to manage your Viewmount Tennis website.
      </p>
      

      <input
        type="email"
        placeholder="Email"
        value={email}
        className="mb-4 w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-200"
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        className="mb-4 w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-200"
        onChange={(e) => setPassword(e.target.value)}
      />

      <button 
      className="w-full rounded-lg bg-green-700 px-4 py-3 font-semibold text-white transition hover:bg-green-800"
      onClick={handleLogin}>
        Log In
      </button>
      
      <button 
      className="mt-3 w-full rounded-lg border border-gray-300 px-4 py-3 font-semibold text-gray-700 transition hover:bg-gray-100"
      onClick={handleLogout}>
        Log Out
      </button>

      {message && (
        <p
        role="status"
        aria-live="polite"
        className="mt-4 text-center text-sm font-medium"
        style={{
          color: message === "Login successful!" 
          ||
          message === "Logout successful!" 
          ? "green" 
          : "red",
        }}
        >
          {message}
        </p>
      )}

      </div>
    </main>
  );
}