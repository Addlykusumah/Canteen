import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { Request, Response } from "express";

const prisma = new PrismaClient();

export const registerSiswa = async (req: Request, res: Response): Promise<void> => {
  try {
    const { nama_siswa, alamat, telp, username, password } = req.body;

    // cek user exist
    const exist = await prisma.users.findUnique({ where: { username } });
    if (exist) {
      res.status(400).json({ msg: "Username sudah digunakan" });
      return;
    }

    // hash password
    const hashed = await bcrypt.hash(password, 10);

    // create user
    const user = await prisma.users.create({
      data: {
        username,
        password: hashed,
        role: "siswa"
      }
    });

    // foto dari multer
    const foto = req.file?.filename || null;

    // create siswa
    const siswa = await prisma.siswa.create({
      data: {
        nama_siswa,
        alamat,
        telp,
        foto,
        id_user: user.id
      }
    });

    res.json({
      msg: "Register siswa berhasil",
      user,
      siswa
    });

  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
