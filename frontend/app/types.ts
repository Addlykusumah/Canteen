// app/types.ts
// Frontend types for Next.js (App Router) based on your Prisma schema + API responses.

export type UserRole = "admin_stan" | "siswa";

export type StatusTransaksi =
  | "belum_dikonfirm"
  | "dimasak"
  | "diantar"
  | "sampai";

export type JenisMenu = "makanan" | "minuman";

// =======================
// BASE ENTITIES
// =======================

export interface User {
  id: number;
  username: string;
  role: UserRole;
}

export interface Siswa {
  id: number;
  nama_siswa: string;
  alamat?: string | null;
  telp?: string | null;
  foto?: string | null;
  id_user?: number; // optional (kadang tidak dikirim oleh API)
}

export interface Stan {
  id: number;
  nama_stan: string;
  nama_pemilik: string;
  telp?: string | null;
  foto?: string | null;
  id_user?: number; // optional (kadang tidak dikirim oleh API)
}

export interface Menu {
  id: number;
  nama_makanan: string;
  harga: number;
  jenis: JenisMenu;
  foto?: string | null;
  deskripsi?: string | null;
  id_stan?: number; // optional
}

export interface MenuByStanResponse {
  success: boolean;
  stan: Pick<Stan, "id" | "nama_stan" | "foto">;
  menu: Menu[];
}

// =======================
// MENU LIST (/menu)
// =======================

export type MenuRow = {
  id: number
  nama_makanan: string
  harga: number
  jenis: "makanan" | "minuman"
  foto: string | null
  deskripsi: string | null
  id_stan: number
  stan?: {
    id: number
    nama_stan: string
    foto: string | null
  }
}







export interface StanMini {
  id: number;
  nama_stan: string;
  foto: string | null;
}
export interface MenuWithStan {
  id: number
  nama_makanan: string
  harga: number
  jenis: 'makanan' | 'minuman'
  foto: string | null
  deskripsi: string | null
  id_stan: number
  stan: StanMini
}

export interface MenuListResponse {
  success: boolean
  data: MenuWithStan[]
}

export interface Diskon {
  id: number;
  nama_diskon: string;
  persentase_diskon: number;
  tanggal_awal: string; // ISO string
  tanggal_akhir: string; // ISO string
}

// Pivot info (kalau suatu saat kamu tampilkan relasi diskon di UI)
export interface MenuDiskon {
  id: number;
  id_menu: number;
  id_diskon: number;
  menu?: Menu;
  diskon?: Diskon;
}

// =======================
// TRANSAKSI / ORDER
// =======================

export interface DetailTransaksi {
  id?: number;
  id_transaksi?: number;
  id_menu: number;
  qty: number;
  harga_beli: number; // harga per 1 item (setelah diskon)
  menu?: Pick<Menu, "id" | "nama_makanan" | "jenis" | "foto" | "deskripsi">;
}

export interface Transaksi {
  id: number;
  tanggal: string; // ISO string
  id_stan?: number;
  id_siswa?: number;
  status: StatusTransaksi;

  // biasanya dihitung dari backend untuk histori/admin
  total?: number;
  itemsCount?: number;

  detail_transaksi: DetailTransaksi[];

  // kadang disertakan pada histori
  siswa?: Pick<Siswa, "id" | "nama_siswa" | "telp">;
  stan?: Pick<Stan, "id" | "nama_stan">;
}

// =======================
// REQUEST BODY TYPES
// =======================

// request create transaksi siswa
export interface CreateTransaksiRequest {
  items: Array<{
    id_menu: number;
    qty: number;
  }>;
}

// request histori bulanan (kalau pakai query tetap, ini opsional)
export interface HistoriQuery {
  month: number; // 1-12
  year: number; // 4 digit
  status?: StatusTransaksi; // optional filter
}

// =======================
// API RESPONSE TYPES
// =======================

export interface ApiErrorResponse {
  msg?: string;
  error?: string;
  status?: boolean;
}

export interface LoginResponse {
  msg: string;
  token: string;
}

export interface ProfileSiswaResponse {
  msg: string;
  user: User;
  siswa: Siswa;
}

export interface UpdateSiswaResponse {
  msg: string;
  siswa: Siswa;
}

export interface ProfileStanResponse {
  msg: string;
  stan: Stan;
}

export interface UpdateStanResponse {
  msg: string;
  stan: Stan;
}

export interface CreateTransaksiResponse {
  msg: string;
  transaksi: {
    id: number;
    tanggal: string;
    id_stan: number;
    id_siswa: number;
    status: StatusTransaksi;
  };
  total: number;
  detail: Array<{
    id_menu: number;
    qty: number;
    harga_beli: number;
  }>;
}

// histori siswa per bulan
export interface HistoriSiswaResponse {
  month: number;
  year: number;
  count: number;
  totalBulanIni?: number;
  transaksi: Transaksi[];
}

// histori order admin stan per bulan
export interface HistoriAdminResponse {
  stan: Pick<Stan, "id" | "nama_stan">;
  month: number;
  year: number;
  filter?: { status: StatusTransaksi | "all" };
  jumlahTransaksi: number;
  totalBulanIni: number;
  transaksi: Transaksi[];
}

// pemasukan admin stan per bulan (kalau kamu pakai endpoint pemasukan)
export interface PemasukanAdminResponse {
  stan: Pick<Stan, "id" | "nama_stan">;
  month: number;
  year: number;
  filter?: { status: StatusTransaksi | "all" };
  jumlahTransaksi: number;
  pemasukanBulanIni: number;
  transaksi: Transaksi[];
}

// =======================
// FRONTEND ONLY (STATE)
// =======================

export interface CartItem {
  id_menu: number;
  nama_makanan: string;
  harga: number;
  qty: number;
  foto?: string | null;
  jenis?: JenisMenu;
}

export interface AuthUser {
  token: string;
  user: UserRole;
}
