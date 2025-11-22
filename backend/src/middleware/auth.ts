import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

/**
 * Middleware autentikasi token
 * Memastikan request memiliki token JWT yang valid
 */
export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ msg: "Authorization header diperlukan" });
  }

  // Format: Bearer <token>
  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ msg: "Token tidak ditemukan" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    (req as any).user = decoded; // simpan payload di request
    next();
  } catch (err) {
    return res.status(401).json({ msg: "Token tidak valid" });
  }
};

/**
 * Middleware untuk membatasi akses hanya admin stan
 */
export const onlyAdminStan = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = (req as any).user;

  if (!user) {
    return res.status(401).json({ msg: "Unauthorized" });
  }

  if (user.role !== "admin_stan") {
    return res.status(403).json({ msg: "Akses ditolak, hanya admin_stan" });
  }

  next();
};
