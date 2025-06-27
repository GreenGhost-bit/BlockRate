"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"
import { 
  Bell, BellRing, Star, Coins, Award, MessageSquare, 
  TrendingUp, Shield, Gift, Clock, X, Check 
} from "lucide-react"

interface Notification {
  id: string
  type: 'reward' | 'review' | 'achievement' | 'governance' | 'system' | 'business'
  title: string
  message: string
  timestamp: Date
  read: boolean
  actionRequired?: boolean
  actionUrl?: string
  metadata?: {
    amount?: number
    businessName?: string
    achievementId?: string
    proposalId?: string
  }
}

const notificationIcons = {
  reward: Coins,
  review: Star,
  achievement: Award,
  governance: Shield,
  system: Bell,
  business: MessageSquare
}

const notificationColors = {
  reward: 'text-yellow-400',
  review: 'text-blue-400',
  achievement: 'text-purple-400',
  governance: 'text-green-400',
  system: 'text-gray-400',
  business: 'text-orange-400'
}

export function NotificationCenter() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadNotifications()
    const interval = setInterval(loadNotifications, 30000)
    return () => clearInterval(interval)
  }, [])

  const loadNotifications = async () => {
    setLoading(true)
    try {
      const mockNotifications: Notification[] = [
        {
          id: "1",
          type: "reward",
          title: "Reward Earned",
          message: "You earned 2.5 ALGO for your quality review of Crypto Coffee Roasters",
          timestamp: new Date(Date.now() - 1000 * 60 * 15),
          read: false,
          metadata: { amount: 2.5, businessName: "Crypto Coffee Roasters" }
        },
        {
          id: "2",
          type: "achievement",
          title: "New Achievement Unlocked",
          message: "Congratulations! You've unlocked the 'Helpful Reviewer' achievement",
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
          read: false,
          metadata: { achievementId: "helpful_reviewer" }
        },
        {
          id: "3",
          type: "business",
          title: "Business Response",
          message: "DeFi Dental Care responded to your review",
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4),
          read: true,
          actionUrl: "/reviews/my-reviews",
          metadata: { businessName: "DeFi Dental Care" }
        },
        {
          id: "4",
          type: "governance",
          title: "Governance Proposal",
          message: "New proposal: 'Increase Review Rewards to 3.0 ALGO' is now open for voting",
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8),
          read: true,
          actionRequired: true,
          actionUrl: "/governance",
          metadata: { proposalId: "prop-001" }
        },
        {
          id: "5",
          type: "review",
          title: "Review Milestone",
          message: "You've now submitted 50 reviews! Keep up the great work",
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
          read: true
        },
        {
          id: "6",
          type: "system",
          title: "Platform Update",
          message: "New features added: Advanced search filters and business analytics",
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48),
          read: true
        }
      ]

      setNotifications(mockNotifications)
    } catch (error) {
      console.error("Failed to load notifications:", error)
    } finally {
      setLoading(false)
    }
  }

  const markAsRead = (notificationId: string) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === notificationId ? { ...notif, read: true } : notif
      )
    )
  }

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notif => ({ ...notif, read: true }))
    )
  }

  const deleteNotification = (notificationId: string) => {
    setNotifications(prev =>
      prev.filter(notif => notif.id !== notificationId)
    )
  }

  const unreadCount = notifications.filter(n => !n.read).length
  const recentNotifications = notifications.slice(0, 5)

  const formatTimeAgo = (timestamp: Date) => {
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - timestamp.getTime()) / (1000 * 60))
    
    if (diffInMinutes < 1) return "Just now"
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
    return `${Math.floor(diffInMinutes / 1440)}d ago`
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="relative">
          {unreadCount > 0 ? (
            <BellRing className="h-5 w-5" />
          ) : (
            <Bell className="h-5 w-5" />
          )}
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-red-500 text-white text-xs">
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      
      <PopoverContent className="w-80 p-0 bg-slate-800 border-slate-700" align="end">
        <div className="border-b border-slate-700 p-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Notifications</h3>
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={markAllAsRead}
                className="text-xs"
              >
                Mark all read
              </Button>
            )}
          </div>
          {unreadCount > 0 && (
            <p className="text-sm text-gray-400 mt-1">
              {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
            </p>
          )}
        </div>

        <ScrollArea className="h-96">
          {notifications.length === 0 ? (
            <div className="p-8 text-center">
              <Bell className="h-12 w-12 mx-auto mb-4 text-gray-600" />
              <p className="text-gray-400">No notifications yet</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-700">
              {notifications.map((notification) => {
                const Icon = notificationIcons[notification.type]
                const iconColor = notificationColors[notification.type]
                
                return (
                  <div
                    key={notification.id}
                    className={`p-4 hover:bg-slate-700/50 transition-colors ${
                      !notification.read ? 'bg-slate-700/20' : ''
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`mt-1 ${iconColor}`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-sm font-medium truncate">
                            {notification.title}
                          </p>
                          <div className="flex items-center space-x-1">
                            {!notification.read && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full" />
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteNotification(notification.id)}
                              className="h-6 w-6 p-0 text-gray-400 hover:text-white"
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                        
                        <p className="text-sm text-gray-400 leading-relaxed">
                          {notification.message}
                        </p>
                        
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-gray-500">
                            {formatTimeAgo(notification.timestamp)}
                          </span>
                          
                          <div className="flex items-center space-x-2">
                            {notification.actionRequired && (
                              <Badge className="bg-orange-500/20 text-orange-400 text-xs">
                                Action Required
                              </Badge>
                            )}
                            
                            {notification.metadata?.amount && (
                              <Badge className="bg-green-500/20 text-green-400 text-xs">
                                +{notification.metadata.amount} ALGO
                              </Badge>
                            )}
                          </div>
                        </div>
                        
                        {notification.actionUrl && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="mt-2 h-7 text-xs"
                            onClick={() => {
                              markAsRead(notification.id)
                              setIsOpen(false)
                            }}
                          >
                            View Details
                          </Button>
                        )}
                        
                        {!notification.read && !notification.actionUrl && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => markAsRead(notification.id)}
                            className="mt-2 h-7 text-xs text-gray-400"
                          >
                            <Check className="h-3 w-3 mr-1" />
                            Mark as read
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </ScrollArea>
        
        {notifications.length > 0 && (
          <div className="border-t border-slate-700 p-3">
            <Button
              variant="ghost"
              size="sm"
              className="w-full text-center text-sm"
              onClick={() => setIsOpen(false)}
            >
              View All Notifications
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  )
}