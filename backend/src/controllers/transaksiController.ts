import { PrismaClient, StatusTransaksi } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

/**
 * POST /siswa/transaksi
 * Body JSON:
 * {
 *   "items": [
 *     { "id_menu": 1, "qty": 2 },
 *     { "id_menu": 5, "qty": 1 }
 *   ]
 * }
 */
export const createTransaksiSiswa = async (req: Request, res: Response) => {
  try {
    const id_user = (req as any).user?.id; // dari JWT middleware

    if (!id_user) {
      return res.status(401).json({ msg: "Unauthorized" });
    }

    // cari siswa berdasarkan user
    const siswa = await prisma.siswa.findFirst({
      where: { id_user },
    });

    if (!siswa) {
      return res.status(403).json({ msg: "Data siswa tidak ditemukan" });
    }

    const { items } = req.body as {
      items: { id_menu: number; qty: number }[];
    };

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ msg: "Items transaksi wajib diisi" });
    }

    const menuIds = items.map((it) => Number(it.id_menu));

    // ambil semua menu yang dipesan beserta relasi diskonnya
    const menus = await prisma.menu.findMany({
      where: { id: { in: menuIds } },
      include: {
        stan: true,
        menu_diskon: {
          include: {
            diskon: true,
          },
        },
      },
    });

    if (menus.length !== menuIds.length) {
      return res.status(400).json({ msg: "Ada menu yang tidak ditemukan" });
    }

    // pastikan semua menu dari stan yang sama
    const firstStanId = menus[0].id_stan;
    const bedaStan = menus.some((m) => m.id_stan !== firstStanId);

    if (bedaStan) {
      return res.status(400).json({
        msg: "Semua menu dalam satu transaksi harus berasal dari stan yang sama",
      });
    }

    const now = new Date();
    let grandTotal = 0;

    // siapkan detail_transaksi dengan harga setelah diskon
    const detailData = items.map((item) => {
      const menu = menus.find((m) => m.id === item.id_menu)!;

      // cari diskon aktif pada menu ini
      const diskonAktif = menu.menu_diskon
        .filter((md) => {
          const d = md.diskon;
          return now >= d.tanggal_awal && now <= d.tanggal_akhir;
        })
        .sort(
          (a, b) => b.diskon.persentase_diskon - a.diskon.persentase_diskon
        ); // kalau ada beberapa diskon, ambil yang persentase paling besar

      const persenDiskon =
        diskonAktif.length > 0 ? diskonAktif[0].diskon.persentase_diskon : 0;

      const hargaAsli = menu.harga;
      const hargaSetelahDiskon =
        persenDiskon > 0
          ? hargaAsli - hargaAsli * (persenDiskon / 100)
          : hargaAsli;

      const subtotal = hargaSetelahDiskon * item.qty;
      grandTotal += subtotal;

      return {
        id_menu: menu.id,
        qty: item.qty,
        harga_beli: hargaSetelahDiskon, // per satuan
      };
    });

    // Simpan transaksi + detail dalam satu transaksi database
    const result = await prisma.$transaction(async (tx) => {
      const transaksi = await tx.transaksi.create({
        data: {
          tanggal: new Date(),
          id_stan: firstStanId,
          id_siswa: siswa.id,
          status: StatusTransaksi.belum_dikonfirm,
        },
      });

      await tx.detail_transaksi.createMany({
        data: detailData.map((d) => ({
          ...d,
          id_transaksi: transaksi.id,
        })),
      });

      return transaksi;
    });

    return res.status(201).json({
      msg: "Transaksi berhasil dibuat",
      transaksi: result,
      total: grandTotal,
      detail: detailData,
    });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ error: err.message || "Server error" });
  }
};
