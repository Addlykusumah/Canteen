"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import axios from "axios";
import {
  ArrowLeft,
  Save,
  User,
  Phone,
  AtSign,
  MapPin,
  Camera,
} from "lucide-react";
import Navbar from "@/components/navbar";
import { BASE_API_URL, BASE_IMAGE_PROFILE } from "@/global";
import { getCookie } from "@/lib/client-cookies";

type ProfileResponse = {
  user?: {
    username?: string;
  };
  siswa?: {
    id: number;
    nama_siswa: string;
    alamat: string;
    telp: string;
    foto?: string;
  };
};

export default function EditProfilPage() {
  const router = useRouter();
  const token = getCookie("token");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [idSiswa, setIdSiswa] = useState<number | null>(null);
  const [nama, setNama] = useState("");
  const [username, setUsername] = useState("");
  const [telp, setTelp] = useState("");
  const [alamat, setAlamat] = useState("");

  const [fotoOld, setFotoOld] = useState<string | null>(null);
  const [fotoFile, setFotoFile] = useState<File | null>(null);
  const [fotoPreview, setFotoPreview] = useState<string | null>(null);

  /* ================= GET PROFILE ================= */
  const fetchProfile = async () => {
    try {
      setLoading(true);

      const res = await axios.get<ProfileResponse>(
        `${BASE_API_URL}/profile`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const siswa = res.data?.siswa;
      const user = res.data?.user;

      if (!siswa) throw new Error("Data siswa tidak ditemukan");

      setIdSiswa(siswa.id);
      setNama(siswa.nama_siswa);
      setAlamat(siswa.alamat);
      setTelp(siswa.telp);
      setUsername(user?.username ?? "");
      setFotoOld(siswa.foto ?? null);
    } catch (err: any) {
      setError(err?.response?.data?.msg ?? "Gagal mengambil profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  /* ================= FOTO ================= */
  const onPickFoto = (file: File | null) => {
    setFotoFile(file);
    if (fotoPreview) URL.revokeObjectURL(fotoPreview);
    if (file) setFotoPreview(URL.createObjectURL(file));
  };

  const fotoUrl =
    fotoPreview ??
    (fotoOld ? `${BASE_IMAGE_PROFILE}/${fotoOld}` : null);

  /* ================= SAVE (PUT) ================= */
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!idSiswa) return setError("ID siswa tidak ditemukan");

    try {
      setSaving(true);

      const formData = new FormData();
      formData.append("nama_siswa", nama);
      formData.append("username", username);
      formData.append("telp", telp);
      formData.append("alamat", alamat);
      if (fotoFile) formData.append("foto", fotoFile);

      await axios.put(
        `${BASE_API_URL}/profile/edit`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            // ❌ jangan set Content-Type manual
          },
        }
      );

      alert("Profil berhasil diperbarui ✅");
      router.push("/siswa/dashboard/profil");
      router.refresh();
    } catch (err: any) {
      setError(err?.response?.data?.msg ?? "Gagal update profil");
    } finally {
      setSaving(false);
    }
  };

  /* ================= UI ================= */
  return (
    <div className="space-y-6">
        <Navbar />
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">Edit Profil</h1>
          <p className="text-sm text-slate-500">
            Endpoint <b>PUT /profile/edit</b>
          </p>
        </div>

        <Link
          href="/siswa/dashboard/profile"
          className="inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm"
        >
          <ArrowLeft className="h-4 w-4" />
          Kembali
        </Link>
      </div>

      <div className="rounded-3xl border bg-white p-6">
        {loading ? (
          <p className="text-sm text-slate-500">Memuat data...</p>
        ) : (
          <form onSubmit={onSubmit} className="space-y-5">
            {error && (
              <div className="rounded-xl bg-red-50 p-3 text-sm text-red-600">
                {error}
              </div>
            )}

            {/* FOTO */}
            <div className="flex items-center gap-4">
              <div className="relative h-20 w-20 rounded-2xl overflow-hidden bg-slate-100">
                {fotoUrl ? (
                  <img
                    src={fotoUrl}
                    alt="Foto"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <Image
                    src="/image/mage.png"
                    alt="placeholder"
                    fill
                    className="object-contain p-2 opacity-40"
                  />
                )}
              </div>

              <label className="cursor-pointer rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white">
                <Camera className="inline h-4 w-4 mr-1" />
                Ganti Foto
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) =>
                    onPickFoto(e.target.files?.[0] ?? null)
                  }
                />
              </label>
            </div>

            {/* FIELD */}
            <Field icon={<User />} label="Nama" value={nama} onChange={setNama} />
            <Field icon={<AtSign />} label="Username" value={username} onChange={setUsername} />
            <Field icon={<Phone />} label="Telepon" value={telp} onChange={setTelp} />
            <Field icon={<MapPin />} label="Alamat" value={alamat} onChange={setAlamat} />

            <button
              disabled={saving}
              className="w-full rounded-xl bg-red-500 py-3 text-sm font-bold text-white hover:bg-red-600 disabled:opacity-60"
            >
              <Save className="inline h-4 w-4 mr-1" />
              {saving ? "Menyimpan..." : "Simpan Perubahan"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

function Field({
  icon,
  label,
  value,
  onChange,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="rounded-xl border p-4 flex gap-3 items-start">
        
      <div className="text-red-500">{icon}</div>
      <div className="flex-1">
        <p className="text-xs text-slate-500">{label}</p>
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
        />
      </div>
    </div>
  );
}
