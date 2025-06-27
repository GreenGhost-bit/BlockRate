"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Shield, Zap, Users, TrendingUp } from "lucide-react"

export function AlgorandStats() {
  const stats = [
    { 
      label: "Total Value Locked", 
      value: "₳2.4M", 
      icon: Shield, 
      color: "text-green-400",
      description: "Assets secured on platform"
    },
    { 
      label: "Reviews Per Second", 
      value: "127", 
      icon: Zap, 
      color: "text-blue-400",
      description: "Real-time processing rate"
    },
    { 
      label: "Active Validators", 
      value: "1,247", 
      icon: Users, 
      color: "text-purple-400",
      description: "Network participants"
    },
    { 
      label: "Network Growth", 
      value: "+24%", 
      icon: TrendingUp, 
      color: "text-yellow-400",
      description: "Monthly growth rate"
    }
  ]

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon
        return (
          <Card key={index} className="bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700 hover:border-green-500/50 transition-all duration-300 group">
            <CardContent className="p-6 text-center">
              <div className="relative">
                <Icon className={`h-8 w-8 mx-auto mb-4 ${stat.color} group-hover:scale-110 transition-transform duration-300`} />
                <div className="absolute -inset-1 bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 opacity-0 group-hover:opacity-20 rounded-full blur transition-opacity duration-300"></div>
              </div>
              <div className="text-3xl font-bold mb-2 font-poppins">{stat.value}</div>
              <div className="text-gray-400 text-sm font-medium mb-1">{stat.label}</div>
              <div className="text-gray-500 text-xs">{stat.description}</div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}