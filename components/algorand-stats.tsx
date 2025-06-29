"use client"

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Users, Zap, DollarSign } from 'lucide-react';

export function AlgorandStats() {
  const stats = [
    {
      title: 'Network TPS',
      value: '6,000',
      change: '+5%',
      icon: Zap,
      color: 'text-blue-400'
    },
    {
      title: 'Active Accounts',
      value: '25.4M',
      change: '+12%',
      icon: Users,
      color: 'text-green-400'
    },
    {
      title: 'Total Value Locked',
      value: '$127M',
      change: '+8%',
      icon: DollarSign,
      color: 'text-purple-400'
    },
    {
      title: 'Daily Transactions',
      value: '890K',
      change: '+15%',
      icon: TrendingUp,
      color: 'text-yellow-400'
    }
  ];

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index} className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <Icon className={`h-8 w-8 ${stat.color}`} />
                <Badge className="bg-green-500/20 text-green-400 text-xs">
                  {stat.change}
                </Badge>
              </div>
              <div className="text-3xl font-bold mb-2">{stat.value}</div>
              <div className="text-gray-400 text-sm">{stat.title}</div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}