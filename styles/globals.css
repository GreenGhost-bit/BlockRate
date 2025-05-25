"use client"

import type { ReactNode, FormEvent } from "react"
import { useState } from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function CreateBlogPage() {
  const [formData, setFormData] = useState<{ title: string; content: string; tags: string }>({
    title: "",
    content: "",
    tags: "",
  })
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = (e: FormEvent): void => {
    e.preventDefault()
    console.log("Blog submitted:", formData)
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
            <h1 className="text-2xl font-bold">Blog Post Published!</h1>
            <p className="text-gray-500">Your blog post has been successfully published on BlockRate.</p>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Link href="/blogs">
                <Button className="bg-primary text-white hover:bg-primary-dark">View All Blogs</Button>
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
      <div className="mx-auto max-w-3xl">
        <Link href="/blogs" className="inline-flex items-center text-sm text-primary hover:underline mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Blogs
        </Link>
        <div className="rounded-lg border bg-white p-8 shadow-sm">
          <h1 className="text-2xl font-bold">Write a Blog Post</h1>
          <p className="mt-2 text-gray-500">Share your thoughts, insights, and experiences with the BlockRate community.</p>
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title *</label>
              <input
                id="title"
                name="title"
                type="text"
                required
                value={formData.title}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700">Content *</label>
              <textarea
                id="content"
                name="content"
                rows={12}
                required
                value={formData.content}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div>
              <label htmlFor="tags" className="block text-sm font-medium text-gray-700">Tags (comma separated)</label>
              <input
                id="tags"
                name="tags"
                type="text"
                value={formData.tags}
                onChange={handleChange}
                placeholder="blockchain, reviews, technology"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div className="flex justify-end pt-4">
              <Button type="submit" className="bg-primary text-white hover:bg-primary-dark">
                Publish Blog Post
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
