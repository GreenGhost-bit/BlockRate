import Link from "next/link"
import {
  ShoppingBag,
  Utensils,
  Hotel,
  Car,
  Laptop,
  Smartphone,
  Briefcase,
  Scissors,
  Home,
  Plane,
  Book,
  Headphones,
  Camera,
  Gift,
  Heart,
  Shirt,
  Baby,
  Dumbbell,
  Palette,
  Coffee,
} from "lucide-react"

export default function CategoriesPage() {
  const categories = [
    { name: "Electronics", icon: Laptop, href: "/categories/electronics" },
    { name: "Restaurants", icon: Utensils, href: "/categories/restaurants" },
    { name: "Hotels", icon: Hotel, href: "/categories/hotels" },
    { name: "Automotive", icon: Car, href: "/categories/automotive" },
    { name: "Mobile Phones", icon: Smartphone, href: "/categories/mobile-phones" },
    { name: "Professional Services", icon: Briefcase, href: "/categories/professional-services" },
    { name: "Beauty & Spa", icon: Scissors, href: "/categories/beauty-spa" },
    { name: "Home Services", icon: Home, href: "/categories/home-services" },
    { name: "Travel", icon: Plane, href: "/categories/travel" },
    { name: "Books & Media", icon: Book, href: "/categories/books-media" },
    { name: "Audio & Headphones", icon: Headphones, href: "/categories/audio-headphones" },
    { name: "Cameras", icon: Camera, href: "/categories/cameras" },
    { name: "Gifts & Flowers", icon: Gift, href: "/categories/gifts-flowers" },
    { name: "Health & Wellness", icon: Heart, href: "/categories/health-wellness" },
    { name: "Fashion", icon: Shirt, href: "/categories/fashion" },
    { name: "Baby & Kids", icon: Baby, href: "/categories/baby-kids" },
    { name: "Sports & Fitness", icon: Dumbbell, href: "/categories/sports-fitness" },
    { name: "Art & Design", icon: Palette, href: "/categories/art-design" },
    { name: "Cafes", icon: Coffee, href: "/categories/cafes" },
    { name: "Retail Stores", icon: ShoppingBag, href: "/categories/retail-stores" },
  ]

  return (
    <div className="container mx-auto px-4 py-16 md:px-6">
      <div className="flex flex-col items-center justify-center space-y-4 text-center">
        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl font-poppins">Browse Categories</h1>
        <p className="max-w-[700px] text-gray-500 md:text-xl">
          Explore reviews across various categories to find what you're looking for
        </p>
      </div>

      <div className="mt-12 grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {categories.map((category) => (
          <Link
            key={category.name}
            href={category.href}
            className="flex flex-col items-center rounded-lg border bg-white p-6 shadow-sm transition-all hover:shadow-md"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
              <category.icon className="h-6 w-6" />
            </div>
            <h2 className="mt-4 text-lg font-medium">{category.name}</h2>
          </Link>
        ))}
      </div>
    </div>
  )
}
