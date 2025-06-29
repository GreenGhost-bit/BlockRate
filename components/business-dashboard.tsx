// components/business-dashboard.tsx
"use client";

import { useState, useEffect } from 'react';
import { 
  Store, 
  Star, 
  TrendingUp, 
  TrendingDown, 
  MessageSquare, 
  Users, 
  Calendar, 
  BarChart3,
  Reply,
  Send,
  Eye,
  Heart,
  AlertCircle,
  CheckCircle,
  Clock,
  Target,
  Zap,
  Settings,
  Download
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';

interface BusinessReview {
  id: string;
  customerName: string;
  rating: number;
  content: string;
  timestamp: Date;
  responded: boolean;
  response?: string;
  responseTimestamp?: Date;
  helpful: number;
  views: number;
  status: 'new' | 'responded' | 'escalated';
}

interface ResponseTemplate {
  id: string;
  name: string;
  content: string;
  category: 'positive' | 'negative' | 'neutral';
  useCount: number;
}

interface BusinessMetrics {
  totalReviews: number;
  averageRating: number;
  responseRate: number;
  averageResponseTime: number;
  monthlyGrowth: number;
  customerSatisfaction: number;
}

interface InsightData {
  category: string;
  positive: number;
  negative: number;
  suggestions: string[];
}

export function BusinessDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedReview, setSelectedReview] = useState<BusinessReview | null>(null);
  const [responseText, setResponseText] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');

  const [businessMetrics, setBusinessMetrics] = useState<BusinessMetrics>({
    totalReviews: 245,
    averageRating: 4.3,
    responseRate: 78,
    averageResponseTime: 4.2,
    monthlyGrowth: 12,
    customerSatisfaction: 86
  });

  const [reviews, setReviews] = useState<BusinessReview[]>([
    {
      id: '1',
      customerName: 'Sarah Johnson',
      rating: 5,
      content: 'Absolutely amazing experience! The service was exceptional and the food was delicious. Will definitely be coming back.',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      responded: false,
      helpful: 8,
      views: 23,
      status: 'new'
    },
    {
      id: '2',
      customerName: 'Mike Chen',
      rating: 2,
      content: 'Food was cold when it arrived and the service was slow. Not happy with the experience.',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
      responded: true,
      response: 'Thank you for your feedback. We apologize for the poor experience. Please reach out to us directly so we can make this right.',
      responseTimestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
      helpful: 3,
      views: 15,
      status: 'responded'
    },
    {
      id: '3',
      customerName: 'Emily Davis',
      rating: 4,
      content: 'Great atmosphere and friendly staff. The only issue was the wait time, but overall a good experience.',
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
      responded: false,
      helpful: 12,
      views: 31,
      status: 'new'
    }
  ]);

  const [responseTemplates, setResponseTemplates] = useState<ResponseTemplate[]>([
    {
      id: '1',
      name: 'Thank You - Positive',
      content: 'Thank you so much for your wonderful review! We\'re thrilled that you had a great experience with us. We look forward to welcoming you back soon!',
      category: 'positive',
      useCount: 45
    },
    {
      id: '2',
      name: 'Apology - Service Issue',
      content: 'We sincerely apologize for the service issues you experienced. This is not the standard we strive for. Please contact us directly at [contact] so we can make this right.',
      category: 'negative',
      useCount: 23
    },
    {
      id: '3',
      name: 'Food Quality Concern',
      content: 'Thank you for bringing this to our attention. Food quality is our top priority, and we\'re disappointed we didn\'t meet your expectations. We\'d love the opportunity to make it up to you.',
      category: 'negative',
      useCount: 18
    },
    {
      id: '4',
      name: 'General Thank You',
      content: 'Thank you for taking the time to share your feedback. We appreciate your business and look forward to serving you again.',
      category: 'neutral',
      useCount: 67
    }
  ]);

  const [insights, setInsights] = useState<InsightData[]>([
    {
      category: 'Food Quality',
      positive: 85,
      negative: 15,
      suggestions: ['Maintain current standards', 'Consider seasonal menu updates']
    },
    {
      category: 'Service',
      positive: 72,
      negative: 28,
      suggestions: ['Improve wait times', 'Additional staff training', 'Better communication']
    },
    {
      category: 'Atmosphere',
      positive: 91,
      negative: 9,
      suggestions: ['Continue current approach', 'Consider music playlist updates']
    },
    {
      category: 'Value',
      positive: 68,
      negative: 32,
      suggestions: ['Review pricing strategy', 'Highlight value propositions', 'Consider promotions']
    }
  ]);

  const newReviews = reviews.filter(review => review.status === 'new');
  const respondedReviews = reviews.filter(review => review.status === 'responded');

  const handleResponseSubmit = (reviewId: string) => {
    setReviews(prev => prev.map(review => {
      if (review.id === reviewId) {
        return {
          ...review,
          responded: true,
          response: responseText,
          responseTimestamp: new Date(),
          status: 'responded'
        };
      }
      return review;
    }));

    setBusinessMetrics(prev => ({
      ...prev,
      responseRate: Math.min(100, prev.responseRate + 1)
    }));

    setSelectedReview(null);
    setResponseText('');
    setSelectedTemplate('');
  };

  const handleTemplateSelect = (templateId: string) => {
    const template = responseTemplates.find(t => t.id === templateId);
    if (template) {
      setResponseText(template.content);
      setSelectedTemplate(templateId);
      
      setResponseTemplates(prev => prev.map(t => 
        t.id === templateId ? { ...t, useCount: t.useCount + 1 } : t
      ));
    }
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 4) return 'text-green-600';
    if (rating >= 3) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getStatusColor = (status: BusinessReview['status']) => {
    switch (status) {
      case 'new':
        return 'bg-blue-100 text-blue-800';
      case 'responded':
        return 'bg-green-100 text-green-800';
      case 'escalated':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getMetricTrend = (value: number, threshold: number) => {
    if (value >= threshold) {
      return { icon: TrendingUp, color: 'text-green-600' };
    }
    return { icon: TrendingDown, color: 'text-red-600' };
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Store className="w-5 h-5" />
            <span>Business Dashboard</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{businessMetrics.totalReviews}</div>
              <div className="text-sm text-muted-foreground">Total Reviews</div>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">{businessMetrics.averageRating.toFixed(1)}</div>
              <div className="text-sm text-muted-foreground">Avg Rating</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{businessMetrics.responseRate}%</div>
              <div className="text-sm text-muted-foreground">Response Rate</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{businessMetrics.averageResponseTime.toFixed(1)}h</div>
              <div className="text-sm text-muted-foreground">Avg Response</div>
            </div>
            <div className="text-center p-4 bg-indigo-50 rounded-lg">
              <div className="text-2xl font-bold text-indigo-600">{businessMetrics.monthlyGrowth}%</div>
              <div className="text-sm text-muted-foreground">Monthly Growth</div>
            </div>
            <div className="text-center p-4 bg-pink-50 rounded-lg">
              <div className="text-2xl font-bold text-pink-600">{businessMetrics.customerSatisfaction}%</div>
              <div className="text-sm text-muted-foreground">Satisfaction</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="reviews">Reviews ({newReviews.length})</TabsTrigger>
          <TabsTrigger value="responses">Responses</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {reviews.slice(0, 3).map((review) => (
                    <div key={review.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback>{review.customerName[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-sm">{review.customerName}</span>
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-3 h-3 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground truncate">
                          {review.content}
                        </p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant="secondary" className={getStatusColor(review.status)}>
                            {review.status}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {review.timestamp.toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm">Response Rate</span>
                      <span className="text-sm font-medium">{businessMetrics.responseRate}%</span>
                    </div>
                    <Progress value={businessMetrics.responseRate} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm">Customer Satisfaction</span>
                      <span className="text-sm font-medium">{businessMetrics.customerSatisfaction}%</span>
                    </div>
                    <Progress value={businessMetrics.customerSatisfaction} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm">Review Growth</span>
                      <span className="text-sm font-medium">{businessMetrics.monthlyGrowth}%</span>
                    </div>
                    <Progress value={businessMetrics.monthlyGrowth} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button variant="outline" className="h-20 flex flex-col space-y-2">
                  <MessageSquare className="w-5 h-5" />
                  <span className="text-sm">Respond to Reviews</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col space-y-2">
                  <BarChart3 className="w-5 h-5" />
                  <span className="text-sm">View Analytics</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col space-y-2">
                  <Download className="w-5 h-5" />
                  <span className="text-sm">Export Data</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col space-y-2">
                  <Settings className="w-5 h-5" />
                  <span className="text-sm">Settings</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reviews" className="space-y-4">
          {newReviews.map((review) => (
            <Card key={review.id} className="border-l-4 border-l-blue-500">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center space-x-3">
                    <Avatar className="w-10 h-10">
                      <AvatarFallback>{review.customerName[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{review.customerName}</div>
                      <div className="text-sm text-muted-foreground">
                        {review.timestamp.toLocaleDateString()} • {review.timestamp.toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                        />
                      ))}
                    </div>
                    <Badge variant="secondary" className={getStatusColor(review.status)}>
                      {review.status}
                    </Badge>
                  </div>
                </div>

                <p className="mb-4 text-sm">{review.content}</p>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <Heart className="w-4 h-4 text-red-500" />
                      <span className="text-sm">{review.helpful}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Eye className="w-4 h-4 text-blue-500" />
                      <span className="text-sm">{review.views}</span>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => setSelectedReview(review)}
                  >
                    <Reply className="w-4 h-4 mr-2" />
                    Respond
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="responses" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Response Templates</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {responseTemplates.map((template) => (
                    <div key={template.id} className="p-3 border rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <div className="font-medium text-sm">{template.name}</div>
                        <Badge 
                          variant="secondary" 
                          className={
                            template.category === 'positive' ? 'bg-green-100 text-green-800' :
                            template.category === 'negative' ? 'bg-red-100 text-red-800' :
                            'bg-blue-100 text-blue-800'
                          }
                        >
                          {template.category}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                        {template.content}
                      </p>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-muted-foreground">
                          Used {template.useCount} times
                        </span>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleTemplateSelect(template.id)}
                        >
                          Use Template
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Response Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Average Response Time</span>
                    <span className="font-medium">{businessMetrics.averageResponseTime.toFixed(1)} hours</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Response Rate</span>
                    <span className="font-medium">{businessMetrics.responseRate}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Templates Used</span>
                    <span className="font-medium">{responseTemplates.reduce((sum, t) => sum + t.useCount, 0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Customer Follow-ups</span>
                    <span className="font-medium">23</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Recent Responses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {respondedReviews.map((review) => (
                  <div key={review.id} className="border rounded-lg p-4">
                    <div className="flex items-center space-x-3 mb-3">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback>{review.customerName[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium text-sm">{review.customerName}</div>
                        <div className="text-xs text-muted-foreground">
                          {review.timestamp.toLocaleDateString()}
                        </div>
                      </div>
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3 h-3 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                          />
                        ))}
                      </div>
                    </div>
                    
                    <div className="bg-muted/50 p-3 rounded mb-3">
                      <p className="text-sm">{review.content}</p>
                    </div>
                    
                    {review.response && (
                      <div className="bg-blue-50 p-3 rounded">
                        <div className="flex items-center space-x-2 mb-2">
                          <Badge variant="secondary">Your Response</Badge>
                          <span className="text-xs text-muted-foreground">
                            {review.responseTimestamp?.toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-sm">{review.response}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {insights.map((insight) => (
              <Card key={insight.category}>
                <CardHeader>
                  <CardTitle className="text-lg">{insight.category}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Positive Sentiment</span>
                        <span>{insight.positive}%</span>
                      </div>
                      <Progress value={insight.positive} className="h-2" />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="text-sm font-medium">Suggestions:</div>
                      {insight.suggestions.map((suggestion, index) => (
                        <div key={index} className="flex items-start space-x-2">
                          <Target className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-muted-foreground">{suggestion}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Reputation Management Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <div className="font-medium text-sm mb-1">Respond Quickly</div>
                  <div className="text-xs text-muted-foreground">Aim for under 4 hours</div>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <Zap className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <div className="font-medium text-sm mb-1">Be Personal</div>
                  <div className="text-xs text-muted-foreground">Use customer names</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <Heart className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                  <div className="font-medium text-sm mb-1">Show Appreciation</div>
                  <div className="text-xs text-muted-foreground">Thank all reviewers</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">New Review Alerts</div>
                    <div className="text-sm text-muted-foreground">Get notified when new reviews are posted</div>
                  </div>
                  <Button variant="outline" size="sm">Configure</Button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Response Reminders</div>
                    <div className="text-sm text-muted-foreground">Remind me to respond to reviews</div>
                  </div>
                  <Button variant="outline" size="sm">Configure</Button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Weekly Reports</div>
                    <div className="text-sm text-muted-foreground">Receive weekly analytics summaries</div>
                  </div>
                  <Button variant="outline" size="sm">Configure</Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Business Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Business Name</label>
                  <Input defaultValue="My Restaurant" className="mt-1" />
                </div>
                <div>
                  <label className="text-sm font-medium">Contact Email</label>
                  <Input defaultValue="contact@myrestaurant.com" className="mt-1" />
                </div>
                <div>
                  <label className="text-sm font-medium">Response Signature</label>
                  <Textarea 
                    defaultValue="Thank you for your review!&#10;&#10;Best regards,&#10;The Management Team" 
                    className="mt-1"
                  />
                </div>
                <Button>Save Changes</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {selectedReview && (
        <Card className="border-2 border-primary">
          <CardHeader>
            <CardTitle>Respond to Review</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center space-x-3 mb-3">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback>{selectedReview.customerName[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{selectedReview.customerName}</div>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${i < selectedReview.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-sm">{selectedReview.content}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium">Quick Templates:</label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {responseTemplates.map((template) => (
                    <Button
                      key={template.id}
                      variant="outline"
                      size="sm"
                      onClick={() => handleTemplateSelect(template.id)}
                    >
                      {template.name}
                    </Button>
                  ))}
                </div>
              </div>
              
              <Textarea
                placeholder="Write your response..."
                value={responseText}
                onChange={(e) => setResponseText(e.target.value)}
                rows={4}
              />
              
              <div className="flex space-x-2">
                <Button
                  onClick={() => handleResponseSubmit(selectedReview.id)}
                  disabled={!responseText.trim()}
                >
                  <Send className="w-4 h-4 mr-2" />
                  Send Response
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setSelectedReview(null)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}