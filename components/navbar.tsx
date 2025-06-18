"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Logo } from "@/components/logo"

// Navigation data
const NAV_ITEMS = [
  { href: "/", label: "Home" },
  { href: "/write-review", label: "Write a Review" },
  { href: "/blogs", label: "Blogs" }
]

const CATEGORIES = [
  { href: "/categories/electronics", label: "Electronics" },
  { href: "/categories/restaurants", label: "Restaurants" },
  { href: "/categories/services", label: "Services" }
]

const AUTH_BUTTONS = [
  { href: "/login", label: "Log in", variant: "outline" as const },
  { href: "/signup", label: "Sign up", variant: "default" as const }
]

// Reusable components
const NavLink = ({ href, label, isActive, onClick }: {
  href: string
  label: string
  isActive: boolean
  onClick?: () => void
}) => (
  <Link
    href={href}
    onClick={onClick}
    className={`text-sm font-medium transition-colors hover:text-primary ${
      isActive ? "text-primary" : "text-gray-600"
    }`}
  >
    {label}
  </Link>
)

const AuthButton = ({ href, label, variant, onClick }: {
  href: string
  label: string
  variant: "outline" | "default"
  onClick?: () => void
}) => (
  <Link href={href} onClick={onClick}>
    <Button 
      variant={variant}
      className="h-9 border-primary text-primary hover:bg-primary hover:text-white"
    >
      {label}
    </Button>
  </Link>
)

const CategoriesDropdown = () => (
  <div className="relative group">
    <button className="flex items-center text-sm font-medium text-gray-600 transition-colors hover:text-primary">
      Categories
      <ChevronDown className="ml-1 h-4 w-4" />
    </button>
    <div className="absolute left-0 top-full z-50 hidden w-64 rounded-md border bg-white p-2 shadow-md group-hover:block">
      <div className="grid gap-1">
        {CATEGORIES.map(({ href, label }) => (
          <Link 
            key={href} 
            href={href} 
            className="block rounded-md px-3 py-2 text-sm hover:bg-gray-100"
          >
            {label}
          </Link>
        ))}
        <Link 
          href="/categories" 
          className="block rounded-md px-3 py-2 text-sm font-medium text-primary hover:bg-gray-100"
        >
          View All Categories
        </Link>
      </div>
    </div>
  </div>
)

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()
  
  const closeMenu = () => setIsMenuOpen(false)
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white">
      <div className="container mx-auto flex h-16 items-center justify-between px-6">
        {/* Logo */}
        <div className="flex items-center">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Logo />
            <span className="font-poppins text-xl font-bold text-gray-900">
              BlockRate
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {NAV_ITEMS.map(({ href, label }) => (
              <NavLink
                key={href}
                href={href}
                label={label}
                isActive={pathname === href}
              />
            ))}
            <CategoriesDropdown />
          </nav>
        </div>

        {/* Desktop Auth Buttons */}
        <div className="hidden md:flex items-center space-x-4">
          {AUTH_BUTTONS.map((button) => (
            <AuthButton key={button.href} {...button} />
          ))}
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          className="flex items-center justify-center rounded-md p-2 md:hidden" 
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? (
            <X className="h-6 w-6 text-gray-700" />
          ) : (
            <Menu className="h-6 w-6 text-gray-700" />
          )}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="container mx-auto md:hidden">
          <nav className="flex flex-col space-y-4 p-4">
            {[...NAV_ITEMS, { href: "/categories", label: "Categories" }].map(({ href, label }) => (
              <NavLink
                key={href}
                href={href}
                label={label}
                isActive={pathname === href}
                onClick={closeMenu}
              />
            ))}
            
            <div className="flex flex-col space-y-2 pt-2">
              {AUTH_BUTTONS.map((button) => (
                <div key={button.href} className="w-full">
                  <AuthButton {...button} onClick={closeMenu} />
                </div>
              ))}
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}