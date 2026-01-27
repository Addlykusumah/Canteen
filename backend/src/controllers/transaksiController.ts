import { PrismaClient, StatusTransaksi } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

export const createTransaksiSiswa = async (req: Request, res: Response) => {
  try {
    const id_user = (req as any).user?.id;
    if (!id_user) return res.status(401).json({ msg: "Unauthorized" });

    const siswa = await prisma.siswa.findFirst({ where: { id_user } });
    if (!siswa)
      return res.status(403).json({ msg: "Data siswa tidak ditemukan" });

    const body = req.body as {
      items?: Array<{ id_menu: number; qty: number }>;
    };
    if (!body.items || !Array.isArray(body.items) || body.items.length === 0) {
      return res.status(400).json({ msg: "Items transaksi wajib diisi" });
    }

    // merge item duplikat + validasi
    const merged = new Map<number, number>();
    for (const it of body.items) {
      const id_menu = Number(it.id_menu);
      const qty = Number(it.qty);

      if (!Number.isInteger(id_menu) || id_menu <= 0) {
        return res.status(400).json({ msg: "id_menu harus integer > 0" });
      }
      if (!Number.isInteger(qty) || qty <= 0) {
        return res.status(400).json({ msg: "qty harus integer > 0" });
      }

      merged.set(id_menu, (merged.get(id_menu) ?? 0) + qty);
    }

    const menuIds = [...merged.keys()];

    const menus = await prisma.menu.findMany({
      where: { id: { in: menuIds } },
      include: {
        menu_diskon: { include: { diskon: true } },
      },
    });

    if (menus.length !== menuIds.length) {
      return res.status(400).json({ msg: "Ada menu yang tidak ditemukan" });
    }

    const firstStanId = menus[0].id_stan;
    if (menus.some((m) => m.id_stan !== firstStanId)) {
      return res.status(400).json({
        msg: "Semua menu dalam satu transaksi harus berasal dari stan yang sama",
      });
    }

    const now = new Date();
    let grandTotal = 0;

    const menuMap = new Map(menus.map((m) => [m.id, m]));

    const detailData = menuIds.map((id_menu) => {
      const menu = menuMap.get(id_menu)!;
      const qty = merged.get(id_menu)!;

      const diskonAktif = menu.menu_diskon
        .filter(
          (md) =>
            now >= md.diskon.tanggal_awal && now <= md.diskon.tanggal_akhir,
        )
        .sort(
          (a, b) => b.diskon.persentase_diskon - a.diskon.persentase_diskon,
        );

      const persenDiskon = diskonAktif[0]?.diskon.persentase_diskon ?? 0;

      const hargaAsli = menu.harga;
      const hargaSetelahDiskon =
        persenDiskon > 0
          ? hargaAsli - hargaAsli * (persenDiskon / 100)
          : hargaAsli;

      grandTotal += hargaSetelahDiskon * qty;

      return {
        id_menu: menu.id,
        qty,
        harga_beli: hargaSetelahDiskon, // Float sesuai schema
      };
    });

    const transaksi = await prisma.$transaction(async (tx) => {
      const header = await tx.transaksi.create({
        data: {
          tanggal: new Date(),
          id_stan: firstStanId,
          id_siswa: siswa.id,
          status: StatusTransaksi.belum_dikonfirm,
        },
      });

      await tx.detail_transaksi.createMany({
        data: detailData.map((d) => ({ ...d, id_transaksi: header.id })),
      });

      return header;
    });

    return res.status(201).json({
      msg: "Transaksi berhasil dibuat",
      transaksi,
      total: grandTotal,
      detail: detailData,
    });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ error: err.message || "Server error" });
  }
};

