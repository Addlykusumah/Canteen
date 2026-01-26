import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

/**
 * GET /admin/stan/profile
 * Hanya admin_stan (berdasarkan JWT)
 */
export const getProfileStan = async (req: Request, res: Response) => {
  try {
    const id_user = (req as any).user?.id;
    if (!id_user) return res.status(401).json({ msg: "Unauthorized" });

    const user = await prisma.users.findUnique({
      where: { id: id_user },
      select: { id: true, username: true, role: true },
    });

    if (!user) return res.status(404).json({ msg: "User tidak ditemukan" });

    const stan = await prisma.stan.findFirst({
      where: { id_user },
    });

    if (!stan) return res.status(404).json({ msg: "Data stan tidak ditemukan" });

    return res.json({
      msg: "Berhasil mengambil profile stan",
      user,
      stan,
    });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ error: err.message || "Server error" });
  }
};

export const updateStanProfile = async (req: Request, res: Response) => {
  try {
    const id_user = (req as any).user?.id;
    if (!id_user) return res.status(401).json({ msg: "Unauthorized" });

    const stan = await prisma.stan.findFirst({
      where: { id_user },
    });

    if (!stan) {
      return res.status(404).json({ msg: "Data stan tidak ditemukan" });
    }

    const { nama_stan, nama_pemilik, telp } = req.body as {
      nama_stan?: string;
      nama_pemilik?: string;
      telp?: string;
    };

    const updatedStan = await prisma.stan.update({
      where: { id: stan.id },
      data: {
        nama_stan: nama_stan ?? stan.nama_stan,
        nama_pemilik: nama_pemilik ?? stan.nama_pemilik,
        telp: telp ?? stan.telp,
      },
    });

    return res.json({
      msg: "Update stan berhasil",
      stan: updatedStan,
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || "Server error" });
  }
};