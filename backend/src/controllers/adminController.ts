import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

/**
 * GET /admin/stan/profile
 * Hanya admin_stan
 */
export const getProfileStan = async (req: Request, res: Response) => {
  try {
    const id_user = (req as any).user?.id;
    if (!id_user) return res.status(401).json({ msg: "Unauthorized" });

    const stan = await prisma.stan.findFirst({
      where: { id_user },
    });

    if (!stan) {
      return res.status(404).json({ msg: "Data stan tidak ditemukan" });
    }

    return res.json({
      msg: "Berhasil mengambil profile stan",
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

    const stan = await prisma.stan.findFirst({ where: { id_user } });
    if (!stan) {
      return res.status(404).json({ msg: "Data stan tidak ditemukan" });
    }

    const { nama_stan, nama_pemilik, telp } = req.body as {
      nama_stan?: string;
      nama_pemilik?: string;
      telp?: string;
    };

    const foto = req.file ? req.file.filename : undefined;

    if (
      nama_stan === undefined &&
      nama_pemilik === undefined &&
      telp === undefined &&
      foto === undefined
    ) {
      return res.status(400).json({
        msg: "Minimal satu field harus diisi untuk update",
      });
    }

    const updatedStan = await prisma.stan.update({
      where: { id: stan.id },
      data: {
        ...(nama_stan !== undefined ? { nama_stan } : {}),
        ...(nama_pemilik !== undefined ? { nama_pemilik } : {}),
        ...(telp !== undefined ? { telp } : {}),
        ...(foto !== undefined ? { foto } : {}),
      },
    });

    return res.json({
      msg: "Profile stan berhasil diupdate",
      stan: updatedStan,
    });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ error: err.message || "Server error" });
  }
};
