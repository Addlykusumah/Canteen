import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

export const getProfile = async (req: Request, res: Response) => {
  try {
    const makerID = Number(req.headers.makerid);

    if (!makerID) {
      return res.status(400).json({ msg: "makerID diperlukan" });
    }

    // cari user berdasarkan makerID (id_user)
    const user = await prisma.users.findUnique({
      where: { id: makerID }
    });

    if (!user) {
      return res.status(404).json({ msg: "User tidak ditemukan" });
    }

    // cari siswa berdasarkan id_user
    const siswa = await prisma.siswa.findFirst({
      where: { id_user: makerID }
    });

    if (!siswa) {
      return res.status(404).json({ msg: "Data siswa tidak ditemukan" });
    }

    return res.json({
      msg: "Berhasil mengambil profile",
      user,
      siswa
    });

  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
};
