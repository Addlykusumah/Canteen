import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

export const getAllMenu = async (req: Request, res: Response) => {
  try {
    const id_user = (req as any).user.id;

    const stan = await prisma.stan.findFirst({ where: { id_user } });
    if (!stan) return res.status(403).json({ msg: "Stan tidak ditemukan" });

    const menu = await prisma.menu.findMany({
      where: { id_stan: stan.id }
    });

    res.json(menu);
    
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};


export const getDetailMenu = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    const menu = await prisma.menu.findUnique({ where: { id } });
    if (!menu) return res.status(404).json({ msg: "Menu tidak ditemukan" });

    res.json(menu);

  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};


export const createMenu = async (req: Request, res: Response) => {
  try {
    const { nama_makanan, jenis, harga, deskripsi } = req.body;
    const id_user = (req as any).user.id;

    const stan = await prisma.stan.findFirst({ where: { id_user } });
    if (!stan) return res.status(403).json({ msg: "Stan tidak ditemukan" });

    const foto = req.file ? req.file.filename : null;

    const menu = await prisma.menu.create({
      data: {
        nama_makanan,
        jenis,
        harga: Number(harga),
        deskripsi,
        foto,
        id_stan: stan.id
      }
    });

    res.json({ msg: "Menu berhasil ditambah", menu });

  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};


export const updateMenu = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const { nama_makanan, jenis, harga, deskripsi } = req.body;

    let menu = await prisma.menu.findUnique({ where: { id } });
    if (!menu) return res.status(404).json({ msg: "Menu tidak ditemukan" });

    const fotoBaru = req.file ? req.file.filename : menu.foto;

    const updated = await prisma.menu.update({
      where: { id },
      data: {
        nama_makanan,
        jenis,
        harga: harga ? Number(harga) : menu.harga,
        deskripsi,
        foto: fotoBaru
      }
    });

    res.json({ msg: "Menu berhasil diupdate", menu: updated });

  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const searchMenu = async (req: Request, res: Response) => {
  try {
    const id_user = (req as any).user.id;
    const search = req.params.keyword?.toLowerCase() || ""; 

    const stan = await prisma.stan.findFirst({ where: { id_user } });
    if (!stan) return res.status(403).json({ msg: "Stan tidak ditemukan" });

    // Ambil semua menu milik stan
    const menu = await prisma.menu.findMany({
      where: {
        id_stan: stan.id,
        nama_makanan: {
          contains: search
        }
      }
    });

    // Filter manual agar lebih akurat (opsional)
    const filtered = menu.filter(m =>
      m.nama_makanan.toLowerCase().includes(search)
    );

    res.json(filtered);

  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};





export const deleteMenu = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    const menu = await prisma.menu.findUnique({ where: { id } });
    if (!menu) return res.status(404).json({ msg: "Menu tidak ditemukan" });

    await prisma.menu.delete({ where: { id } });

    res.json({ msg: "Menu berhasil dihapus" });

  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
