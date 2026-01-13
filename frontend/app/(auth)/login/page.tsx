"use client";

import Image from "next/image";
import { BASE_API_URL } from "../../../global";
import { useRouter } from "next/navigation";
import axios from "axios";
import { storeCookie } from "@/lib/client-cookies";
import { FormEvent, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const url = `${BASE_API_URL}/user/login`;
      const payload = { username, password };

      const { data } = await axios.post(url, payload, {
        headers: { "Content-Type": "application/json" },
      });

      const { msg, token, user, siswa } = data;

      if (user) {
        toast(msg, {
          hideProgressBar: true,
          containerId: `toastLogin`,
          type: "success",
          autoClose: 2000,
        });

        storeCookie("token", token);
        storeCookie("id", user.id.toString());
        storeCookie(
          "name",
          user.role === "siswa" && siswa ? siswa.nama_siswa : user.username
        );
        storeCookie("role", user.role);

        if (user.role === "siswa") router.replace("/dashboard");
        else if (user.role === "admin_stan")
          router.replace("/cashier/dashboard");
      } else {
        toast(msg || "Username atau password salah", {
          hideProgressBar: true,
          containerId: `toastLogin`,
          type: "warning",
          autoClose: 2000,
        });
      }
    } catch (error: any) {
      const message =
        error.response?.data?.msg ||
        error.response?.data?.error ||
        "Something went wrong";

      toast(message, {
        hideProgressBar: true,
        containerId: `toastLogin`,
        type: "error",
        autoClose: 2000,
      });
    }
  };

  return (
    <main className="min-h-screen bg-white">
      <ToastContainer containerId="toastLogin" />

      <div className="grid min-h-screen w-full grid-cols-1 lg:grid-cols-2">
        {/* LEFT SIDE */}
        <section className="flex items-center justify-center px-8 py-12 lg:px-20">
          <div className="w-full max-w-xl">
            
            <h1 className="text-5xl font-extrabold leading-tight text-slate-900 lg:text-6xl">
              Halo, <br /> Selamat Datang
            </h1>

            <p className="mt-4 text-base text-slate-500 lg:text-lg">
              Welcome back! Please login to continue.
            </p>

            {/* FORM */}
            <form onSubmit={handleSubmit} className="mt-12 space-y-5">
              {/* Username */}
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-5 py-4 text-base text-slate-800 outline-none transition focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
              />

              {/* Password */}
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-5 py-4 text-base text-slate-800 outline-none transition focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
              />

              <div className="flex items-center justify-between pt-2">
                <label className="flex items-center gap-3 text-sm text-slate-600">
                  <input
                    type="checkbox"
                    className="h-5 w-5 rounded border-slate-300 text-violet-600 focus:ring-violet-500"
                    defaultChecked
                  />
                  Remember me
                </label>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                className="mt-3 w-44 rounded-xl bg-violet-600 px-6 py-4 text-base font-semibold text-white shadow-sm transition hover:bg-violet-700 focus:outline-none focus:ring-4 focus:ring-violet-200"
              >
                Sign In
              </button>
            </form>
          </div>
        </section>

        {/* RIGHT SIDE */}

        
























        {/* <section className="relative hidden lg:block h-screen w-full"> */}
          {/* <div className="absolute inset-0 overflow-hidden bg-gradient-to-br from-violet-500 to-indigo-500"> */}
            {/* Cloud Effects */}
            {/* <div className="absolute -left-20 top-10 h-28 w-72 rounded-full bg-white/30 blur-sm" />
            <div className="absolute -right-24 top-16 h-32 w-80 rounded-full bg-white/30 blur-sm" />
            <div className="absolute left-10 bottom-14 h-28 w-72 rounded-full bg-white/25 blur-sm" />
            <div className="absolute right-10 bottom-8 h-24 w-60 rounded-full bg-white/20 blur-sm" /> */}

            {/* <div className="absolute inset-0 flex items-center justify-center px-10">
              <div
                style={{ width: "1500px", height: "900px" }}
                className="relative"
              >
                <Image
                  src="/image/3dKantin.png"
                  alt="Illustration"
                  fill
                  priority
                />
              </div>
            </div>
          </div>
        </section> */}
      </div>
    </main>
  );
};

export default LoginPage;
