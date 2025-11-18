import multer, { StorageEngine } from "multer";
import { Request } from "express";


const storage: StorageEngine = multer.diskStorage({
  destination: (req: Request, file: Express.Multer.File, cb) => {
    cb(null, "uploads/siswa");
  },
  filename: (req: Request, file: Express.Multer.File, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, unique + "-" + file.originalname);
  }
});

export const upload = multer({ storage });
