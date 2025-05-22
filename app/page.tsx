import Link from "next/link"
import Image from "next/image"
import { Search, Star, Shield, Database, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { FeedbackForm } from "@/components/feedback-form"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-white to-gray-50 py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none font-poppins">
                  Decentralized Reviews You Can <span className="text-primary">Trust</span>
                </h1>
                <p className="max-w-[600px] text-gray-500 md:text-xl">
                  BlockRate leverages blockchain technology to ensure all reviews are transparent, immutable, and
                  trustworthy. Find honest opinions about products and services.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link href="/write-review">
                  <Button className="bg-primary text-white hover:bg-primary-dark">Write a Review</Button>
                </Link>
                <Link href="/categories">
                  <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white">
                    Explore Categories
                  </Button>
                </Link>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <div className="relative w-full max-w-[500px] aspect-square">
                <Image
                  src="/blockchain-review.png"
                  alt="BlockRate Platform"
                  width={500}
                  height={500}
                  className="rounded-lg shadow-xl"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl font-poppins">
              Find a Business You Can Trust
            </h2>
            <p className="max-w-[700px] text-gray-500 md:text-xl">
              Discover, read, and write blockchain-verified reviews
            </p>
            <div className="w-full max-w-2xl flex items-center space-x-2">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-5 w-5 text-gray-400" />
                <input
                  type="search"
                  placeholder="Search for a business or category"
                  className="w-full rounded-l-md border border-gray-200 bg-white px-10 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>
              <Button className="rounded-l-none bg-primary text-white hover:bg-primary-dark">Search</Button>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl font-poppins">
              How BlockRate Works
            </h2>
            <p className="max-w-[700px] text-gray-500 md:text-xl">
              Our blockchain-based platform ensures transparency and trust in every review
            </p>
          </div>
          <div className="grid gap-8 mt-12 md:grid-cols-3">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Immutable Reviews</h3>
              <p className="text-gray-500">
                Once a review is submitted, it's permanently stored on the blockchain and cannot be altered or deleted.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <Database className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Decentralized Storage</h3>
              <p className="text-gray-500">
                Reviews are stored across a distributed network, eliminating central points of control or manipulation.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <TrendingUp className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Transparent Ratings</h3>
              <p className="text-gray-500">
                All ratings are verifiable and traceable, ensuring authentic feedback from real users.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Reviews */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl font-poppins">
              Featured Reviews
            </h2>
            <p className="max-w-[700px] text-gray-500 md:text-xl">See what people are saying on BlockRate</p>
          </div>
          <div className="grid gap-8 mt-12 md:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-lg border bg-white p-6 shadow-sm">
                <div className="flex items-center space-x-2">
                  {Array(5)
                    .fill(0)
                    .map((_, j) => (
                      <Star
                        key={j}
                        className={`h-5 w-5 ${j < 4 ? "fill-yellow-400 text-yellow-400" : "fill-gray-200 text-gray-200"}`}
                      />
                    ))}
                </div>
                <h3 className="mt-4 text-lg font-bold">Great product, highly recommend!</h3>
                <p className="mt-2 text-gray-500">
                  This product exceeded my expectations. The quality is outstanding and customer service was excellent.
                </p>
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="h-8 w-8 rounded-full bg-gray-200"></div>
                    <span className="text-sm font-medium">John D.</span>
                  </div>
                  <span className="text-xs text-gray-400">Verified Purchase</span>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-12 flex justify-center">
            <Link href="/reviews">
              <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white">
                View More Reviews
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl font-poppins">
              Ready to Share Your Experience?
            </h2>
            <p className="max-w-[700px] text-white/80 md:text-xl">
              Join thousands of users who are making the internet more transparent with blockchain-verified reviews.
            </p>
            <Link href="/write-review">
              <Button className="bg-white text-primary hover:bg-gray-100">Write a Review</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Feedback Form */}
      <FeedbackForm />
    </div>
  )
}
