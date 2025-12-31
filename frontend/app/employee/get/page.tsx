"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/src/lib/api";

interface Employee {
  id: number;
  fullName: string;
  department: string;
  position: string;
  email: string;
  phone: string;
  salary: number;
}

export default function GetEmployeePage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const router = useRouter();

  useEffect(() => {
    fetchAllEmployees();
  }, []);

  // Debounce timer
  useEffect(() => {
    if (searchQuery === "") {
      fetchAllEmployees();
      return;
    }

    const timer = setTimeout(() => {
      searchEmployees(searchQuery);
    }, 500); // 500ms debounce

    return () => clearTimeout(timer);
  }, [searchQuery]);

  async function fetchAllEmployees() {
    try {
      setLoading(true);
      setIsSearching(false);
      setError("");

      const data = await apiFetch<{
        message: string;
        count: number;
        employees: Employee[];
      }>("get/employees", { method: "GET" });

      setEmployees(data.employees);
    } catch (err: any) {
      setError(err.message);
      setEmployees([]);
    } finally {
      setLoading(false);
    }
  }

  async function searchEmployees(query: string) {
    try {
      setIsSearching(true);
      setError("");

      const data = await apiFetch<{
        message: string;
        count: number;
        employees: Employee[];
      }>(`get/employees/search?name=${encodeURIComponent(query)}`, {
        method: "GET"
      });

      setEmployees(data.employees);
    } catch (err: any) {
      setError(err.message);
      setEmployees([]);
    } finally {
      setIsSearching(false);
    }
  }

  function handleSearchChange(value: string) {
    setSearchQuery(value);
  }

  function clearSearch() {
    setSearchQuery("");
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900">
        <div className="text-white text-xl">Yükleniyor...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-zinc-800/50 backdrop-blur-sm border border-zinc-700/50 rounded-2xl shadow-2xl p-8">
          <h1 className="text-3xl font-bold text-white text-center mb-2">
            İşçi Listesi
          </h1>
          <p className="text-zinc-400 text-center mb-8">
            Tüm işçileri görüntüleyin veya arama yapın
          </p>

          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder="İşçi adı ile ara..."
                className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-500 focus:ring-2 focus:ring-zinc-600/50 transition-all pr-20"
              />
              {searchQuery && (
                <button
                  onClick={clearSearch}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-zinc-700 hover:bg-zinc-600 text-white px-4 py-1.5 rounded-md text-sm transition-colors"
                >
                  Temizle
                </button>
              )}
            </div>
            {isSearching && (
              <p className="text-zinc-400 text-sm mt-2">Aranıyor...</p>
            )}
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3 mb-6">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {/* Results Count */}
          <div className="mb-4">
            <p className="text-zinc-400 text-sm">
              {searchQuery ? (
                <>
                  <span className="text-white font-medium">{employees.length}</span> arama sonucu bulundu
                  {searchQuery && <span> - "<span className="text-white">{searchQuery}</span>"</span>}
                </>
              ) : (
                <>
                  Toplam <span className="text-white font-medium">{employees.length}</span> işçi
                </>
              )}
            </p>
          </div>

          {employees.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-zinc-400 text-lg mb-6">
                {searchQuery
                  ? `"${searchQuery}" için sonuç bulunamadı`
                  : "Henüz işçi eklenmemiş"
                }
              </p>
              {!searchQuery && (
                <button
                  onClick={() => router.push("/employee/add")}
                  className="bg-zinc-700 hover:bg-zinc-600 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200"
                >
                  İşçi Ekle
                </button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-zinc-700">
                    <th className="text-left py-4 px-4 text-zinc-300 font-medium">Ad Soyad</th>
                    <th className="text-left py-4 px-4 text-zinc-300 font-medium">Departman</th>
                    <th className="text-left py-4 px-4 text-zinc-300 font-medium">Pozisyon</th>
                    <th className="text-left py-4 px-4 text-zinc-300 font-medium">Email</th>
                    <th className="text-left py-4 px-4 text-zinc-300 font-medium">Telefon</th>
                    <th className="text-left py-4 px-4 text-zinc-300 font-medium">Maaş</th>
                  </tr>
                </thead>
                <tbody>
                  {employees.map((employee) => (
                    <tr
                      key={employee.id}
                      className="border-b border-zinc-700/50 hover:bg-zinc-700/30 transition-colors"
                    >
                      <td className="py-4 px-4 text-white font-medium">{employee.fullName}</td>
                      <td className="py-4 px-4 text-zinc-300">{employee.department}</td>
                      <td className="py-4 px-4 text-zinc-300">{employee.position}</td>
                      <td className="py-4 px-4 text-zinc-300">{employee.email}</td>
                      <td className="py-4 px-4 text-zinc-300">{employee.phone}</td>
                      <td className="py-4 px-4 text-zinc-300">
                        {employee.salary.toLocaleString('tr-TR', {
                          style: 'currency',
                          currency: 'TRY'
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="mt-8 flex gap-4 justify-center">
            <button
              onClick={() => router.push("/homepage")}
              className="bg-zinc-700 hover:bg-zinc-600 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-zinc-500"
            >
              Ana Sayfaya Dön
            </button>
            {employees.length > 0 && (
              <button
                onClick={() => router.push("/employee/add")}
                className="bg-zinc-700 hover:bg-zinc-600 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-zinc-500"
              >
                Yeni İşçi Ekle
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
