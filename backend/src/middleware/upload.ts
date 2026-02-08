import multer, { StorageEngine } from "multer";
import { Request } from "express";
import path from "path";
import fs from "fs";

const storage: StorageEngine = multer.diskStorage({
  destination: (req: Request, file, cb) => {
    let folder = "public/uploads";

    const url = req.originalUrl || ""; // contoh: /register_stan

    // REGISTER SISWA
    if (url.startsWith("/register_siswa") || url.includes("/siswa")) {
      folder = "public/siswa_picture";
    }
    // REGISTER STAN + PROFILE STAN (kalau nanti ada route stan lain)
    else if (url.startsWith("/register_stan") || url.includes("/stan")) {
      folder = "public/stan_picture";
    }
    // MENU
    else if (url.includes("/menu")) {
      folder = "public/menu_picture";
    }

    fs.mkdirSync(folder, { recursive: true });
    cb(null, folder);
  },

  filename: (req: Request, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, unique + ext);
  },
});

const fileFilter: multer.Options["fileFilter"] = (req, file, cb) => {
  if (!file.mimetype.startsWith("image/")) {
    cb(new Error("File harus berupa gambar"));
    return;
  }
  cb(null, true);
};

export const upload = multer({
  storage,
  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB
  },
  fileFilter,
});
