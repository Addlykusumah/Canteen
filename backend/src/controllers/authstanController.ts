import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const JWT_SECRET = process.env.JWT_SECRET || "SECRET_KEY";

export const loginStan = async (req: Request, res: Response) => {
  try {
    const makerId = req.headers["makerid"] || req.headers["maker-id"] || null;
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        error: "username dan password wajib diisi"
      });
    }

    // Ambil user berdasar username
    const user = await prisma.users.findUnique({
      where: { username },
      include: { stan: true }
    });

    if (!user) {
      return res.status(401).json({ error: "Username atau password salah" });
    }

    // ❌ Jika role BUKAN admin_stan → TOLAK
    if (user.role !== "admin_stan") {
      return res.status(403).json({
        error: "Hanya stan yang boleh login di endpoint ini"
      });
    }

    // Cek password
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ error: "Username atau password salah" });
    }

    // Payload token
    const payload = {
      sub: user.id,
      username: user.username,
      role: user.role
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });

    return res.status(200).json({
      message: "Login berhasil",
      maker_id: makerId,
      token: `Bearer ${token}`,
      user: {
        id: user.id,
        username: user.username,
        role: user.role
      },
      stan: user.stan?.map(s => ({
        id: s.id,
        nama_stan: s.nama_stan,
        nama_pemilik: s.nama_pemilik,
        telp: s.telp
      })) || []
    });

  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ error: err.message || "Server error" });
  }
};