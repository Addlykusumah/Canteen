import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import PDFDocument from "pdfkit";

const prisma = new PrismaClient();



export const getNotaTransaksi = async (req: Request, res: Response) => {
  try {
    const id_transaksi = Number(req.params.id);
    const id_user = (req as any).user?.id;
    const isPdf = req.query.pdf === "true";

    if (!id_user)
      return res.status(401).json({ status: false, msg: "Unauthorized" });

    const siswa = await prisma.siswa.findFirst({ where: { id_user } });
    if (!siswa)
      return res
        .status(403)
        .json({
          status: false,
          msg: "Hanya siswa yang dapat melihat nota transaksi",
        });

    const trx = await prisma.transaksi.findFirst({
      where: { id: id_transaksi, id_siswa: siswa.id },
      include: {
        siswa: true,
        stan: true,
        detail_transaksi: {
          include: { menu: true },
        },
      },
    });

    if (!trx)
      return res
        .status(404)
        .json({ status: false, msg: "Transaksi tidak ditemukan" });

    const detail = trx.detail_transaksi.map((d) => ({
      nama: d.menu.nama_makanan,
      qty: d.qty,
      harga: d.harga_beli,
      subtotal: d.qty * d.harga_beli,
    }));

    const total = detail.reduce((sum, d) => sum + d.subtotal, 0);

   if (isPdf) {
  const doc = new PDFDocument({
    size: [226, 600],
    margins: { top: 10, bottom: 10, left: 10, right: 10 },
  });

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    `inline; filename=struk-${trx.id}.pdf`
  );

  doc.pipe(res);

  // HEADER (nama stan)
  doc
    .fontSize(12)
    .text(trx.stan.nama_stan.toUpperCase(), { align: "center" });

  doc.moveDown(0.3);

  // ✅ Ubah tulisan kantin
  doc.fontSize(8).text("Kantin SMK Telkom Malang", { align: "center" });

  doc.moveDown(0.5);

  // GARIS
  doc.text("--------------------------------", { align: "center" });

  // INFO TRANSAKSI
  doc
    .fontSize(8)
    .text(
      `Tanggal : ${trx.tanggal.toLocaleDateString()} ${trx.tanggal.toLocaleTimeString()}`
    );

  doc.text(`Siswa   : ${trx.siswa.nama_siswa}`);
  doc.text(`Status  : ${trx.status}`);

  doc.moveDown(0.5);

  doc.text("--------------------------------", { align: "center" });

  // DETAIL ITEMS
  detail.forEach((item) => {
    doc.fontSize(9).text(item.nama);

    doc
      .fontSize(8)
      .text(
        `${item.qty} x Rp${item.harga.toLocaleString()}   Rp${item.subtotal.toLocaleString()}`
      );

    doc.moveDown(0.2);
  });

  doc.text("--------------------------------", { align: "center" });

  // ✅ Hanya total saja
  doc.fontSize(9).text(`Total : Rp${total.toLocaleString()}`);

  doc.moveDown(0.5);

  doc.text("--------------------------------", { align: "center" });

  doc.moveDown(0.3);

  doc.fontSize(7).text("Terima Kasih telah membeli!", {
    align: "center",
  });

  doc.end();
  return;
}


 
    return res.status(200).json({
      status: true,
      msg: "Nota transaksi berhasil ditampilkan",
      data: {
        id: trx.id,
        tanggal: trx.tanggal,
        siswa: trx.siswa.nama_siswa,
        stan: trx.stan.nama_stan,
        status: trx.status,
        items: detail,
        total,
      },
    });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({
      status: false,
      msg: "Terjadi kesalahan server",
      error: err.message,
    });
  }
};


