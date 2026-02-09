"use client";

import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import Image from "next/image";
import { toast } from "sonner";
import { RefreshCcw, Clock3, ReceiptText } from "lucide-react";
import Navbar from "@/components/navbar";
import { BASE_API_URL, BASE_IMAGE_MENU } from "@/global";


// =====================
// TYPES
// =====================
type StatusTransaksi = "belum_dikonfirm" | "dimasak" | "diantar" | "sampai";

type TransaksiRow = {
  id: number;
  tanggal: string;
  id_stan: number;
  id_siswa: number;
  status: StatusTransaksi;
};

type TransaksiListResponse = {
  data?: TransaksiRow[];
  transaksi?: TransaksiRow[];
  msg?: string;
};

type NotaItem = {
  nama: string;
  qty: number;
  harga: number;
  subtotal: number;
};

type NotaResponse = {
  status: boolean;
  msg: string;
  data: {
    id: number;
    tanggal: string;
    siswa: string;
    stan: string;
    status: StatusTransaksi;
    items: NotaItem[];
    total: number;
  };
};

// dari endpoint /menu (untuk ambil foto berdasarkan nama)
type MenuRow = {
  id: number;
  nama_makanan: string;
  foto: string | null;
};

// =====================
// HELPERS
// =====================
const api = axios.create({ baseURL: BASE_API_URL });

function getToken() {
  return Cookies.get("token") || "";
}

function formatRupiah(n: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(n);
}

