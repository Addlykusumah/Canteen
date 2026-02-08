"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import axios from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import type { StanMini, MenuListResponse } from "../../types";

import {
  Menu,
  X,
  ArrowRight,
  Utensils,
  Clock,
  Leaf,
  Truck,
  Zap,
  BarChart3,
  ShoppingCart,
  Award,
  Phone,
  Mail,
  MapPin,
} from "lucide-react";

import { BASE_API_URL, BASE_IMAGE_STAN, BASE_IMAGE_MENU } from "@/global";
import { useCart } from "@/components/siswa/cart-provider"; // ✅ ADD

const STAN_ICONS = [
  Utensils,
  Clock,
  Leaf,
  Truck,
  Zap,
  BarChart3,
  ShoppingCart,
  Award,
];

const getStanImage = (filename?: string | null) => {
  if (!filename) return null;
  return `${BASE_IMAGE_STAN}/${filename}`;
};

// ==============================
// MENU types (sesuai response backend)
// ==============================
type MenuRow = {
  id: number;
  nama_makanan: string;
  harga: number;
  jenis: "makanan" | "minuman";
  foto: string | null;
  deskripsi: string | null;
  id_stan: number;
  stan?: {
    id: number;
    nama_stan: string;
    foto: string | null;
  };
};

type MenuOnlyResponse = {
  success: boolean;
  data: MenuRow[];
};

const getMenuImage = (filename?: string | null) => {
  if (!filename) return null;
  return `${BASE_IMAGE_MENU}/${filename}`;
};

