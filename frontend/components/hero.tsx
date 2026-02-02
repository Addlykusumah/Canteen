'use client'

import { ArrowRight } from 'lucide-react'
import Image from 'next/image'

export function Hero() {
  return (
    <section id="home" className="py-12 md:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Text Content */}
          <div>
            <p className="text-red-600 font-semibold text-sm md:text-base mb-3 md:mb-4">Healthy Matters Today</p>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 md:mb-6 leading-tight">
              Best Catering Website
            </h1>
            <p className="text-muted-foreground text-base md:text-lg mb-6 md:mb-8 leading-relaxed">
              Discover delicious, fresh meals prepared with premium ingredients. Perfect for any occasion—corporate events, weddings, or everyday celebrations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="bg-red-600 text-white px-8 py-3 rounded-lg hover:bg-red-700 transition font-semibold flex items-center justify-center gap-2 text-sm md:text-base">
                Order Now
                <ArrowRight size={18} />
              </button>
              <button className="border-2 border-red-600 text-red-600 px-8 py-3 rounded-lg hover:bg-red-50 transition font-semibold text-sm md:text-base">
                Explore Menu
              </button>
            </div>
          </div>

          {/* Image */}
          <div className="relative h-64 md:h-80 rounded-2xl overflow-hidden shadow-lg">
            <Image
              src="/hero-pizza.jpg"
              alt="Gourmet pizza with fresh vegetables"
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>

        {/* Social Links / Stats at bottom */}
        <div className="flex justify-center gap-6 mt-12 md:mt-16 pt-8 border-t border-gray-200">
          <a href="#" className="w-10 h-10 rounded-full bg-red-600 text-white flex items-center justify-center hover:bg-red-700 transition font-bold">f</a>
          <a href="#" className="w-10 h-10 rounded-full bg-red-600 text-white flex items-center justify-center hover:bg-red-700 transition font-bold">in</a>
          <a href="#" className="w-10 h-10 rounded-full bg-red-600 text-white flex items-center justify-center hover:bg-red-700 transition font-bold">tw</a>
          <a href="#" className="w-10 h-10 rounded-full bg-red-600 text-white flex items-center justify-center hover:bg-red-700 transition font-bold">ig</a>
        </div>
      </div>
    </section>
  )
}
