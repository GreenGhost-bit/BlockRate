"use client"

import { useState } from "react"
import Link from "next/link"
import { Search, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function WriteReviewPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  // This would normally be determined by your auth system
  // For demo purposes, we're using a state variable

  if (!isLoggedIn) {
    return (
      <div className="container mx-auto px-4 py-16 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl font-poppins">
            Log In to Write a Review
          </h1>
          <p className="max-w-[700px] text-gray-500 md:text-xl">
            You need to be logged in to write a review on BlockRate.
          </p>
          <div className="flex flex-col gap-2 min-[400px]:flex-row">
            <Link href="/login">
              <Button className="bg-primary text-white hover:bg-primary-dark">Log In</Button>
            </Link>
            <Link href="/signup">
              <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white">
                Sign Up
              </Button>
            </Link>
          </div>
          <p className="text-sm text-gray-500 mt-4">
            For demo purposes, click{" "}
            <button onClick={() => setIsLoggedIn(true)} className="text-primary hover:underline">
              here
            </button>{" "}
            to simulate being logged in.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-16 md:px-6">
      <div className="flex flex-col items-center justify-center space-y-4 text-center">
        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl font-poppins">Write a Review</h1>
        <p className="max-w-[700px] text-gray-500 md:text-xl">
          Share your experience and help others make informed decisions
        </p>
      </div>

      <div className="mx-auto mt-12 max-w-3xl">
        <div className="grid gap-8 md:grid-cols-2">
          <div className="rounded-lg border bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold">Add a New Place or Product</h2>
            <p className="mt-2 text-gray-500">Can't find what you're looking for? Add it to our database.</p>
            <div className="mt-4">
              <Link href="/add-place-product">
                <Button className="w-full bg-primary text-white hover:bg-primary-dark">
                  Add New <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
          <div className="rounded-lg border bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold">Review an Existing Place</h2>
            <p className="mt-2 text-gray-500">Search our database to find and review existing places or products.</p>
            <div className="mt-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="search"
                  placeholder="Search for a place or product"
                  className="w-full rounded-md border border-gray-300 bg-white pl-10 pr-4 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>
              <Link href="/search-results">
                <Button className="mt-4 w-full bg-primary text-white hover:bg-primary-dark">
                  Search <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
