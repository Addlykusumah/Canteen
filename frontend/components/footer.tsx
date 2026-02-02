'use client'

import { Facebook, Linkedin, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-red-600 text-white py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Company */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-red-600 font-bold text-sm">
                G
              </div>
              <span className="font-bold text-lg">Godby</span>
            </div>
            <p className="text-sm opacity-80">Premium catering services for unforgettable events.</p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4 text-base">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#home" className="opacity-80 hover:opacity-100 transition">Home</a></li>
              <li><a href="#services" className="opacity-80 hover:opacity-100 transition">Services</a></li>
              <li><a href="#testimonials" className="opacity-80 hover:opacity-100 transition">Testimonials</a></li>
              <li><a href="#contact" className="opacity-80 hover:opacity-100 transition">Contact</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4 text-base">Contact Info</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2 opacity-80">
                <Phone size={16} />
                <span>(555) 123-4567</span>
              </li>
              <li className="flex items-center gap-2 opacity-80">
                <Mail size={16} />
                <span>info@godby.com</span>
              </li>
              <li className="flex items-center gap-2 opacity-80">
                <MapPin size={16} />
                <span>123 Food Street, NYC</span>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-semibold mb-4 text-base">Follow Us</h4>
            <div className="flex gap-3">
              <a href="#" className="w-10 h-10 bg-white text-red-600 rounded-full flex items-center justify-center hover:opacity-80 transition">
                <Facebook size={18} />
              </a>
              <a href="#" className="w-10 h-10 bg-white text-red-600 rounded-full flex items-center justify-center hover:opacity-80 transition">
                <Linkedin size={18} />
              </a>
              <a href="#" className="w-10 h-10 bg-white text-red-600 rounded-full flex items-center justify-center hover:opacity-80 transition">
                <Twitter size={18} />
              </a>
              <a href="#" className="w-10 h-10 bg-white text-red-600 rounded-full flex items-center justify-center hover:opacity-80 transition">
                <Instagram size={18} />
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/20 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm opacity-80 text-center md:text-left">
            <p>&copy; 2024 Godby Catering. All rights reserved.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <a href="#" className="hover:opacity-100 transition">Privacy Policy</a>
              <a href="#" className="hover:opacity-100 transition">Terms of Service</a>
              <a href="#" className="hover:opacity-100 transition">Cookie Settings</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
