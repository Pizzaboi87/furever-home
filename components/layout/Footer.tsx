'use client'

import Image from '@/components/ui/LoadingImage'
import Link from 'next/link'
import { useState } from 'react'

import PublicInquiryModal from '@/components/public-inquiry/PublicInquiryModal'

export default function Footer() {
  const [isContactOpen, setIsContactOpen] = useState(false)

  return (
    <footer className="bg-white border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 bg-linear-to-r from-[#5f57e7] to-primary rounded-lg p-0.5 flex items-center justify-center text-white font-bold text-lg">
                <Image
                  src="/images/assets/logo-small-black.png"
                  width={128}
                  height={128}
                  alt="logo"
                  className="w-full h-full invert"
                />
              </div>
              <span className="font-bold text-[1.4rem] leading-7 text-foreground">Furever<br />Home</span>
            </div>
            <p className="text-muted-foreground text-sm max-w-54">
              Connecting loving families with their perfect animal companions.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/browse" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  Browse Pets
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Support</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/volunteer" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  Volunteer
                </Link>
              </li>
              <li>
                <Link href="/donate" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  Donate
                </Link>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setIsContactOpen(true)}
                  className="cursor-pointer text-left text-sm text-muted-foreground transition-colors hover:text-primary"
                >
                  Contact Us
                </button>
              </li>
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Follow Us</h4>
            <div className="flex gap-4">
              <Link href="#" className="w-10 h-10 bg-linear-to-r from-[#5f57e7] to-primary text-secondary-foreground rounded-lg flex items-center justify-center hover:scale-105 hover:brightness-105 transition-all ease-in-out duration-300">
                <Image
                  src="/images/assets/facebook.png"
                  width={24}
                  height={24}
                  alt="facebook-logo"
                />
              </Link>
              <Link href="#" className="w-10 h-10 bg-linear-to-r from-[#5f57e7] to-primary text-secondary-foreground rounded-lg flex items-center justify-center hover:scale-105 hover:brightness-105 transition-all ease-in-out duration-300">
                <Image
                  src="/images/assets/instagram.png"
                  width={24}
                  height={24}
                  alt="instagram-logo"
                />
              </Link>
              <Link href="#" className="w-10 h-10 bg-linear-to-r from-[#5f57e7] to-primary text-secondary-foreground rounded-lg flex items-center justify-center hover:scale-105 hover:brightness-105 transition-all ease-in-out duration-300">
                <Image
                  src="/images/assets/twitter.png"
                  width={24}
                  height={24}
                  alt="twitter-logo"
                />
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-border pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-muted-foreground text-sm">
              © 2026 Furever Home. All rights reserved.
            </p>
            <div className="flex gap-6">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                Privacy Policy
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>

      <PublicInquiryModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
        source="contact"
        title="Contact Us"
        description="Send a message to the Furever Home team. We will route it to the right person and get back to you soon."
        submitLabel="Send Message"
        successTitle="Message Sent!"
        successMessage="Thanks for reaching out. Our team will review your message and contact you soon."
        defaultSubject="General website inquiry"
        imageSrc="/images/items/question.png"
        imageAlt="A friendly shelter team member helping a visitor"
      />
    </footer>
  )
}
