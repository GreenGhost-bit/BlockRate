"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"

// Form configuration
const FORM_FIELDS = [
  {
    name: "name",
    label: "Name",
    type: "text",
    required: true,
    component: "input"
  },
  {
    name: "email",
    label: "Email",
    type: "email",
    required: true,
    component: "input"
  },
  {
    name: "feedback",
    label: "Feedback",
    type: "textarea",
    required: true,
    component: "textarea",
    rows: 4
  }
] as const

const RESET_TIMEOUT = 3000

type FormData = {
  name: string
  email: string
  feedback: string
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
        {field.label}
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

const SuccessMessage = () => (
  <div className="rounded-lg bg-green-50 p-6 text-center">
    <h3 className="text-lg font-medium text-green-800">
      Thank you for your feedback!
    </h3>
    <p className="mt-2 text-green-600">
      We appreciate your input and will use it to improve our platform.
    </p>
  </div>
)

const FeedbackFormContent = ({
  formData,
  onSubmit,
  onChange
}: {
  formData: FormData
  onSubmit: (e: React.FormEvent) => void
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
}) => (
  <form onSubmit={onSubmit} className="space-y-4">
    {FORM_FIELDS.map((field) => (
      <FormField
        key={field.name}
        field={field}
        value={formData[field.name]}
        onChange={onChange}
      />
    ))}
    
    <Button type="submit" className="w-full bg-primary text-white hover:bg-primary-dark">
      Submit Feedback
    </Button>
  </form>
)

const FormHeader = () => (
  <div className="flex flex-col items-center justify-center space-y-4 text-center">
    <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl font-poppins">
      We Value Your Feedback
    </h2>
    <p className="max-w-[700px] text-gray-500 md:text-xl">
      Help us improve BlockRate by sharing your thoughts and suggestions
    </p>
  </div>
)

export function FeedbackForm() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    feedback: "",
  })
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const resetForm = () => {
    setFormData({ name: "", email: "", feedback: "" })
    setIsSubmitted(false)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would normally send the data to your backend
    console.log("Feedback submitted:", formData)
    setIsSubmitted(true)
    setFormData({ name: "", email: "", feedback: "" })

    // Reset the submission status after 3 seconds
    setTimeout(resetForm, RESET_TIMEOUT)
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4 md:px-6">
        <FormHeader />
        
        <div className="mx-auto mt-8 max-w-md">
          {isSubmitted ? (
            <SuccessMessage />
          ) : (
            <FeedbackFormContent
              formData={formData}
              onSubmit={handleSubmit}
              onChange={handleChange}
            />
          )}
        </div>
      </div>
    </section>
  )
}