"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";
import Image from "next/image";
import { BASE_API_URL } from "../../../../global";

const RegisterSiswaPage = () => {
  const router = useRouter();

  const [namaSiswa, setNamaSiswa] = useState("");
  const [alamat, setAlamat] = useState("");
  const [telp, setTelp] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [foto, setFoto] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (loading) return;

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("nama_siswa", namaSiswa);
      formData.append("alamat", alamat);
      formData.append("telp", telp);
      formData.append("username", username);
      formData.append("password", password);
      if (foto) formData.append("foto", foto);

      const { data } = await axios.post(
        `${BASE_API_URL}/register_siswa`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      toast.success(data.msg || "Register siswa berhasil");

      setTimeout(() => {
        router.replace("/login");
      }, 2000);
    } catch (error: any) {
      toast.error(
        error.response?.data?.msg ||
          error.response?.data?.error ||
          "Register siswa gagal"
      );
    } finally {
      setLoading(false);
    }
  };

  const pickFile = (file?: File) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("File harus berupa gambar");
      return;
    }
    setFoto(file);
  };

  return (
    <main className="h-screen overflow-hidden bg-white">
      <div className="grid h-full w-full grid-cols-1 lg:grid-cols-2">
        {/* LEFT */}
        <section className="flex h-full flex-col items-start justify-center px-8 lg:px-20">
          <div className="w-full max-w-md">
            {/* Logo */}
            <div className="h-14 flex items-center mb-2">
              <Image
                src="/image/logo.png"
                alt="Go Makan Logo"
                width={180}
                height={100}
                className=" translate-x-32 object-contain"
                priority
              />
            </div>

            <p className="text-xs translate-x-24 translate-y-2 text-slate-500 mb-3">
              Lengkapi data untuk membuat akun siswa.
            </p>

            {/* FORM */}
            <form onSubmit={handleSubmit} className="space-y-2">
              {/* Nama */}
              <div>
                <label className="block text-[11px] font-medium text-slate-700 mb-1">
                  Nama Siswa
                </label>
                <input
                  type="text"
                  value={namaSiswa}
                  onChange={(e) => setNamaSiswa(e.target.value)}
                  required
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-xs
                             focus:border-red-500 focus:ring-1 focus:ring-red-500/30"
                />
              </div>

              {/* Alamat */}
              <div>
                <label className="block text-[11px] font-medium text-slate-700 mb-1">
                  Alamat
                </label>
                <textarea
                  rows={1}
                  value={alamat}
                  onChange={(e) => setAlamat(e.target.value)}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-xs resize-none
                             focus:border-red-500 focus:ring-1 focus:ring-red-500/30"
                />
              </div>

              {/* Telp */}
              <div>
                <label className="block text-[11px] font-medium text-slate-700 mb-1">
                  No. Telepon
                </label>
                <input
                  type="tel"
                  value={telp}
                  onChange={(e) => setTelp(e.target.value)}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-xs
                             focus:border-red-500 focus:ring-1 focus:ring-red-500/30"
                />
              </div>

              {/* Username */}
              <div>
                <label className="block text-[11px] font-medium text-slate-700 mb-1">
                  Username
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-xs
                             focus:border-red-500 focus:ring-1 focus:ring-red-500/30"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-[11px] font-medium text-slate-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-xs
                             focus:border-red-500 focus:ring-1 focus:ring-red-500/30"
                />
              </div>

              {/* FOTO – DRAG & DROP */}
              <div>
                <label className="block text-[11px] font-medium text-slate-700 mb-1">
                  Foto (opsional)
                </label>

                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setIsDragging(false);
                    pickFile(e.dataTransfer.files?.[0]);
                  }}
                  className={`flex items-center justify-between rounded-md border-2 border-dashed px-3 py-2 text-[11px] transition
                    ${
                      isDragging
                        ? "border-red-500 bg-red-50"
                        : "border-slate-300 hover:border-red-400"
                    }`}
                >
                  <span className="text-slate-500 truncate">
                    {foto
                      ? foto.name
                      : "Drag & drop foto di sini atau klik Browse"}
                  </span>

                  {foto ? (
                    <button
                      type="button"
                      onClick={() => setFoto(null)}
                      className="ml-2 text-slate-400 hover:text-red-600 transition"
                      title="Hapus foto"
                    >
                      ✕
                    </button>
                  ) : (
                    <label className="cursor-pointer rounded bg-slate-100 px-2 py-1 text-slate-700
                                       hover:bg-slate-200 transition">
                      Browse
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => pickFile(e.target.files?.[0])}
                      />
                    </label>
                  )}
                </div>
              </div>

              {/* SUBMIT */}
              <button
                type="submit"
                disabled={loading}
                className="mt-2 w-full rounded-md bg-red-600 px-4 py-2 text-xs font-semibold text-white
                           hover:bg-red-700 transition disabled:opacity-60"
              >
                {loading ? "Processing..." : "Register Siswa"}
              </button>
            </form>

            {/* BACK */}
            <button
              type="button"
              onClick={() => router.replace("/login")}
              className="mt-3 w-full rounded-md border border-slate-300 px-4 py-2 text-xs font-medium text-slate-700
                         hover:bg-slate-100 hover:border-slate-400 transition"
            >
              ← Back to Login
            </button>
          </div>
        </section>

        {/* RIGHT */}
        <section className="hidden lg:flex h-full w-full items-center justify-center">
          <Image
            src="/image/icon.png"
            alt="Register Illustration"
            width={800}
            height={800}
            className="-translate-x-12 translate-y-4 object-contain"
            priority
          />
        </section>
      </div>
    </main>
  );
};

export default RegisterSiswaPage;
