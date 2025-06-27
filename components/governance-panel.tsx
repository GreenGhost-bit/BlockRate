// components/advanced-governance.tsx
"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { 
  Vote, Plus, Users, Coins, TrendingUp, Clock, Shield, 
  Target, Zap, Crown, ArrowRight, CheckCircle, XCircle, AlertTriangle
} from "lucide-react"
import { useAlgorand } from "./algorand-provider"

interface Proposal {
  id: string
  title: string
  description: string
  category: 'Economic' | 'Security' | 'Technical' | 'Governance'
  proposer: string
  createdAt: Date
  votingStarted: Date
  votingEnds: Date
  status: 'draft' | 'active' | 'passed' | 'failed' | 'executed'
  votes: {
    yes: number
    no: number
    abstain: number
  }
  quorum: number
  passingThreshold: number
  executionDelay: number
  votingPower: { [address: string]: number }
  quadraticVoting: boolean
  delegatedVotes: number
}

interface Delegation {
  id: string
  delegator: string
  delegate: string
  votingPower: number
  active: boolean
  expiresAt?: Date
}

interface StakeInfo {
  amount: number
  lockPeriod: number
  votingPower: number
  rewards: number
  unstakeDate?: Date
}

export function AdvancedGovernance() {
  const { account, balance, governanceVotingPower } = useAlgorand()
  const [activeTab, setActiveTab] = useState('proposals')
  const [proposals, setProposals] = useState<Proposal[]>([])
  const [delegations, setDelegations] = useState<Delegation[]>([])
  const [stakeInfo, setStakeInfo] = useState<StakeInfo | null>(null)
  const [showCreateProposal, setShowCreateProposal] = useState(false)

  const [newProposal, setNewProposal] = useState({
    title: '',
    description: '',
    category: 'Economic' as const,
    votingDuration: 7,
    quorum: 10,
    passingThreshold: 60,
    quadraticVoting: false
  })

  useEffect(() => {
    loadGovernanceData()
  }, [account])

  const loadGovernanceData = async () => {
    const mockProposals: Proposal[] = [
      {
        id: 'prop-001',
        title: 'Increase Review Rewards to 3.0 ALGO',
        description: 'Proposal to increase the base reward for quality reviews from 2.5 to 3.0 ALGO tokens to incentivize more participation and higher quality content.',
        category: 'Economic',
        proposer: 'ALGOF7X8...9K2P',
        createdAt: new Date('2024-01-10'),
        votingStarted: new Date('2024-01-12'),
        votingEnds: new Date('2024-01-19'),
        status: 'active',
        votes: { yes: 4521, no: 1234, abstain: 345 },
        quorum: 5000,
        passingThreshold: 60,
        executionDelay: 3,
        votingPower: {},
        quadraticVoting: true,
        delegatedVotes: 892
      },
      {
        id: 'prop-002',
        title: 'Implement Quadratic Voting for All Proposals',
        description: 'Enable quadratic voting mechanism for all governance proposals to ensure more democratic decision-making and prevent whale dominance.',
        category: 'Governance',
        proposer: 'ALGOM3N8...7Q1X',
        createdAt: new Date('2024-01-08'),
        votingStarted: new Date('2024-01-10'),
        votingEnds: new Date('2024-01-17'),
        status: 'active',
        votes: { yes: 3456, no: 2890, abstain: 654 },
        quorum: 6000,
        passingThreshold: 66,
        executionDelay: 7,
        votingPower: {},
        quadraticVoting: false,
        delegatedVotes: 1203
      },
      {
        id: 'prop-003',
        title: 'Launch Bug Bounty Program',
        description: 'Establish a comprehensive bug bounty program with rewards up to 50,000 ALGO for critical security vulnerabilities.',
        category: 'Security',
        proposer: 'ALGOS3C1...2Y4Z',
        createdAt: new Date('2024-01-05'),
        votingStarted: new Date('2024-01-07'),
        votingEnds: new Date('2024-01-14'),
        status: 'passed',
        votes: { yes: 5678, no: 1234, abstain: 456 },
        quorum: 5000,
        passingThreshold: 60,
        executionDelay: 5,
        votingPower: {},
        quadraticVoting: false,
        delegatedVotes: 567
      }
    ]

    const mockDelegations: Delegation[] = [
      {
        id: 'del-001',
        delegator: account || '',
        delegate: 'ALGOF7X8...9K2P',
        votingPower: 150,
        active: true,
        expiresAt: new Date('2024-06-01')
      }
    ]

    const mockStakeInfo: StakeInfo = {
      amount: 500,
      lockPeriod: 90,
      votingPower: governanceVotingPower || 500,
      rewards: 23.4,
      unstakeDate: new Date('2024-04-15')
    }

    setProposals(mockProposals)
    setDelegations(mockDelegations)
    setStakeInfo(mockStakeInfo)
  }

  const createProposal = async () => {
    if (!newProposal.title || !newProposal.description) return

    const proposal: Proposal = {
      id: `prop-${Date.now()}`,
      title: newProposal.title,
      description: newProposal.description,
      category: newProposal.category,
      proposer: account || '',
      createdAt: new Date(),
      votingStarted: new Date(Date.now() + 24 * 60 * 60 * 1000),
      votingEnds: new Date(Date.now() + (newProposal.votingDuration + 1) * 24 * 60 * 60 * 1000),
      status: 'draft',
      votes: { yes: 0, no: 0, abstain: 0 },
      quorum: newProposal.quorum * 100,
      passingThreshold: newProposal.passingThreshold,
      executionDelay: 3,
      votingPower: {},
      quadraticVoting: newProposal.quadraticVoting,
      delegatedVotes: 0
    }

    setProposals(prev => [proposal, ...prev])
    setShowCreateProposal(false)
    setNewProposal({
      title: '',
      description: '',
      category: 'Economic',
      votingDuration: 7,
      quorum: 10,
      passingThreshold: 60,
      quadraticVoting: false
    })
  }

  const voteOnProposal = async (proposalId: string, vote: 'yes' | 'no' | 'abstain', votingPower: number) => {
    setProposals(prev =>
      prev.map(proposal =>
        proposal.id === proposalId
          ? {
              ...proposal,
              votes: {
                ...proposal.votes,
                [vote]: proposal.votes[vote] + votingPower
              }
            }
          : proposal
      )
    )
  }

  const delegateVotes = async (delegate: string, amount: number, duration: number) => {
    const newDelegation: Delegation = {
      id: `del-${Date.now()}`,
      delegator: account || '',
      delegate,
      votingPower: amount,
      active: true,
      expiresAt: new Date(Date.now() + duration * 24 * 60 * 60 * 1000)
    }

    setDelegations(prev => [...prev, newDelegation])
  }

  const stakeTokens = async (amount: number, lockPeriod: number) => {
    const newStakeInfo: StakeInfo = {
      amount: (stakeInfo?.amount || 0) + amount,
      lockPeriod,
      votingPower: Math.floor(amount * (1 + lockPeriod / 365)),
      rewards: 0,
      unstakeDate: new Date(Date.now() + lockPeriod * 24 * 60 * 60 * 1000)
    }

    setStakeInfo(newStakeInfo)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-blue-500/20 text-blue-400'
      case 'passed': return 'bg-green-500/20 text-green-400'
      case 'failed': return 'bg-red-500/20 text-red-400'
      case 'executed': return 'bg-purple-500/20 text-purple-400'
      default: return 'bg-gray-500/20 text-gray-400'
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Economic': return 'bg-yellow-500/20 text-yellow-400'
      case 'Security': return 'bg-red-500/20 text-red-400'
      case 'Technical': return 'bg-purple-500/20 text-purple-400'
      case 'Governance': return 'bg-green-500/20 text-green-400'
      default: return 'bg-gray-500/20 text-gray-400'
    }
  }

  const formatTimeRemaining = (endDate: Date) => {
    const now = new Date()
    const diffInHours = Math.max(0, Math.floor((endDate.getTime() - now.getTime()) / (1000 * 60 * 60)))
    
    if (diffInHours < 24) return `${diffInHours}h remaining`
    const days = Math.floor(diffInHours / 24)
    return `${days}d ${diffInHours % 24}h remaining`
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Governance Hub</h1>
          <p className="text-gray-400">Participate in platform governance and shape the future</p>
        </div>
        <Button
          onClick={() => setShowCreateProposal(true)}
          className="bg-green-600 hover:bg-green-700"
          disabled={!account || (stakeInfo?.amount || 0) < 100}
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Proposal
        </Button>
      </div>

      {!account && (
        <Card className="bg-yellow-500/10 border-yellow-500/30 mb-8">
          <CardContent className="p-6 text-center">
            <Shield className="w-12 h-12 mx-auto mb-4 text-yellow-400" />
            <h3 className="text-lg font-semibold mb-2">Connect Your Wallet</h3>
            <p className="text-gray-400">Connect your Algorand wallet to participate in governance</p>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 md:grid-cols-4 mb-8">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4 text-center">
            <Coins className="w-8 h-8 mx-auto mb-2 text-yellow-400" />
            <div className="text-2xl font-bold">{stakeInfo?.amount || 0}</div>
            <div className="text-xs text-gray-400">ALGO Staked</div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4 text-center">
            <Vote className="w-8 h-8 mx-auto mb-2 text-blue-400" />
            <div className="text-2xl font-bold">{stakeInfo?.votingPower || 0}</div>
            <div className="text-xs text-gray-400">Voting Power</div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4 text-center">
            <Target className="w-8 h-8 mx-auto mb-2 text-green-400" />
            <div className="text-2xl font-bold">{delegations.reduce((sum, d) => sum + d.votingPower, 0)}</div>
            <div className="text-xs text-gray-400">Delegated Power</div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4 text-center">
            <TrendingUp className="w-8 h-8 mx-auto mb-2 text-purple-400" />
            <div className="text-2xl font-bold">{stakeInfo?.rewards.toFixed(1) || '0.0'}</div>
            <div className="text-xs text-gray-400">Rewards Earned</div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="proposals">Proposals</TabsTrigger>
          <TabsTrigger value="staking">Staking</TabsTrigger>
          <TabsTrigger value="delegation">Delegation</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="proposals" className="space-y-6">
          <div className="space-y-4">
            {proposals.map((proposal) => {
              const totalVotes = proposal.votes.yes + proposal.votes.no + proposal.votes.abstain
              const yesPercentage = totalVotes > 0 ? (proposal.votes.yes / totalVotes) * 100 : 0
              const quorumPercentage = (totalVotes / proposal.quorum) * 100

              return (
                <Card key={proposal.id} className="bg-slate-800/50 border-slate-700">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-xl font-semibold">{proposal.title}</h3>
                          <Badge className={getCategoryColor(proposal.category)}>
                            {proposal.category}
                          </Badge>
                          <Badge className={getStatusColor(proposal.status)}>
                            {proposal.status}
                          </Badge>
                          {proposal.quadraticVoting && (
                            <Badge className="bg-purple-500/20 text-purple-400">
                              Quadratic
                            </Badge>
                          )}
                        </div>
                        <p className="text-gray-300 mb-4">{proposal.description}</p>
                      </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-3 mb-4">
                      <div className="text-sm">
                        <span className="text-gray-400">Proposer:</span>
                        <span className="font-mono ml-2">{proposal.proposer}</span>
                      </div>
                      <div className="text-sm">
                        <span className="text-gray-400">Quorum:</span>
                        <span className="ml-2">{proposal.quorum.toLocaleString()} ALGO</span>
                      </div>
                      <div className="text-sm">
                        <span className="text-gray-400">Threshold:</span>
                        <span className="ml-2">{proposal.passingThreshold}%</span>
                      </div>
                    </div>

                    <div className="space-y-3 mb-4">
                      <div className="flex justify-between text-sm">
                        <span>Support: {yesPercentage.toFixed(1)}%</span>
                        <span className="text-gray-400">
                          {proposal.votes.yes.toLocaleString()} YES • {proposal.votes.no.toLocaleString()} NO • {proposal.votes.abstain.toLocaleString()} ABSTAIN
                        </span>
                      </div>
                      <Progress value={yesPercentage} className="h-2" />
                      
                      <div className="flex justify-between text-xs text-gray-400">
                        <span>Quorum: {quorumPercentage.toFixed(1)}%</span>
                        <span>{quorumPercentage >= 100 ? "✓ Quorum Met" : "Quorum Required"}</span>
                      </div>
                      <Progress value={Math.min(100, quorumPercentage)} className="h-1" />
                    </div>

                    {proposal.status === 'active' && (
                      <div className="flex items-center justify-between pt-4 border-t border-slate-600">
                        <div className="text-sm text-gray-400">
                          <Clock className="w-4 h-4 inline mr-1" />
                          {formatTimeRemaining(proposal.votingEnds)}
                        </div>
                        <div className="space-x-2">
                          <Button
                            size="sm"
                            onClick={() => voteOnProposal(proposal.id, 'yes', stakeInfo?.votingPower || 0)}
                            className="bg-green-600 hover:bg-green-700"
                            disabled={!account || (stakeInfo?.votingPower || 0) === 0}
                          >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Vote Yes
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => voteOnProposal(proposal.id, 'no', stakeInfo?.votingPower || 0)}
                            className="bg-red-600 hover:bg-red-700"
                            disabled={!account || (stakeInfo?.votingPower || 0) === 0}
                          >
                            <XCircle className="w-4 h-4 mr-1" />
                            Vote No
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => voteOnProposal(proposal.id, 'abstain', stakeInfo?.votingPower || 0)}
                            disabled={!account || (stakeInfo?.votingPower || 0) === 0}
                          >
                            Abstain
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        <TabsContent value="staking" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle>Stake ALGO Tokens</CardTitle>
                <CardDescription>
                  Stake your ALGO tokens to earn voting power and governance rewards
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Amount to Stake</label>
                  <Input
                    type="number"
                    placeholder="Enter ALGO amount"
                    className="bg-slate-700 border-slate-600"
                  />
                  <div className="text-xs text-gray-400 mt-1">
                    Available: {balance.toFixed(2)} ALGO
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Lock Period (Days)</label>
                  <Slider
                    defaultValue={[90]}
                    max={365}
                    min={30}
                    step={30}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>30 days</span>
                    <span>365 days</span>
                  </div>
                </div>

                <div className="p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                  <div className="text-sm">
                    <div className="font-medium text-green-400 mb-1">Staking Benefits:</div>
                    <ul className="text-xs text-gray-300 space-y-1">
                      <li>• Voting power in governance proposals</li>
                      <li>• Annual rewards up to 12% APY</li>
                      <li>• Longer locks = higher voting multiplier</li>
                      <li>• Early unstaking penalty applies</li>
                    </ul>
                  </div>
                </div>

                <Button
                  className="w-full bg-green-600 hover:bg-green-700"
                  disabled={!account}
                >
                  Stake ALGO Tokens
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle>Current Stake</CardTitle>
                <CardDescription>
                  Your current staking position and rewards
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {stakeInfo ? (
                  <>
                    <div className="grid gap-4 grid-cols-2">
                      <div>
                        <div className="text-sm text-gray-400">Staked Amount</div>
                        <div className="text-xl font-bold">{stakeInfo.amount} ALGO</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-400">Voting Power</div>
                        <div className="text-xl font-bold">{stakeInfo.votingPower}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-400">Lock Period</div>
                        <div className="text-xl font-bold">{stakeInfo.lockPeriod} days</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-400">Rewards Earned</div>
                        <div className="text-xl font-bold text-green-400">{stakeInfo.rewards.toFixed(2)} ALGO</div>
                      </div>
                    </div>

                    {stakeInfo.unstakeDate && (
                      <div className="p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                        <div className="text-sm">
                          <div className="font-medium text-yellow-400 mb-1">Unlock Date:</div>
                          <div className="text-gray-300">{stakeInfo.unstakeDate.toLocaleDateString()}</div>
                        </div>
                      </div>
                    )}

                    <div className="space-y-2">
                      <Button
                        variant="outline"
                        className="w-full"
                        disabled={!stakeInfo.rewards}
                      >
                        Claim Rewards ({stakeInfo.rewards.toFixed(2)} ALGO)
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full border-red-600 text-red-400"
                        disabled={new Date() < (stakeInfo.unstakeDate || new Date())}
                      >
                        Unstake Tokens
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8">
                    <Coins className="w-12 h-12 mx-auto mb-4 text-gray-600" />
                    <p className="text-gray-400">No active stakes</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="delegation" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle>Delegate Voting Power</CardTitle>
                <CardDescription>
                  Delegate your voting power to trusted community members
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Delegate Address</label>
                  <Input
                    placeholder="ALGO address of delegate"
                    className="bg-slate-700 border-slate-600"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Voting Power to Delegate</label>
                  <Input
                    type="number"
                    placeholder="Amount of voting power"
                    className="bg-slate-700 border-slate-600"
                  />
                  <div className="text-xs text-gray-400 mt-1">
                    Available: {stakeInfo?.votingPower || 0} voting power
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Duration (Days)</label>
                  <Select>
                    <SelectTrigger className="bg-slate-700 border-slate-600">
                      <SelectValue placeholder="Select duration" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="30">30 days</SelectItem>
                      <SelectItem value="60">60 days</SelectItem>
                      <SelectItem value="90">90 days</SelectItem>
                      <SelectItem value="180">180 days</SelectItem>
                      <SelectItem value="365">1 year</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  disabled={!account}
                >
                  Delegate Votes
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle>Active Delegations</CardTitle>
                <CardDescription>
                  Your current vote delegations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {delegations.length > 0 ? (
                    delegations.map((delegation) => (
                      <div key={delegation.id} className="p-3 bg-slate-700/30 rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <div className="font-medium text-sm">
                              {delegation.delegate.slice(0, 8)}...{delegation.delegate.slice(-6)}
                            </div>
                            <div className="text-xs text-gray-400">
                              {delegation.votingPower} voting power
                            </div>
                          </div>
                          <Badge className={delegation.active ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}>
                            {delegation.active ? 'Active' : 'Expired'}
                          </Badge>
                        </div>
                        {delegation.expiresAt && (
                          <div className="text-xs text-gray-400">
                            Expires: {delegation.expiresAt.toLocaleDateString()}
                          </div>
                        )}
                        {delegation.active && (
                          <Button size="sm" variant="outline" className="mt-2 text-xs">
                            Revoke
                          </Button>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <Users className="w-12 h-12 mx-auto mb-4 text-gray-600" />
                      <p className="text-gray-400">No active delegations</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle>Governance History</CardTitle>
              <CardDescription>
                Your participation history in governance activities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Vote className="w-12 h-12 mx-auto mb-4 text-gray-600" />
                <p className="text-gray-400">No governance history available</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {showCreateProposal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="bg-slate-800 border-slate-700 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>Create New Proposal</CardTitle>
              <CardDescription>
                Submit a new governance proposal for community voting
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Proposal Title</label>
                <Input
                  value={newProposal.title}
                  onChange={(e) => setNewProposal(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter proposal title"
                  className="bg-slate-700 border-slate-600"
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Description</label>
                <Textarea
                  value={newProposal.description}
                  onChange={(e) => setNewProposal(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Provide detailed description of the proposal"
                  className="bg-slate-700 border-slate-600"
                  rows={4}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="text-sm font-medium mb-2 block">Category</label>
                  <Select
                    value={newProposal.category}
                    onValueChange={(value: any) => setNewProposal(prev => ({ ...prev, category: value }))}
                  >
                    <SelectTrigger className="bg-slate-700 border-slate-600">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Economic">Economic</SelectItem>
                      <SelectItem value="Security">Security</SelectItem>
                      <SelectItem value="Technical">Technical</SelectItem>
                      <SelectItem value="Governance">Governance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Voting Duration (Days)</label>
                  <Select
                    value={newProposal.votingDuration.toString()}
                    onValueChange={(value) => setNewProposal(prev => ({ ...prev, votingDuration: parseInt(value) }))}
                  >
                    <SelectTrigger className="bg-slate-700 border-slate-600">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="3">3 days</SelectItem>
                      <SelectItem value="7">7 days</SelectItem>
                      <SelectItem value="14">14 days</SelectItem>
                      <SelectItem value="30">30 days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Quorum (%)</label>
                  <Slider
                    value={[newProposal.quorum]}
                    onValueChange={([value]) => setNewProposal(prev => ({ ...prev, quorum: value }))}
                    max={30}
                    min={5}
                    step={1}
                  />
                  <div className="text-xs text-gray-400 mt-1">{newProposal.quorum}% of total supply</div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Passing Threshold (%)</label>
                  <Slider
                    value={[newProposal.passingThreshold]}
                    onValueChange={([value]) => setNewProposal(prev => ({ ...prev, passingThreshold: value }))}
                    max={80}
                    min={50}
                    step={1}
                  />
                  <div className="text-xs text-gray-400 mt-1">{newProposal.passingThreshold}% approval needed</div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={newProposal.quadraticVoting}
                  onCheckedChange={(checked) => setNewProposal(prev => ({ ...prev, quadraticVoting: !!checked }))}
                />
                <label className="text-sm">Enable quadratic voting</label>
              </div>

              <div className="p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                <div className="text-sm">
                  <div className="font-medium text-yellow-400 mb-1">Proposal Requirements:</div>
                  <ul className="text-xs text-gray-300 space-y-1">
                    <li>• Minimum 100 ALGO staked to create proposals</li>
                    <li>• Proposal fee: 10 ALGO (refunded if approved)</li>
                    <li>• 24-hour discussion period before voting starts</li>
                  </ul>
                </div>
              </div>

              <div className="flex space-x-3">
                <Button
                  onClick={createProposal}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                  disabled={!newProposal.title || !newProposal.description}
                >
                  Create Proposal
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowCreateProposal(false)}
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}