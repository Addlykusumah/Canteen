"use client";
import Link from "next/link";
import { BASE_API_URL } from "../../../global";
import { useRouter } from "next/navigation";
import axios from "axios";
import { storeCookie } from "@/lib/client-cookies";
import { FormEvent, useState } from "react";                                                                                                                                                                                                                                                                                                                                                                                                                                                  ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
import { toast } from "sonner";
import Image from "next/image";

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
          router.replace("/admin_stan/dashboard");
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
    <main className="h-screen overflow-hidden bg-white">
      <div className="grid h-full w-full grid-cols-1 lg:grid-cols-2">
        {/* LEFT */}
     <section className="flex h-full flex-col items-start justify-center px-8 py-8 lg:px-20 overflow-y-auto">


          <div className="w-full max-w-md justify-start pb-4">
            {/* Logo */}
            <div className="h-15  flex items-center">
              <Image
                src="/image/logo.png"
                alt="Go Makan Logo"
                width={200}
                height={150}
                className="translate-x-22  object-contain"
                priority
              />
            </div>

            <p className="mt-2 translate-y-4 translate-x-8 text-sm text-slate-500">
              Enter your username and password to access your account.
            </p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-4">
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
              <Link
                href="/siswa/register"
                className="font-semibold text-yellow-600 hover:underline"
              >
                Register Now.
              </Link>
            </p>
          </div>
        </section>

        {/* RIGHT */}
        <section className="hidden lg:flex h-full w-full items-center justify-center">
          <Image
            src="/image/icon.png"
            alt="Login Illustration"
            width={800}
            height={800}
            className=" -translate-x-12 translate-y-4 object-contain"
            priority
          />
        </section>
      </div>
    </main>
  );
};

export default LoginPage;
