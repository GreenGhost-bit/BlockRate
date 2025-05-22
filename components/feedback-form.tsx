"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"

export function FeedbackForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    feedback: "",
  })
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would normally send the data to your backend
    console.log("Feedback submitted:", formData)
    setIsSubmitted(true)
    setFormData({ name: "", email: "", feedback: "" })

    // Reset the submission status after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false)
    }, 3000)
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl font-poppins">
            We Value Your Feedback
          </h2>
          <p className="max-w-[700px] text-gray-500 md:text-xl">
            Help us improve BlockRate by sharing your thoughts and suggestions
          </p>
        </div>
        <div className="mx-auto mt-8 max-w-md">
          {isSubmitted ? (
            <div className="rounded-lg bg-green-50 p-6 text-center">
              <h3 className="text-lg font-medium text-green-800">Thank you for your feedback!</h3>
              <p className="mt-2 text-green-600">We appreciate your input and will use it to improve our platform.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              <div>
                <label htmlFor="feedback" className="block text-sm font-medium text-gray-700">
                  Feedback
                </label>
                <textarea
                  id="feedback"
                  name="feedback"
                  rows={4}
                  required
                  value={formData.feedback}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              <Button type="submit" className="w-full bg-primary text-white hover:bg-primary-dark">
                Submit Feedback
              </Button>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}
