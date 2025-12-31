"use client"

import { apiFetch } from "../../src/lib/api";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [userData, setUserData] = useState<{
    message: string;
    user: {
      id: string;
      name: string;
      surname: string;
      email: string;
    }
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const router = useRouter();

  useEffect(() => {
    async function fetchUser() {
      try {
        const data = await apiFetch<{
          message: string;
          user: {
            id: string;
            name: string;
            surname: string;
            email: string;
          }
        }>("auth/me", { method: "GET" });
        setUserData(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, []);

  async function handleLogout() {
    try {
      await apiFetch("logout", { method: "POST" });
      router.push("/login");
    } catch (err: any) {
      // Hata olsa bile login'e yönlendir
      router.push("/login");
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 flex items-center justify-center">
        <div className="text-white text-xl">Yükleniyor...</div>
      </div>
    );
  }

  if (error || !userData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 flex items-center justify-center">
        <div className="text-red-400 text-xl">{error || "Bir hata oluştu"}</div>
      </div>
    );
  }

  const name = userData.user.name.charAt(0).toUpperCase() + userData.user.name.slice(1)
  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-zinc-800/50 backdrop-blur-sm border border-zinc-700/50 rounded-2xl shadow-2xl p-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Hoş Geldiniz Sayın {name}
              </h1>
              <p className="text-zinc-400">
                İşçi yönetim sistemi
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-6 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              Çıkış Yap
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link
              href="/employee/add"
              className="bg-zinc-700 hover:bg-zinc-600 text-white font-medium py-4 px-6 rounded-lg transition-colors duration-200 text-center focus:outline-none focus:ring-2 focus:ring-zinc-500"
            >
              İşçi Ekleme
            </Link>
            <Link
              href="/employee/remove"
              className="bg-zinc-700 hover:bg-zinc-600 text-white font-medium py-4 px-6 rounded-lg transition-colors duration-200 text-center focus:outline-none focus:ring-2 focus:ring-zinc-500"
            >
              İşçi Çıkarma
            </Link>
            <Link
              href="/employee/get"
              className="bg-zinc-700 hover:bg-zinc-600 text-white font-medium py-4 px-6 rounded-lg transition-colors duration-200 text-center focus:outline-none focus:ring-2 focus:ring-zinc-500"
            >
              İşçi Arama / Listeleme
            </Link>
            <Link
              href="/settings"
              className="bg-zinc-700 hover:bg-zinc-600 text-white font-medium py-4 px-6 rounded-lg transition-colors duration-200 text-center focus:outline-none focus:ring-2 focus:ring-zinc-500"
            >
              Hesap Ayarları
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
