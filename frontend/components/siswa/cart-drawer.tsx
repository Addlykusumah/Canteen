"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCart } from "@/components/siswa/cart-provider";
import { checkoutCart } from "@/lib/order";
import { useMemo, useState } from "react";

function formatRupiah(n: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(n);
}

export default function CartDrawer() {
  const router = useRouter();
  const { isOpen, close, items, inc, dec, remove, reset, totalPrice } = useCart();
  const [loading, setLoading] = useState(false);

  const totalQty = useMemo(() => items.reduce((a, b) => a + (b.qty ?? 0), 0), [items]);

  async function onCheckout() {
    if (items.length === 0) return;

    setLoading(true);
    try {
      await checkoutCart(items);
      reset();
      close();
      alert("Pesanan tersimpan (demo). Menunggu API backend.");
      router.push("/siswa/dashboard/pesanan");
    } catch (e: any) {
      alert(e?.message ?? "Checkout gagal");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className={[
          "fixed inset-0 z-40 bg-white/40 backdrop-blur-[2px] transition-opacity duration-300",
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none",
        ].join(" ")}
        onClick={close}
      />

      {/* Drawer */}
      <aside
        className={[
          "fixed right-0 top-0 z-50 h-full w-full max-w-md bg-white shadow-2xl",
          "transition-transform duration-300 ease-out",
          "rounded-l-3xl border-l border-slate-200/70",
          isOpen ? "translate-x-0" : "translate-x-full",
        ].join(" ")}
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white/90 backdrop-blur border-b border-slate-100 px-5 py-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <div className="text-sm font-extrabold text-red-600">Keranjang</div>
                <span className="inline-flex items-center rounded-full bg-red-600 px-2 py-0.5 text-[11px] font-extrabold text-white">
                  {totalQty} item
                </span>
              </div>
              <div className="mt-0.5 text-xs text-slate-500">
                Cek pesananmu, atur jumlah, lalu checkout.
              </div>
            </div>

            <div className="flex items-center gap-2">
              {items.length > 0 && (
                <button
                  onClick={reset}
                  className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-extrabold text-slate-700 hover:bg-slate-50"
                >
                  Kosongkan
                </button>
              )}
              <button
                onClick={close}
                className="rounded-xl bg-red-600 px-3 py-2 text-xs font-extrabold text-white hover:bg-slate-800"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="h-[calc(100%-168px)] overflow-auto px-5 py-4">
          {items.length === 0 ? (
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
              <div className="flex items-center gap-3">
                <div className="grid h-11 w-11 place-items-center rounded-2xl bg-white border border-slate-200">
                  <span className="text-lg">🛒</span>
                </div>
                <div>
                  <div className="text-sm font-extrabold text-red-600">Keranjang kosong</div>
                  <div className="text-xs text-slate-600">
                    Klik “Pesan” pada menu untuk menambah.
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  close();
                  router.push("/siswa/dashboard/menu");
                }}
                className="mt-4 w-full rounded-2xl bg-red-600 px-4 py-3 text-sm font-extrabold text-white hover:bg-slate-800"
              >
                Lanjut Belanja
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {items.map((it) => (
                <div
                  key={it.id_menu}
                  className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm"
                >
                  <div className="flex gap-3">
                    <div className="relative h-14 w-14 overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
                      {it.fotoUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={it.fotoUrl} alt={it.nama_makanan} className="h-full w-full object-cover" />
                      ) : (
                        <Image
                          src="/image/mage.png"
                          alt="placeholder"
                          fill
                          className="object-contain p-2 opacity-40"
                        />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="truncate text-sm font-extrabold text-slate-900">
                            {it.nama_makanan}
                          </div>
                          <div className="truncate text-xs text-slate-500">
                            {it.stanName ?? "—"}
                          </div>
                        </div>

                        <button
                          onClick={() => remove(it.id_menu)}
                          className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-[11px] font-extrabold text-rose-700 hover:bg-rose-100"
                        >
                          Hapus
                        </button>
                      </div>

                      <div className="mt-2 flex items-center justify-between">
                        <div className="text-sm font-extrabold text-slate-900">
                          {formatRupiah(Number(it.harga))}
                        </div>

                        {/* Qty Control */}
                        <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-2 py-1">
                          <button
                            onClick={() => dec(it.id_menu)}
                            className="grid h-9 w-9 place-items-center rounded-xl bg-white border border-slate-200 text-slate-800 hover:bg-slate-50"
                            aria-label="Kurangi"
                          >
                            <span className="text-lg font-extrabold leading-none">−</span>
                          </button>

                          <div className="w-10 text-center text-sm font-extrabold text-slate-900">
                            {it.qty}
                          </div>

                          <button
                            onClick={() => inc(it.id_menu)}
                            className="grid h-9 w-9 place-items-center rounded-xl bg-white border border-slate-200 text-slate-800 hover:bg-slate-50"
                            aria-label="Tambah"
                          >
                            <span className="text-lg font-extrabold leading-none">+</span>
                          </button>
                        </div>
                      </div>

                      <div className="mt-3 flex items-center justify-between rounded-2xl bg-slate-50 px-3 py-2">
                        <div className="text-xs font-bold text-slate-500">Subtotal</div>
                        <div className="text-sm font-extrabold text-slate-900">
                          {formatRupiah(Number(it.harga) * it.qty)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              <div className="h-2" />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 border-t border-slate-100 bg-white/90 backdrop-blur px-5 py-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-slate-500">Total</div>
              <div className="text-lg font-extrabold text-slate-900">{formatRupiah(totalPrice)}</div>
            </div>

            <div className="text-right">
              <div className="text-[11px] text-slate-500">
                {items.length > 0 ? "Siap checkout?" : "Tambah menu dulu"}
              </div>
            </div>
          </div>

          <button
            disabled={loading || items.length === 0}
            onClick={onCheckout}
            className={[
              "mt-3 w-full rounded-2xl px-5 py-3 text-sm font-extrabold text-white",
              "transition-all duration-200",
              "bg-linear-to-r from-red-500 to-rose-600 hover:from-red-500 hover:to-rose-500",
              "disabled:opacity-60 disabled:cursor-not-allowed",
            ].join(" ")}
          >
            {loading ? "Memproses..." : "Checkout"}
          </button>

          <button
            onClick={() => {
              close();
              router.push("/siswa/dashboard/menu");
            }}
            className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-extrabold text-slate-800 hover:bg-slate-50"
          >
            Lanjut Belanja
          </button>
        </div>
      </aside>
    </>
  );
}
