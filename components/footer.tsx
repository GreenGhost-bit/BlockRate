import Link from "next/link"
import { Logo } from "@/components/logo"
import { Facebook, Twitter, Instagram, Linkedin, Github } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-white border-t">
      <div className="container mx-auto px-4 py-12 md:px-6">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Logo />
              <span className="font-poppins text-xl font-bold">BlockRate</span>
            </div>
            <p className="text-sm text-gray-500">
              A decentralized review platform powered by blockchain technology for transparent and trustworthy reviews.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="text-gray-500 hover:text-primary">
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link href="#" className="text-gray-500 hover:text-primary">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link href="#" className="text-gray-500 hover:text-primary">
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link href="#" className="text-gray-500 hover:text-primary">
                <Linkedin className="h-5 w-5" />
                <span className="sr-only">LinkedIn</span>
              </Link>
              <Link href="#" className="text-gray-500 hover:text-primary">
                <Github className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </Link>
            </div>
          </div>
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-500 hover:text-primary">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/write-review" className="text-gray-500 hover:text-primary">
                  Write a Review
                </Link>
              </li>
              <li>
                <Link href="/categories" className="text-gray-500 hover:text-primary">
                  Categories
                </Link>
              </li>
              <li>
                <Link href="/blogs" className="text-gray-500 hover:text-primary">
                  Blogs
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-500 hover:text-primary">
                  About Us
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/privacy-policy" className="text-gray-500 hover:text-primary">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms-of-service" className="text-gray-500 hover:text-primary">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/cookie-policy" className="text-gray-500 hover:text-primary">
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link href="/disclaimer" className="text-gray-500 hover:text-primary">
                  Disclaimer
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider">Contact</h3>
            <ul className="space-y-2">
              <li className="text-gray-500">1234 Blockchain Street</li>
              <li className="text-gray-500">Decentraland, DC 10101</li>
              <li>
                <a href="mailto:info@blockrate.com" className="text-gray-500 hover:text-primary">
                  info@blockrate.com
                </a>
              </li>
              <li>
                <a href="tel:+11234567890" className="text-gray-500 hover:text-primary">
                  +1 (123) 456-7890
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t pt-8 text-center">
          <p className="text-sm text-gray-500">&copy; {new Date().getFullYear()} BlockRate. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
