"use client";

import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { BASE_API_URL } from "@/global";
import { getCookie } from "@/lib/client-cookies";
import Navbar from "@/components/navbar";

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "Mei", "Jun",
  "Jul", "Agu", "Sep", "Okt", "Nov", "Des",
];

type HistoriItem = {
  id: number;
  tanggal: string;
  status: string;
  total?: number;
  created_at: string;
  updated_at: string;
};

export default function HistoriPage() {
  const token = getCookie("token");

  const now = useMemo(() => new Date(), []);
  const [year, setYear] = useState<number>(now.getFullYear());
  const [month, setMonth] = useState<number>(now.getMonth() + 1);

  const [items, setItems] = useState<HistoriItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const monthTitle = `${MONTHS[month - 1]} ${year}`;

  const fetchHistori = async () => {
    try {
      setLoading(true);

      const res = await axios.get(`${BASE_API_URL}/histori`, {
        params: {
          month: month,
          year: year,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("RESPONSE:", res.data);

      setItems(res.data?.transaksi ?? []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistori();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [month, year]);

  return (
    <div className="space-y-6">

     <Navbar />
      <div className="rounded-3xl border bg-white p-6">
        <div className="flex items-end justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-900">Histori</h1>
            <p className="text-sm text-slate-500">
              Histori transaksi berdasarkan bulan & tahun
            </p>
          </div>

          <button
            onClick={fetchHistori}
            className="rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* FILTER */}
      <div className="rounded-3xl border bg-white p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-bold">Filter</p>
            <p className="text-xs text-slate-500">
              Bulan: <b>{monthTitle}</b>
            </p>
          </div>

          {/* TAHUN */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setYear((y) => y - 1)}
              className="h-9 rounded-xl border px-3 text-sm font-bold"
            >
              −
            </button>

            <div className="h-9 min-w-[90px] grid place-items-center rounded-xl bg-slate-900 text-white text-sm font-bold">
              {year}
            </div>

            <button
              onClick={() => setYear((y) => y + 1)}
              className="h-9 rounded-xl border px-3 text-sm font-bold"
            >
              +
            </button>
          </div>
        </div>

        {/* BULAN */}
        <div className="grid grid-cols-4 gap-2 sm:grid-cols-6 lg:grid-cols-12">
          {MONTHS.map((m, idx) => {
            const active = idx + 1 === month;
            return (
              <button
                key={m}
                onClick={() => setMonth(idx + 1)}
                className={`rounded-xl px-3 py-2 text-xs font-bold transition
                  ${
                    active
                      ? "bg-red-600 text-white"
                      : "border bg-white hover:bg-red-50 hover:text-red-600"
                  }`}
              >
                {m}
              </button>
            );
          })}
        </div>
      </div>

      {/* CONTENT */}
      {loading ? (
        <div className="rounded-3xl border bg-white p-6 text-sm text-slate-500">
          Mengambil histori...
        </div>
      ) : items.length === 0 ? (
        <div className="rounded-3xl border bg-white p-6 text-sm text-slate-500">
          Tidak ada histori di bulan ini.
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {items.map((it) => (
            <div
              key={it.id}
              className="rounded-3xl border bg-white p-5 space-y-3 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold">Order #{it.id}</p>
                  <p className="text-xs text-slate-500">{it.tanggal}</p>
                </div>

                <span className="rounded-full px-3 py-1 text-xs font-bold bg-yellow-100 text-yellow-700">
                  {it.status}
                </span>
              </div>

              {it.total && (
                <div className="rounded-xl bg-red-50 p-3 text-xs">
                  <p className="text-red-400">Total</p>
                  <p className="font-bold text-red-600">
                    Rp {it.total.toLocaleString()}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
