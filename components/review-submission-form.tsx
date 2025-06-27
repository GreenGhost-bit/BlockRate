"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Star, Loader2 } from "lucide-react"
import { useAlgorand } from "./algorand-provider"

export function ReviewSubmissionForm() {
  const { isConnected, submitReview } = useAlgorand()
  const [businessName, setBusinessName] = useState("")
  const [rating, setRating] = useState(0)
  const [content, setContent] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!businessName || !content || rating === 0) return

    setIsSubmitting(true)
    const success = await submitReview(businessName, rating, content)
    if (success) {
      setBusinessName("")
      setContent("")
      setRating(0)
    }
    setIsSubmitting(false)
  }

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Star className="w-5 h-5 mr-2 text-yellow-400" />
          Submit Review
        </CardTitle>
        <CardDescription>
          Write a review and earn ALGO rewards for quality contributions
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            placeholder="Business Name"
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            className="bg-slate-700 border-slate-600"
          />
          
          <div className="flex items-center space-x-2">
            <span className="text-sm">Rating:</span>
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className={`${star <= rating ? 'text-yellow-400' : 'text-gray-600'} hover:text-yellow-400 transition-colors`}
              >
                <Star className="w-5 h-5 fill-current" />
              </button>
            ))}
          </div>
          
          <Textarea
            placeholder="Write your review..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="bg-slate-700 border-slate-600"
            rows={3}
          />
          
          <Button 
            type="submit" 
            disabled={!isConnected || isSubmitting || !businessName || !content || rating === 0}
            className="w-full bg-green-600 hover:bg-green-700"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Submitting to Blockchain...
              </>
            ) : (
              <>
                Submit Review (+2.5 ALGO)
              </>
            )}
          </Button>
          
          {!isConnected && (
            <p className="text-sm text-gray-400 text-center">
              Connect your Algorand wallet to submit reviews
            </p>
          )}
        </form>
      </CardContent>
    </Card>
  )
}