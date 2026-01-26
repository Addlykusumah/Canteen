import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

/**
 * GET /siswa/profile
 * (Hanya siswa, berdasarkan JWT)
 */
export const getProfileSiswa = async (req: Request, res: Response) => {
  try {
    const id_user = (req as any).user?.id;
    if (!id_user) return res.status(401).json({ msg: "Unauthorized" });

    const user = await prisma.users.findUnique({
      where: { id: id_user },
      select: { id: true, username: true, role: true },
    });

    if (!user) return res.status(404).json({ msg: "User tidak ditemukan" });

    const siswa = await prisma.siswa.findFirst({
      where: { id_user },
    });

    if (!siswa) return res.status(404).json({ msg: "Data siswa tidak ditemukan" });

    return res.json({
      msg: "Berhasil mengambil profile",
      user,
      siswa,
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || "Server error" });
  }
};

/**
 * PUT /siswa/profile
 * (Hanya siswa, update data sendiri)
 * Bisa upload foto via upload.single("foto")
 */
export const updateProfileSiswa = async (req: Request, res: Response) => {
  try {
    const id_user = (req as any).user?.id;
    if (!id_user) return res.status(401).json({ msg: "Unauthorized" });

    const siswa = await prisma.siswa.findFirst({
      where: { id_user },
    });

    if (!siswa) return res.status(404).json({ msg: "Data siswa tidak ditemukan" });

    const { nama_siswa, alamat, telp, username } = req.body;

    // kalau ada upload file
    const foto = req.file ? req.file.filename : siswa.foto;

    // update username jika dikirim
    if (username) {
      await prisma.users.update({
        where: { id: id_user },
        data: { username },
      });
    }

    // update siswa (hanya field yang dikirim)
    const updated = await prisma.siswa.update({
      where: { id: siswa.id },
      data: {
        nama_siswa: nama_siswa ?? siswa.nama_siswa,
        alamat: alamat ?? siswa.alamat,
        telp: telp ?? siswa.telp,
        foto,
      },
    });

    return res.json({
      msg: "Update profile siswa berhasil",
      siswa: updated,
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || "Server error" });
  }
};
