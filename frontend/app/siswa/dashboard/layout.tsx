import { CartProvider } from "@/components/siswa/cart-provider";
import CartDrawer from "@/components/siswa/cart-drawer";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      {children}
      <CartDrawer />
    </CartProvider>
  );
}
