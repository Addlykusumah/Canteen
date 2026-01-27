import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { Request, Response } from "express";

const prisma = new PrismaClient();

/**
 * REGISTER SISWA
 * POST /auth/register/siswa
 * multipart/form-data (kalau upload foto) atau JSON (kalau tanpa foto)
 */
export const registerSiswa = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { nama_siswa, alamat, telp, username, password } = req.body as {
      nama_siswa?: string;
      alamat?: string;
      telp?: string;
      username?: string;
      password?: string;
    };

    if (!nama_siswa || !username || !password) {
      res
        .status(400)
        .json({ msg: "Field nama_siswa, username, dan password wajib diisi" });
      return;
    }

    // cek username unik
    const exist = await prisma.users.findUnique({ where: { username } });
    if (exist) {
      res.status(409).json({ msg: "Username sudah digunakan" });
      return;
    }

    const hashed = await bcrypt.hash(password, 10);

    // ambil foto upload (kalau ada)
    const foto = req.file?.filename ?? null;

    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.users.create({
        data: {
          username,
          password: hashed,
          role: "siswa",
        },
        select: { id: true, username: true, role: true },
      });

      const siswa = await tx.siswa.create({
        data: {
          nama_siswa,
          alamat: alamat ?? null,
          telp: telp ?? null,
          foto,
          id_user: user.id,
        },
      });

      return { user, siswa };
    });

    res.status(201).json({
      msg: "Register siswa berhasil",
      user: result.user,
      siswa: result.siswa,
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ msg: error.message || "Server error" });
  }
};

/**
 * REGISTER ADMIN STAN
 * POST /auth/register/stan
 * multipart/form-data (kalau upload foto) atau JSON (kalau tanpa foto)
 */
export const registerStan = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { nama_stan, nama_pemilik, telp, username, password } = req.body as {
      nama_stan?: string;
      nama_pemilik?: string;
      telp?: string;
      username?: string;
      password?: string;
    };

    if (!nama_stan || !nama_pemilik || !username || !password) {
      res.status(400).json({
        msg: "Field nama_stan, nama_pemilik, username, dan password wajib diisi",
      });
      return;
    }

    const existingUser = await prisma.users.findUnique({ where: { username } });
    if (existingUser) {
      res.status(409).json({ msg: "Username sudah terpakai" });
      return;
    }

    const hashed = await bcrypt.hash(password, 10);

    // ambil foto upload (kalau ada) -> pastikan stan schema sudah ada foto String?
    const foto = req.file?.filename ?? null;

    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.users.create({
        data: {
          username,
          password: hashed,
          role: "admin_stan",
        },
        select: { id: true, username: true, role: true },
      });

      const stan = await tx.stan.create({
        data: {
          nama_stan,
          nama_pemilik,
          telp: telp ?? null,
          foto, // ✅ kalau kolom foto sudah ada
          id_user: user.id,
        },
      });

      return { user, stan };
    });

    res.status(201).json({
      msg: "Register stan berhasil",
      user: result.user,
      stan: result.stan,
    });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ msg: err.message || "Server error" });
  }
};
