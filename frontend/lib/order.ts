
export type CartItem = {
  id_menu: number;
  nama_makanan: string;
  harga: number;
  qty: number;
  raw?: any; 
};

function pickStanId(item: CartItem): number {
  const r = item.raw ?? {};
  const id = Number(r.id_stan ?? r.idStan ?? r.stan_id ?? r.id_kantin ?? 0);
  if (!id) throw new Error(`id_stan tidak ditemukan untuk menu: ${item.nama_makanan}`);
  return id;
}

export async function checkoutCart(items: CartItem[]) {
  if (!items.length) throw new Error("Keranjang kosong.");

  // ✅ group per stan
  const grouped: Record<number, { id_menu: number; qty: number }[]> = {};
  for (const it of items) {
    const id_stan = pickStanId(it);
    grouped[id_stan] ||= [];
    grouped[id_stan].push({ id_menu: it.id_menu, qty: it.qty });
  }

  // ✅ kirim per stan ke proxy transaksi
  for (const idStanStr of Object.keys(grouped)) {
    const id_stan = Number(idStanStr);

    const payload = {
      id_stan,
      items: grouped[id_stan], // ⚠️ sesuaikan kalau backend kamu pakai "pesan" bukan "items"
    };

    const res = await fetch("/api/transaksi", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json().catch(() => ({} as any));
    if (!res.ok) {
      throw new Error(data?.msg || data?.message || "Gagal membuat transaksi.");
    }
  }

  return true;
}
