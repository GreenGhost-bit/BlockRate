// components/reward-optimizer.tsx
"use client";

import { useState, useEffect, useMemo } from 'react';
import { 
  TrendingUp, 
  Calendar, 
  Clock, 
  DollarSign, 
  Target, 
  Zap, 
  BarChart3, 
  PieChart,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  Timer,
  Trophy,
  Activity,
  Users,
  MapPin,
  Star,
  Settings,
  RefreshCw
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Slider } from '@/components/ui/slider';

interface RewardForecast {
  period: string;
  baseReward: number;
  multiplierReward: number;
  bonusReward: number;
  totalReward: number;
  confidence: number;
}

interface OptimalTiming {
  hour: number;
  day: string;
  multiplier: number;
  reason: string;
  competition: 'low' | 'medium' | 'high';
}

interface RewardMultiplier {
  type: 'time' | 'quality' | 'frequency' | 'location' | 'engagement';
  name: string;
  currentValue: number;
  maxValue: number;
  description: string;
  requirements: string[];
  impact: number;
}

interface EarningPotential {
  daily: number;
  weekly: number;
  monthly: number;
  yearly: number;
  rank: string;
  percentile: number;
}

interface ActivityPattern {
  bestDays: string[];
  bestHours: number[];
  avgReviewsPerDay: number;
  qualityScore: number;
  engagementRate: number;
}

