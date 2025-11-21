import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { Request, Response } from "express";

const prisma = new PrismaClient();

export const registerSiswa = async (req: Request, res: Response): Promise<void> => {
  try {
    const { nama_siswa, alamat, telp, username, password } = req.body;

    
    const exist = await prisma.users.findUnique({ where: { username } });
    if (exist) {
      res.status(400).json({ msg: "Username sudah digunakan" });
      return;
    }


    const hashed = await bcrypt.hash(password, 10);

 
    const user = await prisma.users.create({
      data: {
        username,
        password: hashed,
        role: "siswa"
      }
    });

    
    const foto = req.file?.filename || null;


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


export const registerStan = async (req: Request, res: Response) => {
  try {
    // makerId dikirim di header (opsional)
    const makerId = req.headers["makerid"] || req.headers["maker-id"] || null;

    // form-data fields (multer.none() memindahkan ke req.body)
    const { nama_stan, nama_pemilik, telp, username, password } = req.body;

    // simple validation
    if (!nama_stan || !nama_pemilik || !username || !password) {
      return res.status(400).json({
        error: "Field nama_stan, nama_pemilik, username, dan password wajib diisi",
      });
    }

    // cek username unik
    const existingUser = await prisma.users.findUnique({
      where: { username },
    });
    if (existingUser) {
      return res.status(409).json({ error: "Username sudah terpakai" });
    }

    // hash password
    const hashed = await bcrypt.hash(password, 10);

    // create user dengan role admin_stan
    const user = await prisma.users.create({
      data: {
        username,
        password: hashed,
        role: "admin_stan", // enum UserRole
      },
    });

    // create stan terkait
    const stan = await prisma.stan.create({
      data: {
        nama_stan,
        nama_pemilik,
        telp: telp || null,
        id_user: user.id,
      },
    });

    // response (jangan kirim password)
    return res.status(201).json({
      message: "Register stan berhasil",
      maker_id: makerId,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
      },
      stan: {
        id: stan.id,
        nama_stan: stan.nama_stan,
        nama_pemilik: stan.nama_pemilik,
        telp: stan.telp,
        id_user: stan.id_user,
      },
    });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ error: err.message || "Server error" });
  }
};
