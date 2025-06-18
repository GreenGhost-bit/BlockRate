"use client"

import type { ReactNode, FormEvent } from "react"
import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Check } from "lucide-react"
import { Button } from "@/components/ui/button"

// Form configuration
const FORM_FIELDS = [
  {
    name: "title",
    label: "Title",
    type: "text",
    required: true,
    component: "input"
  },
  {
    name: "content", 
    label: "Content",
    type: "textarea",
    required: true,
    component: "textarea",
    rows: 12
  },
  {
    name: "tags",
    label: "Tags (comma separated)",
    type: "text", 
    required: false,
    component: "input",
    placeholder: "blockchain, reviews, technology"
  }
] as const

type FormData = {
  title: string
  content: string
  tags: string
}

// Reusable form components
const FormField = ({
  field,
  value,
  onChange
}: {
  field: typeof FORM_FIELDS[number]
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
}) => {
  const baseClasses = "mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
  
  return (
    <div>
      <label htmlFor={field.name} className="block text-sm font-medium text-gray-700">
        {field.label} {field.required && "*"}
      </label>
      
      {field.component === "input" && (
        <input
          id={field.name}
          name={field.name}
          type={field.type}
          required={field.required}
          value={value}
          onChange={onChange}
          placeholder={field.placeholder}
          className={baseClasses}
        />
      )}
      
      {field.component === "textarea" && (
        <textarea
          id={field.name}
          name={field.name}
          rows={field.rows}
          required={field.required}
          value={value}
          onChange={onChange}
          className={baseClasses}
        />
      )}
    </div>
  )
}

const SuccessState = () => (
  <div className="container mx-auto px-4 py-16 md:px-6">
    <div className="mx-auto max-w-2xl rounded-lg border bg-white p-8 shadow-sm">
      <div className="flex flex-col items-center justify-center space-y-4 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
          <Check className="h-8 w-8 text-green-600" />
        </div>
        <h1 className="text-2xl font-bold">Blog Post Published!</h1>
        <p className="text-gray-500">
          Your blog post has been successfully published on BlockRate.
        </p>
        <div className="flex flex-col gap-2 min-[400px]:flex-row">
          <Link href="/blogs">
            <Button className="bg-primary text-white hover:bg-primary-dark">
              View All Blogs
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

const BlogForm = ({
  formData,
  onSubmit,
  onChange
}: {
  formData: FormData
  onSubmit: (e: FormEvent) => void
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
}) => (
  <div className="container mx-auto px-4 py-16 md:px-6">
    <div className="mx-auto max-w-3xl">
      <Link href="/blogs" className="inline-flex items-center text-sm text-primary hover:underline mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Blogs
      </Link>
      
      <div className="rounded-lg border bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-bold">Write a Blog Post</h1>
        <p className="mt-2 text-gray-500">
          Share your thoughts, insights, and experiences with the BlockRate community.
        </p>
        
        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          {FORM_FIELDS.map((field) => (
            <FormField
              key={field.name}
              field={field}
              value={formData[field.name]}
              onChange={onChange}
            />
          ))}
          
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

export default function CreateBlogPage() {
  const [formData, setFormData] = useState<FormData>({
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

  return isSubmitted ? (
    <SuccessState />
  ) : (
    <BlogForm 
      formData={formData}
      onSubmit={handleSubmit}
      onChange={handleChange}
    />
  )
}