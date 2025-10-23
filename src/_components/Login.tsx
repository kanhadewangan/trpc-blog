import { useState } from "react";
export const Login = () => {
     
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");

  return <div className="rounded-lg bg-white shadow-sm p-6 space-y-4">
    <h2 className=" text-xl text-gray-400">Login</h2>
    <form className="grid gap-3">
        <label className="grid gap-1">
          <span className="text-sm text-gray-700">Email</span>
          <input
            className="border rounded px-3 py-2 outline-none focus:ring-2 focus:ring-blue-300"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email"
            aria-label="email"
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
            aria-label="password"
            required
            min={6}
          />
        </label>
      </form>
  </div>;
}