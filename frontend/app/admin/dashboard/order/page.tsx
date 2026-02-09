"use client";

import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { getCookie } from "@/lib/client-cookies";
import { BASE_API_URL } from "@/global";


type Transaksi = {
  id?: number;
  id_transaksi?: number;
  ID?: number;
  status?: string;
  created_at?: string;
  tanggal?: string;
  total?: number;
  [key: string]: any;
};


function getId(row: Transaksi) {
  return Number(row.id ?? row.id_transaksi ?? row.ID ?? 0);
}

function getTanggal(row: Transaksi) {
  return row.created_at ?? row.tanggal ?? "-";
}

function statusBadge(status: string) {
  const s = status?.toLowerCase() || "";

  if (s.includes("pending")) return "bg-slate-100 text-slate-700";
  if (s.includes("diproses")) return "bg-amber-100 text-amber-700";
  if (s.includes("selesai")) return "bg-emerald-100 text-emerald-700";
  if (s.includes("batal")) return "bg-red-100 text-red-700";

  return "bg-purple-100 text-purple-700";
}


export default function OrderPage() {
  const token = getCookie("token");

  const [data, setData] = useState<Transaksi[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [status, setStatus] = useState("");

  const [updating, setUpdating] = useState<number | null>(null);

  /* ================= FETCH DATA ================= */
  const loadData = async () => {
    try {
      setLoading(true);

      const res = await axios.get(`${BASE_API_URL}/pemasukan`, {
        params: {
          month,
          year,
          status,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("RESPONSE:", res.data);

      // 🔥 FIX ANTI ERROR FILTER
      const result =
        res.data?.data?.data ??
        res.data?.data ??
        res.data ??
        [];

      setData(Array.isArray(result) ? result : []);
    } catch (err: any) {
      alert(err.response?.data?.message ?? "Gagal mengambil data");
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  /* ================= UPDATE STATUS ================= */
  const updateStatus = async (id: number, newStatus: string) => {
    try {
      setUpdating(id);

      await axios.put(
        `${BASE_API_URL}/transaksi/status/${id}`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      await loadData();
    } catch (err: any) {
      alert(err.response?.data?.message ?? "Gagal update status");
    } finally {
      setUpdating(null);
    }
  };

  /* ================= EFFECT ================= */
  useEffect(() => {
    loadData();
  }, [month, year, status]);

  /* ================= FILTER ================= */
  const filtered = useMemo(() => {
    const q = search.toLowerCase();

    return data.filter(
      (row) =>
        String(getId(row)).includes(q) ||
        String(row.status ?? "").toLowerCase().includes(q)
    );
  }, [data, search]);

  /* ================= UI ================= */
  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="rounded-4xl-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900">
              📦 Data Pemasukan
            </h1>
            <p className="text-sm text-slate-500">
              Kelola & update status transaksi
            </p>
          </div>

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari transaksi..."
            className="rounded-full border border-slate-200 px-4 py-2 text-sm outline-none focus:border-red-400 focus:ring-4 focus:ring-red-100"
          />
        </div>

        {/* FILTER */}
        <div className="mt-5 flex flex-wrap gap-3">
          <input
            type="number"
            placeholder="Month"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
          />
          <input
            type="number"
            placeholder="Year"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
          />
          <input
            type="text"
            placeholder="Status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
          />
        </div>
      </div>

      {/* TABLE */}
      <div className="overflow-hidden rounded-4xl bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-xs font-bold text-slate-600">
            <tr>
              <th className="px-6 py-4">ID</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Tanggal</th>
              <th className="px-6 py-4">Total</th>
              <th className="px-6 py-4 text-right">Aksi</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="px-6 py-6 text-center text-slate-500">
                  Memuat data...
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-6 text-center text-slate-500">
                  Tidak ada data
                </td>
              </tr>
            ) : (
              filtered.map((row) => {
                const id = getId(row);

                return (
                  <tr
                    key={id}
                    className="border-t border-slate-100 hover:bg-slate-50"
                  >
                    <td className="px-6 py-4 font-bold">{id}</td>

                    <td className="px-6 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-bold ${statusBadge(
                          row.status ?? ""
                        )}`}
                      >
                        {row.status}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-slate-600">
                      {getTanggal(row)}
                    </td>

                    <td className="px-6 py-4">
                      Rp {Number(row.total ?? 0).toLocaleString()}
                    </td>

                    <td className="px-6 py-4 text-right space-x-2">
                      {["diproses", "selesai", "batal"].map((s) => (
                        <button
                          key={s}
                          disabled={updating === id}
                          onClick={() => updateStatus(id, s)}
                          className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold hover:bg-slate-100"
                        >
                          {s}
                        </button>
                      ))}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
