'use client'

import { Star } from 'lucide-react'

const testimonials = [
  {
    title: 'High Thinking Yees',
    image: '🍲',
    description: 'Absolutely delicious food with premium quality. Our corporate event was a huge success thanks to their exceptional catering service.'
  },
  {
    title: 'White Bellies to Own Bites',
    image: '🍛',
    description: 'The variety and freshness of ingredients were outstanding. Every guest complimented the food and presentation.'
  },
  {
    title: 'Daigarn Kaatts',
    image: '🥗',
    description: 'Professional service, timely delivery, and amazing food. They exceeded all our expectations for our wedding celebration.'
  }
]

export function Testimonials() {
  return (
    <section id="testimonials" className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">Taly Feedback</h2>
          <p className="text-muted-foreground text-base md:text-lg">What our satisfied customers say about us</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-gray-50 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition">
              {/* Image */}
              <div className="h-48 bg-linear-to-br from-gray-200 to-gray-300 flex items-center justify-center text-6xl">
                {testimonial.image}
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="font-semibold text-foreground mb-2 text-sm md:text-base">{testimonial.title}</h3>
                <div className="flex gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} className="fill-red-600 text-red-600" />
                  ))}
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed">{testimonial.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
