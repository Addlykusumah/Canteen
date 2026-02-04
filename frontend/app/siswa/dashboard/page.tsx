'use client'

import { useState } from 'react'
import Image from 'next/image'
import {
  Menu,
  X,
  ArrowRight,
  Utensils,
  Clock,
  Leaf,
  Truck,
  Zap,
  BarChart3,
  ShoppingCart,
  Award,
  Star,
  Mail,
  Phone,
  MapPin,
} from 'lucide-react'

const features = [
  {
    icon: Utensils,
    title: 'Kantin 1 - Pak Yoyok',
    menuFavorit: 'Masakan rumahan yang selalu jadi andalan siswa',
    jamBuka: '07.00 – 15.00',
  },
  {
    icon: Clock,
    title: 'Kantin 2 - Bu Wati',
    menuFavorit: 'Menu hangat yang bikin kenyang sampai jam pelajaran berikutnya',
    jamBuka: '07.00 – 15.00',
  },
  {
    icon: Leaf,
    title: 'Kantin 3 - Bu Retno',
    menuFavorit: 'Cocok buat kamu yang mau makan cepat tapi tetap enak',
    jamBuka: '08.00 – 15.00',
  },
  {
    icon: Truck,
    title: 'Kantin 4 - Bu Sri',
    menuFavorit: 'Menu simpel tapi rasanya mantap',
    jamBuka: '07.00 – 15.00',
  },
  {
    icon: Zap,
    title: 'Kantin 5 - Pak Eko',
    menuFavorit: 'Tempat favorit buat cari lauk lengkap',
    jamBuka: '07.00 – 15.00',
  },
  {
    icon: BarChart3,
    title: 'Kantin 6 - Pak Supri',
    menuFavorit: 'Porsi jumbo buat yang lagi lapar banget',
    jamBuka: '06.30 – 15.00',
  },
  {
    icon: ShoppingCart,
    title: 'Kantin 7 - Bu Ani',
    menuFavorit: 'Menu fresh yang selalu baru setiap hari',
    jamBuka: '07.00 – 15.00',
  },
  {
    icon: Award,
    title: 'Kantin 8 - Pak Budi',
    menuFavorit: 'Kantin legendaris yang sudah jadi favorit banyak siswa',
    jamBuka: '07.00 – 15.00',
  },
]

