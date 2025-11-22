import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// GET all siswa
export const getAllSiswaAdmin = async (req: Request, res: Response) => {
  try {
    const siswa = await prisma.siswa.findMany({
      include: { user: true }
    });
    res.json(siswa);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};


export const createSiswaAdmin = async (req: Request, res: Response) => {
  try {
    const { nama_siswa, alamat, telp, username, password } = req.body;
    if (!username || !password || !nama_siswa) {
      return res.status(400).json({ msg: "username, password, nama_siswa diperlukan" });
    }

    // cek username
    const exist = await prisma.users.findUnique({ where: { username } });
    if (exist) return res.status(400).json({ msg: "Username sudah digunakan" });

    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.users.create({
      data: { username, password: hashed, role: "siswa" }
    });

    const foto = (req as any).file?.filename ?? null;

    const siswa = await prisma.siswa.create({
      data: {
        nama_siswa,
        alamat,
        telp,
        foto,
        id_user: user.id
      }
    });

    res.status(201).json({ msg: "Siswa dibuat", siswa, user });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE siswa by id
export const updateSiswaAdmin = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const { nama_siswa, alamat, telp, username, password } = req.body;

    const siswa = await prisma.siswa.findUnique({ where: { id } });
    if (!siswa) return res.status(404).json({ msg: "Siswa tidak ditemukan" });

    // update user (username / password bila ada)
    if (username || password) {
      const dataUser: any = {};
      if (username) dataUser.username = username;
      if (password) dataUser.password = await bcrypt.hash(password, 10);

      await prisma.users.update({
        where: { id: siswa.id_user },
        data: dataUser
      });
    }

    const foto = (req as any).file?.filename ?? siswa.foto;

    const updated = await prisma.siswa.update({
      where: { id },
      data: {
        nama_siswa: nama_siswa ?? undefined,
        alamat: alamat ?? undefined,
        telp: telp ?? undefined,
        foto
      }
    });

    res.json({ msg: "Siswa diupdate", siswa: updated });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE siswa by id
export const deleteSiswaAdmin = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    const siswa = await prisma.siswa.findUnique({ where: { id } });
    if (!siswa) return res.status(404).json({ msg: "Siswa tidak ditemukan" });

    // hapus user dulu (atau atur sesuai kebijakan)
    await prisma.siswa.delete({ where: { id } });

    // Opsi: hapus user record juga (jika ingin)
    await prisma.users.delete({ where: { id: siswa.id_user } });

    res.json({ msg: "Siswa dan user terkait dihapus" });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};