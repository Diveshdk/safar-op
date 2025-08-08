"use client";
import Image from "next/image";
import { Facebook, Instagram, Twitter, LinkedinIcon as LinkedIn } from 'lucide-react';

export function SiteFooter() {
  return (
    <footer className="footer-wrap py-12">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Get In Touch */}
        <div>
          <h4 className="font-semibold text-lg mb-3">Get In Touch</h4>
          <p className="text-sm text-slate-400 mb-2">
            Peredrift <br />
            65 West 54th Street, <br />
            New York, NY 10019
          </p>
          <p className="text-sm text-slate-400 mb-2">
            Support Phone <br />
            217.246.5655
          </p>
          <p className="text-sm text-slate-400">
            Email: info@peredrift.com <br />
            Response time: usually 4 hours
          </p>
        </div>

        {/* About Us */}
        <div>
          <h4 className="font-semibold text-lg mb-3">About Us</h4>
          <ul className="space-y-2">
            <li><a href="#" className="hover:text-cyan-400">How It Works</a></li>
            <li><a href="#" className="hover:text-cyan-400">Start Planning</a></li>
            <li><a href="#" className="hover:text-cyan-400">About Us</a></li>
            <li><a href="#" className="hover:text-cyan-400">Blog</a></li>
            <li><a href="#" className="hover:text-cyan-400">Reviews</a></li>
            <li><a href="#" className="hover:text-cyan-400">Trip Inspiration</a></li>
            <li><a href="#" className="hover:text-cyan-400">Contact Us</a></li>
          </ul>
        </div>

        {/* From The Blog */}
        <div>
          <h4 className="font-semibold text-lg mb-3">From The Blog</h4>
          <ul className="space-y-2">
            <li><a href="#" className="hover:text-cyan-400">Traveling Guides</a></li>
            <li><a href="#" className="hover:text-cyan-400">Planning Your Trip</a></li>
            <li><a href="#" className="hover:text-cyan-400">Product Guides</a></li>
            <li><a href="#" className="hover:text-cyan-400">Guest Posts</a></li>
            <li><a href="#" className="hover:text-cyan-400">Destinations</a></li>
            <li><a href="#" className="hover:text-cyan-400">Tours</a></li>
            <li><a href="#" className="hover:text-cyan-400">Webinars</a></li>
          </ul>
        </div>

        {/* Get Social */}
        <div>
          <h4 className="font-semibold text-lg mb-3">Get Social</h4>
          <p className="text-sm text-slate-400 mb-3">
            Keep up-to-date with all the latest and breaking social media news.
            There are a lot of exciting things happening this year.
          </p>
          <div className="flex space-x-4">
            <a href="#" className="hover:text-cyan-400"><Facebook className="h-5 w-5" /></a>
            <a href="#" className="hover:text-cyan-400"><Twitter className="h-5 w-5" /></a>
            <a href="#" className="hover:text-cyan-400"><Instagram className="h-5 w-5" /></a>
            <a href="#" className="hover:text-cyan-400"><LinkedIn className="h-5 w-5" /></a>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="container mx-auto px-4 mt-12">
        <div className="footer-divider mb-4" />
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Image src="/placeholder-logo.png" alt="Peredrift Logo" width={120} height={24} className="h-6 w-auto mr-4" />
            <span className="text-xs text-slate-500">Travel Simplified</span>
          </div>
          <p className="text-xs text-slate-500">
            Copyright © 2018 Peredrift and other trademarks, service marks, and designs are the registered or
            unregistered trademarks of Peredrift Inc. in USA and other countries.
          </p>
        </div>
      </div>
    </footer>
  );
}
