import Link from "next/link";
import { Phone, Mail, MapPin, Facebook, Twitter, Instagram, Youtube } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-teal-600 to-blue-600 text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Platform Info */}
          <div className="lg:col-span-1">
            <h3 className="text-lg font-bold mb-4 flex items-center">
              <span className="bg-white text-teal-600 px-2 py-1 rounded mr-2 text-sm">🏥</span>
              Swasthya Platform
            </h3>
            <p className="text-sm text-teal-100 leading-relaxed mb-4">
              A comprehensive government initiative to provide accessible, affordable, and high-quality healthcare services to every citizen.
            </p>
            <div className="flex space-x-3">
              <a href="#" className="text-teal-200 hover:text-white transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-teal-200 hover:text-white transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-teal-200 hover:text-white transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-teal-200 hover:text-white transition-colors">
                <Youtube size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/clinics" className="text-sm text-teal-100 hover:text-white transition-colors flex items-center">
                  <MapPin size={16} className="mr-2" />
                  Find Clinics
                </Link>
              </li>
              <li>
                <Link href="/appointments" className="text-sm text-teal-100 hover:text-white transition-colors flex items-center">
                  📅 Book Appointments
                </Link>
              </li>
              <li>
                <Link href="/reports" className="text-sm text-teal-100 hover:text-white transition-colors flex items-center">
                  📊 My Reports
                </Link>
              </li>
              <li>
                <Link href="/tracker" className="text-sm text-teal-100 hover:text-white transition-colors flex items-center">
                  🗺️ Health Tracker
                </Link>
              </li>
            </ul>
          </div>

          {/* Emergency */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-red-300">Emergency</h3>
            <ul className="space-y-3">
              <li className="flex items-center">
                <Phone size={16} className="mr-2 text-red-300" />
                <span className="text-sm text-teal-100">Ambulance: <span className="font-bold text-white">102</span></span>
              </li>
              <li className="flex items-center">
                <Phone size={16} className="mr-2 text-red-300" />
                <span className="text-sm text-teal-100">General Help: <span className="font-bold text-white">108</span></span>
              </li>
              <li>
                <Link href="/instructions" className="text-sm text-red-200 hover:text-red-100 font-medium transition-colors flex items-center">
                  🚨 Emergency Guidelines
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-center">
                <Mail size={16} className="mr-2 text-teal-200" />
                <span className="text-sm text-teal-100">support@swasthya.gov.in</span>
              </li>
              <li className="flex items-center">
                <Phone size={16} className="mr-2 text-teal-200" />
                <span className="text-sm text-teal-100">1800-XXX-XXXX</span>
              </li>
              <li className="flex items-center">
                <MapPin size={16} className="mr-2 text-teal-200" />
                <span className="text-sm text-teal-100">New Delhi, India</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-teal-500 text-center">
          <p className="text-sm text-teal-200">
            © {new Date().getFullYear()} Government Public Healthcare Initiative. All rights reserved.
          </p>
          <div className="mt-4 flex justify-center space-x-6 text-xs text-teal-300">
            <Link href="/privacy" className="hover:text-white">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white">Terms of Service</Link>
            <Link href="/accessibility" className="hover:text-white">Accessibility</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
