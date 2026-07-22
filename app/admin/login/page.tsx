"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function AdminLogin() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);
    setError("");

    const { data, error } = await supabase
      .from("admins")
      .select("*")
      .eq("email", email.trim())
      .eq("password", password)
      .single();

    setLoading(false);

    if (error || !data) {
      setError("بيانات الدخول غير صحيحة");
      return;
    }

    localStorage.setItem("admin_logged_in", "true");
    localStorage.setItem("admin_email", data.email);

    router.push("/admin");
  }

  return (
    <main className="min-h-screen bg-black flex items-center justify-center p-6">

      <div className="w-full max-w-md bg-zinc-900 rounded-2xl border border-purple-700 p-8">

        <h1 className="text-3xl font-bold text-center text-purple-500 mb-2">
          Hydra Live
        </h1>

        <p className="text-center text-gray-400 mb-8">
          Admin Login
        </p>

        <form onSubmit={handleLogin} className="space-y-5">

          <div>
            <label className="block mb-2 text-white">
              Email
            </label>

            <input
              type="text"
              value={email}
              onChange={(e)=>setEmail(e.target.value)}
              className="w-full rounded-lg bg-black border border-gray-700 p-3 text-white outline-none focus:border-purple-500"
              placeholder="admin"
            />
          </div>

          <div>
            <label className="block mb-2 text-white">
              Password
            </label>

            <input
              type="password"
              value={password}
              onChange={(e)=>setPassword(e.target.value)}
              className="w-full rounded-lg bg-black border border-gray-700 p-3 text-white outline-none focus:border-purple-500"
              placeholder="********"
            />
          </div>

          {error && (
            <div className="bg-red-600/20 border border-red-600 rounded-lg p-3 text-red-400">
              {error}
            </div>
          )}

          <button
            disabled={loading}
            className="w-full bg-purple-600 hover:bg-purple-700 transition rounded-lg py-3 font-bold"
          >
            {loading ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
          </button>

        </form>

      </div>

    </main>
  );
}