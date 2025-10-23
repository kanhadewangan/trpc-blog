"use client";
import axios from "axios";
import React, { useState } from "react";

export default function List() {
  const [name, setName] = useState<string>("");
  const [age, setAge] = useState<number | "">("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successId, setSuccessId] = useState<number | null>(null);

  const canSubmit = name.trim().length > 0 && age !== "" && Number(age) > 0;

 async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if(name && age){
        const res = await axios.post("/api/trpc/sigIn", {
          name,
          age: Number(age),
        });
        setSuccessId(res.data.id);
        setError(null);
        console.log("User created with ID:", res.data.result.data);
    }
    if(!name || age===""){
        setError("Name and Age are required.");
        setSuccessId(null);
    }
 }

  return (
    <section className="rounded-lg bg-white shadow-sm p-6 space-y-4">
      <h2 className="text-lg font-medium">Sign In / Create User</h2>

      <form onSubmit={handleSubmit} className="grid gap-3">
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
    </section>
  );
}