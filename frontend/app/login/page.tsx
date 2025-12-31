"use client";

import { useState } from "react";
import { Input } from "../../src/components/Input";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/src/lib/api";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    try {
      await apiFetch("login", {
        method: "POST",
        body: JSON.stringify({email, password})
      }
      );
      router.push("/homepage");
    }
    catch (err: any) {
      setError(err.message);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 px-4">
      <div className="w-full max-w-md">
        <div className="bg-zinc-800/50 backdrop-blur-sm border border-zinc-700/50 rounded-2xl shadow-2xl p-8">
          <h1 className="text-3xl font-bold text-white text-center mb-2">
            Giriş Yap
          </h1>
          <p className="text-zinc-400 text-center mb-8">
            Hesabınıza erişmek için bilgilerinizi girin
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Email"
              value={email}
              onChange={setEmail}
              name="email"
              autoComplete="email"
            />
            <Input
              label="Şifre"
              type="password"
              value={password}
              onChange={setPassword}
              name="password"
              autoComplete="current-password"
            />

            {error && (
              <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-zinc-700 hover:bg-zinc-600 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 focus:ring-offset-zinc-800"
            >
              Giriş Yap
            </button>
          </form>

          <p className="text-zinc-400 text-center mt-6 text-sm">
            Hesabınız yok mu?{" "}
            <a href="/register" className="text-white hover:text-zinc-300 font-medium transition-colors">
              Kayıt Ol
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}