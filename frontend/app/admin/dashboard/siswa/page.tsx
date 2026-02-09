"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import axios from "axios";
import { useRouter } from "next/navigation";
import Navbar from "@/components/navbaradmin";
import { BASE_API_URL, BASE_IMAGE_PROFILE } from "@/global";
import { getCookie } from "@/lib/client-cookies";

type Siswa = {
  id?: number;
  id_siswa?: number;
  nama_siswa?: string;
  alamat?: string;
  telp?: string;
  username?: string;
  foto?: string;
};

function pickId(r: any) {
  return r?.id ?? r?.id_siswa ?? null;
}

function buildFotoUrl(path?: string) {
  if (!path) return null;
  if (path.startsWith("http")) return path;
  return `${BASE_IMAGE_PROFILE}/${path}`;
}

export default function AdminSiswaPage() {
  const router = useRouter();
  const token = getCookie("token");

  const [rows, setRows] = useState<Siswa[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const [openEdit, setOpenEdit] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [nama_siswa, setNama] = useState("");
  const [alamat, setAlamat] = useState("");
  const [telp, setTelp] = useState("");
  const [username, setUsername] = useState("");
  const [foto, setFoto] = useState<File | null>(null);

  // =========================
  // FETCH DATA
  // =========================
  const load = async () => {
    try {
      setLoading(true);
      setErr("");

      const res = await axios.get(`${BASE_API_URL}/admin/siswa`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 200) {
        setRows(res.data?.data ?? res.data ?? []);
      }
    } catch (e: any) {
      setErr(e?.response?.data?.message ?? "Gagal mengambil data siswa");
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // START EDIT
  // =========================
  const startEdit = (r: Siswa) => {
    const id = Number(pickId(r));
    if (!id) return;

    setEditingId(id);
    setNama(r.nama_siswa ?? "");
    setAlamat(r.alamat ?? "");
    setTelp(r.telp ?? "");
    setUsername(r.username ?? "");
    setFoto(null);
    setOpenEdit(true);
  };

  // =========================
  // UPDATE
  // =========================
  const simpanEdit = async () => {
    if (!editingId) return;

    try {
      setLoading(true);
      setErr("");

      const formData = new FormData();
      formData.append("nama_siswa", nama_siswa);
      formData.append("alamat", alamat);
      formData.append("telp", telp);
      formData.append("username", username);

      if (foto) {
        formData.append("foto", foto);
      }

      await axios.put(
        `${BASE_API_URL}/admin/siswa/${editingId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setOpenEdit(false);
      await load();
    } catch (e: any) {
      setErr(e?.response?.data?.message ?? "Gagal update siswa");
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // DELETE
  // =========================
  const hapus = async (id: number) => {
    const ok = confirm("Yakin ingin menghapus siswa ini?");
    if (!ok) return;

    try {
      setLoading(true);
      setErr("");

      await axios.delete(`${BASE_API_URL}/admin/siswa/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      await load();
    } catch (e: any) {
      setErr(e?.response?.data?.message ?? "Gagal hapus siswa");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) {
      router.replace("/admin/login");
      return;
    }
    load();
  }, []);

  return (
    <div className="space-y-6">

      <Navbar />
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-extrabold text-slate-900">
          Data Siswa
        </h1>
        <p className="text-sm text-slate-500">
          Kelola data siswa (edit & hapus)
        </p>
        {err && <p className="mt-2 text-sm text-red-600">{err}</p>}
      </div>

      {/* TABLE */}
      <div className="rounded-2xl bg-white shadow-sm overflow-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-50">
            <tr className="text-left text-slate-600">
              <th className="px-5 py-3">Foto</th>
              <th className="px-5 py-3">ID</th>
              <th className="px-5 py-3">Nama</th>
              <th className="px-5 py-3">Username</th>
              <th className="px-5 py-3">Telp</th>
              <th className="px-5 py-3">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => {
              const id = Number(pickId(r));
              const fotoUrl = buildFotoUrl(r.foto);

              return (
                <tr key={id} className="border-t">
                  <td className="px-5 py-3">
                    <div className="relative h-10 w-10 overflow-hidden rounded-full bg-slate-100">
                      {fotoUrl ? (
                        <Image
                          src={fotoUrl}
                          alt="Foto"
                          fill
                          sizes="40px"
                          className="object-cover"
                          unoptimized
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-xs text-slate-400">
                          N/A
                        </div>
                      )}
                    </div>
                  </td>

                  <td className="px-5 py-3">{id}</td>
                  <td className="px-5 py-3 font-bold">
                    {r.nama_siswa}
                  </td>
                  <td className="px-5 py-3">{r.username}</td>
                  <td className="px-5 py-3">{r.telp}</td>

                  <td className="px-5 py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => startEdit(r)}
                        className="px-3 py-1 bg-slate-200 rounded-lg text-xs font-bold"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => hapus(id)}
                        className="px-3 py-1 bg-red-600 text-white rounded-lg text-xs font-bold"
                      >
                        Hapus
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}

            {!loading && rows.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center py-8 text-slate-500">
                  Tidak ada data siswa
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL EDIT */}
      {openEdit && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg space-y-4">
            <h2 className="text-lg font-extrabold">Edit Siswa</h2>

            <input
              className="w-full border px-4 py-2 rounded-lg"
              placeholder="Nama"
              value={nama_siswa}
              onChange={(e) => setNama(e.target.value)}
            />
            <input
              className="w-full border px-4 py-2 rounded-lg"
              placeholder="Alamat"
              value={alamat}
              onChange={(e) => setAlamat(e.target.value)}
            />
            <input
              className="w-full border px-4 py-2 rounded-lg"
              placeholder="Telp"
              value={telp}
              onChange={(e) => setTelp(e.target.value)}
            />
            <input
              className="w-full border px-4 py-2 rounded-lg"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />

            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFoto(e.target.files?.[0] || null)}
            />

            <div className="flex gap-2">
              <button
                onClick={simpanEdit}
                className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-bold"
              >
                Simpan
              </button>
              <button
                onClick={() => setOpenEdit(false)}
                className="border px-4 py-2 rounded-lg text-sm font-bold"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
