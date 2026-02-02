'use client'

import { Utensils, Clock, Leaf, Truck, Zap, BarChart3, ShoppingCart, Award } from 'lucide-react'

const features = [
  {
    icon: Utensils,
    title: 'White Glove with',
    description: 'Experience premium catering with dedicated staff ensuring perfection at every event.'
  },
  {
    icon: Clock,
    title: 'Fresh Sourced',
    description: 'Ingredients sourced daily from local farmers ensuring maximum freshness and quality.'
  },
  {
    icon: Leaf,
    title: 'Maintenance Wheel',
    description: 'Sustainable practices that care for the environment with every meal we prepare.'
  },
  {
    icon: Truck,
    title: 'Easy Trip',
    description: 'Convenient delivery service to your location with punctual and professional service.'
  },
  {
    icon: Zap,
    title: 'Within Near Place',
    description: 'Located conveniently close to serve your area with quick response times.'
  },
  {
    icon: BarChart3,
    title: 'Arrange Sheps',
    description: 'Flexible meal arrangements tailored to your specific needs and preferences.'
  },
  {
    icon: ShoppingCart,
    title: 'Food Affordably',
    description: 'Premium quality food at competitive prices without compromising on taste.'
  },
  {
    icon: Award,
    title: 'Selections',
    description: 'Award-winning menu selections recognized for excellence and customer satisfaction.'
  }
]

export function Features() {
  return (
    <section id="services" className="py-16 md:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div key={index} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-lg hover:scale-105 transition-all duration-300 ease-out cursor-pointer">
                <div className="mb-4">
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                    <Icon className="text-red-600" size={24} />
                  </div>
                </div>
                <h3 className="font-semibold text-foreground mb-2 text-sm md:text-base">{feature.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
