"use client";

import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import Image from "next/image";
import { toast } from "sonner";
import Navbar from "@/components/navbar";
import type { MenuRow, MenuListResponse } from "../../../types";
import { BASE_API_URL, BASE_IMAGE_MENU } from "@/global";

// helpers
const getMenuImage = (filename?: string | null) => {
  if (!filename) return "";
  return `${BASE_IMAGE_MENU}/${filename}`;
};

const formatRupiah = (n: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(n);

type FilterJenis = "all" | "makanan" | "minuman";

export default function MenuPage() {
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");

  const [filterJenis, setFilterJenis] = useState<FilterJenis>("all");

  const [menus, setMenus] = useState<MenuRow[]>([]);
  const [loadingMenu, setLoadingMenu] = useState(false);

  // FETCH MENU
  useEffect(() => {
    const fetchMenus = async () => {
      setLoadingMenu(true);
      try {
        const url = `${BASE_API_URL}/menu`;
        const { data } = await axios.get<MenuListResponse>(url, {
          headers: { "Content-Type": "application/json" },
        });

        const rows = Array.isArray(data?.data) ? data.data : [];
        const sorted = [...rows].sort((a, b) => b.id - a.id);
        setMenus(sorted);
      } catch (err: any) {
        toast.error(
          err?.response?.data?.msg ||
            err?.response?.data?.error ||
            "Gagal mengambil data menu dari /menu",
        );
        setMenus([]);
      } finally {
        setLoadingMenu(false);
      }
    };

    fetchMenus();
  }, []);

  // FILTER + SEARCH
  const filtered = useMemo(() => {
    let list = menus;

    // filter jenis dari backend
    if (filterJenis !== "all") {
      list = list.filter((m) => m.jenis === filterJenis);
    }

    // search
    const q = search.trim().toLowerCase();
    if (!q) return list;

    return list.filter((m) => {
      const nama = (m.nama_makanan || "").toLowerCase();
      const desk = (m.deskripsi || "").toLowerCase();
      const stan = (m.stan?.nama_stan || "").toLowerCase();
      return nama.includes(q) || desk.includes(q) || stan.includes(q);
    });
  }, [menus, filterJenis, search]);

  const totalShown = filtered.length;

  const TabBtn = ({
    active,
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
        "rounded-full px-4 py-2 text-sm font-extrabold transition",
        "ring-1 ring-inset",
        active
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
      <div className="rounded-3xl border border-red-100 bg-white p-6 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900">
              Display Menu
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Pilih kategori menu, lalu cari menu favoritmu.
            </p>
          </div>

          <div className="shrink-0">
            <div className="rounded-full bg-red-50 px-4 py-2 text-sm font-extrabold text-red-700 ring-1 ring-red-100">
              {loadingMenu ? "..." : `${totalShown} item`}
            </div>
          </div>
        </div>

        {/* Tabs + Search */}
        <div className="mt-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          {/* Tabs filter */}
          <div className="flex flex-wrap gap-2">
            <TabBtn
              active={filterJenis === "all"}
              onClick={() => setFilterJenis("all")}
            >
              Semua
            </TabBtn>
            <TabBtn
              active={filterJenis === "makanan"}
              onClick={() => setFilterJenis("makanan")}
            >
              Makanan
            </TabBtn>
            <TabBtn
              active={filterJenis === "minuman"}
              onClick={() => setFilterJenis("minuman")}
            >
              Minuman
            </TabBtn>
          </div>

          {/* Search */}
          <div className="flex w-full gap-2 lg:w-auto">
            <input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") setSearch(searchInput);
              }}
              placeholder="Cari menu..."
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none
              focus:border-red-400 focus:ring-4 focus:ring-red-100 lg:w-80"
            />

            <button
              type="button"
              onClick={() => setSearch(searchInput)}
              className="rounded-2xl bg-red-600 px-4 py-2.5 text-sm font-extrabold text-white hover:bg-red-700"
            >
              Cari
            </button>

            <button
              type="button"
              onClick={() => {
                setSearchInput("");
                setSearch("");
                setFilterJenis("all");
              }}
              className="rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-extrabold text-slate-700 hover:bg-slate-50"
            >
              Reset
            </button>
          </div>
        </div>

        <div className="mt-3 text-xs text-slate-500">
          {loadingMenu ? "Memuat..." : `Total: ${totalShown} item`}
        </div>
      </div>

      {/* GRID MENU (desain punyamu) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {loadingMenu ? (
          <div className="text-sm text-muted-foreground md:col-span-3">
            Loading menu...
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-sm text-muted-foreground md:col-span-3">
            Tidak ada menu untuk filter ini.
          </div>
        ) : (
          filtered.map((m) => {
            const img = getMenuImage(m.foto);

            return (
              <div
                key={m.id}
                className="bg-gray-50 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition flex flex-col"
              >
                {/* GAMBAR MENU */}
                <div className="relative h-40 bg-gray-200">
                  {img ? (
                    <Image
                      src={img}
                      alt={m.nama_makanan || "Menu"}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-5xl">
                      🍲
                    </div>
                  )}
                </div>

                {/* INFO */}
                <div className="p-4">
                  <h3 className="font-semibold text-foreground text-base line-clamp-1">
                    {m.nama_makanan?.trim()
                      ? m.nama_makanan
                      : "Menu Tanpa Nama"}
                  </h3>

                  <p className="text-muted-foreground text-sm leading-relaxed mt-1 line-clamp-2">
                    {m.deskripsi?.trim()
                      ? m.deskripsi
                      : "Belum ada deskripsi menu."}
                  </p>

                  <p className="font-semibold text-foreground mt-3">
                    {formatRupiah(m.harga)}
                  </p>

                  <p className="mt-1 text-xs font-semibold text-red-600">
                    {m.stan?.nama_stan || "Kantin tidak diketahui"}
                  </p>

                  {/* BUTTON PESAN */}
                  <button
                    onClick={() =>
                      toast.success(`Pesan: ${m.nama_makanan || "Menu"}`)
                    }
                    className="mt-3 w-full bg-red-600 text-white py-3 rounded-lg
                      hover:bg-red-700 hover:scale-102 hover:shadow-lg
                      transition-all duration-300 ease-in-out
                      font-semibold text-sm md:text-base"
                  >
                    Pesan Sekarang
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
