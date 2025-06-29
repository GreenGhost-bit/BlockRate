"use client"

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Star, Send } from 'lucide-react';
import { useAlgorand } from './algorand-provider';

export function ReviewSubmissionForm() {
  const { isConnected, submitReview } = useAlgorand();
  const [businessName, setBusinessName] = useState('');
  const [content, setContent] = useState('');
  const [rating, setRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isConnected) {
      alert('Please connect your wallet first');
      return;
    }

    if (!businessName || !content || rating === 0) {
      alert('Please fill in all fields');
      return;
    }

    setIsSubmitting(true);
    
    await submitReview({
      businessName,
      content,
      rating,
      author: 'CURRENT_USER_ADDRESS'
    });

    setBusinessName('');
    setContent('');
    setRating(0);
    setIsSubmitting(false);
    
    alert('Review submitted successfully!');
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-center">
          Submit a Review
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              placeholder="Business Name"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              className="w-full"
            />
          </div>
          
          <div>
            <div className="flex items-center space-x-1 justify-center mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="p-1"
                >
                  <Star
                    className={`w-6 h-6 ${
                      star <= rating
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-400'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>
          
          <div>
            <textarea
              placeholder="Write your review..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full min-h-[100px] p-3 border rounded-md bg-background text-foreground resize-none"
              rows={4}
            />
          </div>
          
          <Button
            type="submit"
            disabled={!isConnected || isSubmitting}
            className="w-full bg-green-600 hover:bg-green-700"
          >
            {isSubmitting ? (
              'Submitting...'
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Submit Review
              </>
            )}
          </Button>
          
          {!isConnected && (
            <p className="text-sm text-center text-muted-foreground">
              Connect your wallet to submit reviews
            </p>
          )}
        </form>
      </CardContent>
    </Card>
  );
}