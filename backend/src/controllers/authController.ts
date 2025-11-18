import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export const registerSiswa = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password, nama_siswa } = req.body;

    const hash = await bcrypt.hash(password, 10);

    const user = await prisma.users.create({
      data: {
        username,
        password: hash,
        role: "siswa",
      },
    });

    const siswa = await prisma.siswa.create({
      data: {
        nama_siswa,
        id_user: user.id,
      },
    });

    res.json({ message: "Register siswa berhasil", user, siswa });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const registerAdminStan = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password, nama_stan, nama_pemilik } = req.body;

    const hash = await bcrypt.hash(password, 10);

    const user = await prisma.users.create({
      data: {
        username,
        password: hash,
        role: "admin_stan",
      },
    });

    const stan = await prisma.stan.create({
      data: {
        nama_stan,
        nama_pemilik,
        id_user: user.id,
      },
    });

    res.json({ message: "Register admin stan berhasil", user, stan });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password } = req.body;

    const user = await prisma.users.findUnique({
      where: { username },
    });

    if (!user) {
      res.status(404).json({ error: "User tidak ditemukan" });
      return;
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      res.status(401).json({ error: "Password salah" });
      return;
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET as string,
      { expiresIn: "1d" }
    );

    res.json({ message: "Login berhasil", token, role: user.role });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
