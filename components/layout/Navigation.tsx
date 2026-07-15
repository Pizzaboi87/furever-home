'use client'

import Image from '@/components/ui/LoadingImage'
import Link from 'next/link'
import { useState } from 'react'

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="relative z-40 bg-white shadow-sm border-b border-border pointer">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-12 h-12 bg-primary rounded-lg p-0.5 flex items-center justify-center text-white font-bold text-lg">
              <Image
                src="/images/assets/logo-small-black.png"
                width={128}
                height={128}
                alt="logo"
                loading="eager"
                fetchPriority="high"
                className='w-full h-full invert'
              />
            </div>
            <span className="font-bold leading-5 text-lg text-foreground hidden sm:inline">Furever<br />Home</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-foreground hover:text-primary transition-colors font-medium">
              Home
            </Link>
            <Link href="/browse" className="text-foreground hover:text-primary transition-colors font-medium">
              Browse Pets
            </Link>
            <Link href="/about" className="text-foreground hover:text-primary transition-colors font-medium">
              About
            </Link>
            <Link href="/volunteer" className="text-foreground hover:text-primary transition-colors font-medium">
              Volunteer
            </Link>
            <Link href="/donate" className="bg-linear-to-r from-[#5f57e7] to-primary text-primary-foreground px-4 py-2 rounded-lg font-medium hover:scale-105 hover:brightness-105 transition-all ease-in-out duration-300">
              Donate
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setIsOpen((current) => !current)}
            className="relative z-20 md:hidden p-2 text-foreground hover:bg-secondary hover:bg-opacity-20 rounded-lg transition-colors"
            aria-expanded={isOpen}
            aria-label="Toggle navigation menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="relative z-20 md:hidden pb-4 space-y-2">
            <Link href="/" className="block px-4 py-2 text-foreground hover:bg-secondary hover:bg-opacity-20 rounded-lg transition-colors">
              Home
            </Link>
            <Link href="/browse" className="block px-4 py-2 text-foreground hover:bg-secondary hover:bg-opacity-20 rounded-lg transition-colors">
              Browse Pets
            </Link>
            <Link href="/about" className="block px-4 py-2 text-foreground hover:bg-secondary hover:bg-opacity-20 rounded-lg transition-colors">
              About
            </Link>
            <Link href="/volunteer" className="block px-4 py-2 text-foreground hover:bg-secondary hover:bg-opacity-20 rounded-lg transition-colors">
              Volunteer
            </Link>
            <Link href="/donate" className="block px-4 py-2 bg-linear-to-r from-[#5f57e7] to-primary text-primary-foreground rounded-lg font-medium hover:scale-105 hover:brightness-105 transition-all ease-in-out duration-300">
              Donate
            </Link>
          </div>
        )}
      </div>
    </nav>
  )
}