export const HistoriPesananBulananSiswa = async (
  req: Request,
  res: Response,
) => {
  try {
    const id_user = (req as any).user?.id;
    if (!id_user) return res.status(401).json({ msg: "Unauthorized" });

    const siswa = await prisma.siswa.findFirst({ where: { id_user } });
    if (!siswa)
      return res.status(403).json({ msg: "Data siswa tidak ditemukan" });

    const month = Number(req.query.month);
    const year = Number(req.query.year);

    if (!Number.isInteger(month) || month < 1 || month > 12) {
      return res.status(400).json({ msg: "Query month wajib 1-12" });
    }
    if (!Number.isInteger(year) || year < 2000 || year > 2100) {
      return res
        .status(400)
        .json({ msg: "Query year wajib format 4 digit (mis. 2026)" });
    }

    // Range tanggal: awal bulan -> awal bulan berikutnya
    const start = new Date(year, month - 1, 1, 0, 0, 0);
    const end = new Date(year, month, 1, 0, 0, 0);

    const transaksiList = await prisma.transaksi.findMany({
      where: {
        id_siswa: siswa.id,
        tanggal: { gte: start, lt: end },
      },
      orderBy: { tanggal: "desc" },
      include: {
        stan: { select: { id: true, nama_stan: true } },
        detail_transaksi: {
          include: {
            menu: {
              select: {
                id: true,
                nama_makanan: true,
                jenis: true,
                foto: true,
                deskripsi: true,
              },
            },
          },
        },
      },
    });

    // Hitung total per transaksi dan total sebulan
    const data = transaksiList.map((t) => {
      const total = t.detail_transaksi.reduce(
        (sum, d) => sum + d.qty * d.harga_beli,
        0,
      );
      return { ...t, total };
    });

    const totalBulanIni = data.reduce((sum, t) => sum + t.total, 0);

    return res.json({
      month,
      year,
      count: data.length,
      totalBulanIni,
      transaksi: data,
    });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ error: err.message || "Server error" });
  }
};

export const PemasukanAdmin = async (req: Request, res: Response) => {
  try {
    const id_user = (req as any).user?.id;
    const role = (req as any).user?.role;

    if (!id_user) return res.status(401).json({ msg: "Unauthorized" });
    if (role !== "admin_stan") {
      return res.status(403).json({ msg: "Akses ditolak, hanya admin stan" });
    }

    // Cari stan milik admin
    const stan = await prisma.stan.findFirst({ where: { id_user } });
    if (!stan) return res.status(404).json({ msg: "Stan tidak ditemukan" });

    const month = Number(req.query.month);
    const year = Number(req.query.year);

    if (!Number.isInteger(month) || month < 1 || month > 12) {
      return res.status(400).json({ msg: "Query month wajib 1-12" });
    }
    if (!Number.isInteger(year) || year < 2000 || year > 2100) {
      return res.status(400).json({ msg: "Query year wajib format 4 digit" });
    }

    // optional filter status
    const statusQ = req.query.status as string | undefined;
    const statusFilter = statusQ ? (statusQ as StatusTransaksi) : undefined;

    const start = new Date(year, month - 1, 1, 0, 0, 0);
    const end = new Date(year, month, 1, 0, 0, 0);

    const transaksiList = await prisma.transaksi.findMany({
      where: {
        id_stan: stan.id,
        tanggal: { gte: start, lt: end },
        ...(statusFilter ? { status: statusFilter } : {}),
      },
      orderBy: { tanggal: "desc" },
      include: {
        siswa: { select: { id: true, nama_siswa: true } },
        detail_transaksi: {
          include: {
            menu: { select: { id: true, nama_makanan: true } },
          },
        },
      },
    });

    const transaksiDenganTotal = transaksiList.map((t) => {
      const total = t.detail_transaksi.reduce(
        (sum, d) => sum + d.qty * d.harga_beli,
        0,
      );
      return { ...t, total };
    });

    const pemasukanBulanIni = transaksiDenganTotal.reduce(
      (sum, t) => sum + t.total,
      0,
    );

    return res.json({
      stan: { id: stan.id, nama_stan: stan.nama_stan },
      month,
      year,
      filter: { status: statusFilter ?? "all" },
      jumlahTransaksi: transaksiDenganTotal.length,
      pemasukanBulanIni,
      transaksi: transaksiDenganTotal,
    });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ error: err.message || "Server error" });
  }
};

