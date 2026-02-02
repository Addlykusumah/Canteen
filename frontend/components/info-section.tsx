'use client'

import Image from 'next/image'

export function InfoSection() {
  return (
    <section className="py-16 md:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Text Content */}
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 md:mb-6 leading-tight">
              Flvlus will affigen on parfl-step iloe.
            </h2>
            <p className="text-muted-foreground text-base md:text-lg mb-4 leading-relaxed">
              This section is perfect to highlight any special offerings, seasonal menus, or unique catering packages. Share what makes your catering service stand out from the competition.
            </p>
            <p className="text-muted-foreground text-base md:text-lg mb-8 leading-relaxed">
              Include details about your preparation methods, ingredient sourcing, or customer success stories. Make it compelling and authentic.
            </p>
            <button className="bg-primary text-primary-foreground px-8 py-3 rounded-lg hover:bg-secondary transition font-semibold text-sm md:text-base">
              LEARN MORE
            </button>
          </div>

          {/* Image */}
          <div className="relative h-64 md:h-80 rounded-2xl overflow-hidden shadow-lg">
            <Image
              src="/sandwich.jpg"
              alt="Gourmet sandwich with fresh ingredients"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
