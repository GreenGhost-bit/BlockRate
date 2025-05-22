import Link from "next/link"
import Image from "next/image"
import { Star, ArrowLeft } from "lucide-react"

export default function CategoryPage({ params }: { params: { category: string } }) {
  const category = decodeURIComponent(params.category).replace(/-/g, " ")

  // This would normally come from your database
  const places = [
    {
      id: 1,
      name: "Example Place 1",
      rating: 4.5,
      reviewCount: 128,
      image: "/placeholder.svg?height=200&width=200&query=business",
    },
    {
      id: 2,
      name: "Example Place 2",
      rating: 3.8,
      reviewCount: 74,
      image: "/placeholder.svg?height=200&width=200&query=store",
    },
    {
      id: 3,
      name: "Example Place 3",
      rating: 4.2,
      reviewCount: 96,
      image: "/placeholder.svg?height=200&width=200&query=shop",
    },
    {
      id: 4,
      name: "Example Place 4",
      rating: 4.7,
      reviewCount: 152,
      image: "/placeholder.svg?height=200&width=200&query=restaurant",
    },
    {
      id: 5,
      name: "Example Place 5",
      rating: 3.5,
      reviewCount: 42,
      image: "/placeholder.svg?height=200&width=200&query=cafe",
    },
    {
      id: 6,
      name: "Example Place 6",
      rating: 4.1,
      reviewCount: 87,
      image: "/placeholder.svg?height=200&width=200&query=hotel",
    },
    {
      id: 7,
      name: "Example Place 7",
      rating: 3.9,
      reviewCount: 63,
      image: "/placeholder.svg?height=200&width=200&query=service",
    },
    {
      id: 8,
      name: "Example Place 8",
      rating: 4.4,
      reviewCount: 112,
      image: "/placeholder.svg?height=200&width=200&query=product",
    },
  ]

  return (
    <div className="container mx-auto px-4 py-16 md:px-6">
      <Link href="/categories" className="inline-flex items-center text-sm text-primary hover:underline mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Categories
      </Link>

      <div className="flex flex-col items-start justify-center space-y-4">
        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl font-poppins capitalize">
          {category}
        </h1>
        <p className="max-w-[700px] text-gray-500 md:text-xl">
          Browse and review places and products in the {category.toLowerCase()} category
        </p>
      </div>

      <div className="mt-12 grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {places.map((place) => (
          <Link
            key={place.id}
            href={`/place/${place.id}`}
            className="group overflow-hidden rounded-lg border bg-white shadow-sm transition-all hover:shadow-md"
          >
            <div className="aspect-video w-full overflow-hidden">
              <Image
                src={place.image || "/placeholder.svg"}
                alt={place.name}
                width={300}
                height={200}
                className="h-full w-full object-cover transition-transform group-hover:scale-105"
              />
            </div>
            <div className="p-4">
              <h2 className="font-medium group-hover:text-primary">{place.name}</h2>
              <div className="mt-2 flex items-center">
                <div className="flex items-center">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="ml-1 text-sm font-medium">{place.rating}</span>
                </div>
                <span className="mx-2 text-gray-300">•</span>
                <span className="text-sm text-gray-500">{place.reviewCount} reviews</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
