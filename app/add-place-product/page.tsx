"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Check } from "lucide-react"
import { Button } from "@/components/ui/button"

// Form configuration
const CATEGORIES = [
  { value: "", label: "Select a category" },
  { value: "restaurant", label: "Restaurant" },
  { value: "retail", label: "Retail Store" },
  { value: "service", label: "Service Provider" },
  { value: "hotel", label: "Hotel" },
  { value: "electronics", label: "Electronics" },
  { value: "software", label: "Software" },
  { value: "other", label: "Other" }
]

const FORM_FIELDS = [
  {
    name: "name",
    label: "Name",
    type: "text",
    required: true,
    component: "input"
  },
  {
    name: "category",
    label: "Category",
    type: "select",
    required: true,
    component: "select",
    options: CATEGORIES
  },
  {
    name: "address",
    label: "Address",
    type: "text",
    required: false,
    component: "input"
  },
  {
    name: "website",
    label: "Website",
    type: "url",
    required: false,
    component: "input"
  },
  {
    name: "description",
    label: "Description",
    type: "textarea",
    required: true,
    component: "textarea",
    rows: 4
  }
] as const

type FormData = {
  name: string
  category: string
  address: string
  website: string
  description: string
}

// Reusable form components
const FormField = ({ 
  field, 
  value, 
  onChange 
}: { 
  field: typeof FORM_FIELDS[number]
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void
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
          className={baseClasses}
        />
      )}
      
      {field.component === "select" && (
        <select
          id={field.name}
          name={field.name}
          required={field.required}
          value={value}
          onChange={onChange}
          className={baseClasses}
        >
          {field.options?.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
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

const SuccessState = ({ formData }: { formData: FormData }) => (
  <div className="container mx-auto px-4 py-16 md:px-6">
    <div className="mx-auto max-w-2xl rounded-lg border bg-white p-8 shadow-sm">
      <div className="flex flex-col items-center justify-center space-y-4 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
          <Check className="h-8 w-8 text-green-600" />
        </div>
        <h1 className="text-2xl font-bold">Place Added Successfully!</h1>
        <p className="text-gray-500">
          Thank you for contributing to BlockRate. Would you like to write a review for this place now?
        </p>
        <div className="flex flex-col gap-2 min-[400px]:flex-row">
          <Link href={`/review/${encodeURIComponent(formData.name)}`}>
            <Button className="bg-primary text-white hover:bg-primary-dark">
              Write a Review
            </Button>
          </Link>
          <Link href="/write-review">
            <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white">
              Back to Write Review
            </Button>
          </Link>
        </div>
      </div>
    </div>
  </div>
)

const AddPlaceForm = ({ 
  formData, 
  onSubmit, 
  onChange 
}: {
  formData: FormData
  onSubmit: (e: React.FormEvent) => void
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void
}) => (
  <div className="container mx-auto px-4 py-16 md:px-6">
    <div className="mx-auto max-w-2xl">
      <Link href="/write-review" className="inline-flex items-center text-sm text-primary hover:underline mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Write Review
      </Link>
      
      <div className="rounded-lg border bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-bold">Add a New Place or Product</h1>
        <p className="mt-2 text-gray-500">
          Fill out the form below to add a new place or product to our database.
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
              Add Place/Product
            </Button>
          </div>
        </form>
      </div>
    </div>
  </div>
)

export default function AddPlaceProductPage() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    category: "",
    address: "",
    website: "",
    description: "",
  })
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would normally send the data to your backend
    console.log("Place/Product submitted:", formData)
    setIsSubmitted(true)
  }

  return isSubmitted ? (
    <SuccessState formData={formData} />
  ) : (
    <AddPlaceForm 
      formData={formData} 
      onSubmit={handleSubmit} 
      onChange={handleChange} 
    />
  )
}