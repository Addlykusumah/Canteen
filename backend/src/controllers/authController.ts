import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "SECRET_KEY";

export const login = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    const makerId = req.headers["makerid"] || req.headers["maker-id"] || null;

    if (!username || !password) {
      return res
        .status(400)
        .json({ error: "Username dan password wajib diisi" });
    }

    const user = await prisma.users.findUnique({
      where: { username },
      include: { stan: true, siswa: true },
    });

    if (!user)
      return res.status(401).json({ error: "Username atau password salah" });

    const match = await bcrypt.compare(password, user.password);
    if (!match)
      return res.status(401).json({ error: "Username atau password salah" });

    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: user.role === "siswa" ? "1d" : "7d" },
    );

    // Response berbeda berdasarkan role
    if (user.role === "siswa") {
      const siswa = await prisma.siswa.findFirst({
        where: { id_user: user.id },
      });
      return res.status(200).json({
        msg: "Login siswa berhasil",
        token,
        user: {
          id: user.id,
          username: user.username,
          role: user.role,
        },
        siswa,
      });
    } else if (user.role === "admin_stan") {
      return res.status(200).json({
        msg: "Login stan berhasil",
        token: `${token}`,
        user: {
          id: user.id,
          username: user.username,
          role: user.role,
        },
        stan:
          user.stan?.map((s) => ({
            id: s.id,
            nama_stan: s.nama_stan,
            nama_pemilik: s.nama_pemilik,
            telp: s.telp,
          })) || [],
      });
    }

    return res.status(400).json({ error: "Role user tidak dikenali" });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ error: err.message || "Server error" });
  }
};
