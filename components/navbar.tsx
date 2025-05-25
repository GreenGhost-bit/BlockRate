"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Logo } from "@/components/logo"

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()

  const isActive = (path: string) => pathname === path

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white">
      <div className="container mx-auto flex h-16 items-center justify-between px-6">
        <div className="flex items-center">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Logo />
            <span className="font-poppins text-xl font-bold text-gray-900">BlockRate</span>
          </Link>
          <nav className="hidden md:flex items-center space-x-6">
            {[
              { href: "/", label: "Home" },
              { href: "/write-review", label: "Write a Review" },
              { href: "/blogs", label: "Blogs" }
            ].map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  isActive(href) ? "text-primary" : "text-gray-600"
                }`}
              >
                {label}
              </Link>
            ))}
            <div className="relative group">
              <button className="flex items-center text-sm font-medium transition-colors hover:text-primary">
                Categories
                <ChevronDown className="ml-1 h-4 w-4" />
              </button>
              <div className="absolute left-0 top-full z-50 hidden w-64 rounded-md border bg-white p-2 shadow-md group-hover:block">
                <div className="grid gap-1">
                  {[
                    { href: "/categories/electronics", label: "Electronics" },
                    { href: "/categories/restaurants", label: "Restaurants" },
                    { href: "/categories/services", label: "Services" }
                  ].map(({ href, label }) => (
                    <Link key={href} href={href} className="block rounded-md px-3 py-2 text-sm hover:bg-gray-100">
                      {label}
                    </Link>
                  ))}
                  <Link href="/categories" className="block rounded-md px-3 py-2 text-sm font-medium text-primary hover:bg-gray-100">
                    View All Categories
                  </Link>
                </div>
              </div>
            </div>
          </nav>
        </div>
        <div className="hidden md:flex items-center space-x-4">
          {[
            { href: "/login", label: "Log in", variant: "outline" },
            { href: "/signup", label: "Sign up", variant: "default" }
          ].map(({ href, label, variant }) => (
            <Link key={href} href={href}>
              <Button variant={variant} className="h-9 border-primary text-primary hover:bg-primary hover:text-white">
                {label}
              </Button>
            </Link>
          ))}
        </div>
        <button className="flex items-center justify-center rounded-md p-2 md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X className="h-6 w-6 text-gray-700" /> : <Menu className="h-6 w-6 text-gray-700" />}
        </button>
      </div>
      {isMenuOpen && (
        <div className="container mx-auto md:hidden">
          <nav className="flex flex-col space-y-4 p-4">
            {[
              { href: "/", label: "Home" },
              { href: "/write-review", label: "Write a Review" },
              { href: "/categories", label: "Categories" },
              { href: "/blogs", label: "Blogs" }
            ].map(({ href, label }) => (
              <Link key={href} href={href} className={`text-sm font-medium transition-colors hover:text-primary ${isActive(href) ? "text-primary" : "text-gray-600"}`} onClick={() => setIsMenuOpen(false)}>
                {label}
              </Link>
            ))}
            <div className="flex flex-col space-y-2 pt-2">
              {[
                { href: "/login", label: "Log in", variant: "outline" },
                { href: "/signup", label: "Sign up", variant: "default" }
              ].map(({ href, label, variant }) => (
                <Link key={href} href={href} onClick={() => setIsMenuOpen(false)}>
                  <Button variant={variant} className="w-full border-primary text-primary hover:bg-primary hover:text-white">
                    {label}
                  </Button>
                </Link>
              ))}
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