export const HistoriAdmin = async (req: Request, res: Response) => {
  try {
    const id_user = (req as any).user?.id;
    const role = (req as any).user?.role;

    if (!id_user) return res.status(401).json({ msg: "Unauthorized" });
    if (role !== "admin_stan") {
      return res.status(403).json({ msg: "Akses ditolak, hanya admin stan" });
    }

    // ambil stan milik admin
    const stan = await prisma.stan.findFirst({ where: { id_user } });
    if (!stan) return res.status(404).json({ msg: "Stan tidak ditemukan" });

    const month = Number(req.query.month);
    const year = Number(req.query.year);

    if (!Number.isInteger(month) || month < 1 || month > 12) {
      return res.status(400).json({ msg: "Query month wajib 1-12" });
    }
    if (!Number.isInteger(year) || year < 2000 || year > 2100) {
      return res.status(400).json({ msg: "Query year wajib format 4 digit" });
    }

    // optional filter status
    const statusQ = req.query.status as string | undefined;
    const statusFilter = statusQ ? (statusQ as StatusTransaksi) : undefined;

    const start = new Date(year, month - 1, 1, 0, 0, 0);
    const end = new Date(year, month, 1, 0, 0, 0);

    const transaksiList = await prisma.transaksi.findMany({
      where: {
        id_stan: stan.id,
        tanggal: { gte: start, lt: end },
        ...(statusFilter ? { status: statusFilter } : {}),
      },
      orderBy: { tanggal: "desc" },
      include: {
        siswa: { select: { id: true, nama_siswa: true, telp: true } },
        detail_transaksi: {
          include: {
            menu: {
              select: { id: true, nama_makanan: true, jenis: true, foto: true },
            },
          },
        },
      },
    });

    // hitung total per transaksi + total bulan ini
    const data = transaksiList.map((t) => {
      const total = t.detail_transaksi.reduce(
        (sum, d) => sum + d.qty * d.harga_beli,
        0,
      );
      const itemsCount = t.detail_transaksi.reduce((sum, d) => sum + d.qty, 0);
      return { ...t, total, itemsCount };
    });

    const totalBulanIni = data.reduce((sum, t) => sum + t.total, 0);

    return res.json({
      stan: { id: stan.id, nama_stan: stan.nama_stan },
      month,
      year,
      filter: { status: statusFilter ?? "all" },
      jumlahTransaksi: data.length,
      totalBulanIni,
      transaksi: data,
    });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ error: err.message || "Server error" });
  }
};

export const updateStatusTransaksi = async (req: Request, res: Response) => {
  try {
    const id_user = (req as any).user?.id;
    if (!id_user) {
      return res.status(401).json({ msg: "Unauthorized" });
    }

    const id_transaksi = Number(req.params.id);
    if (isNaN(id_transaksi)) {
      return res.status(400).json({ msg: "ID transaksi tidak valid" });
    }

    const { status } = req.body as { status?: StatusTransaksi };

    if (!status) {
      return res.status(400).json({ msg: "Status wajib diisi" });
    }

    // Validasi enum
    if (!Object.values(StatusTransaksi).includes(status)) {
      return res.status(400).json({
        msg: `Status tidak valid. Pilihan: ${Object.values(StatusTransaksi).join(", ")}`,
      });
    }

    // Cari stan milik admin ini
    const stan = await prisma.stan.findFirst({
      where: { id_user },
    });

    if (!stan) {
      return res.status(403).json({ msg: "Stan tidak ditemukan" });
    }

    // Cari transaksi
    const transaksi = await prisma.transaksi.findUnique({
      where: { id: id_transaksi },
    });

    if (!transaksi) {
      return res.status(404).json({ msg: "Transaksi tidak ditemukan" });
    }

    // Pastikan transaksi milik stan ini
    if (transaksi.id_stan !== stan.id) {
      return res.status(403).json({
        msg: "Anda tidak berhak mengubah transaksi ini",
      });
    }

    // OPTIONAL: validasi alur status (biar tidak lompat)
    const statusOrder = [
      StatusTransaksi.belum_dikonfirm,
      StatusTransaksi.dimasak,
      StatusTransaksi.diantar,
      StatusTransaksi.sampai,
    ];

    const currentIndex = statusOrder.indexOf(transaksi.status);
    const nextIndex = statusOrder.indexOf(status);

    if (nextIndex < currentIndex) {
      return res.status(400).json({
        msg: `Tidak boleh mengubah status mundur dari ${transaksi.status} ke ${status}`,
      });
    }

    const updated = await prisma.transaksi.update({
      where: { id: id_transaksi },
      data: { status },
    });

    return res.json({
      msg: "Status transaksi berhasil diubah",
      transaksi: updated,
    });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ error: err.message || "Server error" });
  }
};