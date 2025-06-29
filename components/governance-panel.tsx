"use client"

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Vote, Clock, Users, CheckCircle } from 'lucide-react';

export function GovernancePanel() {
  const proposals = [
    {
      id: 1,
      title: 'Increase Review Rewards by 25%',
      description: 'Proposal to increase the base ALGO reward for quality reviews from 2 to 2.5 ALGO',
      status: 'Active',
      votes: 1247,
      timeLeft: '5 days',
      userVoted: false
    },
    {
      id: 2,
      title: 'Implement AI Review Verification',
      description: 'Add AI-powered review verification to reduce spam and improve quality',
      status: 'Passed',
      votes: 2156,
      timeLeft: 'Ended',
      userVoted: true
    }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30 mb-4">
          🏛️ Decentralized Governance
        </Badge>
        <h2 className="text-3xl md:text-5xl font-bold tracking-tighter font-poppins mb-4">
          Community Governance
        </h2>
        <p className="text-gray-300 text-lg max-w-2xl mx-auto">
          Shape the future of BlockRate through decentralized decision making
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {proposals.map((proposal) => (
          <Card key={proposal.id} className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{proposal.title}</CardTitle>
                <Badge 
                  className={
                    proposal.status === 'Active' 
                      ? 'bg-green-500/20 text-green-400' 
                      : 'bg-blue-500/20 text-blue-400'
                  }
                >
                  {proposal.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 text-sm mb-4">
                {proposal.description}
              </p>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4 text-blue-400" />
                    <span>{proposal.votes} votes</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-purple-400" />
                    <span>{proposal.timeLeft}</span>
                  </div>
                </div>
                
                {proposal.status === 'Active' && (
                  <div className="flex space-x-2">
                    <Button size="sm" className="flex-1 bg-green-600 hover:bg-green-700">
                      <Vote className="w-4 h-4 mr-2" />
                      Vote Yes
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1">
                      Vote No
                    </Button>
                  </div>
                )}
                
                {proposal.userVoted && (
                  <div className="flex items-center space-x-2 text-sm text-green-400">
                    <CheckCircle className="w-4 h-4" />
                    <span>You voted on this proposal</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}