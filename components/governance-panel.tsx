"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Vote, Users, Clock, TrendingUp, CheckCircle, XCircle } from "lucide-react"
import { useAlgorand } from "./algorand-provider"
import { ConnectWalletButton } from "./connect-wallet-button"

export function GovernancePanel() {
  const { isConnected, governanceVotingPower, voteOnReview } = useAlgorand()
  const [votedProposals, setVotedProposals] = useState<string[]>([])

  const proposals = [
    {
      id: "prop-001",
      title: "Increase Review Rewards to 3.0 ALGO",
      description: "Proposal to increase the base reward for quality reviews from 2.5 to 3.0 ALGO tokens to incentivize more participation and higher quality content.",
      category: "Economic",
      votes: { yes: 2847, no: 734 },
      totalVotes: 3581,
      endsIn: "3 days",
      proposer: "ALGOF7X8...9K2P",
      quorum: 5000,
      status: "Active"
    },
    {
      id: "prop-002",
      title: "Implement Business Verification System",
      description: "Add mandatory Know Your Business (KYB) process for enterprises wanting to be listed on BlockRate platform to ensure legitimacy.",
      category: "Security",
      votes: { yes: 1623, no: 1456 },
      totalVotes: 3079,
      endsIn: "7 days", 
      proposer: "ALGOM3N8...7Q1X",
      quorum: 5000,
      status: "Active"
    },
    {
      id: "prop-003",
      title: "Reduce Transaction Fees by 25%",
      description: "Lower the platform transaction fees to make reviews more accessible to users across all economic backgrounds.",
      category: "Economic",
      votes: { yes: 4205, no: 892 },
      totalVotes: 5097,
      endsIn: "Passed",
      proposer: "ALGO9X2K...4M7L",
      quorum: 5000,
      status: "Passed"
    }
  ]

  const handleVote = async (proposalId: string, vote: 'yes' | 'no') => {
    if (!isConnected || votedProposals.includes(proposalId)) return
    
    const success = await voteOnReview(proposalId, vote === 'yes' ? 'helpful' : 'spam')
    if (success) {
      setVotedProposals(prev => [...prev, proposalId])
    }
  }

  const getProgressPercentage = (yes: number, total: number) => {
    return total > 0 ? (yes / total) * 100 : 0
  }

  const getQuorumPercentage = (total: number, quorum: number) => {
    return (total / quorum) * 100
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active": return "bg-blue-500/20 text-blue-400"
      case "Passed": return "bg-green-500/20 text-green-400"
      case "Failed": return "bg-red-500/20 text-red-400"
      default: return "bg-gray-500/20 text-gray-400"
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Economic": return "bg-yellow-500/20 text-yellow-400"
      case "Security": return "bg-red-500/20 text-red-400"
      case "Technical": return "bg-purple-500/20 text-purple-400"
      default: return "bg-gray-500/20 text-gray-400"
    }
  }

  return (
    <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center text-2xl">
              <Vote className="w-6 h-6 mr-3 text-purple-400" />
              Governance Dashboard
            </CardTitle>
            <CardDescription className="mt-2">
              Participate in platform governance and shape the future of BlockRate
            </CardDescription>
          </div>
          {isConnected && (
            <div className="text-right">
              <div className="text-2xl font-bold text-purple-400">{governanceVotingPower}</div>
              <div className="text-xs text-gray-400">Voting Power (ALGO)</div>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {isConnected ? (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-purple-500/10 rounded-lg">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400">{governanceVotingPower}</div>
                <div className="text-xs text-gray-400">Your Voting Power</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">{proposals.filter(p => p.status === "Active").length}</div>
                <div className="text-xs text-gray-400">Active Proposals</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400">{votedProposals.length}</div>
                <div className="text-xs text-gray-400">Your Votes Cast</div>
              </div>
            </div>
            
            <div className="space-y-6">
              <h3 className="text-lg font-semibold flex items-center">
                <TrendingUp className="w-5 h-5 mr-2" />
                Current Proposals
              </h3>
              
              {proposals.map((proposal) => {
                const yesPercentage = getProgressPercentage(proposal.votes.yes, proposal.totalVotes)
                const quorumPercentage = getQuorumPercentage(proposal.totalVotes, proposal.quorum)
                const hasVoted = votedProposals.includes(proposal.id)
                
                return (
                  <div key={proposal.id} className="p-6 border border-slate-600 rounded-lg bg-slate-800/30 hover:bg-slate-800/50 transition-colors">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h4 className="font-semibold text-lg">{proposal.title}</h4>
                          <Badge className={getCategoryColor(proposal.category)}>
                            {proposal.category}
                          </Badge>
                          <Badge className={getStatusColor(proposal.status)}>
                            {proposal.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-400 mb-4 leading-relaxed">
                          {proposal.description}
                        </p>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center space-x-2">
                          <Users className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-400">Proposer:</span>
                          <span className="font-mono text-blue-400">{proposal.proposer}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-400">
                            {proposal.status === "Active" ? `Ends in: ${proposal.endsIn}` : `Status: ${proposal.endsIn}`}
                          </span>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span>Support: {yesPercentage.toFixed(1)}%</span>
                          <span className="text-gray-400">
                            {proposal.votes.yes.toLocaleString()} YES • {proposal.votes.no.toLocaleString()} NO
                          </span>
                        </div>
                        <Progress value={yesPercentage} className="h-2" />
                        
                        <div className="flex justify-between text-xs text-gray-400">
                          <span>Quorum: {quorumPercentage.toFixed(1)}% ({proposal.totalVotes.toLocaleString()}/{proposal.quorum.toLocaleString()})</span>
                          <span>{quorumPercentage >= 100 ? "✓ Quorum Met" : "Quorum Required"}</span>
                        </div>
                      </div>
                      
                      {proposal.status === "Active" && (
                        <div className="flex items-center justify-between pt-4 border-t border-slate-600">
                          <div className="text-xs text-gray-400">
                            Voting power required: {governanceVotingPower} ALGO
                          </div>
                          <div className="space-x-3">
                            {hasVoted ? (
                              <Badge className="bg-green-500/20 text-green-400">
                                ✓ Voted
                              </Badge>
                            ) : (
                              <>
                                <Button 
                                  size="sm" 
                                  onClick={() => handleVote(proposal.id, 'yes')}
                                  className="bg-green-600 hover:bg-green-700"
                                  disabled={governanceVotingPower === 0}
                                >
                                  <CheckCircle className="w-4 h-4 mr-1" />
                                  Vote Yes
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="outline" 
                                  onClick={() => handleVote(proposal.id, 'no')}
                                  className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white"
                                  disabled={governanceVotingPower === 0}
                                >
                                  <XCircle className="w-4 h-4 mr-1" />
                                  Vote No
                                </Button>
                              </>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <Vote className="w-16 h-16 mx-auto mb-6 text-gray-600" />
            <h3 className="text-xl font-semibold mb-4">Connect to Participate</h3>
            <p className="text-gray-400 mb-6 max-w-md mx-auto">
              Connect your Algorand wallet to participate in governance voting and help shape the platform's future
            </p>
            <ConnectWalletButton size="lg" />
            <div className="mt-6 text-xs text-gray-500">
              Voting power is determined by your ALGO balance
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}