function formatTanggal(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function statusBadge(status: StatusTransaksi) {
  // supaya mirip screenshot: "Pending" warna kuning/orange, lainnya menyesuaikan
  if (status === "belum_dikonfirm") {
    return { label: "Pending", cls: "bg-amber-100 text-amber-700" };
  }
  if (status === "dimasak") {
    return { label: "Dimasak", cls: "bg-sky-100 text-sky-700" };
  }
  if (status === "diantar") {
    return { label: "Diantar", cls: "bg-violet-100 text-violet-700" };
  }
  return { label: "Sampai", cls: "bg-emerald-100 text-emerald-700" };
}

function buildMenuImage(filename?: string | null) {
  if (!filename) return "";
  return `${BASE_IMAGE_MENU}/${filename}`;
}

type FilterTab = "belum_dikonfirm" | "dimasak" | "diantar" | "sampai";


export default function PesananPage() {
  const [loading, setLoading] = useState(false);

  const [transaksi, setTransaksi] = useState<TransaksiRow[]>([]);
  const [notaMap, setNotaMap] = useState<Record<number, NotaResponse["data"]>>(
    {},
  );
  const [menuFotoMap, setMenuFotoMap] = useState<Record<string, string>>({});

  // UI filter
  const [active, setActive] = useState<FilterTab>("belum_dikonfirm");

  // =====================
  // FETCH /menu -> foto map
  // =====================
  useEffect(() => {
    const fetchMenuForImages = async () => {
      try {
        const res = await api.get<{ data?: MenuRow[]; success?: boolean }>(
          "/menu",
          {
            headers: { "Content-Type": "application/json" },
          },
        );

        const rows = Array.isArray(res.data?.data) ? res.data.data : [];
        const map: Record<string, string> = {};

        for (const r of rows) {
          const nama = String((r as any)?.nama_makanan ?? "")
            .trim()
            .toLowerCase();
          const foto = (r as any)?.foto ? String((r as any).foto) : "";
          if (nama && foto) map[nama] = foto;
        }
        setMenuFotoMap(map);
      } catch {
        setMenuFotoMap({});
      }
    };

    fetchMenuForImages();
  }, []);

  const [pdfOpen, setPdfOpen] = useState(false);
const [pdfUrl, setPdfUrl] = useState<string>("");
const [loadingPdf, setLoadingPdf] = useState(false);

function closePdf() {
  setPdfOpen(false);
  if (pdfUrl) URL.revokeObjectURL(pdfUrl);
  setPdfUrl("");
}


  // =====================
  // FETCH /transaksi + nota ringkas per transaksi
  // =====================
  async function fetchAll() {
    const token = getToken();
    if (!token) {
      toast.error("Token tidak ada. Login siswa dulu.");
      return;
    }

    setLoading(true);
    try {
      const res = await api.get<TransaksiListResponse>("/transaksi", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const list =
        (Array.isArray(res.data?.data) && res.data.data) ||
        (Array.isArray(res.data?.transaksi) && res.data.transaksi) ||
        [];

      const sorted = [...list].sort((a, b) => b.id - a.id);
      setTransaksi(sorted);

      // ambil nota untuk tiap transaksi agar bisa tampil item + total
      const results = await Promise.allSettled(
        sorted.map(async (t) => {
          const notaRes = await api.get<NotaResponse>(`/siswa/nota/${t.id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (!notaRes.data?.status)
            throw new Error(notaRes.data?.msg || "Nota gagal");
          return notaRes.data.data;
        }),
      );

      const map: Record<number, NotaResponse["data"]> = {};
      for (const r of results) {
        if (r.status === "fulfilled") {
          map[r.value.id] = r.value;
        }
      }
      setNotaMap(map);
    } catch (err: any) {
      toast.error(
        err?.response?.data?.msg ||
          err?.response?.data?.error ||
          "Gagal mengambil transaksi",
      );
      setTransaksi([]);
      setNotaMap({});
    } finally {
      setLoading(false);
    }
  }

 async function onCetakNotaPdf(idTransaksi: number) {
  const token = getToken();
  if (!token) {
    toast.error("Token tidak ada. Login siswa dulu.");
    return;
  }

  setLoadingPdf(true);
  try {
    const res = await api.get(`/siswa/nota/${idTransaksi}?pdf=true`, {
      headers: { Authorization: `Bearer ${token}` },
      responseType: "blob",
    });

    const blob = new Blob([res.data], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);

    // kalau sebelumnya ada pdfUrl, bersihkan
    if (pdfUrl) URL.revokeObjectURL(pdfUrl);

    setPdfUrl(url);
    setPdfOpen(true);
  } catch (err: any) {
    toast.error(
      err?.response?.data?.msg ||
        err?.response?.data?.error ||
        "Gagal membuka PDF"
    );
  } finally {
    setLoadingPdf(false);
  }
}




  useEffect(() => {
    fetchAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // =====================
  // FILTERED
  // =====================
  const filteredCards = useMemo(() => {
    return transaksi.filter((t) => t.status === active);
  }, [transaksi, active]);

  // =====================
  // UI small components
  // =====================
  const TabBtn = ({
    active: isActive,
    children,
    onClick,
  }: {
    active: boolean;
    children: React.ReactNode;
    onClick: () => void;
  }) => (
    <button
      type="button"
      onClick={onClick}
      className={[
        "rounded-full px-5 py-2 text-sm font-extrabold transition",
        "ring-1 ring-inset",
        isActive
          ? "bg-red-600 text-white ring-red-600 shadow-sm"
          : "bg-white text-slate-700 ring-slate-200 hover:bg-red-50 hover:ring-red-200",
      ].join(" ")}
    >
      {children}
    </button>
  );

  return (
    <div className="space-y-6">
        <Navbar />
      <div className="relative overflow-hidden rounded-3xl border border-red-100 bg-white shadow-sm">
        {/* dotted background */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,#ef4444_1px,transparent_0)] bg-[length:18px_18px] opacity-[0.06]" />
        <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-red-500/10 blur-2xl" />

        <div className="relative p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <h1 className="mt-3 text-3xl font-extrabold text-slate-900">
                Pesanan Saya
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                Pantau status pesanan kamu secara real-time.
              </p>
            </div>

            <button
              type="button"
              onClick={fetchAll}
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-red-200 bg-white px-5 py-3 text-sm font-extrabold text-red-600 hover:bg-red-50"
            >
              <RefreshCcw className="h-4 w-4" />
              Refresh
            </button>
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            <TabBtn
              active={active === "belum_dikonfirm"}
              onClick={() => setActive("belum_dikonfirm")}
            >
              Belum
            </TabBtn>
            <TabBtn
              active={active === "dimasak"}
              onClick={() => setActive("dimasak")}
            >
              Dimasak
            </TabBtn>
            <TabBtn
              active={active === "diantar"}
              onClick={() => setActive("diantar")}
            >
              Diantar
            </TabBtn>
            <TabBtn
              active={active === "sampai"}
              onClick={() => setActive("sampai")}
            >
              Sampai
            </TabBtn>
          </div>

          <div className="mt-3 text-sm text-slate-500">
            Total:{" "}
            <span className="font-semibold">
              {loading ? "..." : `${filteredCards.length} pesanan`}
            </span>
          </div>
        </div>
      </div>

      {/* GRID CARD (ukuran lebih kecil seperti screenshot) */}
      <div className="grid mx-6 gap-10 sm:grid-cols-4 lg:grid-cols-3">
        {loading ? (
          <div className="rounded-3xl border border-red-100 bg-white p-6 text-sm text-slate-500 sm:col-span-2 lg:col-span-3">
            Memuat pesanan...
          </div>
        ) : filteredCards.length === 0 ? (
          <div className="rounded-3xl border border-red-100 bg-white p-6 text-sm text-slate-500 sm:col-span-2 lg:col-span-3">
            Belum ada pesanan pada status ini.
          </div>
        ) : (
          filteredCards.map((t) => {
            const nota = notaMap[t.id];

            const firstItem = nota?.items?.[0];
            const itemName = firstItem?.nama || "-";
            const qty = firstItem?.qty || 0;
            const harga = firstItem?.harga || 0;

            // foto dari /menu berdasarkan nama item
            const fotoFile = menuFotoMap[itemName.trim().toLowerCase()] || "";
            const img = fotoFile ? buildMenuImage(fotoFile) : "";

            const badge = statusBadge(t.status);

            return (
              <div
                key={t.id}
                className="rounded-3xl border border-red-100 bg-white shadow-sm transition hover:shadow-lg"
              >
                <div className="p-5">
                  {/* TOP */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full bg-slate-100 ring-2 ring-white shadow">
                        {img ? (
                          <Image
                            src={img}
                            alt={itemName}
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        ) : (
                          <div className="grid h-full w-full place-items-center text-xs font-bold text-slate-400">
                            🍲
                          </div>
                        )}
                      </div>

                      <div className="min-w-0">
                        <div className="text-xs font-semibold text-slate-400">
                          Order
                        </div>
                        <div className="text-lg font-extrabold text-slate-900 leading-tight">
                          #{t.id}
                        </div>

                        <div className="mt-1 text-[15px] font-extrabold text-slate-900 line-clamp-1">
                          {itemName}
                        </div>
                        <div className="text-sm text-slate-500 line-clamp-1">
                          m: {nota?.stan ?? "-"}
                        </div>
                      </div>
                    </div>

                    <span
                      className={[
                        "inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-extrabold",
                        badge.cls,
                      ].join(" ")}
                    >
                      <Clock3 className="h-4 w-4" />
                      {badge.label}
                    </span>
                  </div>

                  {/* DATE */}
                  <div className="mt-4 text-sm text-slate-400">
                    {formatTanggal(t.tanggal)}
                  </div>

                  {/* ITEM ROW */}
                  <div className="mt-4 flex items-center justify-between gap-3 border-t border-slate-100 pt-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full bg-slate-100">
                        {img ? (
                          <Image
                            src={img}
                            alt={itemName}
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        ) : (
                          <div className="grid h-full w-full place-items-center text-xs text-slate-400">
                            🍲
                          </div>
                        )}
                      </div>

                      <div className="min-w-0">
                        <div className="font-extrabold text-slate-900 line-clamp-1">
                          {itemName}
                        </div>
                        <div className="text-sm text-slate-500">
                          <span className="font-extrabold text-red-600">
                            {qty}x
                          </span>{" "}
                          @ {formatRupiah(harga)}
                        </div>
                      </div>
                    </div>

                    <div className="text-base font-extrabold text-slate-900 shrink-0">
                      {formatRupiah(nota?.total ?? 0)}
                    </div>
                  </div>

                  {/* STATUS + TOTAL */}
                  <div className="mt-5 flex items-center justify-between">
                    <div className="text-sm text-slate-500">
                      Status:{" "}
                      <span className="font-extrabold text-slate-700">
                        {t.status.replaceAll("_", " ")}
                      </span>
                    </div>
                    <div className="text-lg font-extrabold text-red-600">
                      {formatRupiah(nota?.total ?? 0)}
                    </div>
                  </div>
                </div>

                {/* BUTTON (sementara placeholder karena kamu bilang fokus pesanan dulu) */}
                <div className="px-5 pb-5">
                  <button
                    type="button"
                    onClick={() => onCetakNotaPdf(t.id)}
                    className="w-full rounded-2xl bg-red-600 py-3.5 text-base font-extrabold text-white hover:bg-red-700 transition flex items-center justify-center gap-2"
                  >
                    
                    Cetak Nota
                  </button>
                </div>
              </div>
            );
            
          })
        )}
      </div>
      {pdfOpen && (
  <div
    className="fixed inset-0 z-[9999] bg-black/40 backdrop-blur-[2px] flex items-center justify-center p-4"
    onClick={closePdf}
  >
    <div
      className="w-full max-w-4xl rounded-3xl bg-white shadow-2xl overflow-hidden"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header modal */}
      <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
        <div className="text-sm font-extrabold text-slate-900">Nota (PDF)</div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              // trigger print iframe
              const frame = document.getElementById("pdf-frame") as HTMLIFrameElement | null;
              frame?.contentWindow?.focus();
              frame?.contentWindow?.print();
            }}
            className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-extrabold text-slate-700 hover:bg-slate-50"
          >
            Print
          </button>

          <button
            type="button"
            onClick={closePdf}
            className="rounded-2xl bg-red-600 px-4 py-2 text-sm font-extrabold text-white hover:bg-red-700"
          >
            Tutup
          </button>
        </div>
      </div>

      {/* Body modal */}
      <div className="h-[75vh] bg-slate-50">
        {pdfUrl ? (
          <iframe
            id="pdf-frame"
            src={pdfUrl}
            className="h-full w-full"
            title="PDF Nota"
          />
        ) : (
          <div className="h-full w-full grid place-items-center text-sm text-slate-500">
            PDF tidak tersedia
          </div>
        )}
      </div>
    </div>
  </div>
)}

    </div>
  );
}
