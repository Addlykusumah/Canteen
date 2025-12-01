"use client"

import { BASE_API_URL } from "../../../global";
import { useRouter } from "next/navigation";
import axios from "axios";
import { storeCookie } from "@/lib/client-cookies";
import { FormEvent, useState } from "react"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

const LoginPage = () => {
    const [username, setUsername] = useState<string>("")
    const [password, setPassword] = useState<string>("")
    const [showPassword, setShowPassword] = useState<boolean>(false)

    const router = useRouter()

    const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
        const url = `${BASE_API_URL}/user/login`;
        const payload = { username, password };

        const { data } = await axios.post(url, payload, {
            headers: { "Content-Type": "application/json" }
        });

        console.log("Response:", data);

        const { msg, token, user, siswa } = data;

        if (user) {
            
            toast(msg, { hideProgressBar: true, containerId: `toastLogin`, type: "success", autoClose: 2000 });

            storeCookie("token", token);
            storeCookie("id", user.id.toString());
            storeCookie("name", user.role === "siswa" && siswa ? siswa.nama_siswa : user.username);
            storeCookie("role", user.role);

            if (user.role === "siswa") router.replace("/dashboard");
            else if (user.role === "admin_stan") router.replace("/cashier/dashboard");

        } else {
            
            toast(msg || "Username atau password salah", {
                hideProgressBar: true,
                containerId: `toastLogin`,
                type: "warning",
                autoClose: 2000
            });
        }

    } catch (error: any) {
    console.error(error);

    const message =
        error.response?.data?.msg ||   
        error.response?.data?.error || 
        "Something went wrong";      

    toast(message, {
        hideProgressBar: true,
        containerId: `toastLogin`,
        type: "error",
        autoClose: 2000
    });
}

};


    return (
        <div className="w-screen h-screen bg-login">
            <ToastContainer containerId={`toastLogin`} />
            <div className="w-full h-full bg-backdrop-login flex justify-center items-center p-5">
                <div className="w-32 md:w-6/12 lg:w-4/12 min-h-[400px] border rounded-xl bg-white p-5 flex flex-col items-center relative">
                    <div className="absolute bottom-0 left-0 w-full py-2 text-center">
                        <small className="text-slate-600">Copyright @2025</small>
                    </div>

                    <h4 className="text-2xl uppercase font-semibold text-primary mb-4">CraveIt</h4>
                    <span className="text-sm text-slate-500 font-medium text-center">
                        Welcome To My Food Store
                    </span>

                    <form onSubmit={handleSubmit} className="w-full my-10">
                        {/* Username */}
                        <div className="flex w-full my-4">
                            <div className="bg-primary rounded-l-md p-3">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                                </svg>
                            </div>
                            <input
                                type="text"
                                className="border p-2 grow rounded-r-md focus:outline-none focus:ring-primary focus:border-primary"
                                value={username}
                                onChange={e => setUsername(e.target.value)}
                                placeholder="Username"
                            />
                        </div>

                        {/* Password */}
                        <div className="flex w-full my-4">
                            <div className="bg-primary rounded-l-md p-3">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                                </svg>
                            </div>
                            <input
                                type={showPassword ? "text" : "password"}
                                className="border p-2 grow focus:outline-none focus:ring-primary focus:border-primary"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                placeholder="Password"
                            />
                            <div className="cursor-pointer bg-primary rounded-r-md p-3" onClick={() => setShowPassword(!showPassword)}>
                                {showPassword ? (
                                    <span>Hide</span>
                                ) : (
                                    <span>Show</span>
                                )}
                            </div>
                        </div>

                        <div className="my-10">
                            <button type="submit" className="bg-primary hover:bg-primary uppercase w-full p-2 rounded-md text-white">
                                Login
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default LoginPage
