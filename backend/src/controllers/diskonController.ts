import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

/**
 * POST /diskon/tambah
 * Admin stan menambahkan diskon untuk beberapa menu miliknya.
 *
 * Body (form-data / x-www-form-urlencoded):
 *  - nama_diskon: string
 *  - persentase_diskon: number (misal 10 untuk 10%)
 *  - tanggal_awal: "2025-01-01" atau ISO date
 *  - tanggal_akhir: "2025-01-10"
 *  - menu_ids: bisa:
 *      - "1" (string)
 *      - ["1","2","3"] (
 */
export const tambahDiskon = async (req: Request, res: Response) => {
  try {
    const { nama_diskon, persentase_diskon, tanggal_awal, tanggal_akhir } =
      req.body;

    const id_user = (req as any).user?.id; // dari middleware auth (JWT)
    if (!id_user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Cari stan milik user ini
    const stan = await prisma.stan.findFirst({
      where: { id_user },
    });

    if (!stan) {
      return res
        .status(403)
        .json({ error: "Stan tidak ditemukan untuk user ini" });
    }

    // Ambil dan normalisasi menu_ids
    let menuIdsRaw = (req.body as any).menu_ids;

    // Bisa datang sebagai string tunggal ("1") atau array ["1","2"]
    let menuIds: number[] = [];
    if (Array.isArray(menuIdsRaw)) {
      menuIds = menuIdsRaw
        .map((id: any) => Number(id))
        .filter((n) => !isNaN(n));
    } else if (menuIdsRaw !== undefined) {
      const n = Number(menuIdsRaw);
      if (!isNaN(n)) menuIds = [n];
    }

    if (!menuIds.length) {
      return res.status(400).json({
        error: "menu_ids wajib diisi (minimal 1 id_menu)",
      });
    }

    // Validasi nilai persentase diskon
    const persen = Number(persentase_diskon);
    if (isNaN(persen) || persen <= 0 || persen > 100) {
      return res.status(400).json({
        error: "persentase_diskon harus berupa angka 1-100",
      });
    }

    // Parse tanggal
    const startDate = new Date(tanggal_awal);
    const endDate = new Date(tanggal_akhir);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return res.status(400).json({
        error: "Format tanggal_awal atau tanggal_akhir tidak valid",
      });
    }

    if (endDate < startDate) {
      return res.status(400).json({
        error: "tanggal_akhir tidak boleh lebih awal dari tanggal_awal",
      });
    }

    // Pastikan semua menu yang dipilih memang milik stan ini
    const menus = await prisma.menu.findMany({
      where: {
        id_stan: stan.id,
        id: { in: menuIds },
      },
      select: { id: true, nama_makanan: true },
    });

    if (menus.length !== menuIds.length) {
      return res.status(400).json({
        error: "Terdapat menu yang tidak dimiliki oleh stan ini",
      });
    }

    // Transaction: buat diskon + isi menu_diskon
    const result = await prisma.$transaction(async (tx) => {
      const diskon = await tx.diskon.create({
        data: {
          nama_diskon,
          persentase_diskon: persen,
          tanggal_awal: startDate,
          tanggal_akhir: endDate,
        },
      });

      await tx.menu_diskon.createMany({
        data: menuIds.map((id_menu) => ({
          id_menu,
          id_diskon: diskon.id,
        })),
      });

      return diskon;
    });

    return res.status(201).json({
      msg: "Diskon berhasil ditambah",
      stan: {
        id: stan.id,
        nama_stan: stan.nama_stan,
      },
      diskon: result,
    });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ error: err.message || "Server error" });
  }
};

export const getDiskonByStan = async (req: Request, res: Response) => {
  try {
    const id_user = (req as any).user?.id;
    if (!id_user) return res.status(401).json({ error: "Unauthorized" });

    const stan = await prisma.stan.findFirst({ where: { id_user } });
    if (!stan) return res.status(403).json({ error: "Stan tidak ditemukan" });

    // Cari semua menu milik stan ini
    const menus = await prisma.menu.findMany({
      where: { id_stan: stan.id },
      select: { id: true },
    });

    const menuIds = menus.map((m) => m.id);
    if (!menuIds.length) {
      return res.json([]);
    }

    // Ambil diskon lewat menu_diskon
    const relasi = await prisma.menu_diskon.findMany({
      where: { id_menu: { in: menuIds } },
      include: {
        diskon: true,
        menu: {
          select: { id: true, nama_makanan: true },
        },
      },
    });

    res.json(relasi);
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: err.message || "Server error" });
  }
};

