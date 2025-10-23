"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { trpc } from "../_trpc/client";

const Login = () => {
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const mutation = trpc.login.useMutation({
    onSuccess() {
      router.push("/");
    },
    onError(err: any) {
      setError(err?.message ?? "Login failed");
    },
  });

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError(null);
    mutation.mutate({ email, password });
    console.log("Login attempted with:", { email, password });
  };

  return (
    <div className="rounded-lg bg-white shadow-sm p-6 space-y-4 text-black">
      <h2 className=" text-xl text-gray-400">Login</h2>
      <form className="grid gap-3" onSubmit={handleSubmit}>
        <label className="grid gap-1">
          <span className="text-sm text-gray-700">Email</span>
          <input
            className="border rounded px-3 py-2 outline-none focus:ring-2 focus:ring-blue-300"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email"
            required
          />
        </label>

        <label className="grid gap-1">
          <span className="text-sm text-gray-700">Password</span>
          <input
            className="border rounded px-3 py-2 outline-none focus:ring-2 focus:ring-blue-300"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            required
            minLength={6}
          />
        </label>

        <button
          type="submit"
          disabled={mutation.isPending}
          className="p-4 py-2 rounded text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-60"
        >
          {mutation.isSuccess ? "Logging in..." : "Login"}
        </button>
        {error && <div className="text-sm text-red-600">Error: {error}</div>}
      </form>
    </div>
  );
};

export default Login;