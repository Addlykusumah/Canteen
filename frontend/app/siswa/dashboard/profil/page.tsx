"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import axios from "axios";
import { ArrowLeft, User, Phone, AtSign, MapPin, IdCard } from "lucide-react";
import { BASE_API_URL, BASE_IMAGE_PROFILE } from "@/global";
import { getCookie } from "@/lib/client-cookies";
import Navbar from "@/components/navbar";

type ProfileType = {
  id?: number;
  nama_siswa?: string;
  username?: string;
  telp?: string;
  alamat?: string;
  foto?: string;
};

function getField(value: any, fallback = "—") {
  if (!value) return fallback;
  if (typeof value === "string" && value.trim() === "") return fallback;
  return value;
}
function buildImageUrl(path?: string) {
  if (!path) return null;
  if (path.startsWith("http")) return path;
  return `${BASE_IMAGE_PROFILE}/${path}`;
}

export default function ProfilPage() {
  const token = getCookie("token");

  const [profile, setProfile] = useState<ProfileType | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await axios.get(
        `${BASE_API_URL}/profile?t=${Date.now()}`, // anti 304
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("PROFILE RESPONSE:", res.data);

      const user = res.data?.user;
      const siswa = res.data?.siswa;

      setProfile({
        id: user?.id,
        username: user?.username,
        nama_siswa: siswa?.nama_siswa,
        telp: siswa?.telp,
        alamat: siswa?.alamat,
        foto: siswa?.foto,
      });
    } catch (err: any) {
      console.error(err);
      setError(err?.response?.data?.message ?? "Gagal mengambil profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchProfile();
    } else {
      setError("Token tidak ditemukan");
    }
  }, []);

  const fotoUrl = buildImageUrl(profile?.foto);

  return (
    <div className="space-y-6">
       <Navbar />
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">Profil Saya</h1>
          <p className="text-sm text-slate-500">
            Data diambil dari endpoint <b>/profile</b>
          </p>
        </div>

        <Link
          href="/siswa/dashboard"
          className="inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm"
        >
          <ArrowLeft className="h-4 w-4" />
          Kembali
        </Link>
      </div>

      {/* CARD */}
      <div className="rounded-3xl border bg-white p-6 space-y-6">
        {loading ? (
          <p className="text-sm text-slate-500">Mengambil data profile...</p>
        ) : error ? (
          <p className="text-sm text-red-600">{error}</p>
        ) : !profile ? (
          <p className="text-sm text-slate-500">Profile tidak ditemukan.</p>
        ) : (
          <>
            {/* FOTO */}
            <div className="flex items-center gap-4">
              <div className="relative h-16 w-16 overflow-hidden rounded-2xl bg-slate-100">
                {fotoUrl ? (
                  <img
                    src={fotoUrl}
                    alt="Foto"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <Image
                    src="/image/mage.png"
                    alt="Placeholder"
                    fill
                    className="object-contain p-2 opacity-40"
                  />
                )}
              </div>

              <div>
                <p className="text-lg font-bold">
                  {getField(profile.nama_siswa)}
                </p>
                <p className="text-sm text-slate-500">
                  @{getField(profile.username)}
                </p>
              </div>
            </div>

            {/* INFO */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InfoItem
                icon={<User size={18} />}
                label="Nama"
                value={getField(profile.nama_siswa)}
              />
              <InfoItem
                icon={<AtSign size={18} />}
                label="Username"
                value={getField(profile.username)}
              />
              <InfoItem
                icon={<Phone size={18} />}
                label="Telepon"
                value={getField(profile.telp)}
              />
              <InfoItem
                icon={<MapPin size={18} />}
                label="Alamat"
                value={getField(profile.alamat)}
              />
              <InfoItem
                icon={<IdCard size={18} />}
                label="ID"
                value={getField(profile.id)}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function InfoItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: any;
}) {
  return (
    <div className="rounded-2xl border p-4 flex items-start gap-3">
      <div className="text-red-600">{icon}</div>
      <div>
        <p className="text-xs text-slate-500">{label}</p>
        <p className="font-semibold">{value}</p>
      </div>
    </div>
  );
}
