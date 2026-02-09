"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Navbar from "@/components/navbaradmin";
import { BASE_API_URL, BASE_IMAGE_STAN } from "@/global";
import { getCookie } from "@/lib/client-cookies";

type StanProfile = {
  id?: number;
  nama_stan?: string;
  nama_pemilik?: string;
  telp?: string;
  foto?: string;
  id_user?: number;
};

function getField(value: any, fallback = "—") {
  if (!value) return fallback;
  if (typeof value === "string" && value.trim() === "") return fallback;
  return value;
}

function buildImageUrl(path?: string) {
  if (!path) return null;
  if (path.startsWith("http")) return path;
  return `${BASE_IMAGE_STAN}/${path}`;
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const token = getCookie("token");

  const [profile, setProfile] = useState<StanProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ==============================
  // FETCH PROFILE STAN (AXIOS)
  // ==============================
  const fetchProfileStan = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await axios.get(`${BASE_API_URL}/stan/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 200) {
       
        setProfile(res.data?.stan ?? null);
      }
    } catch (err: any) {
      console.error(err);
      setError(
        err?.response?.data?.msg ??
          err?.response?.data?.message ??
          "Gagal mengambil profile stan"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) {
      router.replace("/admin/login");
      return;
    }

    fetchProfileStan();
  }, []);

  const fotoUrl = buildImageUrl(profile?.foto);

  return (
    <div className="space-y-6">

        <Navbar />
      {/* HERO */}
      <div className="overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-red-600 to-rose-600 shadow-2xl">
        <div className="p-8 text-white">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-xs font-extrabold">
            🍔 KantinKu
            <span className="rounded-full bg-white/30 px-2 py-0.5 text-[11px]">
              admin
            </span>
          </div>

          <h2 className="mt-4 text-3xl font-extrabold">
            Dashboard Admin Stan
          </h2>

          <p className="mt-2 text-sm text-white/90">
            Informasi profil stan kamu
          </p>

          <Link
            href="/admin/dashboard/profil-stan"
            className="mt-6 inline-flex rounded-full bg-white px-5 py-2 text-sm font-extrabold text-red-600"
          >
            Edit Profil Stan →
          </Link>
        </div>
      </div>

      {/* CARD PROFILE */}
      <div className="rounded-[2rem] bg-white p-6 shadow-sm">
        {loading ? (
          <p className="text-sm text-slate-500">
            Mengambil data profile stan...
          </p>
        ) : error ? (
          <p className="text-sm text-red-600">{error}</p>
        ) : !profile ? (
          <p className="text-sm text-slate-500">
            Data profile tidak ditemukan.
          </p>
        ) : (
          <div className="flex flex-col gap-6 md:flex-row">
            {/* FOTO */}
            <div className="relative h-48 w-full md:w-64 overflow-hidden rounded-2xl bg-slate-100">
              {fotoUrl ? (
                <img
                  src={fotoUrl}
                  alt="Foto Stan"
                  className="h-full w-full object-cover"
                />
              ) : (
                <Image
                  src="/image/default-stan.jpg"
                  alt="Placeholder"
                  fill
                  className="object-cover opacity-40"
                />
              )}
            </div>

            {/* INFO */}
            <div className="flex-1 space-y-4">
              <h3 className="text-2xl font-extrabold text-slate-900">
                {getField(profile.nama_stan)}
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-slate-500">Pemilik</p>
                  <p className="font-semibold">
                    {getField(profile.nama_pemilik)}
                  </p>
                </div>

                <div>
                  <p className="text-slate-500">No. HP</p>
                  <p className="font-semibold">
                    {getField(profile.telp)}
                  </p>
                </div>

                <div className="sm:col-span-2">
                  <p className="text-slate-500">ID User</p>
                  <p className="font-semibold">
                    {getField(profile.id_user)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
