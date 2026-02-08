// app/api/transaksi/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const BACKEND_BASE_URL =
  process.env.NEXT_PUBLIC_BASE_API_URL || "http://localhost:8000";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { msg: "Token tidak ditemukan di cookie (token)" },
        { status: 401 }
      );
    }

    const res = await fetch(`${BACKEND_BASE_URL}/transaksi`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // ✅ ini yang dibutuhkan backend
      },
      body: JSON.stringify(body),
    });

    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, { status: res.status });
  } catch (e: any) {
    return NextResponse.json(
      { msg: e?.message || "Proxy error" },
      { status: 500 }
    );
  }
}
