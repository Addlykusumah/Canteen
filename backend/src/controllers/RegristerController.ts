import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { Request, Response } from "express";

const prisma = new PrismaClient();

/**
 * REGISTER SISWA
 * Endpoint contoh: POST /auth/register/siswa
 */
export const registerSiswa = async (req: Request, res: Response): Promise<void> => {
  try {
    const { nama_siswa, alamat, telp, username, password } = req.body;

    // Basic validation
    if (!nama_siswa || !username || !password) {
      res.status(400).json({
        msg: "Field nama_siswa, username, dan password wajib diisi",
      });
      return;
    }

    // Cek username unik
    const exist = await prisma.users.findUnique({ where: { username } });
    if (exist) {
      res.status(409).json({ msg: "Username sudah digunakan" });
      return;
    }

    const hashed = await bcrypt.hash(password, 10);
    const foto = (req as any).file?.filename || null;

    // Pakai transaction supaya konsisten antara users & siswa
    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.users.create({
        data: {
          username,
          password: hashed,
          role: "siswa", // UserRole.siswa
        },
      });

      const siswa = await tx.siswa.create({
        data: {
          nama_siswa,
          alamat,
          telp,
          foto,
          id_user: user.id, // relasi ke users.id (sesuai schema)
        },
      });

      return { user, siswa };
    });

    res.status(201).json({
      msg: "Register siswa berhasil",
      user: {
        id: result.user.id,
        username: result.user.username,
        role: result.user.role,
      },
      siswa: result.siswa,
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ msg: error.message || "Server error" });
  }
};

/**
 * REGISTER ADMIN STAN
 * Endpoint contoh: POST /auth/register/stan
 */
export const registerStan = async (req: Request, res: Response): Promise<void> => {
  try {
    // makerId dikirim di header (opsional, buat tracking)
    const makerId = (req.headers["makerid"] ||
      req.headers["maker-id"] ||
      null) as string | null;

    const { nama_stan, nama_pemilik, telp, username, password } = req.body;

    // Simple validation
    if (!nama_stan || !nama_pemilik || !username || !password) {
      res.status(400).json({
        msg: "Field nama_stan, nama_pemilik, username, dan password wajib diisi",
      });
      return;
    }

    // cek username unik
    const existingUser = await prisma.users.findUnique({
      where: { username },
    });
    if (existingUser) {
      res.status(409).json({ msg: "Username sudah terpakai" });
      return;
    }

    const hashed = await bcrypt.hash(password, 10);

    // Transaction: buat user + stan bareng
    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.users.create({
        data: {
          username,
          password: hashed,
          role: "admin_stan", // UserRole.admin_stan
        },
      });

      const stan = await tx.stan.create({
        data: {
          nama_stan,
          nama_pemilik,
          telp: telp || null,
          id_user: user.id, // relasi ke users.id
        },
      });

      return { user, stan };
    });

    res.status(201).json({
      msg: "Register stan berhasil",
      user: {
        id: result.user.id,
        username: result.user.username,
        role: result.user.role,
      },
      stan: {
        id: result.stan.id,
        nama_stan: result.stan.nama_stan,
        nama_pemilik: result.stan.nama_pemilik,
        telp: result.stan.telp,
        id_user: result.stan.id_user,
      },
    });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ msg: err.message || "Server error" });
  }
};
