"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
// import { useToast } from "@/hooks/use-toast";

interface LoginResponse {
  msg: string;
  token: string;
  user: {
    id: number;
    username: string;
    role: "siswa" | "admin_stan";
  };
  siswa?: {
    nama_siswa: string;
  };
}

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  // const { toast } = useToast();

  // Temporary fallback for toast
  const toast = ({
    title,
    description,
    variant,
  }: {
    title: string;
    description: string;
    variant?: string;
  }) => {
    if (variant === "destructive") {
      alert(`${title}\n${description}`);
    } else {
      alert(`${title}\n${description}`);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!username || !password) {
      toast({
        title: "Validation Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const BASE_API_URL =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const url = `${BASE_API_URL}/user/login`;
      const payload = { username, password };

      const { data } = await axios.post<LoginResponse>(url, payload, {
        headers: { "Content-Type": "application/json" },
      });

      const { msg, token, user, siswa } = data;

      if (user) {
        toast({
          title: "Success",
          description: msg,
        });

        // Store credentials
        localStorage.setItem("token", token);
        localStorage.setItem("id", user.id.toString());
        localStorage.setItem(
          "name",
          user.role === "siswa" && siswa ? siswa.nama_siswa : user.username,
        );
        localStorage.setItem("role", user.role);

        if (rememberMe) {
          localStorage.setItem("rememberMe", "true");
        }

        // Redirect based on role
        setTimeout(() => {
          if (user.role === "siswa") {
            router.replace("/dashboard");
          } else if (user.role === "admin_stan") {
            router.replace("/cashier/dashboard");
          }
        }, 300);
      } else {
        toast({
          title: "Login Failed",
          description: msg || "Username atau password salah",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      const message =
        error.response?.data?.msg ||
        error.response?.data?.error ||
        "Terjadi kesalahan. Silakan coba lagi.";

      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-amber-50 to-red-50">
      <div className="grid min-h-screen w-full grid-cols-1 lg:grid-cols-2">
        {/* LEFT SIDE - FORM */}
        <section className="flex items-center justify-center px-6 py-12 sm:px-8 lg:px-20">
          <div className="w-full max-w-sm">
            {/* Logo */}
            <div className="mb-8 flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded bg-red-600">
                <span className="text-xs font-bold text-white">🦅</span>
              </div>
              <span className="text-lg font-bold text-gray-900">Garuda</span>
            </div>

            {/* Heading */}
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-gray-900">Dirgahayu,</h1>
              <h2 className="text-4xl font-bold text-red-600">
                Republik Indonesia
              </h2>
              <p className="mt-3 text-sm text-gray-600">
                Welcome back, today is Indonesia independence day
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email/Username Input */}
              <div>
                <Input
                  type="text"
                  placeholder="independenceday@gmail.com"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={loading}
                  className="h-12 border-gray-300 bg-white placeholder:text-gray-400 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                />
              </div>

              {/* Password Input */}
              <div>
                <Input
                  type="password"
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  className="h-12 border-gray-300 bg-white placeholder:text-gray-400 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                />
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="remember"
                    checked={rememberMe}
                    onCheckedChange={(checked) =>
                      setRememberMe(checked as boolean)
                    }
                    className="border-red-600 bg-white"
                  />
                  <label
                    htmlFor="remember"
                    className="text-sm font-medium text-gray-700 cursor-pointer"
                  >
                    Remember me
                  </label>
                </div>
                <Link
                  href="/forgot-password"
                  className="text-sm font-medium text-gray-600 hover:text-red-600 transition-colors"
                >
                  Forgot Password?
                </Link>
              </div>

              {/* Sign In Button */}
              <Button
                type="submit"
                disabled={loading}
                className="mt-6 w-full h-12 bg-red-600 text-base font-semibold hover:bg-red-700 text-white rounded-lg transition-colors"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Loading
                  </span>
                ) : (
                  "Sign In"
                )}
              </Button>

              {/* Sign Up Link */}
              <p className="pt-6 text-center text-sm text-gray-600">
                Don&apos;t have an account?{" "}
                <Link
                  href="/sign-up"
                  className="font-semibold text-red-600 hover:text-red-700 transition-colors"
                >
                  Sign Up
                </Link>
              </p>
            </form>
          </div>
        </section>

        {/* RIGHT SIDE - ILLUSTRATION */}
        <section className="relative hidden lg:flex items-center justify-center bg-gradient-to-br from-red-500/10 to-amber-500/10 overflow-hidden">
          {/* Decorative background elements */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-10 right-20 w-40 h-40 bg-red-600 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
            <div className="absolute -bottom-8 left-20 w-40 h-40 bg-amber-600 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
          </div>

          {/* Illustration */}
          <div className="relative z-10 px-10">
            <div className="relative w-full max-w-md aspect-square">
              <Image
                src="/images/indonesia-independence.jpg"
                alt="Indonesia Independence Illustration"
                fill
                priority
                className="object-contain drop-shadow-lg"
              />
            </div>
          </div>
        </section>
      </div>

      <style jsx>{`
        @keyframes blob {
          0%,
          100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </main>
  );
};

export default LoginPage;
