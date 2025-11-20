import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export const loginSiswa = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    // Validasi input
    if (!username || !password) {
      return res.status(400).json({ msg: "Username dan password diperlukan" });
    }

    // Cek user berdasarkan username
    const user = await prisma.users.findUnique({
      where: { username: username }
    });

    if (!user) {
      return res.status(400).json({ msg: "Username tidak ditemukan" });
    }

    // Bandingkan password
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(400).json({ msg: "Password salah" });
    }

    // Ambil data siswa
    const siswa = await prisma.siswa.findFirst({
      where: { id_user: user.id }
    });

    return res.json({
      msg: "Login berhasil",
      user,
      siswa
    });

  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
};