export const updateDiskon = async (req: Request, res: Response) => {
  try {
    const id_diskon = Number(req.params.id);
    if (isNaN(id_diskon)) {
      return res.status(400).json({ error: "ID diskon tidak valid" });
    }

    const id_user = (req as any).user?.id;
    if (!id_user) return res.status(401).json({ error: "Unauthorized" });

    const stan = await prisma.stan.findFirst({ where: { id_user } });
    if (!stan) {
      return res.status(403).json({ error: "Stan tidak ditemukan" });
    }

    // Ambil diskon + relasi ke menu
    const existing = await prisma.diskon.findUnique({
      where: { id: id_diskon },
      include: {
        menu_diskon: {
          include: {
            menu: true,
          },
        },
      },
    });

    if (!existing) {
      return res.status(404).json({ error: "Diskon tidak ditemukan" });
    }

    const menusTerkait = existing.menu_diskon
      .map((md) => md.menu)
      .filter((m): m is NonNullable<typeof m> => !!m);

    const dimilikiStanIni = menusTerkait.some((m) => m.id_stan === stan.id);

    if (!dimilikiStanIni) {
      return res.status(403).json({
        error: "Diskon ini tidak terkait dengan menu milik stan ini",
      });
    }

    const { nama_diskon, persentase_diskon, tanggal_awal, tanggal_akhir } =
      req.body;

    const dataUpdate: any = {};

    if (nama_diskon !== undefined) {
      dataUpdate.nama_diskon = nama_diskon;
    }

    if (persentase_diskon !== undefined) {
      const persen = Number(persentase_diskon);
      if (isNaN(persen) || persen <= 0 || persen > 100) {
        return res.status(400).json({
          error: "persentase_diskon harus berupa angka 1-100",
        });
      }
      dataUpdate.persentase_diskon = persen;
    }

    let startDate = existing.tanggal_awal;
    let endDate = existing.tanggal_akhir;

    if (tanggal_awal !== undefined) {
      const d = new Date(tanggal_awal);
      if (isNaN(d.getTime())) {
        return res.status(400).json({
          error: "Format tanggal_awal tidak valid",
        });
      }
      startDate = d;
      dataUpdate.tanggal_awal = d;
    }

    if (tanggal_akhir !== undefined) {
      const d = new Date(tanggal_akhir);
      if (isNaN(d.getTime())) {
        return res.status(400).json({
          error: "Format tanggal_akhir tidak valid",
        });
      }
      endDate = d;
      dataUpdate.tanggal_akhir = d;
    }

    if (endDate < startDate) {
      return res.status(400).json({
        error: "tanggal_akhir tidak boleh lebih awal dari tanggal_awal",
      });
    }

    if (Object.keys(dataUpdate).length === 0) {
      return res.status(400).json({
        error: "Tidak ada data yang diupdate",
      });
    }

    const updated = await prisma.diskon.update({
      where: { id: id_diskon },
      data: dataUpdate,
    });

    return res.json({
      msg: "Diskon berhasil diupdate",
      diskon: updated,
    });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ error: err.message || "Server error" });
  }
};

export const deleteDiskon = async (req: Request, res: Response) => {
  try {
    const id_diskon = Number(req.params.id);
    if (isNaN(id_diskon)) {
      return res.status(400).json({ error: "ID diskon tidak valid" });
    }

    const id_user = (req as any).user?.id;
    if (!id_user) return res.status(401).json({ error: "Unauthorized" });

    // cari stan milik user ini
    const stan = await prisma.stan.findFirst({
      where: { id_user },
    });

    if (!stan) {
      return res.status(403).json({ error: "Stan tidak ditemukan" });
    }

    const diskon = await prisma.diskon.findUnique({
      where: { id: id_diskon },
      include: {
        menu_diskon: {
          include: { menu: true },
        },
      },
    });

    if (!diskon) {
      return res.status(404).json({ error: "Diskon tidak ditemukan" });
    }

    const relasiMenuStan = diskon.menu_diskon.some(
      (md) => md.menu?.id_stan === stan.id
    );

    if (!relasiMenuStan) {
      return res.status(403).json({
        error: "Anda tidak punya akses untuk menghapus diskon ini",
      });
    }

    await prisma.$transaction(async (tx) => {
      await tx.menu_diskon.deleteMany({
        where: { id_diskon },
      });

      await tx.diskon.delete({
        where: { id: id_diskon },
      });
    });

    return res.json({
      msg: "Diskon berhasil dihapus",
      id_diskon,
    });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
};

export const insertMenuDiskon = async (req: Request, res: Response) => {
  try {
    const id_user = (req as any).user?.id;
    if (!id_user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const stan = await prisma.stan.findFirst({ where: { id_user } });
    if (!stan) {
      return res.status(403).json({ error: "Stan tidak ditemukan" });
    }

    const { id_diskon } = req.body;

    const diskonId = Number(id_diskon);
    if (!id_diskon || isNaN(diskonId)) {
      return res
        .status(400)
        .json({ error: "id_diskon wajib diisi dan harus angka" });
    }

    // id_menu bisa dikirim sekali atau berkali-kali (form-data)
    let idMenuRaw = (req.body as any).id_menu;
    let menuIds: number[] = [];

    if (Array.isArray(idMenuRaw)) {
      menuIds = idMenuRaw.map((v: any) => Number(v)).filter((n) => !isNaN(n));
    } else if (idMenuRaw !== undefined) {
      const n = Number(idMenuRaw);
      if (!isNaN(n)) menuIds = [n];
    }

    if (!menuIds.length) {
      return res.status(400).json({
        error: "id_menu wajib diisi (minimal 1 id_menu)",
      });
    }

    // pastikan diskon ada
    const diskon = await prisma.diskon.findUnique({
      where: { id: diskonId },
    });

    if (!diskon) {
      return res.status(404).json({ error: "Diskon tidak ditemukan" });
    }

    // pastikan semua menu milik stan ini
    const menus = await prisma.menu.findMany({
      where: {
        id: { in: menuIds },
        id_stan: stan.id,
      },
      select: { id: true, nama_makanan: true },
    });

    if (menus.length !== menuIds.length) {
      return res.status(400).json({
        error:
          "Terdapat id_menu yang tidak dimiliki stan ini atau tidak ditemukan",
      });
    }

    // cek yang sudah pernah punya relasi, supaya tidak dobel
    const existingRelations = await prisma.menu_diskon.findMany({
      where: {
        id_diskon: diskonId,
        id_menu: { in: menuIds },
      },
      select: { id_menu: true },
    });

    const alreadyMenuIds = new Set(existingRelations.map((e) => e.id_menu));
    const toInsert = menuIds.filter((id) => !alreadyMenuIds.has(id));

    if (!toInsert.length) {
      return res.status(400).json({
        error: "Semua menu yang dikirim sudah memiliki diskon ini",
      });
    }

    // buat relasi baru
    await prisma.menu_diskon.createMany({
      data: toInsert.map((id_menu) => ({
        id_menu,
        id_diskon: diskonId,
      })),
    });

    return res.status(201).json({
      msg: "Menu diskon berhasil ditambahkan",
      id_diskon: diskonId,
      menu_ids: toInsert,
    });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ error: err.message || "Server error" });
  }
};

