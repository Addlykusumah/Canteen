import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

export const updateSiswa = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const { nama_siswa, alamat, telp, username } = req.body;

    // cari siswa
    const siswa = await prisma.siswa.findUnique({ where: { id } });
    if (!siswa) return res.status(404).json({ msg: "Siswa tidak ditemukan" });

    // ambil foto baru jika diupload
    const foto = req.file ? req.file.filename : siswa.foto;

    // update username user
    await prisma.users.update({
      where: { id: siswa.id_user },
      data: {
        username: username || undefined
      }
    });

    // update siswa
    const updated = await prisma.siswa.update({
      where: { id },
      data: {
        nama_siswa,
        alamat,
        telp,
        foto
      }
    });

    res.json({
      msg: "Update siswa berhasil",
      siswa: updated
    });

  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
