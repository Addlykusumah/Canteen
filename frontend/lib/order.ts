import Cookies from "js-cookie";
import { post } from "@/lib/api-bridge";

export type CartItem = {
  id_menu: number;
  nama_makanan: string;
  harga: number;
  qty: number;
  raw?: any;
};

export async function checkoutCart(items: CartItem[]) {
  if (!items.length) throw new Error("Keranjang kosong.");

  const token = Cookies.get("token"); // sesuaikan nama cookie kamu
  if (!token) throw new Error("Token tidak ada. Login dulu.");


  const payload = {
    items: items.map((it) => ({
      id_menu: it.id_menu,
      qty: it.qty,
    })),
  };

  const res = await post("/transaksi", payload, token);

  if (!res.status) {
    throw new Error(res.message);
  }

  return res.data;
}