const formatRupiah = (n: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(n);

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();

  // ✅ cart
  const { addItem } = useCart();

  // ✅ stans hasil dedup dari /menu (bagian features)
  const [stans, setStans] = useState<StanMini[]>([]);
  const [loadingStan, setLoadingStan] = useState(false);

  // ✅ menu list untuk section "Menu"
  const [menus, setMenus] = useState<MenuRow[]>([]);
  const [loadingMenu, setLoadingMenu] = useState(false);

  // ===================================
  // FETCH STAN (dedup dari /menu)
  // ===================================
  useEffect(() => {
    const fetchStansFromMenu = async () => {
      setLoadingStan(true);
      try {
        const url = `${BASE_API_URL}/menu`;
        const { data } = await axios.get<MenuListResponse>(url, {
          headers: { "Content-Type": "application/json" },
        });

        const rows = Array.isArray(data?.data) ? data.data : [];

        const map = new Map<number, StanMini>();
        for (const item of rows) {
          if (!item?.stan?.id) continue;
          map.set(item.stan.id, {
            id: item.stan.id,
            nama_stan: item.stan.nama_stan,
            foto: item.stan.foto ?? null,
          });
        }

        const uniqueSorted = Array.from(map.values()).sort(
          (a, b) => a.id - b.id
        );
        setStans(uniqueSorted);
      } catch (error: any) {
        toast.error(
          error?.response?.data?.msg ||
            error?.response?.data?.error ||
            "Gagal mengambil data stan dari /menu"
        );
      } finally {
        setLoadingStan(false);
      }
    };

    fetchStansFromMenu();
  }, []);

  const stanCards = useMemo(() => {
    return stans.map((s, idx) => ({
      ...s,
      Icon: STAN_ICONS[idx % STAN_ICONS.length],
    }));
  }, [stans]);

  // ===================================
  // FETCH MENU (FOKUS MENU SAJA)
  // ===================================
  useEffect(() => {
    const fetchMenus = async () => {
      setLoadingMenu(true);
      try {
        const url = `${BASE_API_URL}/menu`;
        const { data } = await axios.get<MenuOnlyResponse>(url, {
          headers: { "Content-Type": "application/json" },
        });

        const rows = Array.isArray(data?.data) ? data.data : [];
        const sorted = [...rows].sort((a, b) => b.id - a.id);
        setMenus(sorted);
      } catch (error: any) {
        toast.error(
          error?.response?.data?.msg ||
            error?.response?.data?.error ||
            "Gagal mengambil data menu dari /menu"
        );
      } finally {
        setLoadingMenu(false);
      }
    };

    fetchMenus();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <Image
                src="/image/kanan.png"
                alt="Logo"
                width={300}
                height={300}
                className="h-36 w-36"
              />
            </div>

            <nav className="hidden md:flex gap-8">
              {["Home", "About", "Services", "Testimonials"].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="text-sm hover:text-red-600 transition"
                >
                  {item}
                </a>
              ))}
            </nav>

            <button className="hidden md:block bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition text-sm font-medium">
              Order Now
            </button>

            <button
              className="md:hidden"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {menuOpen && (
            <div className="md:hidden pb-4 border-t border-gray-200">
              <nav className="flex flex-col gap-3">
                {["Home", "About", "Services", "Testimonials"].map((item) => (
                  <a
                    key={item}
                    href={`#${item.toLowerCase()}`}
                    className="text-sm hover:text-red-600 py-2"
                  >
                    {item}
                  </a>
                ))}
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Hero */}
      <section id="home" className="py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
            <div>
              <p className="text-red-600 font-semibold text-sm md:text-base mb-4">
                E-Kantin SMK Telkom Malang
              </p>
              <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                Pesan Makanan Kantin Jadi Lebih Mudah
              </h1>

              <p className="text-muted-foreground text-base md:text-lg mb-8 leading-relaxed">
                Pesan makanan jadi lebih cepat dan praktis
                <br />
                Cukup dari HP lalu ambil saat pesanan siap
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  className="bg-red-600 text-white px-8 py-3 rounded-lg 
                  hover:bg-red-700 hover:scale-102 hover:shadow-lg 
                  transition-all duration-300 ease-in-out 
                  font-semibold flex items-center justify-center gap-2 text-sm md:text-base"
                >
                  Pesan Sekarang <ArrowRight size={18} />
                </button>

                <button
                  className="border-2 border-red-600 text-red-600 px-8 py-3 rounded-lg 
                  hover:bg-red-50 hover:scale-102 hover:shadow-md
                  transition-all duration-300 ease-in-out 
                  font-semibold text-sm md:text-base"
                >
                  Lihat Menu
                </button>
              </div>
            </div>

            <div className="relative h-64 md:h-80 rounded-2xl overflow-hidden shadow-lg">
              <Image
                src="/image/bg1.jpg"
                alt="Hero"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features (Profil Stan dari /menu) */}
      <section id="services" className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold">Daftar Stan</h2>
              <p className="text-muted-foreground mt-1">
                Pilih stan favoritmu, lalu klik <b>Lihat Menu</b>.
              </p>
            </div>

            {loadingStan && (
              <p className="text-sm text-muted-foreground">Loading stan...</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 items-stretch">
            {stanCards.map((s) => {
              const avatar = getStanImage(s.foto);
              const Icon = s.Icon;

              return (
                <div
                  key={s.id}
                  className="bg-white p-6 rounded-xl shadow-sm hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer flex flex-col h-full"
                >
                  <div className="w-14 h-14 mx-auto bg-red-100 rounded-2xl flex items-center justify-center mb-4 overflow-hidden">
                    {avatar ? (
                      <Image
                        src={avatar}
                        alt={s.nama_stan}
                        width={100}
                        height={100}
                        className="h-20 w-20 object-cover"
                        unoptimized
                      />
                    ) : (
                      <Icon className="text-red-600" size={26} />
                    )}
                  </div>

                  <h3 className="font-semibold ml-10 text-foreground mb-3 text-base md:text-lg">
                    {s.nama_stan}
                  </h3>

                  <div className="text-sm mb-4">
                    <p className="text-muted-foreground ml-2 mb-2 leading-relaxed mt-1">
                      {s.nama_stan} menyediakan berbagai pilihan menu lezat yang
                      siap menemani waktu istirahatmu.
                    </p>
                  </div>

                  <button
                    onClick={() => router.push(`/siswa/menu/stan/${s.id}`)}
                    className="mt-auto w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition text-sm font-medium"
                  >
                    Lihat Menu
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* MENU LIST (Fetch /menu, fokus menu) */}
      <section id="testimonials" className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-3">Menu</h2>
            <p className="text-muted-foreground text-base md:text-lg">
              Pilihan menu terbaru yang bisa kamu pesan.
            </p>
            {loadingMenu && (
              <p className="text-sm text-muted-foreground mt-3">
                Loading menu...
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {menus.map((m) => {
              const img = getMenuImage(m.foto);

              return (
                <div
                  key={m.id}
                  className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition flex flex-col"
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
                    <p className="text-2xl font-semibold text-foreground md:text-lg">
                      {m.nama_makanan?.trim()
                        ? m.nama_makanan
                        : "Menu Tanpa Nama"}
                    </p>

                    <p className="text-muted-foreground font-bold leading-relaxed mt-1">
                      {m.deskripsi?.trim()
                        ? m.deskripsi
                        : "Belum ada deskripsi menu."}
                    </p>

                    <p className="font-semibold text-foreground mt-3">
                      {formatRupiah(m.harga)}
                    </p>

                    {/* ✅ BUTTON PESAN SEKARANG: add cart + open drawer */}
                    <button
                      type="button"
                      onClick={() => {
                        addItem(
                          {
                            id_menu: m.id,
                            nama_makanan: m.nama_makanan?.trim()
                              ? m.nama_makanan
                              : "Menu Tanpa Nama",
                            harga: Number(m.harga ?? 0),
                            fotoUrl: m.foto
                              ? (getMenuImage(m.foto) ?? undefined)
                              : undefined,
                            stanName: m.stan?.nama_stan ?? "-",
                            raw: m,
                          },
                          1
                        );

                        toast.success("Ditambahkan ke keranjang");
                      }}
                      className="mt-12 w-full bg-red-600 mb-8 text-white py-3 rounded-lg
                      hover:bg-red-700 hover:scale-102 hover:shadow-lg
                      transition-all duration-300 ease-in-out
                      font-semibold text-sm md:text-base"
                    >
                      Pesan Sekarang
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {!loadingMenu && menus.length === 0 && (
            <p className="text-sm text-muted-foreground mt-6 text-center">
              Belum ada menu tersedia.
            </p>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-red-600 text-white py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-red-600 font-bold text-sm">
                  G
                </div>
                <span className="font-bold text-lg">Godby</span>
              </div>
              <p className="text-sm opacity-80">
                Premium catering services for unforgettable events.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                {["Home", "Services", "Testimonials", "Contact"].map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="opacity-80 hover:opacity-100 transition"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Contact Info</h4>
              <ul className="space-y-3 text-sm">
                <li className="flex items-center gap-2 opacity-80">
                  <Phone size={16} /> (555) 123-4567
                </li>
                <li className="flex items-center gap-2 opacity-80">
                  <Mail size={16} /> info@godby.com
                </li>
                <li className="flex items-center gap-2 opacity-80">
                  <MapPin size={16} /> 123 Food Street, NYC
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/20 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center text-sm opacity-80 text-center md:text-left">
              <p>&copy; 2024 Godby Catering. All rights reserved.</p>
              <div className="flex gap-6 mt-4 md:mt-0">
                {["Privacy Policy", "Terms of Service", "Cookie Settings"].map(
                  (link) => (
                    <a
                      key={link}
                      href="#"
                      className="hover:opacity-100 transition"
                    >
                      {link}
                    </a>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
