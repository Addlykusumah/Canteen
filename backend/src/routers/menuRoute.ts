import express from "express";
import { authMiddleware, onlyAdminStan } from "../middleware/auth";
import { upload } from "../middleware/upload";

import {
  getAllMenu,
  createMenu,
  updateMenu,
  deleteMenu,
  getDetailMenu,
  searchMenu,       
  getAllMenuSiswa,
  getMenuByStanSiswa
} from "../controllers/menuController";

const router = express.Router();

// SHOW menu milik stan
router.post("/menu/show", authMiddleware, onlyAdminStan, getAllMenu);

// DETAIL menu
router.get("/menu/detail/:id", authMiddleware, onlyAdminStan, getDetailMenu);

// TAMBAH menu
router.post("/menu/tambah", authMiddleware, onlyAdminStan, upload.single("foto"), createMenu);

// UPDATE menu
router.put("/menu/update/:id", authMiddleware, onlyAdminStan, upload.single("foto"), updateMenu);

// HAPUS menu
router.delete("/menu/hapus/:id", authMiddleware, onlyAdminStan, deleteMenu);

// SEARCH menu
router.get("/menu/search/:keyword", authMiddleware, onlyAdminStan, searchMenu);

router.get("/menu", getAllMenuSiswa);

router.get("/menu/stan/:id_stan", getMenuByStanSiswa);


export default router;
