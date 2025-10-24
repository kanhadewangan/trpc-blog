"use client";
import axios from "axios";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { trpc } from "../app/_trpc/client";

export default function List() {
  const [name, setName] = useState<string>("");
  const [age, setAge] = useState<number | "">("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successId, setSuccessId] = useState<number | null>(null);
  const router = useRouter();


  const mutation = trpc.signup.useMutation({
    onSuccess(data) {
      setError(null);
      setLoading(false);
      const userId = data
      console.log("User created with ID:", userId);
      localStorage.setItem("userId", String(userId));

    },
    onError(err) {
      setError(err.message);
      setSuccessId(null);
      setLoading(false);
    },
  });
  const canSubmit = name.trim().length > 0 && age !== "" && Number(age) > 0;
const hanleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!canSubmit) return;
    setLoading(true);
    setError(null);
    setSuccessId(null);

    mutation.mutate({
      name: name.trim(),
      email: `${name.trim().toLowerCase().replace(/\s+/g, ".")}@example.com`,
      password: "password123",
    });
  }

  return (
    <section className="rounded-lg bg-white shadow-sm p-6 space-y-4">
      <h2 className="text-lg font-medium">Sign In / Create User</h2>

      <form  onSubmit={hanleSubmit} className="grid gap-3">
        <label className="grid gap-1">
          <span className="text-sm text-gray-700">Name</span>
          <input
            className="border rounded px-3 py-2 outline-none focus:ring-2 focus:ring-blue-300"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter name"
            aria-label="name"
            required
          />
        </label>

        <label className="grid gap-1">
          <span className="text-sm text-gray-700">Age</span>
          <input
            className="border rounded px-3 py-2 outline-none focus:ring-2 focus:ring-blue-300"
            type="number"
            value={age}
            onChange={(e) => setAge(e.target.value === "" ? "" : Number(e.target.value))}
            placeholder="Enter age"
            aria-label="age"
            required
            min={1}
          />
        </label>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={!canSubmit || loading}
            className={`px-4 py-2 rounded text-white ${
              loading || !canSubmit ? "bg-gray-300" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Submitting..." : "Sign In"}
          </button>

          <button
            type="button"
            className="px-3 py-2 rounded border text-sm"
            onClick={() => {
              setName("Kanha Dewangan");
              setAge(25);
            }}
          >
            Fill Demo
          </button>
        </div>
      </form>
      {error && <div className="text-sm text-red-600">Error: {error}</div>}
      {successId && (
        <div className="text-sm text-green-700">Success — New User ID: {successId}</div>
      )}
      <button className="px-3 py-2 rounded border text-sm" onClick={() => router.push("/login")}>
        Reset
      </button>
    </section>
  );
}