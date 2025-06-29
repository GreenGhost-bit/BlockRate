// components/social-features.tsx
"use client";

import { useState, useEffect } from 'react';
import { 
  Share2, 
  Users, 
  Heart, 
  MessageCircle, 
  Bookmark, 
  UserPlus, 
  UserMinus,
  Star,
  TrendingUp,
  Eye,
  ThumbsUp,
  Send,
  Copy,
  ExternalLink,
  Award,
  Crown,
  Zap,
  Target,
  Globe,
  Lock,
  Settings,
  Filter,
  Search
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface SocialUser {
  id: string;
  username: string;
  displayName: string;
  avatar?: string;
  bio: string;
  followers: number;
  following: number;
  reviewCount: number;
  totalLikes: number;
  rank: string;
  isVerified: boolean;
  isFollowing: boolean;
  badges: string[];
}

interface SocialReview {
  id: string;
  businessName: string;
  businessCategory: string;
  rating: number;
  content: string;
  photos: string[];
  author: SocialUser;
  timestamp: Date;
  likes: number;
  comments: number;
  shares: number;
  isLiked: boolean;
  isBookmarked: boolean;
  tags: string[];
  location: string;
}

interface ReviewCollection {
  id: string;
  name: string;
  description: string;
  reviews: SocialReview[];
  isPublic: boolean;
  followers: number;
  author: SocialUser;
  tags: string[];
  coverImage?: string;
}

interface Comment {
  id: string;
  author: SocialUser;
  content: string;
  timestamp: Date;
  likes: number;
  isLiked: boolean;
}

export function SocialFeatures() {
  const [activeTab, setActiveTab] = useState('feed');
  const [selectedReview, setSelectedReview] = useState<SocialReview | null>(null);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const [socialFeed, setSocialFeed] = useState<SocialReview[]>([
    {
      id: '1',
      businessName: 'The Artisan Café',
      businessCategory: 'Coffee Shop',
      rating: 5,
      content: 'Found this hidden gem in downtown! Their lavender latte is absolutely divine and the atmosphere is perfect for work meetings. The barista even drew a cute latte art. Highly recommend for coffee lovers! ☕️✨',
      photos: ['cafe-1.jpg', 'latte-art.jpg'],
      author: {
        id: 'user1',
        username: 'foodie_sarah',
        displayName: 'Sarah M.',
        bio: 'Coffee enthusiast & food blogger',
        followers: 1247,
        following: 389,
        reviewCount: 156,
        totalLikes: 3429,
        rank: 'Gold Reviewer',
        isVerified: true,
        isFollowing: false,
        badges: ['Coffee Expert', 'Local Guide', 'Top Reviewer']
      },
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      likes: 24,
      comments: 8,
      shares: 5,
      isLiked: false,
      isBookmarked: true,
      tags: ['coffee', 'downtown', 'cozy', 'wifi'],
      location: 'Downtown District'
    },
    {
      id: '2',
      businessName: 'Sakura Sushi Bar',
      businessCategory: 'Japanese Restaurant',
      rating: 4,
      content: 'Incredible omakase experience! The chef was friendly and explained each piece. Fresh ingredients and beautiful presentation. A bit pricey but worth it for special occasions. The salmon was melt-in-your-mouth perfect! 🍣',
      photos: ['sushi-platter.jpg'],
      author: {
        id: 'user2',
        username: 'mike_eats',
        displayName: 'Mike Chen',
        bio: 'Food adventurer exploring the city',
        followers: 892,
        following: 567,
        reviewCount: 203,
        totalLikes: 2156,
        rank: 'Silver Reviewer',
        isVerified: false,
        isFollowing: true,
        badges: ['Sushi Lover', 'Adventurous Eater']
      },
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
      likes: 31,
      comments: 12,
      shares: 8,
      isLiked: true,
      isBookmarked: false,
      tags: ['sushi', 'omakase', 'fresh', 'expensive'],
      location: 'Midtown'
    }
  ]);

  const [topReviewers, setTopReviewers] = useState<SocialUser[]>([
    {
      id: 'user3',
      username: 'restaurant_guru',
      displayName: 'Alex Rodriguez',
      bio: 'Restaurant critic & culinary expert',
      followers: 5432,
      following: 234,
      reviewCount: 1247,
      totalLikes: 15678,
      rank: 'Diamond Reviewer',
      isVerified: true,
      isFollowing: false,
      badges: ['Master Critic', 'Verified Expert', 'Top 1%']
    },
    {
      id: 'user4',
      username: 'local_foodie',
      displayName: 'Emma Wilson',
      bio: 'Discovering local gems one bite at a time',
      followers: 2891,
      following: 445,
      reviewCount: 678,
      totalLikes: 8934,
      rank: 'Platinum Reviewer',
      isVerified: true,
      isFollowing: true,
      badges: ['Local Expert', 'Trendsetter']
    }
  ]);

  const [myCollections, setMyCollections] = useState<ReviewCollection[]>([
    {
      id: 'col1',
      name: 'Best Coffee Spots',
      description: 'My favorite coffee shops around the city',
      reviews: socialFeed.filter(r => r.businessCategory === 'Coffee Shop'),
      isPublic: true,
      followers: 156,
      author: {
        id: 'current_user',
        username: 'my_username',
        displayName: 'You',
        bio: '',
        followers: 234,
        following: 189,
        reviewCount: 67,
        totalLikes: 892,
        rank: 'Gold Reviewer',
        isVerified: false,
        isFollowing: false,
        badges: []
      },
      tags: ['coffee', 'favorites', 'recommendations']
    },
    {
      id: 'col2',
      name: 'Date Night Restaurants',
      description: 'Perfect spots for romantic dinners',
      reviews: [],
      isPublic: false,
      followers: 89,
      author: {
        id: 'current_user',
        username: 'my_username',
        displayName: 'You',
        bio: '',
        followers: 234,
        following: 189,
        reviewCount: 67,
        totalLikes: 892,
        rank: 'Gold Reviewer',
        isVerified: false,
        isFollowing: false,
        badges: []
      },
      tags: ['romantic', 'dinner', 'date-night']
    }
  ]);

  const [comments, setComments] = useState<{ [reviewId: string]: Comment[] }>({
    '1': [
      {
        id: 'c1',
        author: topReviewers[1],
        content: 'Thanks for the recommendation! Adding this to my coffee list 🙌',
        timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
        likes: 3,
        isLiked: false
      },
      {
        id: 'c2',
        author: topReviewers[0],
        content: 'I love their pastries too! The almond croissant is incredible.',
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
        likes: 1,
        isLiked: true
      }
    ]
  });

  const handleLikeReview = (reviewId: string) => {
    setSocialFeed(prev => prev.map(review => {
      if (review.id === reviewId) {
        return {
          ...review,
          isLiked: !review.isLiked,
          likes: review.isLiked ? review.likes - 1 : review.likes + 1
        };
      }
      return review;
    }));
  };

  const handleBookmarkReview = (reviewId: string) => {
    setSocialFeed(prev => prev.map(review => {
      if (review.id === reviewId) {
        return {
          ...review,
          isBookmarked: !review.isBookmarked
        };
      }
      return review;
    }));
  };

  const handleFollowUser = (userId: string) => {
    setTopReviewers(prev => prev.map(user => {
      if (user.id === userId) {
        return {
          ...user,
          isFollowing: !user.isFollowing,
          followers: user.isFollowing ? user.followers - 1 : user.followers + 1
        };
      }
      return user;
    }));

    setSocialFeed(prev => prev.map(review => {
      if (review.author.id === userId) {
        return {
          ...review,
          author: {
            ...review.author,
            isFollowing: !review.author.isFollowing,
            followers: review.author.isFollowing ? review.author.followers - 1 : review.author.followers + 1
          }
        };
      }
      return review;
    }));
  };

  const handleShareReview = async (review: SocialReview, platform: string) => {
    const shareText = `Check out this review of ${review.businessName}: "${review.content.substring(0, 100)}..." - ${review.rating}/5 stars`;
    const shareUrl = `https://blockrate.app/review/${review.id}`;

    switch (platform) {
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`);
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`);
        break;
      case 'copy':
        await navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
        break;
    }

    setSocialFeed(prev => prev.map(r => 
      r.id === review.id ? { ...r, shares: r.shares + 1 } : r
    ));
    setShareDialogOpen(false);
  };

  const handleAddComment = (reviewId: string) => {
    if (!newComment.trim()) return;

    const comment: Comment = {
      id: `c${Date.now()}`,
      author: {
        id: 'current_user',
        username: 'my_username',
        displayName: 'You',
        bio: '',
        followers: 234,
        following: 189,
        reviewCount: 67,
        totalLikes: 892,
        rank: 'Gold Reviewer',
        isVerified: false,
        isFollowing: false,
        badges: []
      },
      content: newComment,
      timestamp: new Date(),
      likes: 0,
      isLiked: false
    };

    setComments(prev => ({
      ...prev,
      [reviewId]: [...(prev[reviewId] || []), comment]
    }));

    setSocialFeed(prev => prev.map(review => 
      review.id === reviewId 
        ? { ...review, comments: review.comments + 1 }
        : review
    ));

    setNewComment('');
  };

  const getRankColor = (rank: string) => {
    switch (rank) {
      case 'Diamond Reviewer': return 'text-purple-600';
      case 'Platinum Reviewer': return 'text-gray-600';
      case 'Gold Reviewer': return 'text-yellow-600';
      case 'Silver Reviewer': return 'text-gray-500';
      default: return 'text-gray-400';
    }
  };

  const getRankIcon = (rank: string) => {
    switch (rank) {
      case 'Diamond Reviewer': return <Crown className="w-4 h-4" />;
      case 'Platinum Reviewer': return <Award className="w-4 h-4" />;
      case 'Gold Reviewer': return <Star className="w-4 h-4" />;
      default: return <Target className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="w-5 h-5" />
            <span>Social Feed</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">234</div>
              <div className="text-sm text-muted-foreground">Followers</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">189</div>
              <div className="text-sm text-muted-foreground">Following</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">67</div>
              <div className="text-sm text-muted-foreground">Reviews</div>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">892</div>
              <div className="text-sm text-muted-foreground">Total Likes</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="feed">Feed</TabsTrigger>
          <TabsTrigger value="following">Following</TabsTrigger>
          <TabsTrigger value="collections">Collections</TabsTrigger>
          <TabsTrigger value="discover">Discover</TabsTrigger>
          <TabsTrigger value="trending">Trending</TabsTrigger>
        </TabsList>

        <TabsContent value="feed" className="space-y-4">
          <div className="space-y-6">
            {socialFeed.map((review) => (
              <Card key={review.id} className="overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4 mb-4">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={review.author.avatar} />
                      <AvatarFallback>{review.author.displayName[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <div className="font-medium">{review.author.displayName}</div>
                        <div className="text-sm text-muted-foreground">@{review.author.username}</div>
                        {review.author.isVerified && (
                          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                            <Zap className="w-3 h-3 mr-1" />
                            Verified
                          </Badge>
                        )}
                        <div className={`flex items-center space-x-1 ${getRankColor(review.author.rank)}`}>
                          {getRankIcon(review.author.rank)}
                          <span className="text-xs font-medium">{review.author.rank}</span>
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {review.timestamp.toLocaleDateString()} • {review.location}
                      </div>
                    </div>
                    <Button
                      variant={review.author.isFollowing ? "secondary" : "outline"}
                      size="sm"
                      onClick={() => handleFollowUser(review.author.id)}
                    >
                      {review.author.isFollowing ? (
                        <>
                          <UserMinus className="w-4 h-4 mr-2" />
                          Unfollow
                        </>
                      ) : (
                        <>
                          <UserPlus className="w-4 h-4 mr-2" />
                          Follow
                        </>
                      )}
                    </Button>
                  </div>

                  <div className="mb-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="font-semibold">{review.businessName}</h3>
                      <Badge variant="secondary">{review.businessCategory}</Badge>
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm mb-3">{review.content}</p>
                    
                    {review.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {review.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            #{tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between border-t pt-4">
                    <div className="flex items-center space-x-6">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleLikeReview(review.id)}
                        className={review.isLiked ? 'text-red-600' : ''}
                      >
                        <Heart className={`w-4 h-4 mr-2 ${review.isLiked ? 'fill-current' : ''}`} />
                        {review.likes}
                      </Button>
                      
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MessageCircle className="w-4 h-4 mr-2" />
                            {review.comments}
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Comments</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4 max-h-96 overflow-y-auto">
                            {(comments[review.id] || []).map((comment) => (
                              <div key={comment.id} className="flex items-start space-x-3">
                                <Avatar className="w-8 h-8">
                                  <AvatarFallback>{comment.author.displayName[0]}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                  <div className="bg-muted p-3 rounded-lg">
                                    <div className="font-medium text-sm">{comment.author.displayName}</div>
                                    <div className="text-sm">{comment.content}</div>
                                  </div>
                                  <div className="flex items-center space-x-2 mt-1">
                                    <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                                      <ThumbsUp className="w-3 h-3 mr-1" />
                                      {comment.likes}
                                    </Button>
                                    <span className="text-xs text-muted-foreground">
                                      {comment.timestamp.toLocaleDateString()}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                          <div className="flex space-x-2">
                            <Input
                              value={newComment}
                              onChange={(e) => setNewComment(e.target.value)}
                              placeholder="Write a comment..."
                              onKeyDown={(e) => e.key === 'Enter' && handleAddComment(review.id)}
                            />
                            <Button onClick={() => handleAddComment(review.id)}>
                              <Send className="w-4 h-4" />
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>

                      <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="sm" onClick={() => setSelectedReview(review)}>
                            <Share2 className="w-4 h-4 mr-2" />
                            {review.shares}
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Share Review</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="p-4 bg-muted rounded-lg">
                              <div className="font-medium">{selectedReview?.businessName}</div>
                              <div className="text-sm text-muted-foreground line-clamp-2">
                                {selectedReview?.content}
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <Button
                                variant="outline"
                                onClick={() => selectedReview && handleShareReview(selectedReview, 'twitter')}
                              >
                                <ExternalLink className="w-4 h-4 mr-2" />
                                Twitter
                              </Button>
                              <Button
                                variant="outline"
                                onClick={() => selectedReview && handleShareReview(selectedReview, 'facebook')}
                              >
                                <ExternalLink className="w-4 h-4 mr-2" />
                                Facebook
                              </Button>
                              <Button
                                variant="outline"
                                onClick={() => selectedReview && handleShareReview(selectedReview, 'copy')}
                              >
                                <Copy className="w-4 h-4 mr-2" />
                                Copy Link
                              </Button>
                              <Button
                                variant="outline"
                                onClick={() => selectedReview && handleShareReview(selectedReview, 'instagram')}
                              >
                                <ExternalLink className="w-4 h-4 mr-2" />
                                Instagram
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleBookmarkReview(review.id)}
                      className={review.isBookmarked ? 'text-blue-600' : ''}
                    >
                      <Bookmark className={`w-4 h-4 ${review.isBookmarked ? 'fill-current' : ''}`} />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="following" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>People You Follow</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topReviewers.filter(user => user.isFollowing).map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <Avatar className="w-12 h-12">
                        <AvatarFallback>{user.displayName[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center space-x-2">
                          <div className="font-medium">{user.displayName}</div>
                          {user.isVerified && (
                            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                              <Zap className="w-3 h-3 mr-1" />
                              Verified
                            </Badge>
                          )}
                        </div>
                        <div className="text-sm text-muted-foreground">@{user.username}</div>
                        <div className="text-sm text-muted-foreground">{user.bio}</div>
                        <div className="flex space-x-4 text-xs text-muted-foreground mt-1">
                          <span>{user.followers} followers</span>
                          <span>{user.reviewCount} reviews</span>
                          <span>{user.totalLikes} likes</span>
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleFollowUser(user.id)}
                    >
                      <UserMinus className="w-4 h-4 mr-2" />
                      Unfollow
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="collections" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">My Collections</h3>
            <Button>
              <Bookmark className="w-4 h-4 mr-2" />
              Create Collection
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {myCollections.map((collection) => (
              <Card key={collection.id}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="font-medium">{collection.name}</h4>
                      <p className="text-sm text-muted-foreground">{collection.description}</p>
                    </div>
                    <div className="flex items-center space-x-1">
                      {collection.isPublic ? (
                        <Globe className="w-4 h-4 text-green-600" />
                      ) : (
                        <Lock className="w-4 h-4 text-gray-600" />
                      )}
                      <Settings className="w-4 h-4 text-muted-foreground" />
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1 mb-4">
                    {collection.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        #{tag}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex space-x-4 text-sm text-muted-foreground">
                      <span>{collection.reviews.length} reviews</span>
                      <span>{collection.followers} followers</span>
                    </div>
                    <Button variant="outline" size="sm">
                      View Collection
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="discover" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Discover New Reviewers</CardTitle>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search reviewers..."
                  className="pl-10"
                />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topReviewers.filter(user => !user.isFollowing).map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <Avatar className="w-12 h-12">
                        <AvatarFallback>{user.displayName[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center space-x-2">
                          <div className="font-medium">{user.displayName}</div>
                          {user.isVerified && (
                            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                              <Zap className="w-3 h-3 mr-1" />
                              Verified
                            </Badge>
                          )}
                          <div className={`flex items-center space-x-1 ${getRankColor(user.rank)}`}>
                            {getRankIcon(user.rank)}
                            <span className="text-xs font-medium">{user.rank}</span>
                          </div>
                        </div>
                        <div className="text-sm text-muted-foreground">@{user.username}</div>
                        <div className="text-sm text-muted-foreground">{user.bio}</div>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {user.badges.map((badge) => (
                            <Badge key={badge} variant="outline" className="text-xs">
                              {badge}
                            </Badge>
                          ))}
                        </div>
                        <div className="flex space-x-4 text-xs text-muted-foreground mt-2">
                          <span>{user.followers} followers</span>
                          <span>{user.reviewCount} reviews</span>
                          <span>{user.totalLikes} likes</span>
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleFollowUser(user.id)}
                    >
                      <UserPlus className="w-4 h-4 mr-2" />
                      Follow
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trending" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5" />
                  <span>Trending Reviews</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {socialFeed.slice(0, 3).map((review, index) => (
                    <div key={review.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                      <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="text-xs font-bold text-primary">{index + 1}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm truncate">{review.businessName}</div>
                        <div className="text-xs text-muted-foreground">
                          by @{review.author.username}
                        </div>
                        <div className="flex items-center space-x-2 mt-1">
                          <div className="flex items-center space-x-1">
                            <Heart className="w-3 h-3 text-red-500" />
                            <span className="text-xs">{review.likes}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Share2 className="w-3 h-3 text-blue-500" />
                            <span className="text-xs">{review.shares}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Popular Collections</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {myCollections.map((collection, index) => (
                    <div key={collection.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                      <div className="w-6 h-6 bg-secondary/10 rounded-full flex items-center justify-center">
                        <Bookmark className="w-3 h-3 text-secondary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm truncate">{collection.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {collection.reviews.length} reviews • {collection.followers} followers
                        </div>
                        <div className="flex items-center space-x-1 mt-1">
                          {collection.isPublic ? (
                            <Globe className="w-3 h-3 text-green-600" />
                          ) : (
                            <Lock className="w-3 h-3 text-gray-600" />
                          )}
                          <span className="text-xs text-muted-foreground">
                            {collection.isPublic ? 'Public' : 'Private'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Social Proof Indicators</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <Eye className="w-8 h-8 mx-auto mb-2 text-green-600" />
                  <div className="font-medium">2.3K</div>
                  <div className="text-sm text-muted-foreground">Profile Views</div>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <ThumbsUp className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                  <div className="font-medium">94%</div>
                  <div className="text-sm text-muted-foreground">Helpful Rate</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <TrendingUp className="w-8 h-8 mx-auto mb-2 text-purple-600" />
                  <div className="font-medium">Top 15%</div>
                  <div className="text-sm text-muted-foreground">Reviewer Rank</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}