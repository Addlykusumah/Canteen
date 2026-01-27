import { Request, Response, NextFunction } from "express";
import Joi from "joi";

const usernamePattern = /^[a-zA-Z0-9_]{3,30}$/; // huruf, angka, underscore, 3-30 karakter
const phonePattern = /^[0-9]{10,15}$/;

const addUserSchema = Joi.object({
  username: Joi.string().trim().pattern(usernamePattern).required().messages({
    "string.empty": "Username tidak boleh kosong",
    "string.pattern.base":
      "Username hanya boleh berisi huruf, angka, dan underscore (3-30 karakter)",
    "any.required": "Username wajib diisi",
  }),

  password: Joi.string().min(3).required().messages({
    "string.empty": "Password tidak boleh kosong",
    "string.min": "Password minimal 3 karakter",
    "any.required": "Password wajib diisi",
  }),

  role: Joi.string().valid("admin_stan", "siswa").required().messages({
    "any.only": 'Role hanya boleh "admin_stan" atau "siswa"',
    "any.required": "Role wajib diisi",
  }),

  // ini bisa dipetakan ke nama_siswa / nama_pemilik di controller
  name: Joi.string().trim().required().messages({
    "string.empty": "Nama tidak boleh kosong",
    "any.required": "Nama wajib diisi",
  }),

  phone: Joi.string()
    .pattern(phonePattern)
    .allow(null, "")
    .optional()
    .messages({
      "string.pattern.base": "Nomor telepon harus 10-15 digit angka",
    }),

  // biasanya ini nama file (string) dari multer, atau bisa diabaikan
  profile_picture: Joi.any().optional(),
});

// EDIT USER (boleh kirim sebagian field saja)
const editUserSchema = Joi.object({
  username: Joi.string().trim().pattern(usernamePattern).optional().messages({
    "string.pattern.base":
      "Username hanya boleh berisi huruf, angka, dan underscore (3-30 karakter)",
  }),

  password: Joi.string().min(3).optional().messages({
    "string.min": "Password minimal 3 karakter",
  }),

  role: Joi.string().valid("admin_stan", "siswa").optional().messages({
    "any.only": 'Role hanya boleh "admin_stan" atau "siswa"',
  }),

  name: Joi.string().trim().optional(),

  phone: Joi.string()
    .pattern(phonePattern)
    .allow(null, "")
    .optional()
    .messages({
      "string.pattern.base": "Nomor telepon harus 10-15 digit angka",
    }),

  profile_picture: Joi.any().optional(),
})
  // pastikan ada minimal 1 field yang diubah
  .min(1)
  .messages({
    "object.min": "Minimal satu field harus diisi untuk update user",
  });

// LOGIN
const authSchema = Joi.object({
  username: Joi.string().trim().pattern(usernamePattern).required().messages({
    "string.empty": "Username tidak boleh kosong",
    "string.pattern.base":
      "Username hanya boleh berisi huruf, angka, dan underscore (3-30 karakter)",
    "any.required": "Username wajib diisi",
  }),

  password: Joi.string().min(3).required().messages({
    "string.empty": "Password tidak boleh kosong",
    "string.min": "Password minimal 3 karakter",
    "any.required": "Password wajib diisi",
  }),
});

// =========================
// SCHEMA KHUSUS REGISTER SISWA & STAN
// =========================

// registerSiswa: nama_siswa, alamat, telp, username, password
const registerSiswaSchema = Joi.object({
  nama_siswa: Joi.string().trim().required().messages({
    "string.empty": "nama_siswa tidak boleh kosong",
    "any.required": "nama_siswa wajib diisi",
  }),
  alamat: Joi.string().allow(null, "").optional(),
  telp: Joi.string().pattern(phonePattern).allow(null, "").optional().messages({
    "string.pattern.base": "Nomor telepon harus 10-15 digit angka",
  }),
  username: Joi.string().trim().pattern(usernamePattern).required().messages({
    "string.empty": "Username tidak boleh kosong",
    "string.pattern.base":
      "Username hanya boleh berisi huruf, angka, dan underscore (3-30 karakter)",
    "any.required": "Username wajib diisi",
  }),
  password: Joi.string().min(3).required().messages({
    "string.empty": "Password tidak boleh kosong",
    "string.min": "Password minimal 3 karakter",
    "any.required": "Password wajib diisi",
  }),
});

// registerStan: nama_stan, nama_pemilik, telp, username, password
const registerStanSchema = Joi.object({
  nama_stan: Joi.string().trim().required().messages({
    "string.empty": "nama_stan tidak boleh kosong",
    "any.required": "nama_stan wajib diisi",
  }),
  nama_pemilik: Joi.string().trim().required().messages({
    "string.empty": "nama_pemilik tidak boleh kosong",
    "any.required": "nama_pemilik wajib diisi",
  }),
  telp: Joi.string().pattern(phonePattern).allow(null, "").optional().messages({
    "string.pattern.base": "Nomor telepon harus 10-15 digit angka",
  }),
  username: Joi.string().trim().pattern(usernamePattern).required().messages({
    "string.empty": "Username tidak boleh kosong",
    "string.pattern.base":
      "Username hanya boleh berisi huruf, angka, dan underscore (3-30 karakter)",
    "any.required": "Username wajib diisi",
  }),
  password: Joi.string().min(3).required().messages({
    "string.empty": "Password tidak boleh kosong",
    "string.min": "Password minimal 3 karakter",
    "any.required": "Password wajib diisi",
  }),
});

// =========================
// MIDDLEWARE
// =========================

export const verifyAddUser = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { error } = addUserSchema.validate(req.body, {
    abortEarly: false,
    allowUnknown: true,
  });

  if (error) {
    return res.status(400).json({
      status: false,
      msg: error.details.map((it) => it.message).join(", "),
    });
  }
  next();
};

export const verifyEditUser = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { error } = editUserSchema.validate(req.body, {
    abortEarly: false,
    allowUnknown: true,
  });

  if (error) {
    return res.status(400).json({
      status: false,
      msg: error.details.map((it) => it.message).join(", "),
    });
  }
  next();
};

export const verifyAuthentication = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { error } = authSchema.validate(req.body, {
    abortEarly: false,
    allowUnknown: true,
  });

  if (error) {
    return res.status(400).json({
      status: false,
      msg: error.details.map((it) => it.message).join(", "),
    });
  }
  next();
};

// khusus untuk route /register_siswa
export const verifyRegisterSiswa = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { error } = registerSiswaSchema.validate(req.body, {
    abortEarly: false,
    allowUnknown: true, // supaya nggak konflik sama field dari multer
  });

  if (error) {
    return res.status(400).json({
      status: false,
      msg: error.details.map((it) => it.message).join(", "),
    });
  }
  next();
};

// khusus untuk route /register_stan
export const verifyRegisterStan = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { error } = registerStanSchema.validate(req.body, {
    abortEarly: false,
    allowUnknown: true,
  });

  if (error) {
    return res.status(400).json({
      status: false,
      msg: error.details.map((it) => it.message).join(", "),
    });
  }
  next();
};
