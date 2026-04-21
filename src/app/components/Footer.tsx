import { Leaf, Mail, Phone, MapPin, Lock } from "lucide-react";
import { Link } from "react-router";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Leaf className="size-8 text-[#4CAF50]" />
              <span className="text-xl font-bold text-gray-900">
                RootRevive
              </span>
            </div>
            <p className="text-gray-600 mb-4">
              Premium dehydrated fruits, vegetables, and herbs. Naturally preserved goodness from farm to table.
            </p>
            <div className="flex gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Phone className="size-4" />
                <span>+91 9328539766</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="size-4" />
                <span>info@rootrevive.co.in</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Quick Links</h3>
            <ul className="space-y-2 text-gray-600">
              <li>
                <Link to="/products" className="hover:text-[#4CAF50] transition-colors">
                  Products
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-[#4CAF50] transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-[#4CAF50] transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-[#4CAF50] transition-colors flex items-center gap-2">
                  <Lock className="size-3" />
                  Admin Login
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Categories</h3>
            <ul className="space-y-2 text-gray-600">
              <li>
                <Link to="/products?category=fruits" className="hover:text-[#4CAF50] transition-colors">
                  Dehydrated Fruits
                </Link>
              </li>
              <li>
                <Link to="/products?category=vegetables" className="hover:text-[#4CAF50] transition-colors">
                  Dehydrated Vegetables
                </Link>
              </li>
              <li>
                <Link to="/products?category=herbs" className="hover:text-[#4CAF50] transition-colors">
                  Herbal Products
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-8 pt-8 text-center text-sm text-gray-600">
          <p>© 2026 RootRevive. All rights reserved. Made with care and sustainability.</p>
        </div>
      </div>
    </footer>
  );
}