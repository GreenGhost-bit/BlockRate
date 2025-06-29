// components/wallet-features.tsx
"use client";

import { useState, useEffect } from 'react';
import { 
  Wallet, 
  History, 
  TrendingUp, 
  Shield, 
  Eye, 
  EyeOff, 
  Filter, 
  Download, 
  RefreshCw,
  ArrowUpRight,
  ArrowDownLeft,
  Search,
  Calendar,
  DollarSign
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface Asset {
  id: string;
  name: string;
  symbol: string;
  balance: number;
  value: number;
  change24h: number;
  percentage: number;
}

interface Transaction {
  id: string;
  type: 'received' | 'sent' | 'reward' | 'governance';
  amount: number;
  asset: string;
  timestamp: Date;
  status: 'completed' | 'pending' | 'failed';
  hash: string;
  description: string;
}

interface SecurityRecommendation {
  id: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
  completed: boolean;
}

export function WalletFeatures() {
  const [isBalanceVisible, setIsBalanceVisible] = useState(true);
  const [selectedTimeframe, setSelectedTimeframe] = useState('7d');
  const [transactionFilter, setTransactionFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [portfolio, setPortfolio] = useState<Asset[]>([
    {
      id: '1',
      name: 'Algorand',
      symbol: 'ALGO',
      balance: 1547.32,
      value: 348.95,
      change24h: 5.67,
      percentage: 78.5
    },
    {
      id: '2',
      name: 'USDC',
      symbol: 'USDC',
      balance: 95.50,
      value: 95.50,
      change24h: 0.01,
      percentage: 21.5
    }
  ]);

  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: '1',
      type: 'reward',
      amount: 2.5,
      asset: 'ALGO',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      status: 'completed',
      hash: 'ABC123...XYZ789',
      description: 'Review reward for Restaurant ABC'
    },
    {
      id: '2',
      type: 'governance',
      amount: 15.0,
      asset: 'ALGO',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
      status: 'completed',
      hash: 'DEF456...UVW012',
      description: 'Governance participation reward'
    },
    {
      id: '3',
      type: 'sent',
      amount: 10.0,
      asset: 'ALGO',
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      status: 'completed',
      hash: 'GHI789...RST345',
      description: 'Transfer to external wallet'
    }
  ]);

  const [securityRecommendations, setSecurityRecommendations] = useState<SecurityRecommendation[]>([
    {
      id: '1',
      title: 'Enable 2FA',
      description: 'Add two-factor authentication for enhanced security',
      severity: 'high',
      completed: false
    },
    {
      id: '2',
      title: 'Backup Wallet',
      description: 'Create a secure backup of your wallet',
      severity: 'high',
      completed: true
    },
    {
      id: '3',
      title: 'Review Permissions',
      description: 'Check and update app permissions',
      severity: 'medium',
      completed: false
    }
  ]);

  const totalValue = portfolio.reduce((sum, asset) => sum + asset.value, 0);
  const totalChange24h = portfolio.reduce((sum, asset) => sum + (asset.value * asset.change24h / 100), 0);

  const filteredTransactions = transactions.filter(tx => {
    const matchesFilter = transactionFilter === 'all' || tx.type === transactionFilter;
    const matchesSearch = searchQuery === '' || 
      tx.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.hash.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsRefreshing(false);
  };

  const handleCompleteRecommendation = (id: string) => {
    setSecurityRecommendations(prev => 
      prev.map(rec => rec.id === id ? { ...rec, completed: true } : rec)
    );
  };

  const getTransactionIcon = (type: Transaction['type']) => {
    switch (type) {
      case 'received':
      case 'reward':
      case 'governance':
        return <ArrowDownLeft className="w-4 h-4 text-green-600" />;
      case 'sent':
        return <ArrowUpRight className="w-4 h-4 text-red-600" />;
      default:
        return <RefreshCw className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: Transaction['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getSeverityColor = (severity: SecurityRecommendation['severity']) => {
    switch (severity) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-2xl font-bold">Wallet Overview</CardTitle>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsBalanceVisible(!isBalanceVisible)}
            >
              {isBalanceVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing}
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="text-3xl font-bold">
                {isBalanceVisible ? `$${totalValue.toFixed(2)}` : '••••••'}
              </div>
              <div className={`text-sm ${totalChange24h >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {totalChange24h >= 0 ? '+' : ''}{totalChange24h.toFixed(2)} USD (24h)
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {portfolio.find(p => p.symbol === 'ALGO')?.balance.toFixed(2) || '0'}
                </div>
                <div className="text-sm text-muted-foreground">ALGO Balance</div>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {transactions.filter(t => t.type === 'reward').length}
                </div>
                <div className="text-sm text-muted-foreground">Rewards Earned</div>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">
                  {transactions.filter(t => t.type === 'governance').length}
                </div>
                <div className="text-sm text-muted-foreground">Governance Votes</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="portfolio" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="portfolio" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Asset Allocation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {portfolio.map((asset) => (
                  <div key={asset.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="text-xs font-bold">{asset.symbol}</span>
                      </div>
                      <div>
                        <div className="font-medium">{asset.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {asset.balance.toFixed(2)} {asset.symbol}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">${asset.value.toFixed(2)}</div>
                      <div className={`text-sm ${asset.change24h >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {asset.change24h >= 0 ? '+' : ''}{asset.change24h.toFixed(2)}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transactions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Transaction History</CardTitle>
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search transactions..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <select
                  value={transactionFilter}
                  onChange={(e) => setTransactionFilter(e.target.value)}
                  className="px-3 py-2 border rounded-md bg-background"
                >
                  <option value="all">All Types</option>
                  <option value="reward">Rewards</option>
                  <option value="governance">Governance</option>
                  <option value="sent">Sent</option>
                  <option value="received">Received</option>
                </select>
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {filteredTransactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50">
                    <div className="flex items-center space-x-4">
                      {getTransactionIcon(transaction.type)}
                      <div>
                        <div className="font-medium">{transaction.description}</div>
                        <div className="text-sm text-muted-foreground">
                          {transaction.timestamp.toLocaleDateString()} • {transaction.hash}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">
                        {transaction.type === 'sent' ? '-' : '+'}{transaction.amount} {transaction.asset}
                      </div>
                      <Badge variant="secondary" className={getStatusColor(transaction.status)}>
                        {transaction.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Security Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {securityRecommendations.map((recommendation) => (
                  <div key={recommendation.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <Shield className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <div className="font-medium">{recommendation.title}</div>
                        <div className="text-sm text-muted-foreground">{recommendation.description}</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary" className={getSeverityColor(recommendation.severity)}>
                        {recommendation.severity}
                      </Badge>
                      {!recommendation.completed && (
                        <Button 
                          size="sm" 
                          onClick={() => handleCompleteRecommendation(recommendation.id)}
                        >
                          Complete
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Earning Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Monthly Goal</span>
                      <span>75/100 ALGO</span>
                    </div>
                    <Progress value={75} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Review Streak</span>
                      <span>12 days</span>
                    </div>
                    <Progress value={60} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Activity Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Reviews This Month</span>
                    <span className="font-medium">24</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Rewards Earned</span>
                    <span className="font-medium">45.2 ALGO</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Governance Participation</span>
                    <span className="font-medium">3 votes</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}