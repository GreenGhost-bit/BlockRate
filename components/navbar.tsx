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

  const isActive = (path: string) => {
    return pathname === path
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Logo />
            <span className="font-poppins text-xl font-bold">BlockRate</span>
          </Link>
          <nav className="hidden md:flex items-center space-x-6">
            <Link
              href="/"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive("/") ? "text-primary" : "text-secondary"
              }`}
            >
              Home
            </Link>
            <Link
              href="/write-review"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive("/write-review") ? "text-primary" : "text-secondary"
              }`}
            >
              Write a Review
            </Link>
            <div className="relative group">
              <button className="flex items-center text-sm font-medium transition-colors hover:text-primary">
                Categories
                <ChevronDown className="ml-1 h-4 w-4" />
              </button>
              <div className="absolute left-0 top-full z-50 hidden w-64 rounded-md border bg-white p-2 shadow-md group-hover:block">
                <div className="grid gap-1">
                  <Link href="/categories/electronics" className="block rounded-md px-3 py-2 text-sm hover:bg-gray-100">
                    Electronics
                  </Link>
                  <Link href="/categories/restaurants" className="block rounded-md px-3 py-2 text-sm hover:bg-gray-100">
                    Restaurants
                  </Link>
                  <Link href="/categories/services" className="block rounded-md px-3 py-2 text-sm hover:bg-gray-100">
                    Services
                  </Link>
                  <Link
                    href="/categories"
                    className="block rounded-md px-3 py-2 text-sm font-medium text-primary hover:bg-gray-100"
                  >
                    View All Categories
                  </Link>
                </div>
              </div>
            </div>
            <Link
              href="/blogs"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive("/blogs") ? "text-primary" : "text-secondary"
              }`}
            >
              Blogs
            </Link>
          </nav>
        </div>
        <div className="hidden md:flex items-center space-x-4">
          <Link href="/login">
            <Button variant="outline" className="h-9 border-primary text-primary hover:bg-primary hover:text-white">
              Log in
            </Button>
          </Link>
          <Link href="/signup">
            <Button className="h-9 bg-primary text-white hover:bg-primary-dark">Sign up</Button>
          </Link>
        </div>
        <button
          className="flex items-center justify-center rounded-md p-2 md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>
      {isMenuOpen && (
        <div className="container mx-auto md:hidden">
          <nav className="flex flex-col space-y-4 p-4">
            <Link
              href="/"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive("/") ? "text-primary" : "text-secondary"
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/write-review"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive("/write-review") ? "text-primary" : "text-secondary"
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Write a Review
            </Link>
            <Link
              href="/categories"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive("/categories") ? "text-primary" : "text-secondary"
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Categories
            </Link>
            <Link
              href="/blogs"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive("/blogs") ? "text-primary" : "text-secondary"
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Blogs
            </Link>
            <div className="flex flex-col space-y-2 pt-2">
              <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                <Button
                  variant="outline"
                  className="w-full border-primary text-primary hover:bg-primary hover:text-white"
                >
                  Log in
                </Button>
              </Link>
              <Link href="/signup" onClick={() => setIsMenuOpen(false)}>
                <Button className="w-full bg-primary text-white hover:bg-primary-dark">Sign up</Button>
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
