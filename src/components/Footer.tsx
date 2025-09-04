import React from 'react';
import { Github, Mail, MapPin, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-2">
              <img src="https://user-images.githubusercontent.com/1735999/280595337-b44458d2-4361-4c1d-93d3-138332145719.png" alt="DigitalNexCode Logo" className="h-10" />
            </Link>
            <p className="text-gray-300 text-sm">
              Transforming ideas into digital excellence. Your trusted technology partner in Pretoria, South Africa.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://github.com/digitalnexcode"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-blue-400 transition-colors"
              >
                <Github className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-gray-300 hover:text-blue-400 transition-colors">About Us</Link></li>
              <li><Link to="/services" className="text-gray-300 hover:text-blue-400 transition-colors">Services</Link></li>
              <li><Link to="/portfolio" className="text-gray-300 hover:text-blue-400 transition-colors">Portfolio</Link></li>
              <li><Link to="/blog" className="text-gray-300 hover:text-blue-400 transition-colors">Blog</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Services</h3>
            <ul className="space-y-2">
              <li className="text-gray-300">Custom Software Development</li>
              <li className="text-gray-300">Product Design</li>
              <li className="text-gray-300">Quality Assurance</li>
              <li className="text-gray-300">Consultancy</li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Contact</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-gray-300">
                <MapPin className="h-4 w-4" />
                <span className="text-sm">Pretoria, South Africa</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-300">
                <Mail className="h-4 w-4" />
                <a href="mailto:info@digitalnexcode.co.za" className="text-sm hover:text-blue-400">info@digitalnexcode.co.za</a>
              </div>
              <div className="flex items-center space-x-2 text-gray-300">
                <Phone className="h-4 w-4" />
                <a href="tel:0780562868" className="text-sm hover:text-blue-400">078 056 2868</a>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-300 text-sm">
            © 2025 DigitalNexCode. All rights reserved. | Domain: .co.za free first year with annual hosting
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
