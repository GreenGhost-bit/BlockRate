// components/business-verification.tsx
"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  Shield, Upload, FileText, CheckCircle, Clock, AlertCircle, 
  Building, Phone, Mail, Globe, MapPin, CreditCard, Crown
} from "lucide-react"

interface VerificationDocument {
  id: string
  type: 'business_license' | 'tax_id' | 'address_proof' | 'bank_statement' | 'identity'
  name: string
  status: 'pending' | 'approved' | 'rejected'
  uploadedAt: Date
  reviewedAt?: Date
  reason?: string
}

interface VerificationStep {
  id: string
  title: string
  description: string
  completed: boolean
  required: boolean
  documents: VerificationDocument[]
}

interface BusinessInfo {
  legalName: string
  tradeName: string
  registrationNumber: string
  taxId: string
  address: string
  city: string
  state: string
  zipCode: string
  country: string
  phone: string
  email: string
  website: string
  industry: string
  establishedDate: string
}

export function BusinessVerification() {
  const [currentStep, setCurrentStep] = useState(0)
  const [businessInfo, setBusinessInfo] = useState<BusinessInfo>({
    legalName: '',
    tradeName: '',
    registrationNumber: '',
    taxId: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    phone: '',
    email: '',
    website: '',
    industry: '',
    establishedDate: ''
  })

  const [verificationSteps, setVerificationSteps] = useState<VerificationStep[]>([
    {
      id: 'basic_info',
      title: 'Basic Information',
      description: 'Provide essential business details',
      completed: false,
      required: true,
      documents: []
    },
    {
      id: 'legal_docs',
      title: 'Legal Documents',
      description: 'Upload business registration and licenses',
      completed: false,
      required: true,
      documents: [
        {
          id: '1',
          type: 'business_license',
          name: 'Business License',
          status: 'pending',
          uploadedAt: new Date()
        }
      ]
    },
    {
      id: 'financial_docs',
      title: 'Financial Verification',
      description: 'Verify business financial standing',
      completed: false,
      required: true,
      documents: []
    },
    {
      id: 'identity_verification',
      title: 'Identity Verification',
      description: 'Verify business owner identity',
      completed: false,
      required: true,
      documents: []
    },
    {
      id: 'final_review',
      title: 'Final Review',
      description: 'Complete verification process',
      completed: false,
      required: true,
      documents: []
    }
  ])

  const updateBusinessInfo = (field: keyof BusinessInfo, value: string) => {
    setBusinessInfo(prev => ({ ...prev, [field]: value }))
  }

  const handleFileUpload = (stepId: string, documentType: string) => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.pdf,.jpg,.jpeg,.png'
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        const newDoc: VerificationDocument = {
          id: Date.now().toString(),
          type: documentType as any,
          name: file.name,
          status: 'pending',
          uploadedAt: new Date()
        }
        
        setVerificationSteps(prev =>
          prev.map(step =>
            step.id === stepId
              ? { ...step, documents: [...step.documents, newDoc] }
              : step
          )
        )
      }
    }
    input.click()
  }

  const calculateProgress = () => {
    const completedSteps = verificationSteps.filter(step => step.completed).length
    return (completedSteps / verificationSteps.length) * 100
  }

  const getVerificationLevel = () => {
    const progress = calculateProgress()
    if (progress === 100) return { level: 'Platinum', color: 'text-purple-400', icon: Crown }
    if (progress >= 75) return { level: 'Gold', color: 'text-yellow-400', icon: Shield }
    if (progress >= 50) return { level: 'Silver', color: 'text-gray-400', icon: Shield }
    return { level: 'Bronze', color: 'text-amber-600', icon: Shield }
  }

  const verificationLevel = getVerificationLevel()
  const VerificationIcon = verificationLevel.icon

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">Business Verification</h1>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Complete the verification process to build trust with customers and unlock advanced features
        </p>
      </div>

      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center">
                <VerificationIcon className={`w-6 h-6 mr-2 ${verificationLevel.color}`} />
                Verification Progress
              </CardTitle>
              <CardDescription>
                Current level: <span className={verificationLevel.color}>{verificationLevel.level}</span>
              </CardDescription>
            </div>
            <Badge className={`${verificationLevel.color} border-current`}>
              {Math.round(calculateProgress())}% Complete
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Progress value={calculateProgress()} className="h-3" />
            <div className="grid gap-2 md:grid-cols-5">
              {verificationSteps.map((step, index) => (
                <div
                  key={step.id}
                  className={`p-3 rounded-lg text-center cursor-pointer transition-colors ${
                    step.completed
                      ? 'bg-green-600/20 border border-green-600/50'
                      : index === currentStep
                      ? 'bg-blue-600/20 border border-blue-600/50'
                      : 'bg-slate-700/30 border border-slate-600'
                  }`}
                  onClick={() => setCurrentStep(index)}
                >
                  <div className="flex items-center justify-center mb-2">
                    {step.completed ? (
                      <CheckCircle className="w-5 h-5 text-green-400" />
                    ) : index === currentStep ? (
                      <Clock className="w-5 h-5 text-blue-400" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                  <div className="text-xs font-medium">{step.title}</div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={verificationSteps[currentStep]?.id} className="space-y-6">
        <TabsContent value="basic_info" className="space-y-6">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Building className="w-5 h-5 mr-2" />
                Basic Business Information
              </CardTitle>
              <CardDescription>
                Provide your business details to start the verification process
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="text-sm font-medium mb-2 block">Legal Business Name *</label>
                  <Input
                    value={businessInfo.legalName}
                    onChange={(e) => updateBusinessInfo('legalName', e.target.value)}
                    placeholder="Enter legal business name"
                    className="bg-slate-700 border-slate-600"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Trade Name (DBA)</label>
                  <Input
                    value={businessInfo.tradeName}
                    onChange={(e) => updateBusinessInfo('tradeName', e.target.value)}
                    placeholder="Doing business as..."
                    className="bg-slate-700 border-slate-600"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Business Registration Number *</label>
                  <Input
                    value={businessInfo.registrationNumber}
                    onChange={(e) => updateBusinessInfo('registrationNumber', e.target.value)}
                    placeholder="Registration/EIN number"
                    className="bg-slate-700 border-slate-600"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Tax ID/VAT Number *</label>
                  <Input
                    value={businessInfo.taxId}
                    onChange={(e) => updateBusinessInfo('taxId', e.target.value)}
                    placeholder="Tax identification number"
                    className="bg-slate-700 border-slate-600"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Industry *</label>
                  <Select value={businessInfo.industry} onValueChange={(value) => updateBusinessInfo('industry', value)}>
                    <SelectTrigger className="bg-slate-700 border-slate-600">
                      <SelectValue placeholder="Select industry" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="food_beverage">Food & Beverage</SelectItem>
                      <SelectItem value="technology">Technology</SelectItem>
                      <SelectItem value="healthcare">Healthcare</SelectItem>
                      <SelectItem value="finance">Finance</SelectItem>
                      <SelectItem value="education">Education</SelectItem>
                      <SelectItem value="retail">Retail</SelectItem>
                      <SelectItem value="services">Services</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Established Date *</label>
                  <Input
                    type="date"
                    value={businessInfo.establishedDate}
                    onChange={(e) => updateBusinessInfo('establishedDate', e.target.value)}
                    className="bg-slate-700 border-slate-600"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Business Address *</label>
                <Textarea
                  value={businessInfo.address}
                  onChange={(e) => updateBusinessInfo('address', e.target.value)}
                  placeholder="Complete business address"
                  className="bg-slate-700 border-slate-600"
                  rows={2}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">City *</label>
                  <Input
                    value={businessInfo.city}
                    onChange={(e) => updateBusinessInfo('city', e.target.value)}
                    placeholder="City"
                    className="bg-slate-700 border-slate-600"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">State/Province *</label>
                  <Input
                    value={businessInfo.state}
                    onChange={(e) => updateBusinessInfo('state', e.target.value)}
                    placeholder="State"
                    className="bg-slate-700 border-slate-600"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">ZIP/Postal Code *</label>
                  <Input
                    value={businessInfo.zipCode}
                    onChange={(e) => updateBusinessInfo('zipCode', e.target.value)}
                    placeholder="ZIP code"
                    className="bg-slate-700 border-slate-600"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Country *</label>
                  <Input
                    value={businessInfo.country}
                    onChange={(e) => updateBusinessInfo('country', e.target.value)}
                    placeholder="Country"
                    className="bg-slate-700 border-slate-600"
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <label className="text-sm font-medium mb-2 block">Phone Number *</label>
                  <Input
                    value={businessInfo.phone}
                    onChange={(e) => updateBusinessInfo('phone', e.target.value)}
                    placeholder="+1 (555) 123-4567"
                    className="bg-slate-700 border-slate-600"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Email Address *</label>
                  <Input
                    type="email"
                    value={businessInfo.email}
                    onChange={(e) => updateBusinessInfo('email', e.target.value)}
                    placeholder="business@example.com"
                    className="bg-slate-700 border-slate-600"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Website</label>
                  <Input
                    value={businessInfo.website}
                    onChange={(e) => updateBusinessInfo('website', e.target.value)}
                    placeholder="https://example.com"
                    className="bg-slate-700 border-slate-600"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="legal_docs" className="space-y-6">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                Legal Documents
              </CardTitle>
              <CardDescription>
                Upload required legal documents to verify your business registration
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="p-4 border-2 border-dashed border-slate-600 rounded-lg text-center">
                  <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                  <h4 className="font-medium mb-2">Business License</h4>
                  <p className="text-sm text-gray-400 mb-4">
                    Upload your current business license or registration certificate
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => handleFileUpload('legal_docs', 'business_license')}
                  >
                    Upload Document
                  </Button>
                </div>

                <div className="p-4 border-2 border-dashed border-slate-600 rounded-lg text-center">
                  <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                  <h4 className="font-medium mb-2">Tax Certificate</h4>
                  <p className="text-sm text-gray-400 mb-4">
                    Upload tax registration certificate or EIN letter
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => handleFileUpload('legal_docs', 'tax_id')}
                  >
                    Upload Document
                  </Button>
                </div>

                <div className="p-4 border-2 border-dashed border-slate-600 rounded-lg text-center">
                  <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                  <h4 className="font-medium mb-2">Address Proof</h4>
                  <p className="text-sm text-gray-400 mb-4">
                    Upload utility bill or lease agreement as address proof
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => handleFileUpload('legal_docs', 'address_proof')}
                  >
                    Upload Document
                  </Button>
                </div>

                <div className="p-4 border-2 border-dashed border-slate-600 rounded-lg text-center">
                  <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                  <h4 className="font-medium mb-2">Operating Permits</h4>
                  <p className="text-sm text-gray-400 mb-4">
                    Upload any required industry-specific permits or licenses
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => handleFileUpload('legal_docs', 'business_license')}
                  >
                    Upload Document
                  </Button>
                </div>
              </div>

              {verificationSteps[1].documents.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium">Uploaded Documents</h4>
                  {verificationSteps[1].documents.map((doc) => (
                    <div key={doc.id} className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <FileText className="w-4 h-4 text-gray-400" />
                        <span className="text-sm">{doc.name}</span>
                      </div>
                      <Badge className={`
                        ${doc.status === 'approved' ? 'bg-green-500/20 text-green-400' :
                          doc.status === 'rejected' ? 'bg-red-500/20 text-red-400' :
                          'bg-yellow-500/20 text-yellow-400'}
                      `}>
                        {doc.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="financial_docs" className="space-y-6">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center">
                <CreditCard className="w-5 h-5 mr-2" />
                Financial Verification
              </CardTitle>
              <CardDescription>
                Verify your business financial standing and payment capabilities
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="p-4 border-2 border-dashed border-slate-600 rounded-lg text-center">
                  <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                  <h4 className="font-medium mb-2">Bank Statement</h4>
                  <p className="text-sm text-gray-400 mb-4">
                    Upload recent bank statement (last 3 months)
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => handleFileUpload('financial_docs', 'bank_statement')}
                  >
                    Upload Statement
                  </Button>
                </div>

                <div className="p-4 border-2 border-dashed border-slate-600 rounded-lg text-center">
                  <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                  <h4 className="font-medium mb-2">Financial Records</h4>
                  <p className="text-sm text-gray-400 mb-4">
                    Upload tax returns or financial statements
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => handleFileUpload('financial_docs', 'bank_statement')}
                  >
                    Upload Records
                  </Button>
                </div>
              </div>

              <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                <h4 className="font-medium text-blue-400 mb-2">Why we need financial verification</h4>
                <ul className="text-sm text-gray-300 space-y-1">
                  <li>• Ensure business legitimacy and operational status</li>
                  <li>• Enable higher trust levels with customers</li>
                  <li>• Unlock premium features and higher reward tiers</li>
                  <li>• Comply with financial regulations and KYB requirements</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="identity_verification" className="space-y-6">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="w-5 h-5 mr-2" />
                Identity Verification
              </CardTitle>
              <CardDescription>
                Verify the identity of business owners and authorized representatives
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="p-4 border-2 border-dashed border-slate-600 rounded-lg text-center">
                  <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                  <h4 className="font-medium mb-2">Government ID</h4>
                  <p className="text-sm text-gray-400 mb-4">
                    Upload driver's license, passport, or national ID
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => handleFileUpload('identity_verification', 'identity')}
                  >
                    Upload ID
                  </Button>
                </div>

                <div className="p-4 border-2 border-dashed border-slate-600 rounded-lg text-center">
                  <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                  <h4 className="font-medium mb-2">Proof of Address</h4>
                  <p className="text-sm text-gray-400 mb-4">
                    Upload utility bill or bank statement with your address
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => handleFileUpload('identity_verification', 'address_proof')}
                  >
                    Upload Proof
                  </Button>
                </div>
              </div>

              <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                <h4 className="font-medium text-yellow-400 mb-2">Security & Privacy</h4>
                <p className="text-sm text-gray-300">
                  All uploaded documents are encrypted and stored securely. We only use this information 
                  for verification purposes and comply with all privacy regulations including GDPR and CCPA.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="final_review" className="space-y-6">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center">
                <CheckCircle className="w-5 h-5 mr-2" />
                Final Review
              </CardTitle>
              <CardDescription>
                Review your submission and complete the verification process
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center py-8">
                <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-400" />
                <h3 className="text-xl font-semibold mb-2">Verification Submitted</h3>
                <p className="text-gray-400 mb-6">
                  Your verification documents have been submitted and are under review. 
                  We'll notify you within 2-3 business days with the results.
                </p>
                
                <div className="grid gap-4 md:grid-cols-3 mb-6">
                  <div className="p-4 bg-slate-700/30 rounded-lg">
                    <Clock className="w-6 h-6 mx-auto mb-2 text-blue-400" />
                    <div className="text-sm font-medium">Review Time</div>
                    <div className="text-xs text-gray-400">2-3 business days</div>
                  </div>
                  <div className="p-4 bg-slate-700/30 rounded-lg">
                    <Mail className="w-6 h-6 mx-auto mb-2 text-green-400" />
                    <div className="text-sm font-medium">Email Updates</div>
                    <div className="text-xs text-gray-400">Progress notifications</div>
                  </div>
                  <div className="p-4 bg-slate-700/30 rounded-lg">
                    <Crown className="w-6 h-6 mx-auto mb-2 text-purple-400" />
                    <div className="text-sm font-medium">Premium Features</div>
                    <div className="text-xs text-gray-400">Unlock upon approval</div>
                  </div>
                </div>

                <Button className="bg-green-600 hover:bg-green-700">
                  Track Verification Status
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
          disabled={currentStep === 0}
        >
          Previous Step
        </Button>
        <Button
          onClick={() => setCurrentStep(Math.min(verificationSteps.length - 1, currentStep + 1))}
          disabled={currentStep === verificationSteps.length - 1}
          className="bg-green-600 hover:bg-green-700"
        >
          Next Step
        </Button>
      </div>
    </div>
  )
}