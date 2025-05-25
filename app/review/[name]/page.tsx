"use client"

import type { ReactNode, FormEvent } from "react"
import { useState } from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function ReviewPage({ params }: Readonly<{ params: { name: string } }>) {
  const decodedName: string = decodeURIComponent(params.name)

  const [rating, setRating] = useState<number>(0)
  const [review, setReview] = useState<string>("")
  const [anonymous, setAnonymous] = useState<boolean>(false)
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false)

  const handleRatingClick = (value: number): void => {
    setRating(value)
  }

  const handleSubmit = (e: FormEvent): void => {
    e.preventDefault()

    console.log("Review submitted:", {
      place: decodedName,
      rating,
      review,
      anonymous
    })

    setIsSubmitted(true)
  }

  if (isSubmitted) {
    return (
      <div className="container mx-auto px-4 py-16 md:px-6">
        <div className="mx-auto max-w-2xl rounded-lg border bg-white p-8 shadow-sm">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <svg
                className="h-8 w-8 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold">Review Submitted Successfully!</h1>
            <p className="text-gray-500">
              Thank you for sharing your experience. Your review has been securely stored on the blockchain.
            </p>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Link href={`/place/${encodeURIComponent(decodedName)}`}>
                <Button className="bg-primary text-white hover:bg-primary-dark">View Place</Button>
              </Link>
              <Link href="/">
                <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white">
                  Back to Home
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-16 md:px-6">
      <div className="mx-auto max-w-2xl">
        <Link href="/write-review" className="inline-flex items-center text-sm text-primary hover:underline mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Write Review
        </Link>
        <div className="rounded-lg border bg-white p-8 shadow-sm">
          <h1 className="text-2xl font-bold">Write a Review for {decodedName}</h1>
          <p className="mt-2 text-gray-500">Share your honest experience to help others make informed decisions.</p>
          <form onSubmit={handleSubmit} className="mt-6 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Rating *</label>
              <div className="flex space-x-4">
                {[1, 2, 3, 4, 5].map((value) => (
                  <div
                    key={value}
                    className={`rating-block ${rating === value ? "active" : ""}`}
                    onClick={() => handleRatingClick(value)}
                  >
                    {value}
                  </div>
                ))}
              </div>
              <div className="mt-2 flex justify-between text-xs text-gray-500">
                <span>Strongly don't recommend</span>
                <span>Highly recommend</span>
              </div>
            </div>
            <div>
              <label htmlFor="review" className="block text-sm font-medium text-gray-700">
                Your Review *
              </label>
              <textarea
                id="review"
                rows={6}
                required
                value={review}
                onChange={(e) => setReview(e.target.value)}
                placeholder="Share details of your experience with this place or product..."
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div className="flex items-center">
              <input
                id="anonymous"
                type="checkbox"
                checked={anonymous}
                onChange={(e) => setAnonymous(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <label htmlFor="anonymous" className="ml-2 block text-sm text-gray-700">
                Post anonymously
              </label>
            </div>
            <div className="pt-4">
              <Button
                type="submit"
                className="w-full bg-primary text-white hover:bg-primary-dark"
                disabled={rating === 0 || review.trim() === ""}
              >
                Submit Review
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
