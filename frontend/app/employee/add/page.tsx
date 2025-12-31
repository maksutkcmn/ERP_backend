"use client";

import { useState } from "react";
import { Input } from "../../../src/components/Input";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/src/lib/api";

export default function AddEmployeePage() {
  const [fullName, setFullName] = useState("");
  const [department, setDepartment] = useState("");
  const [position, setPosition] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [salary, setSalary] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validation
    if (!fullName || !department || !position || !email || !phone || !salary) {
      setError("Lütfen tüm alanları doldurun");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Geçerli bir email adresi girin");
      return;
    }

    // Salary validation
    const salaryNum = parseFloat(salary);
    if (isNaN(salaryNum) || salaryNum <= 0) {
      setError("Maaş pozitif bir sayı olmalıdır");
      return;
    }

    try {
      await apiFetch("addemployee", {
        method: "POST",
        body: JSON.stringify({
          fullName,
          department,
          position,
          email,
          phone,
          salary: salaryNum
        })
      });

      setSuccess("İşçi başarıyla eklendi!");

      // Clear form
      setFullName("");
      setDepartment("");
      setPosition("");
      setEmail("");
      setPhone("");
      setSalary("");

      // Redirect after 2 seconds
      setTimeout(() => {
        router.push("/homepage");
      }, 2000);
    } catch (err: any) {
      setError(err.message);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 px-4 py-8">
      <div className="w-full max-w-2xl">
        <div className="bg-zinc-800/50 backdrop-blur-sm border border-zinc-700/50 rounded-2xl shadow-2xl p-8">
          <h1 className="text-3xl font-bold text-white text-center mb-2">
            İşçi Ekle
          </h1>
          <p className="text-zinc-400 text-center mb-8">
            Yeni bir işçi eklemek için bilgileri girin
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Input
                label="Tam İsim"
                value={fullName}
                onChange={setFullName}
                name="fullName"
                autoComplete="name"
              />
              <Input
                label="Email"
                type="email"
                value={email}
                onChange={setEmail}
                name="email"
                autoComplete="email"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Input
                label="Departman"
                value={department}
                onChange={setDepartment}
                name="department"
                autoComplete="organization"
              />
              <Input
                label="Pozisyon"
                value={position}
                onChange={setPosition}
                name="position"
                autoComplete="organization-title"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Input
                label="Telefon"
                type="tel"
                value={phone}
                onChange={setPhone}
                name="phone"
                autoComplete="tel"
              />
              <Input
                label="Maaş"
                type="number"
                value={salary}
                onChange={setSalary}
                name="salary"
              />
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            {success && (
              <div className="bg-green-500/10 border border-green-500/50 rounded-lg p-3">
                <p className="text-green-400 text-sm">{success}</p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <button
                type="button"
                onClick={() => router.push("/homepage")}
                className="w-full bg-zinc-700/50 hover:bg-zinc-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 focus:ring-offset-zinc-800"
              >
                İptal
              </button>
              <button
                type="submit"
                className="w-full bg-zinc-700 hover:bg-zinc-600 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 focus:ring-offset-zinc-800"
              >
                İşçi Ekle
              </button>
            </div>
          </form>

          <p className="text-zinc-400 text-center mt-6 text-sm">
            <a href="/homepage" className="text-white hover:text-zinc-300 font-medium transition-colors">
              ← Ana Sayfaya Dön
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
