"use client"

import type { ReactNode, FormEvent } from "react"
import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Check } from "lucide-react"
import { Button } from "@/components/ui/button"

// Configuration constants
const RATING_VALUES = [1, 2, 3, 4, 5] as const
const RATING_LABELS = {
  min: "Strongly don't recommend",
  max: "Highly recommend"
} as const

type ReviewFormData = {
  rating: number
  review: string
  anonymous: boolean
}

// Reusable components
const StarRating = ({ 
  rating, 
  onRatingClick 
}: { 
  rating: number
  onRatingClick: (value: number) => void 
}) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">
      Rating *
    </label>
    <div className="flex space-x-4">
      {RATING_VALUES.map((value) => (
        <div
          key={value}
          className={`rating-block ${rating === value ? "active" : ""}`}
          onClick={() => onRatingClick(value)}
        >
          {value}
        </div>
      ))}
    </div>
    <div className="mt-2 flex justify-between text-xs text-gray-500">
      <span>{RATING_LABELS.min}</span>
      <span>{RATING_LABELS.max}</span>
    </div>
  </div>
)

const ReviewTextArea = ({
  value,
  onChange
}: {
  value: string
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
}) => (
  <div>
    <label htmlFor="review" className="block text-sm font-medium text-gray-700">
      Your Review *
    </label>
    <textarea
      id="review"
      rows={6}
      required
      value={value}
      onChange={onChange}
      placeholder="Share details of your experience with this place or product..."
      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
    />
  </div>
)

const AnonymousCheckbox = ({
  checked,
  onChange
}: {
  checked: boolean
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}) => (
  <div className="flex items-center">
    <input
      id="anonymous"
      type="checkbox"
      checked={checked}
      onChange={onChange}
      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
    />
    <label htmlFor="anonymous" className="ml-2 block text-sm text-gray-700">
      Post anonymously
    </label>
  </div>
)

const SuccessState = ({ placeName }: { placeName: string }) => (
  <div className="container mx-auto px-4 py-16 md:px-6">
    <div className="mx-auto max-w-2xl rounded-lg border bg-white p-8 shadow-sm">
      <div className="flex flex-col items-center justify-center space-y-4 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
          <Check className="h-8 w-8 text-green-600" />
        </div>
        <h1 className="text-2xl font-bold">Review Submitted Successfully!</h1>
        <p className="text-gray-500">
          Thank you for sharing your experience. Your review has been securely stored on the blockchain.
        </p>
        <div className="flex flex-col gap-2 min-[400px]:flex-row">
          <Link href={`/place/${encodeURIComponent(placeName)}`}>
            <Button className="bg-primary text-white hover:bg-primary-dark">
              View Place
            </Button>
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

const ReviewForm = ({
  placeName,
  formData,
  onSubmit,
  onRatingChange,
  onReviewChange,
  onAnonymousChange
}: {
  placeName: string
  formData: ReviewFormData
  onSubmit: (e: FormEvent) => void
  onRatingChange: (value: number) => void
  onReviewChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  onAnonymousChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}) => {
  const isSubmitDisabled = formData.rating === 0 || formData.review.trim() === ""

  return (
    <div className="container mx-auto px-4 py-16 md:px-6">
      <div className="mx-auto max-w-2xl">
        <Link href="/write-review" className="inline-flex items-center text-sm text-primary hover:underline mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Write Review
        </Link>
        
        <div className="rounded-lg border bg-white p-8 shadow-sm">
          <h1 className="text-2xl font-bold">Write a Review for {placeName}</h1>
          <p className="mt-2 text-gray-500">
            Share your honest experience to help others make informed decisions.
          </p>
          
          <form onSubmit={onSubmit} className="mt-6 space-y-6">
            <StarRating 
              rating={formData.rating} 
              onRatingClick={onRatingChange} 
            />
            
            <ReviewTextArea 
              value={formData.review} 
              onChange={onReviewChange} 
            />
            
            <AnonymousCheckbox 
              checked={formData.anonymous} 
              onChange={onAnonymousChange} 
            />
            
            <div className="pt-4">
              <Button
                type="submit"
                className="w-full bg-primary text-white hover:bg-primary-dark"
                disabled={isSubmitDisabled}
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

export default function ReviewPage({ params }: Readonly<{ params: { name: string } }>) {
  const decodedName: string = decodeURIComponent(params.name)

  const [formData, setFormData] = useState<ReviewFormData>({
    rating: 0,
    review: "",
    anonymous: false
  })
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false)

  const handleRatingChange = (value: number): void => {
    setFormData(prev => ({ ...prev, rating: value }))
  }

  const handleReviewChange = (e: React.ChangeEvent<HTMLTextAreaElement>): void => {
    setFormData(prev => ({ ...prev, review: e.target.value }))
  }

  const handleAnonymousChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setFormData(prev => ({ ...prev, anonymous: e.target.checked }))
  }

  const handleSubmit = (e: FormEvent): void => {
    e.preventDefault()

    console.log("Review submitted:", {
      place: decodedName,
      ...formData
    })

    setIsSubmitted(true)
  }

  return isSubmitted ? (
    <SuccessState placeName={decodedName} />
  ) : (
    <ReviewForm
      placeName={decodedName}
      formData={formData}
      onSubmit={handleSubmit}
      onRatingChange={handleRatingChange}
      onReviewChange={handleReviewChange}
      onAnonymousChange={handleAnonymousChange}
    />
  )
}