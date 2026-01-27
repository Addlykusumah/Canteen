import multer, { StorageEngine } from "multer";
import { Request } from "express";
import path from "path";
import fs from "fs";

const storage: StorageEngine = multer.diskStorage({
  destination: (req: Request, file, cb) => {
    // tentukan folder berdasarkan route
    let folder = "public/uploads";

    if (req.baseUrl.includes("/siswa")) {
      folder = "public/siswa_picture";
    } else if (req.baseUrl.includes("/admin/stan")) {
      folder = "public/stan_picture";
    } else if (req.baseUrl.includes("/menu")) {
      folder = "public/menu_picture";
    }

    // pastikan folder ada
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
