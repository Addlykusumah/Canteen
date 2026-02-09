"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";

const NAV_LINKS = [
  { label: "Home", href: "/../../admin/dashboard" },
  { label: "Siswa", href: "../../admin/dashboard/siswa" },
  { label: "order", href: "../../admin/dashboard/order" },
  { label: "Diskon", href: "../../admin/dashboard/diskon" },
  { label: "menu", href: "/../../admin/dashboard/menu" },
  { label: "Menu Diskon", href: "/../../admin/dashboard/menu-diskon" },
  { label: "Histori", href: "/../../admin/dashboard/histori" },
  { label: "profil", href: "../../admin/dashboard/profil" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/image/kanan.png"
              alt="Logo"
              width={300}
              height={300}
              className="h-36 w-36"
            />
          </Link>

          {/* Desktop Menu */}
          <nav className="hidden md:flex gap-8">
            {NAV_LINKS.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="text-sm font-medium hover:text-red-600 transition"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Desktop Button */}
          <Link
            href="/#testimonials"
            className="hidden md:block bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition text-sm font-medium"
          >
            Order Now
          </Link>

          {/* Mobile Toggle */}
          <button
            className="md:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden pb-4 border-t border-gray-200">
            <nav className="flex flex-col gap-3 pt-3">
              {NAV_LINKS.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="text-sm font-medium hover:text-red-600 py-2"
                  onClick={() => setMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
