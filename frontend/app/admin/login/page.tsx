"use client";

import Image from "next/image";
import Link from "next/link";
import { BASE_API_URL } from "../../../global";
import { useRouter } from "next/navigation";
import axios from "axios";
import { storeCookie } from "@/lib/client-cookies";
import { FormEvent, useState } from "react";
import { toast } from "sonner";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = `${BASE_API_URL}/user/login`;
      const payload = { username, password };

      const { data } = await axios.post(url, payload, {
        headers: { "Content-Type": "application/json" },
      });

      const { msg, token, user, siswa } = data;

      if (!user || !token) {
        toast.warning(msg || "Username atau password salah");
        return;
      }

      // ✅ LOGIN SUKSES
      toast.success(msg || "Login berhasil");

      storeCookie("token", token);
      storeCookie("id", user.id.toString());
      storeCookie(
        "name",
        user.role === "siswa" && siswa ? siswa.nama_siswa : user.username
      );
      storeCookie("role", user.role);

      setTimeout(() => {
        if (user.role === "siswa") {
          router.replace("/dashboard");
        } else if (user.role === "admin_stan") {
          router.replace("/cashier/dashboard");
        }
      }, 300);
    } catch (error: any) {
      const message =
        error.response?.data?.msg ||
        error.response?.data?.error ||
        "Something went wrong";

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-white">
      <div className="grid min-h-screen w-full grid-cols-1 lg:grid-cols-2">
        {/* LEFT */}
        <section className="flex items-center justify-center px-8 py-12 lg:px-20">
          <div className="w-full max-w-xl">
            <div className="mb-14 flex items-center gap-3">
              <span className="h-3 w-3 rounded-sm bg-violet-600" />
              <span className="text-base font-semibold text-slate-700">
                KantinKu
              </span>
            </div>

            <h1 className="text-5xl font-extrabold text-slate-900 lg:text-6xl">
              Selamat Datang
            </h1>
            <h2 className="text-5xl font-extrabold text-violet-600 lg:text-6xl">
              Di Kantin Online
            </h2>

            <p className="mt-4 text-base text-slate-500 lg:text-lg">
              Silakan masukkan username dan password anda
            </p>

            <form onSubmit={handleSubmit} className="mt-12 space-y-5">
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-5 py-4 text-base focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
                required
              />

              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-5 py-4 text-base focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
                required
              />

              <button
                type="submit"
                disabled={loading}
                className="mt-3 inline-flex w-44 items-center justify-center rounded-xl bg-violet-600 px-6 py-4 text-base font-semibold text-white hover:bg-violet-700 disabled:opacity-60"
              >
                {loading ? "Loading..." : "Sign In"}
              </button>

              <p className="pt-10 text-sm text-slate-500">
                Don&apos;t have an account?{" "}
                <Link
                  href="/siswa/register"
                  className="font-semibold text-violet-600 hover:underline"
                >
                  Sign Up.
                </Link>
              </p>
            </form>
          </div>
        </section>

        {/* RIGHT */}
        <section className="relative hidden lg:block h-screen w-full">
          <div className="absolute inset-0 flex items-center justify-center px-10">
            <div className="relative h-[700px] w-[1500px]">
              <Image
                src="/image/3dKantin.png"
                alt="Illustration"
                fill
                priority
                className="object-contain"
              />
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default LoginPage;