const testimonials = [
  {
    title: 'High Thinking Yees',
    image: '🍲',
    desc: 'Absolutely delicious food with premium quality. Our corporate event was a huge success thanks to their exceptional catering service.',
  },
  {
    title: 'White Bellies to Own Bites',
    image: '🍛',
    desc: 'The variety and freshness of ingredients were outstanding. Every guest complimented the food and presentation.',
  },
  {
    title: 'Daigarn Kaatts',
    image: '🥗',
    desc: 'Professional service, timely delivery, and amazing food. They exceeded all our expectations for our wedding celebration.',
  },
]

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <Image src="/image/kanan.png" alt="Logo" width={300} height={300} className="h-36 w-36" />
            </div>

            <nav className="hidden md:flex gap-8">
              {['Home', 'About', 'Services', 'Testimonials'].map((item) => (
                <a key={item} href={`#${item.toLowerCase()}`} className="text-sm hover:text-red-600 transition">
                  {item}
                </a>
              ))}
            </nav>

            <button className="hidden md:block bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition text-sm font-medium">
              Order Now
            </button>

            <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {menuOpen && (
            <div className="md:hidden pb-4 border-t border-gray-200">
              <nav className="flex flex-col gap-3">
                {['Home', 'About', 'Services', 'Testimonials'].map((item) => (
                  <a key={item} href={`#${item.toLowerCase()}`} className="text-sm hover:text-red-600 py-2">
                    {item}
                  </a>
                ))}
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Hero */}
      <section id="home" className="py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
            <div>
              <p className="text-red-600 font-semibold text-sm md:text-base mb-4">E-Kantin SMK Telkom Malang</p>
              <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                Pesan Makanan Kantin Jadi Lebih Mudah
              </h1>

              <p className="text-muted-foreground text-base md:text-lg mb-8 leading-relaxed">
                Pesan makanan jadi lebih cepat dan praktis
                <br />
                Cukup dari HP lalu ambil saat pesanan siap
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  className="bg-red-600 text-white px-8 py-3 rounded-lg 
                  hover:bg-red-700 hover:scale-102 hover:shadow-lg 
                  transition-all duration-300 ease-in-out 
                  font-semibold flex items-center justify-center gap-2 text-sm md:text-base"
                >
                  Pesan Sekarang <ArrowRight size={18} />
                </button>

                <button
                  className="border-2 border-red-600 text-red-600 px-8 py-3 rounded-lg 
                  hover:bg-red-50 hover:scale-102 hover:shadow-md
                  transition-all duration-300 ease-in-out 
                  font-semibold text-sm md:text-base"
                >
                  Lihat Menu
                </button>
              </div>
            </div>

            <div className="relative h-64 md:h-80 rounded-2xl overflow-hidden shadow-lg">
              <Image src="/image/bg1.jpg" alt="Hero" fill className="object-cover" priority />
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="services" className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 items-stretch">
            {features.map((f, i) => {
              const Icon = f.icon
              return (
                <div
                  key={i}
                  className="bg-white p-6 rounded-xl shadow-sm hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer flex flex-col h-full"
                >
                  {/* icon */}
                  <div className="w-12 h-12 mx-auto bg-red-100 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="text-red-600" size={24} />
                  </div>

                  {/* isi card */}
                  <h3 className="font-semibold text-foreground mb-3 text-base md:text-lg">
                    {f.title}
                  </h3>

                  {/* teks rapi & terstruktur */}
                  <div className="text-sm mb-4 space-y-3">
                    <div className="space-y-1">
                      <p className="font-medium text-foreground">Tentang Kantin</p>
                      <p className="text-muted-foreground leading-relaxed">
                        {f.menuFavorit}
                      </p>
                    </div>

                    <p className="flex items-center gap-2 text-muted-foreground">
                      <span>🕒</span>
                      <span>Buka: {f.jamBuka}</span>
                    </p>
                  </div>

                  {/* Button selalu sejajar di bawah */}
                  <button className="mt-auto w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition text-sm font-medium">
                    Lihat Menu
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-3">Menu</h2>
            <p className="text-muted-foreground text-base md:text-lg">What our satisfied customers say about us</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <div key={i} className="bg-gray-50 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition">
                <div className="h-48 bg-linear-to-br from-gray-200 to-gray-300 flex items-center justify-center text-6xl">
                  {t.image}
                </div>
                <div className="p-6">
                  <h3 className="font-semibold text-foreground mb-2 text-sm md:text-base">{t.title}</h3>
                  <div className="flex gap-1 mb-3">
                    {[...Array(5)].map((_, j) => (
                      <Star key={j} size={16} className="fill-red-600 text-red-600" />
                    ))}
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed">{t.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Info Section */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 leading-tight">Flvlus will affigen on parfl-step iloe.</h2>
              <p className="text-muted-foreground text-base md:text-lg mb-4 leading-relaxed">
                This section is perfect to highlight any special offerings, seasonal menus, or unique catering packages. Share what makes your catering service stand out from the competition.
              </p>
              <p className="text-muted-foreground text-base md:text-lg mb-8 leading-relaxed">
                Include details about your preparation methods, ingredient sourcing, or customer success stories. Make it compelling and authentic.
              </p>
              <button className="bg-red-600 text-white px-8 py-3 rounded-lg hover:bg-red-700 transition font-semibold text-sm md:text-base">
                LEARN MORE
              </button>
            </div>

            <div className="relative h-64 md:h-80 rounded-2xl overflow-hidden shadow-lg">
              <Image src="/sandwich.jpg" alt="Sandwich" fill className="object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-red-600 text-white py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-red-600 font-bold text-sm">
                  G
                </div>
                <span className="font-bold text-lg">Godby</span>
              </div>
              <p className="text-sm opacity-80">Premium catering services for unforgettable events.</p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                {['Home', 'Services', 'Testimonials', 'Contact'].map((link) => (
                  <li key={link}>
                    <a href="#" className="opacity-80 hover:opacity-100 transition">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Contact Info</h4>
              <ul className="space-y-3 text-sm">
                <li className="flex items-center gap-2 opacity-80">
                  <Phone size={16} /> (555) 123-4567
                </li>
                <li className="flex items-center gap-2 opacity-80">
                  <Mail size={16} /> info@godby.com
                </li>
                <li className="flex items-center gap-2 opacity-80">
                  <MapPin size={16} /> 123 Food Street, NYC
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/20 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center text-sm opacity-80 text-center md:text-left">
              <p>&copy; 2024 Godby Catering. All rights reserved.</p>
              <div className="flex gap-6 mt-4 md:mt-0">
                {['Privacy Policy', 'Terms of Service', 'Cookie Settings'].map((link) => (
                  <a key={link} href="#" className="hover:opacity-100 transition">
                    {link}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
