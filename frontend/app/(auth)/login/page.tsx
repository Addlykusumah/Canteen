"use client";

import { BASE_API_URL } from "../../../global";
import { useRouter } from "next/navigation";
import axios from "axios";
import { storeCookie } from "@/lib/client-cookies";
import { FormEvent, useState } from "react";
import { toast } from "sonner";
import Image from "next/image";

type Mode = "login" | "register";

const LoginPage = () => {
  const [mode, setMode] = useState<Mode>("login");
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

      toast.success(msg || "Login berhasil");

      storeCookie("token", token);
      storeCookie("id", user.id.toString());
      storeCookie(
        "name",
        user.role === "siswa" && siswa ? siswa.nama_siswa : user.username,
      );
      storeCookie("role", user.role);

      setTimeout(() => {
        if (user.role === "siswa") router.replace("/siswa/dashboard");
        else if (user.role === "admin_stan")
          router.replace("/admin/dashboard");
      }, 300);
    } catch (error: any) {
      toast.error(
        error.response?.data?.msg ||
          error.response?.data?.error ||
          "Something went wrong",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      className="relative h-screen overflow-hidden bg-cover bg-center bg-no-repeat"
    
    >
      {/* Overlay supaya konten kebaca */}
      <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px]" />

      <div className="relative grid h-full w-full grid-cols-1 lg:grid-cols-2">
        {/* LEFT */}
        <section className="flex h-full flex-col items-start justify-center px-8 py-8 lg:px-20 overflow-y-auto">
          <div className="w-full max-w-md pb-4">
            <div className="relative">
              {/* LOGIN VIEW */}
              <div
                className={`transition-[opacity,transform] duration-500 ease-in-out ${
                  mode === "login"
                    ? "opacity-100 translate-y-0 pointer-events-auto relative"
                    : "opacity-0 -translate-y-4 pointer-events-none absolute inset-0"
                }`}
              >
                {/* Logo */}
                <div className="h-16 flex items-center mb-4">
                  <Image
                    src="/image/logo.png"
                    alt="Go Makan Logo"
                    width={200}
                    height={120}
                    className="translate-x-28 translate-y-4 object-contain"
                    priority
                  />
                </div>

                <p className="text-sm translate-x-6 translate-y-6 text-slate-500 mb-10">
                  Masukan username dan password kamu untuk mengakses akun
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-2">
                      Username
                    </label>
                    <input
                      type="text"
                      placeholder="username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                      className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-2">
                      Password
                    </label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="mt-6 w-full rounded-lg bg-red-600 px-4 py-3 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60"
                  >
                    {loading ? "Logging in..." : "Log In"}
                  </button>
                </form>

                <p className="mt-5 text-center text-xs text-slate-600">
                  Don&apos;t Have An Account?{" "}
                  <button
                    type="button"
                    onClick={() => setMode("register")}
                    className="font-semibold text-yellow-600 hover:underline"
                  >
                    Register Now.
                  </button>
                </p>
              </div>

              {/* REGISTER VIEW */}
              <div
                className={`transition-[opacity,transform] duration-500 ease-in-out ${
                  mode === "register"
                    ? "opacity-100 translate-y-0 pointer-events-auto relative"
                    : "opacity-0 translate-y-4 pointer-events-none absolute inset-0"
                }`}
              >
                <h2 className="text-2xl font-bold text-slate-900">
                  Choose Register Type
                </h2>
                <p className="mt-2 text-sm text-slate-500">
                  Please select how you want to register.
                </p>

                <div className="mt-8 grid grid-cols-1 gap-4">
                  <button
                    type="button"
                    onClick={() => router.push("/regrister_admin")}
                    className="group rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition-transform duration-300 hover:-translate-y-1 hover:shadow-md"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-600 text-white font-bold">
                        A
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="text-base font-semibold text-slate-900">
                            Register as Admin
                          </h3>
                          <span className="text-slate-400 group-hover:translate-x-1">
                            →
                          </span>
                        </div>
                        <p className="mt-1 text-sm text-slate-500">
                          Create an admin account to manage operations.
                        </p>
                      </div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => router.push("/regrister_siswa")}
                    className="group rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition-transform duration-300 hover:-translate-y-1 hover:shadow-md"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-yellow-500 text-white font-bold">
                        S
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="text-base font-semibold text-slate-900">
                            Register as Siswa
                          </h3>
                          <span className="text-slate-400 group-hover:translate-x-1">
                            →
                          </span>
                        </div>
                        <p className="mt-1 text-sm text-slate-500">
                          Create a student account to access services.
                        </p>
                      </div>
                    </div>
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setMode("login")}
                  className="mt-6 w-full rounded-lg border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  ← Back to Login
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* RIGHT */}
        <section className="hidden lg:flex h-full w-full items-center justify-center">
          <Image
            src="/image/icon.png"
            alt="Login Illustration"
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

export default LoginPage;
