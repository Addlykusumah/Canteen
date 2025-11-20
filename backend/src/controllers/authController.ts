import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export const loginSiswa = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ msg: "Username dan password diperlukan" });
    }

    const user = await prisma.users.findUnique({
      where: { username }
    });

    if (!user) return res.status(400).json({ msg: "Username tidak ditemukan" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(400).json({ msg: "Password salah" });

    const siswa = await prisma.siswa.findFirst({
      where: { id_user: user.id }
    });

     const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET as string, // 🔥 pakai env
      { expiresIn: "1d" }
    );

    res.json({
      msg: "Login berhasil",
      token,
      user,
      siswa
    });

  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
};
