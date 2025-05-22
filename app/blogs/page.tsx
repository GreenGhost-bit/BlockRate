"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"

export default function BlogsPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  // This would normally be determined by your auth system
  // For demo purposes, we're using a state variable

  // Sample blog posts
  const blogs = [
    {
      id: 1,
      title: "The Future of Decentralized Reviews",
      excerpt: "How blockchain technology is revolutionizing the way we trust online reviews.",
      author: "Alex Johnson",
      date: "May 15, 2023",
      image: "/placeholder.svg?height=300&width=600&query=blockchain%20technology",
    },
    {
      id: 2,
      title: "Why Transparency Matters in Customer Feedback",
      excerpt: "The importance of authentic reviews in building consumer trust and business reputation.",
      author: "Sarah Williams",
      date: "June 3, 2023",
      image: "/placeholder.svg?height=300&width=600&query=customer%20feedback",
    },
    {
      id: 3,
      title: "How to Spot Fake Reviews in the Digital Age",
      excerpt: "Tips and tricks to identify manipulated reviews and make informed decisions.",
      author: "Michael Chen",
      date: "July 12, 2023",
      image: "/placeholder.svg?height=300&width=600&query=fake%20reviews",
    },
    {
      id: 4,
      title: "The Psychology Behind Consumer Reviews",
      excerpt: "Understanding why people leave reviews and how they influence purchasing decisions.",
      author: "Emily Rodriguez",
      date: "August 24, 2023",
      image: "/placeholder.svg?height=300&width=600&query=psychology%20reviews",
    },
  ]

  return (
    <div className="container mx-auto px-4 py-16 md:px-6">
      <div className="flex flex-col items-center justify-center space-y-4 text-center">
        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl font-poppins">BlockRate Blog</h1>
        <p className="max-w-[700px] text-gray-500 md:text-xl">
          Insights, tips, and stories about decentralized reviews and blockchain technology
        </p>
        {isLoggedIn && (
          <Link href="/blogs/create">
            <Button className="bg-primary text-white hover:bg-primary-dark">Write a Blog Post</Button>
          </Link>
        )}
        {!isLoggedIn && (
          <div>
            <p className="text-sm text-gray-500 mb-2">Log in to write your own blog posts</p>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Link href="/login">
                <Button className="bg-primary text-white hover:bg-primary-dark">Log In</Button>
              </Link>
              <button onClick={() => setIsLoggedIn(true)} className="text-primary hover:underline text-sm mt-2">
                (Demo: Click to simulate login)
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="mt-12 grid gap-8 md:grid-cols-2">
        {blogs.map((blog) => (
          <Link
            key={blog.id}
            href={`/blogs/${blog.id}`}
            className="group overflow-hidden rounded-lg border bg-white shadow-sm transition-all hover:shadow-md"
          >
            <div className="aspect-video w-full overflow-hidden">
              <Image
                src={blog.image || "/placeholder.svg"}
                alt={blog.title}
                width={600}
                height={300}
                className="h-full w-full object-cover transition-transform group-hover:scale-105"
              />
            </div>
            <div className="p-6">
              <h2 className="text-xl font-bold group-hover:text-primary">{blog.title}</h2>
              <p className="mt-2 text-gray-500">{blog.excerpt}</p>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-sm text-gray-400">{blog.author}</span>
                <span className="text-sm text-gray-400">{blog.date}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
