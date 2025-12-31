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

export default function RemoveEmployeePage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState<number | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const router = useRouter();

  useEffect(() => {
    fetchEmployees();
  }, []);

  async function fetchEmployees() {
    try {
      setLoading(true);
      const data = await apiFetch<{
        message: string;
        count: number;
        employees: Employee[];
      }>("get/employees", { method: "GET" });

      setEmployees(data.employees);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (selectedEmployee === null) return;

    try {
      setError("");
      setSuccess("");

      await apiFetch(`employees/${selectedEmployee}`, {
        method: "DELETE"
      });

      setSuccess("İşçi başarıyla silindi!");
      setShowConfirmModal(false);
      setSelectedEmployee(null);

      await fetchEmployees();

      setTimeout(() => {
        setSuccess("");
      }, 3000);
    } catch (err: any) {
      setError(err.message);
      setShowConfirmModal(false);
    }
  }

  function openConfirmModal(employeeId: number) {
    setSelectedEmployee(employeeId);
    setShowConfirmModal(true);
  }

  function closeConfirmModal() {
    setShowConfirmModal(false);
    setSelectedEmployee(null);
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
            İşçi Sil
          </h1>
          <p className="text-zinc-400 text-center mb-8">
            Silmek istediğiniz işçiyi seçin
          </p>

          {error && (
            <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3 mb-6">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {success && (
            <div className="bg-green-500/10 border border-green-500/50 rounded-lg p-3 mb-6">
              <p className="text-green-400 text-sm">{success}</p>
            </div>
          )}

          {employees.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-zinc-400 text-lg mb-6">Henüz işçi eklenmemiş</p>
              <button
                onClick={() => router.push("/employee/add")}
                className="bg-zinc-700 hover:bg-zinc-600 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200"
              >
                İşçi Ekle
              </button>
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
                    <th className="text-center py-4 px-4 text-zinc-300 font-medium">İşlem</th>
                  </tr>
                </thead>
                <tbody>
                  {employees.map((employee) => (
                    <tr
                      key={employee.id}
                      className="border-b border-zinc-700/50 hover:bg-zinc-700/30 transition-colors"
                    >
                      <td className="py-4 px-4 text-white">{employee.fullName}</td>
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
                      <td className="py-4 px-4 text-center">
                        <button
                          onClick={() => openConfirmModal(employee.id)}
                          className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500"
                        >
                          Sil
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="mt-8 text-center">
            <button
              onClick={() => router.push("/homepage")}
              className="bg-zinc-700 hover:bg-zinc-600 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-zinc-500"
            >
              Ana Sayfaya Dön
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-zinc-800 border border-zinc-700 rounded-2xl shadow-2xl p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold text-white mb-4">
              Silme Onayı
            </h2>
            <p className="text-zinc-300 mb-6">
              Bu işçiyi silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
            </p>
            <div className="flex gap-4">
              <button
                onClick={closeConfirmModal}
                className="flex-1 bg-zinc-700 hover:bg-zinc-600 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-zinc-500"
              >
                İptal
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                Evet, Sil
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
