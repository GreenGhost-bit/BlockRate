// components/review-moderation.tsx
"use client";

import { useState, useEffect } from 'react';
import { 
  Flag, 
  AlertTriangle, 
  Shield, 
  Eye, 
  ThumbsUp, 
  ThumbsDown, 
  MessageSquare,
  User,
  Calendar,
  Star,
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp,
  Filter
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';

interface Review {
  id: string;
  businessName: string;
  rating: number;
  content: string;
  authorId: string;
  authorName: string;
  timestamp: Date;
  flags: Flag[];
  status: 'active' | 'flagged' | 'removed' | 'approved';
  qualityScore: number;
  helpfulVotes: number;
  unhelpfulVotes: number;
}

interface Flag {
  id: string;
  type: 'spam' | 'inappropriate' | 'fake' | 'harassment' | 'other';
  reporterId: string;
  reason: string;
  timestamp: Date;
  status: 'pending' | 'reviewed' | 'dismissed';
}

interface ModerationAction {
  id: string;
  reviewId: string;
  moderatorId: string;
  action: 'approve' | 'remove' | 'flag' | 'warn';
  reason: string;
  timestamp: Date;
}

interface QualityMetrics {
  reviewId: string;
  lengthScore: number;
  grammarScore: number;
  originalityScore: number;
  helpfulnessScore: number;
  overallScore: number;
}

export function ReviewModeration() {
  const [activeTab, setActiveTab] = useState('flagged');
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [moderationReason, setModerationReason] = useState('');
  const [filterType, setFilterType] = useState('all');

  const [reviews, setReviews] = useState<Review[]>([
    {
      id: '1',
      businessName: 'Pizza Palace',
      rating: 1,
      content: 'Terrible food, worst experience ever! NEVER GO HERE!!!',
      authorId: 'user1',
      authorName: 'John Doe',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      flags: [
        {
          id: 'f1',
          type: 'inappropriate',
          reporterId: 'user2',
          reason: 'Excessive use of caps and aggressive language',
          timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
          status: 'pending'
        }
      ],
      status: 'flagged',
      qualityScore: 25,
      helpfulVotes: 1,
      unhelpfulVotes: 8
    },
    {
      id: '2',
      businessName: 'Coffee Corner',
      rating: 5,
      content: 'Amazing coffee and great service! The barista was very friendly and the atmosphere is perfect for working.',
      authorId: 'user3',
      authorName: 'Jane Smith',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
      flags: [],
      status: 'active',
      qualityScore: 92,
      helpfulVotes: 15,
      unhelpfulVotes: 2
    },
    {
      id: '3',
      businessName: 'Burger Joint',
      rating: 5,
      content: 'Best burger ever! Amazing! Perfect! Great! Wonderful!',
      authorId: 'user4',
      authorName: 'Bob Wilson',
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
      flags: [
        {
          id: 'f2',
          type: 'spam',
          reporterId: 'user5',
          reason: 'Repetitive content, suspicious pattern',
          timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
          status: 'pending'
        }
      ],
      status: 'flagged',
      qualityScore: 35,
      helpfulVotes: 3,
      unhelpfulVotes: 12
    }
  ]);

  const [moderationActions, setModerationActions] = useState<ModerationAction[]>([]);

  const flaggedReviews = reviews.filter(review => review.status === 'flagged');
  const pendingReviews = reviews.filter(review => review.status === 'active' && review.qualityScore < 60);
  const approvedReviews = reviews.filter(review => review.status === 'approved');

  const handleModerateReview = (reviewId: string, action: 'approve' | 'remove' | 'warn') => {
    const moderationAction: ModerationAction = {
      id: `action_${Date.now()}`,
      reviewId,
      moderatorId: 'current_moderator',
      action,
      reason: moderationReason,
      timestamp: new Date()
    };

    setModerationActions(prev => [...prev, moderationAction]);
    
    setReviews(prev => prev.map(review => {
      if (review.id === reviewId) {
        return {
          ...review,
          status: action === 'approve' ? 'approved' : action === 'remove' ? 'removed' : review.status
        };
      }
      return review;
    }));

    setSelectedReview(null);
    setModerationReason('');
  };

  const handleFlagReview = (reviewId: string, flagType: Flag['type'], reason: string) => {
    const newFlag: Flag = {
      id: `flag_${Date.now()}`,
      type: flagType,
      reporterId: 'current_user',
      reason,
      timestamp: new Date(),
      status: 'pending'
    };

    setReviews(prev => prev.map(review => {
      if (review.id === reviewId) {
        return {
          ...review,
          flags: [...review.flags, newFlag],
          status: 'flagged'
        };
      }
      return review;
    }));
  };

  const calculateQualityScore = (review: Review): QualityMetrics => {
    const lengthScore = Math.min(review.content.length / 100 * 100, 100);
    const grammarScore = review.content.includes('.') && review.content.includes(' ') ? 80 : 40;
    const originalityScore = review.content.split(' ').length > 10 ? 85 : 50;
    const helpfulnessRatio = review.helpfulVotes / (review.helpfulVotes + review.unhelpfulVotes + 1);
    const helpfulnessScore = helpfulnessRatio * 100;
    const overallScore = (lengthScore + grammarScore + originalityScore + helpfulnessScore) / 4;

    return {
      reviewId: review.id,
      lengthScore,
      grammarScore,
      originalityScore,
      helpfulnessScore,
      overallScore
    };
  };

  const detectSpamPatterns = (review: Review): boolean => {
    const suspiciousPatterns = [
      /(.)\1{3,}/g,
      /^(.{1,10})\1+$/,
      /(amazing|great|perfect|wonderful|terrible|awful|worst){3,}/gi,
      /[A-Z]{10,}/
    ];

    return suspiciousPatterns.some(pattern => pattern.test(review.content));
  };

  const getStatusColor = (status: Review['status']) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'flagged':
        return 'bg-red-100 text-red-800';
      case 'removed':
        return 'bg-gray-100 text-gray-800';
      case 'approved':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getFlagTypeColor = (type: Flag['type']) => {
    switch (type) {
      case 'spam':
        return 'bg-orange-100 text-orange-800';
      case 'inappropriate':
        return 'bg-red-100 text-red-800';
      case 'fake':
        return 'bg-purple-100 text-purple-800';
      case 'harassment':
        return 'bg-pink-100 text-pink-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getQualityScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const filteredReviews = () => {
    let reviewsToShow: Review[] = [];
    
    switch (activeTab) {
      case 'flagged':
        reviewsToShow = flaggedReviews;
        break;
      case 'pending':
        reviewsToShow = pendingReviews;
        break;
      case 'approved':
        reviewsToShow = approvedReviews;
        break;
      default:
        reviewsToShow = reviews;
    }

    if (filterType !== 'all') {
      reviewsToShow = reviewsToShow.filter(review => 
        review.flags.some(flag => flag.type === filterType)
      );
    }

    return reviewsToShow;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="w-5 h-5" />
            <span>Community Moderation Dashboard</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">{flaggedReviews.length}</div>
              <div className="text-sm text-muted-foreground">Flagged Reviews</div>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">{pendingReviews.length}</div>
              <div className="text-sm text-muted-foreground">Pending Review</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{approvedReviews.length}</div>
              <div className="text-sm text-muted-foreground">Approved</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{moderationActions.length}</div>
              <div className="text-sm text-muted-foreground">Actions Taken</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex justify-between items-center">
          <TabsList>
            <TabsTrigger value="flagged">Flagged ({flaggedReviews.length})</TabsTrigger>
            <TabsTrigger value="pending">Pending ({pendingReviews.length})</TabsTrigger>
            <TabsTrigger value="approved">Approved ({approvedReviews.length})</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>
          
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-2 border rounded-md bg-background"
          >
            <option value="all">All Types</option>
            <option value="spam">Spam</option>
            <option value="inappropriate">Inappropriate</option>
            <option value="fake">Fake</option>
            <option value="harassment">Harassment</option>
          </select>
        </div>

        <TabsContent value="flagged" className="space-y-4">
          {filteredReviews().map((review) => (
            <Card key={review.id} className="border-l-4 border-l-red-500">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center space-x-3">
                    <Avatar className="w-10 h-10">
                      <AvatarFallback>{review.authorName[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{review.authorName}</div>
                      <div className="text-sm text-muted-foreground">
                        {review.businessName} • {review.timestamp.toLocaleDateString()}
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

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="text-center p-3 bg-muted/50 rounded-lg">
                    <div className={`text-lg font-bold ${getQualityScoreColor(review.qualityScore)}`}>
                      {review.qualityScore}%
                    </div>
                    <div className="text-xs text-muted-foreground">Quality Score</div>
                  </div>
                  <div className="text-center p-3 bg-muted/50 rounded-lg">
                    <div className="text-lg font-bold text-green-600">{review.helpfulVotes}</div>
                    <div className="text-xs text-muted-foreground">Helpful Votes</div>
                  </div>
                  <div className="text-center p-3 bg-muted/50 rounded-lg">
                    <div className="text-lg font-bold text-red-600">{review.flags.length}</div>
                    <div className="text-xs text-muted-foreground">Flags</div>
                  </div>
                </div>

                {review.flags.length > 0 && (
                  <div className="mb-4">
                    <div className="text-sm font-medium mb-2">Flags:</div>
                    <div className="space-y-2">
                      {review.flags.map((flag) => (
                        <div key={flag.id} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                          <div className="flex items-center space-x-2">
                            <Badge variant="secondary" className={getFlagTypeColor(flag.type)}>
                              {flag.type}
                            </Badge>
                            <span className="text-sm">{flag.reason}</span>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {flag.timestamp.toLocaleDateString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleModerateReview(review.id, 'approve')}
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleModerateReview(review.id, 'remove')}
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Remove
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => setSelectedReview(review)}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Review Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="pending" className="space-y-4">
          {filteredReviews().map((review) => {
            const qualityMetrics = calculateQualityScore(review);
            const isSpam = detectSpamPatterns(review);
            
            return (
              <Card key={review.id} className="border-l-4 border-l-yellow-500">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center space-x-3">
                      <Avatar className="w-10 h-10">
                        <AvatarFallback>{review.authorName[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{review.authorName}</div>
                        <div className="text-sm text-muted-foreground">
                          {review.businessName} • {review.timestamp.toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {isSpam && (
                        <Badge variant="destructive">
                          <AlertTriangle className="w-3 h-3 mr-1" />
                          Spam Detected
                        </Badge>
                      )}
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  <p className="mb-4 text-sm">{review.content}</p>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
                    <div className="text-center p-2 bg-muted/50 rounded">
                      <div className="text-sm font-bold">{qualityMetrics.lengthScore.toFixed(0)}%</div>
                      <div className="text-xs text-muted-foreground">Length</div>
                    </div>
                    <div className="text-center p-2 bg-muted/50 rounded">
                      <div className="text-sm font-bold">{qualityMetrics.grammarScore.toFixed(0)}%</div>
                      <div className="text-xs text-muted-foreground">Grammar</div>
                    </div>
                    <div className="text-center p-2 bg-muted/50 rounded">
                      <div className="text-sm font-bold">{qualityMetrics.originalityScore.toFixed(0)}%</div>
                      <div className="text-xs text-muted-foreground">Originality</div>
                    </div>
                    <div className="text-center p-2 bg-muted/50 rounded">
                      <div className="text-sm font-bold">{qualityMetrics.helpfulnessScore.toFixed(0)}%</div>
                      <div className="text-xs text-muted-foreground">Helpfulness</div>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      onClick={() => handleModerateReview(review.id, 'approve')}
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleFlagReview(review.id, 'spam', 'Auto-detected spam pattern')}
                    >
                      <Flag className="w-4 h-4 mr-2" />
                      Flag as Spam
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </TabsContent>

        <TabsContent value="approved" className="space-y-4">
          {filteredReviews().map((review) => (
            <Card key={review.id} className="border-l-4 border-l-green-500">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center space-x-3">
                    <Avatar className="w-10 h-10">
                      <AvatarFallback>{review.authorName[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{review.authorName}</div>
                      <div className="text-sm text-muted-foreground">
                        {review.businessName} • {review.timestamp.toLocaleDateString()}
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

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <ThumbsUp className="w-4 h-4 text-green-600" />
                      <span className="text-sm">{review.helpfulVotes}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <ThumbsDown className="w-4 h-4 text-red-600" />
                      <span className="text-sm">{review.unhelpfulVotes}</span>
                    </div>
                  </div>
                  <div className="text-sm text-green-600 font-medium">
                    Quality Score: {review.qualityScore}%
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Moderation Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Spam Detection Rate</span>
                      <span>85%</span>
                    </div>
                    <Progress value={85} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Community Reports</span>
                      <span>67%</span>
                    </div>
                    <Progress value={67} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>False Positive Rate</span>
                      <span>12%</span>
                    </div>
                    <Progress value={12} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quality Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Average Quality Score</span>
                    <span className="font-medium">78%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">High Quality Reviews</span>
                    <span className="font-medium">156</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Reviews Flagged</span>
                    <span className="font-medium">23</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Action Response Time</span>
                    <span className="font-medium">2.3 hours</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {selectedReview && (
        <Card className="border-2 border-primary">
          <CardHeader>
            <CardTitle>Review Details & Moderation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="font-medium">"{selectedReview.content}"</p>
                <div className="text-sm text-muted-foreground mt-2">
                  By {selectedReview.authorName} • {selectedReview.timestamp.toLocaleDateString()}
                </div>
              </div>
              
              <Textarea
                placeholder="Enter moderation reason..."
                value={moderationReason}
                onChange={(e) => setModerationReason(e.target.value)}
              />
              
              <div className="flex space-x-2">
                <Button
                  onClick={() => handleModerateReview(selectedReview.id, 'approve')}
                  disabled={!moderationReason.trim()}
                >
                  Approve Review
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleModerateReview(selectedReview.id, 'remove')}
                  disabled={!moderationReason.trim()}
                >
                  Remove Review
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleModerateReview(selectedReview.id, 'warn')}
                  disabled={!moderationReason.trim()}
                >
                  Warn User
                </Button>
                <Button
                  variant="ghost"
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