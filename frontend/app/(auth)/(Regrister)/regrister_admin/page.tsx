"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BASE_API_URL } from "../../../../global"; // sesuaikan path

const RegisterStanPage = () => {
  const router = useRouter();

  const [namaStan, setNamaStan] = useState("");
  const [namaPemilik, setNamaPemilik] = useState("");
  const [telp, setTelp] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (loading) return;

    try {
      setLoading(true);

      const url = `${BASE_API_URL}/register_stan`; // ganti kalau route backend beda

      // Karena backend pakai multer.none(), kirim sebagai multipart/form-data
      const formData = new FormData();
      formData.append("nama_stan", namaStan);
      formData.append("nama_pemilik", namaPemilik);
      formData.append("telp", telp);
      formData.append("username", username);
      formData.append("password", password);

      const { data } = await axios.post(url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast(data.msg || data.message || "Register stan berhasil", {
        containerId: "toastRegisterStan",
        type: "success",
        hideProgressBar: true,
        autoClose: 2000,
      });

      setTimeout(() => {
        router.replace("/login");
      }, 2000);
    } catch (error: any) {
      console.error(error);
      const message =
        error.response?.data?.msg ||
        error.response?.data?.error ||
        "Register stan gagal";

      toast(message, {
        containerId: "toastRegisterStan",
        type: "error",
        hideProgressBar: true,
        autoClose: 2500,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-screen h-screen bg-login">
      <ToastContainer containerId="toastRegisterStan" />
      <div className="w-full h-full bg-backdrop-login flex justify-center items-center p-5">
        <div className="w-full md:w-6/12 lg:w-4/12 min-h-[400px] border rounded-xl bg-white p-5 flex flex-col items-center relative">
          <div className="absolute bottom-0 left-0 w-full py-2 text-center">
            <small className="text-slate-600">Copyright @2025</small>
          </div>

          <h4 className="text-2xl uppercase font-semibold text-primary mb-2">
            CraveIt
          </h4>
          <span className="text-sm text-slate-500 font-medium text-center">
            Register Admin Stan
          </span>

          <form onSubmit={handleSubmit} className="w-full my-6 space-y-4">
            {/* Nama Stan */}
            <div>
              <label className="block text-sm mb-1">Nama Stan</label>
              <input
                type="text"
                className="border p-2 w-full rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                value={namaStan}
                onChange={(e) => setNamaStan(e.target.value)}
                placeholder="Nama stan"
                required
              />
            </div>

            {/* Nama Pemilik */}
            <div>
              <label className="block text-sm mb-1">Nama Pemilik</label>
              <input
                type="text"
                className="border p-2 w-full rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                value={namaPemilik}
                onChange={(e) => setNamaPemilik(e.target.value)}
                placeholder="Nama pemilik"
                required
              />
            </div>

            {/* Telepon */}
            <div>
              <label className="block text-sm mb-1">No. Telepon</label>
              <input
                type="tel"
                className="border p-2 w-full rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                value={telp}
                onChange={(e) => setTelp(e.target.value)}
                placeholder="08xxxxxxxxxx"
              />
            </div>

            {/* Username */}
            <div>
              <label className="block text-sm mb-1">Username</label>
              <input
                type="text"
                className="border p-2 w-full rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm mb-1">Password</label>
              <input
                type="password"
                className="border p-2 w-full rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-4 bg-primary hover:bg-primary/90 uppercase w-full p-2 rounded-md text-white disabled:opacity-60"
            >
              {loading ? "Processing..." : "Register Stan"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterStanPage;