export function RewardOptimizer() {
  const [selectedPeriod, setSelectedPeriod] = useState('weekly');
  const [targetReviews, setTargetReviews] = useState([15]);
  const [currentStreak, setCurrentStreak] = useState(12);
  const [activeTab, setActiveTab] = useState('forecast');

  const [rewardForecasts, setRewardForecasts] = useState<RewardForecast[]>([
    {
      period: 'Today',
      baseReward: 2.5,
      multiplierReward: 1.2,
      bonusReward: 0.8,
      totalReward: 4.5,
      confidence: 0.92
    },
    {
      period: 'This Week',
      baseReward: 18.5,
      multiplierReward: 8.4,
      bonusReward: 5.1,
      totalReward: 32.0,
      confidence: 0.87
    },
    {
      period: 'This Month',
      baseReward: 75.0,
      multiplierReward: 35.2,
      bonusReward: 22.8,
      totalReward: 133.0,
      confidence: 0.78
    },
    {
      period: 'This Year',
      baseReward: 900.0,
      multiplierReward: 420.0,
      bonusReward: 280.0,
      totalReward: 1600.0,
      confidence: 0.65
    }
  ]);

  const [optimalTimings, setOptimalTimings] = useState<OptimalTiming[]>([
    {
      hour: 11,
      day: 'Tuesday',
      multiplier: 1.8,
      reason: 'Low competition, high engagement',
      competition: 'low'
    },
    {
      hour: 14,
      day: 'Wednesday',
      multiplier: 1.6,
      reason: 'Peak lunch hour activity',
      competition: 'medium'
    },
    {
      hour: 19,
      day: 'Friday',
      multiplier: 2.1,
      reason: 'Weekend dining surge',
      competition: 'low'
    },
    {
      hour: 12,
      day: 'Sunday',
      multiplier: 1.4,
      reason: 'Brunch crowd reviews',
      competition: 'high'
    }
  ]);

  const [rewardMultipliers, setRewardMultipliers] = useState<RewardMultiplier[]>([
    {
      type: 'quality',
      name: 'Review Quality',
      currentValue: 1.3,
      maxValue: 2.0,
      description: 'Bonus for detailed, helpful reviews',
      requirements: ['150+ characters', 'Include photos', 'Mention specifics'],
      impact: 0.4
    },
    {
      type: 'frequency',
      name: 'Review Streak',
      currentValue: 1.2,
      maxValue: 1.5,
      description: 'Daily review streak bonus',
      requirements: ['Review daily', 'Maintain 7+ day streak'],
      impact: 0.3
    },
    {
      type: 'time',
      name: 'Optimal Timing',
      currentValue: 1.1,
      maxValue: 1.8,
      description: 'Timing-based multiplier',
      requirements: ['Review during peak hours', 'Low competition windows'],
      impact: 0.7
    },
    {
      type: 'location',
      name: 'Location Diversity',
      currentValue: 1.0,
      maxValue: 1.3,
      description: 'Bonus for reviewing different areas',
      requirements: ['5+ different neighborhoods', 'Various business types'],
      impact: 0.2
    },
    {
      type: 'engagement',
      name: 'Community Engagement',
      currentValue: 1.15,
      maxValue: 1.6,
      description: 'Bonus for helpful reviews',
      requirements: ['High helpful votes', 'Low flag rate', 'Response to comments'],
      impact: 0.45
    }
  ]);

  const [activityPattern, setActivityPattern] = useState<ActivityPattern>({
    bestDays: ['Tuesday', 'Friday', 'Sunday'],
    bestHours: [11, 14, 19],
    avgReviewsPerDay: 2.3,
    qualityScore: 78,
    engagementRate: 85
  });

  const earningPotential: EarningPotential = useMemo(() => {
    const currentMultiplier = rewardMultipliers.reduce((total, mult) => total * mult.currentValue, 1);
    const baseDaily = targetReviews[0] * 1.5;
    
    return {
      daily: baseDaily * currentMultiplier,
      weekly: baseDaily * currentMultiplier * 7,
      monthly: baseDaily * currentMultiplier * 30,
      yearly: baseDaily * currentMultiplier * 365,
      rank: 'Gold Reviewer',
      percentile: 82
    };
  }, [targetReviews, rewardMultipliers]);

  const calculateOptimizedSchedule = () => {
    const schedule = [];
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    
    for (let day of days) {
      const timing = optimalTimings.find(t => t.day === day) || optimalTimings[0];
      schedule.push({
        day,
        recommendedTime: `${timing.hour}:00`,
        multiplier: timing.multiplier,
        expectedReward: 2.5 * timing.multiplier,
        priority: timing.multiplier > 1.5 ? 'high' : timing.multiplier > 1.2 ? 'medium' : 'low'
      });
    }
    
    return schedule;
  };

  const calculateMonthlyProjection = () => {
    const currentDate = new Date();
    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    const daysRemaining = daysInMonth - currentDate.getDate();
    
    const currentMultiplier = rewardMultipliers.reduce((total, mult) => total * mult.currentValue, 1);
    const dailyTarget = targetReviews[0];
    const projectedDaily = dailyTarget * 2.1 * currentMultiplier;
    
    return {
      daysRemaining,
      projectedEarnings: projectedDaily * daysRemaining,
      currentMonth: projectedDaily * currentDate.getDate(),
      streakBonus: currentStreak * 0.1,
      totalProjected: (projectedDaily * daysInMonth) + (currentStreak * 0.1)
    };
  };

  const getMultiplierColor = (current: number, max: number) => {
    const percentage = current / max;
    if (percentage >= 0.8) return 'text-green-600';
    if (percentage >= 0.6) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const optimizedSchedule = calculateOptimizedSchedule();
  const monthlyProjection = calculateMonthlyProjection();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5" />
            <span>Reward Optimizer</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{earningPotential.daily.toFixed(1)}</div>
              <div className="text-sm text-muted-foreground">Daily Potential</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{currentStreak}</div>
              <div className="text-sm text-muted-foreground">Day Streak</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{earningPotential.percentile}%</div>
              <div className="text-sm text-muted-foreground">Top Percentile</div>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">{monthlyProjection.totalProjected.toFixed(0)}</div>
              <div className="text-sm text-muted-foreground">Month Projection</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="forecast">Forecast</TabsTrigger>
          <TabsTrigger value="timing">Optimal Timing</TabsTrigger>
          <TabsTrigger value="multipliers">Multipliers</TabsTrigger>
          <TabsTrigger value="schedule">Schedule</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="forecast" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Reward Forecasting</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {rewardForecasts.map((forecast) => (
                    <div key={forecast.period} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <div className="font-medium">{forecast.period}</div>
                          <div className="text-sm text-muted-foreground">
                            {(forecast.confidence * 100).toFixed(0)}% confidence
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-green-600">
                            {forecast.totalReward.toFixed(1)} ALGO
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Base Rewards:</span>
                          <span>{forecast.baseReward.toFixed(1)} ALGO</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Multiplier Bonus:</span>
                          <span className="text-blue-600">+{forecast.multiplierReward.toFixed(1)} ALGO</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Special Bonus:</span>
                          <span className="text-purple-600">+{forecast.bonusReward.toFixed(1)} ALGO</span>
                        </div>
                      </div>
                      
                      <Progress value={forecast.confidence * 100} className="h-2 mt-3" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Target Optimization</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <label className="text-sm font-medium">Daily Review Target: {targetReviews[0]}</label>
                    <Slider
                      value={targetReviews}
                      onValueChange={setTargetReviews}
                      max={20}
                      min={1}
                      step={1}
                      className="mt-2"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>1 review</span>
                      <span>20 reviews</span>
                    </div>
                  </div>

                  <div className="p-4 bg-blue-50 rounded-lg">
                    <div className="text-sm font-medium text-blue-900 mb-2">Projected Impact</div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Daily Earnings:</span>
                        <span className="font-medium">{earningPotential.daily.toFixed(1)} ALGO</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Monthly Earnings:</span>
                        <span className="font-medium">{earningPotential.monthly.toFixed(0)} ALGO</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Yearly Projection:</span>
                        <span className="font-medium">{earningPotential.yearly.toFixed(0)} ALGO</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-center">
                    <Badge variant="secondary" className="bg-gold-100 text-gold-800">
                      <Trophy className="w-3 h-3 mr-1" />
                      {earningPotential.rank}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="timing" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Optimal Review Timing</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {optimalTimings.map((timing, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <div className="font-medium">{timing.day} at {timing.hour}:00</div>
                        <div className="text-sm text-muted-foreground">{timing.reason}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-green-600">
                          {timing.multiplier}x
                        </div>
                        <Badge 
                          variant="secondary" 
                          className={
                            timing.competition === 'low' ? 'bg-green-100 text-green-800' :
                            timing.competition === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }
                        >
                          {timing.competition} competition
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-muted-foreground">
                        Expected: {(2.5 * timing.multiplier).toFixed(1)} ALGO
                      </div>
                      <Button size="sm" variant="outline">
                        <Timer className="w-4 h-4 mr-2" />
                        Set Reminder
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Activity Pattern Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <Activity className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                  <div className="font-medium">{activityPattern.avgReviewsPerDay}</div>
                  <div className="text-sm text-muted-foreground">Avg Reviews/Day</div>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <Star className="w-8 h-8 mx-auto mb-2 text-yellow-600" />
                  <div className="font-medium">{activityPattern.qualityScore}%</div>
                  <div className="text-sm text-muted-foreground">Quality Score</div>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <Users className="w-8 h-8 mx-auto mb-2 text-green-600" />
                  <div className="font-medium">{activityPattern.engagementRate}%</div>
                  <div className="text-sm text-muted-foreground">Engagement Rate</div>
                </div>
              </div>

              <div className="mt-6">
                <div className="text-sm font-medium mb-3">Best Performance Days</div>
                <div className="flex flex-wrap gap-2">
                  {activityPattern.bestDays.map((day) => (
                    <Badge key={day} variant="secondary" className="bg-green-100 text-green-800">
                      {day}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="mt-4">
                <div className="text-sm font-medium mb-3">Peak Hours</div>
                <div className="flex flex-wrap gap-2">
                  {activityPattern.bestHours.map((hour) => (
                    <Badge key={hour} variant="secondary" className="bg-blue-100 text-blue-800">
                      {hour}:00
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="multipliers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Reward Multipliers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {rewardMultipliers.map((multiplier) => (
                  <div key={multiplier.type} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <div className="font-medium">{multiplier.name}</div>
                        <div className="text-sm text-muted-foreground">{multiplier.description}</div>
                      </div>
                      <div className="text-right">
                        <div className={`text-lg font-bold ${getMultiplierColor(multiplier.currentValue, multiplier.maxValue)}`}>
                          {multiplier.currentValue.toFixed(1)}x
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Max: {multiplier.maxValue.toFixed(1)}x
                        </div>
                      </div>
                    </div>
                    
                    <Progress 
                      value={(multiplier.currentValue / multiplier.maxValue) * 100} 
                      className="h-2 mb-3" 
                    />
                    
                    <div className="space-y-1">
                      <div className="text-sm font-medium">Requirements:</div>
                      {multiplier.requirements.map((req, index) => (
                        <div key={index} className="text-sm text-muted-foreground flex items-center">
                          <Target className="w-3 h-3 mr-2" />
                          {req}
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-3 flex justify-between items-center">
                      <div className="text-sm text-muted-foreground">
                        Impact: +{(multiplier.impact * 100).toFixed(0)}% potential
                      </div>
                      <Button size="sm" variant="outline">
                        <Zap className="w-4 h-4 mr-2" />
                        Optimize
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="schedule" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Optimized Weekly Schedule</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {optimizedSchedule.map((schedule) => (
                  <div key={schedule.day} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Calendar className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <div className="font-medium">{schedule.day}</div>
                        <div className="text-sm text-muted-foreground">
                          Best time: {schedule.recommendedTime}
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="font-medium">{schedule.expectedReward.toFixed(1)} ALGO</div>
                      <Badge variant="secondary" className={getPriorityColor(schedule.priority)}>
                        {schedule.priority} priority
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <div className="text-sm font-medium text-blue-900 mb-2">Weekly Summary</div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-blue-800">Total Potential:</span>
                    <span className="font-medium ml-2">
                      {optimizedSchedule.reduce((sum, s) => sum + s.expectedReward, 0).toFixed(1)} ALGO
                    </span>
                  </div>
                  <div>
                    <span className="text-blue-800">High Priority Days:</span>
                    <span className="font-medium ml-2">
                      {optimizedSchedule.filter(s => s.priority === 'high').length}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Performance Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">This Week vs Last Week</span>
                    <div className="flex items-center space-x-1 text-green-600">
                      <ArrowUpRight className="w-4 h-4" />
                      <span className="font-medium">+23%</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Average Daily Multiplier</span>
                    <span className="font-medium">1.34x</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Streak Maintenance</span>
                    <div className="flex items-center space-x-1 text-green-600">
                      <span className="font-medium">98%</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Optimal Time Utilization</span>
                    <span className="font-medium">67%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Improvement Opportunities</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 bg-yellow-50 rounded-lg">
                    <div className="font-medium text-sm text-yellow-900">Review Quality</div>
                    <div className="text-sm text-yellow-800">Add more photos to increase multiplier</div>
                    <div className="text-xs text-yellow-700 mt-1">Potential: +0.3x multiplier</div>
                  </div>
                  
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <div className="font-medium text-sm text-blue-900">Timing Optimization</div>
                    <div className="text-sm text-blue-800">Review during peak hours more often</div>
                    <div className="text-xs text-blue-700 mt-1">Potential: +15% weekly earnings</div>
                  </div>
                  
                  <div className="p-3 bg-green-50 rounded-lg">
                    <div className="font-medium text-sm text-green-900">Location Diversity</div>
                    <div className="text-sm text-green-800">Explore 2 more neighborhoods</div>
                    <div className="text-xs text-green-700 mt-1">Potential: +0.2x multiplier</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Monthly Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <div className="text-lg font-bold">{monthlyProjection.currentMonth.toFixed(0)}</div>
                  <div className="text-sm text-muted-foreground">Earned This Month</div>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <div className="text-lg font-bold">{monthlyProjection.projectedEarnings.toFixed(0)}</div>
                  <div className="text-sm text-muted-foreground">Remaining Potential</div>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <div className="text-lg font-bold">{monthlyProjection.daysRemaining}</div>
                  <div className="text-sm text-muted-foreground">Days Left</div>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <div className="text-lg font-bold">{monthlyProjection.streakBonus.toFixed(1)}</div>
                  <div className="text-sm text-muted-foreground">Streak Bonus</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}