export const updateMenuDiskon = async (req: Request, res: Response) => {
  try {
    const pivotId = Number(req.params.id);
    if (isNaN(pivotId)) {
      return res.status(400).json({ error: "ID menu_diskon tidak valid" });
    }

    const id_user = (req as any).user?.id;
    if (!id_user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // cari stan milik user ini
    const stan = await prisma.stan.findFirst({ where: { id_user } });
    if (!stan) {
      return res.status(403).json({ error: "Stan tidak ditemukan" });
    }

    // cari baris menu_diskon yang mau di-update
    const existing = await prisma.menu_diskon.findUnique({
      where: { id: pivotId },
      include: {
        menu: true,
        diskon: true,
      },
    });

    if (!existing) {
      return res
        .status(404)
        .json({ error: "Relasi menu_diskon tidak ditemukan" });
    }

    // pastikan relasi ini memang terkait menu milik stan ini
    if (!existing.menu || existing.menu.id_stan !== stan.id) {
      return res.status(403).json({
        error: "Anda tidak memiliki akses untuk mengubah menu_diskon ini",
      });
    }

    const { id_diskon, id_menu } = req.body;

    if (id_diskon === undefined && id_menu === undefined) {
      return res.status(400).json({
        error: "Minimal salah satu dari id_diskon atau id_menu harus diisi",
      });
    }

    // tentukan nilai final (kalau tidak diisi, pakai nilai lama)
    let newDiskonId = existing.id_diskon;
    let newMenuId = existing.id_menu;

    if (id_diskon !== undefined) {
      const parsed = Number(id_diskon);
      if (isNaN(parsed)) {
        return res.status(400).json({ error: "id_diskon harus berupa angka" });
      }
      newDiskonId = parsed;
    }

    if (id_menu !== undefined) {
      const parsed = Number(id_menu);
      if (isNaN(parsed)) {
        return res.status(400).json({ error: "id_menu harus berupa angka" });
      }
      newMenuId = parsed;
    }

    // pastikan diskon baru ada
    const diskon = await prisma.diskon.findUnique({
      where: { id: newDiskonId },
    });

    if (!diskon) {
      return res.status(404).json({ error: "Diskon baru tidak ditemukan" });
    }

    // pastikan menu baru milik stan ini
    const menuBaru = await prisma.menu.findFirst({
      where: {
        id: newMenuId,
        id_stan: stan.id,
      },
    });

    if (!menuBaru) {
      return res.status(400).json({
        error: "Menu baru tidak ditemukan atau bukan milik stan ini",
      });
    }

    // cek apakah kombinasi (id_menu, id_diskon) sudah ada di baris lain
    const duplicate = await prisma.menu_diskon.findFirst({
      where: {
        id_menu: newMenuId,
        id_diskon: newDiskonId,
        NOT: { id: pivotId },
      },
    });

    if (duplicate) {
      return res.status(400).json({
        error: "Relasi menu dan diskon ini sudah ada",
      });
    }

    // update pivot
    const updated = await prisma.menu_diskon.update({
      where: { id: pivotId },
      data: {
        id_menu: newMenuId,
        id_diskon: newDiskonId,
      },
    });

    return res.json({
      msg: "Menu diskon berhasil diupdate",
      menu_diskon: updated,
    });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ error: err.message || "Server error" });
  }
};
