"use client"

import type React from "react"
import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { TrendingUp, TrendingDown, Users, Settings, MoreVertical, Check } from "lucide-react"

interface UserProfile {
  username: string
  handle: string
  avatar: string
  bio: string
  portfolioValue: string
  totalReturn: number
  followers: number
  following: number
  performanceData: { period: string; value: number[] }[]
  allocation: { ticker: string; percentage: number; color: string }[]
  holdings: {
    ticker: string
    name: string
    quantity: number
    avgCost: number
    currentPrice: number
    marketValue: number
    unrealizedPL: number
  }[]
  dividends: {
    ytd: string
    projected: string
    yieldOnCost: string
    monthlyData: { month: string; amount: number; breakdown: { ticker: string; amount: number }[] }[]
  }
  recentTrades: {
    date: string
    action: "Buy" | "Sell"
    ticker: string
    quantity: number
    price: number
  }[]
  followers_list: { username: string; handle: string; avatar: string }[]
  following_list: { username: string; handle: string; avatar: string }[]
}

const MOCK_USERS: { [key: string]: UserProfile } = {
  You: {
    username: "You",
    handle: "@girlboss",
    avatar: "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.freepik.com%2Ffree-photos-vectors%2Fwoman-smiling-face&psig=AOvVaw285RgbY1bj66dc7QDJlMto&ust=1763937280995000&source=images&cd=vfe&opi=89978449&ved=0CBUQjRxqFwoTCMi3hsrohpEDFQAAAAAdAAAAABBR",
    bio: "Software Engineer, Hack Western Mustang",
    portfolioValue: "$40,452",
    totalReturn: 18.5,
    followers: 11,
    following: 22,
    performanceData: [
      { period: "Daily", value: [100, 101, 99, 102, 103, 105, 104, 106] },
      { period: "Monthly", value: [100, 102, 105, 103, 108, 112, 115, 118] },
      { period: "YTD", value: [100, 105, 110, 108, 115, 118, 120, 118] },
      { period: "1Y", value: [100, 105, 110, 115, 112, 118, 120, 118.5] },
      { period: "5Y", value: [100, 120, 140, 160, 150, 170, 180, 185] },
    ],
    allocation: [
      { ticker: "AAPL", percentage: 25, color: "#ec4899" },
      { ticker: "VOO", percentage: 20, color: "#fbbf24" },
      { ticker: "TSLA", percentage: 15, color: "#8b5cf6" },
      { ticker: "MSFT", percentage: 15, color: "#10b981" },
      { ticker: "VTI", percentage: 12, color: "#3b82f6" },
      { ticker: "Cash", percentage: 13, color: "#6b7280" },
    ],
    holdings: [
      {
        ticker: "VOO",
        name: "Vanguard S&P 500 ETF",
        quantity: 50,
        avgCost: 380,
        currentPrice: 435,
        marketValue: 21750,
        unrealizedPL: 14.5,
      },
      {
        ticker: "AAPL",
        name: "Apple Inc.",
        quantity: 75,
        avgCost: 170,
        currentPrice: 195,
        marketValue: 14625,
        unrealizedPL: 14.7,
      },
      {
        ticker: "MSFT",
        name: "Microsoft Corp.",
        quantity: 30,
        avgCost: 350,
        currentPrice: 440,
        marketValue: 13200,
        unrealizedPL: 25.7,
      },
      {
        ticker: "BND",
        name: "Vanguard Bond ETF",
        quantity: 60,
        avgCost: 79,
        currentPrice: 83.5,
        marketValue: 5010,
        unrealizedPL: 5.7,
      },
    ],
    dividends: {
      ytd: "$1,245",
      projected: "$1,680",
      yieldOnCost: "2.8%",
      monthlyData: [
        {
          month: "Jan",
          amount: 102,
          breakdown: [
            { ticker: "AAPL", amount: 45 },
            { ticker: "VOO", amount: 35 },
            { ticker: "MSFT", amount: 22 },
          ],
        },
        {
          month: "Feb",
          amount: 98,
          breakdown: [
            { ticker: "AAPL", amount: 42 },
            { ticker: "VOO", amount: 34 },
            { ticker: "MSFT", amount: 22 },
          ],
        },
        {
          month: "Mar",
          amount: 115,
          breakdown: [
            { ticker: "AAPL", amount: 48 },
            { ticker: "VOO", amount: 40 },
            { ticker: "MSFT", amount: 27 },
          ],
        },
        {
          month: "Apr",
          amount: 105,
          breakdown: [
            { ticker: "AAPL", amount: 46 },
            { ticker: "VOO", amount: 36 },
            { ticker: "MSFT", amount: 23 },
          ],
        },
        {
          month: "May",
          amount: 122,
          breakdown: [
            { ticker: "AAPL", amount: 52 },
            { ticker: "VOO", amount: 42 },
            { ticker: "MSFT", amount: 28 },
          ],
        },
        {
          month: "Jun",
          amount: 130,
          breakdown: [
            { ticker: "AAPL", amount: 55 },
            { ticker: "VOO", amount: 45 },
            { ticker: "MSFT", amount: 30 },
          ],
        },
      ],
    },
    recentTrades: [
      { date: "2025-01-20", action: "Buy", ticker: "MSFT", quantity: 5, price: 440 },
      { date: "2025-01-18", action: "Buy", ticker: "VOO", quantity: 10, price: 435 },
      { date: "2025-01-15", action: "Sell", ticker: "TSLA", quantity: 8, price: 310 },
      { date: "2025-01-10", action: "Buy", ticker: "AAPL", quantity: 15, price: 195 },
    ],
    followers_list: [
      { username: "Sarah M", handle: "@sarahinvests", avatar: "/woman-portrait.png" },
      { username: "Emma Chen", handle: "@emmabudgets", avatar: "/serene-asian-woman.png" },
    ],
    following_list: [
      { username: "Maya Finance", handle: "@mayatalks", avatar: "/woman-with-stylish-glasses.png" },
      { username: "Priya Shah", handle: "@priyasaves", avatar: "/serene-indian-woman.png" },
    ],
  },
  "@yourusername": {
    username: "You",
    handle: "@yourusername",
    avatar: "/abstract-geometric-shapes.png",
    bio: "Building wealth one investment at a time 💰 | Long-term investor | ETF enthusiast",
    portfolioValue: "$52,450",
    totalReturn: 18.5,
    followers: 245,
    following: 132,
    performanceData: [
      { period: "Daily", value: [100, 101, 99, 102, 103, 105, 104, 106] },
      { period: "Monthly", value: [100, 102, 105, 103, 108, 112, 115, 118] },
      { period: "YTD", value: [100, 105, 110, 108, 115, 118, 120, 118] },
      { period: "1Y", value: [100, 105, 110, 115, 112, 118, 120, 118.5] },
      { period: "5Y", value: [100, 120, 140, 160, 150, 170, 180, 185] },
    ],
    allocation: [
      { ticker: "AAPL", percentage: 25, color: "#ec4899" },
      { ticker: "VOO", percentage: 20, color: "#fbbf24" },
      { ticker: "TSLA", percentage: 15, color: "#8b5cf6" },
      { ticker: "MSFT", percentage: 15, color: "#10b981" },
      { ticker: "VTI", percentage: 12, color: "#3b82f6" },
      { ticker: "Cash", percentage: 13, color: "#6b7280" },
    ],
    holdings: [
      {
        ticker: "VOO",
        name: "Vanguard S&P 500 ETF",
        quantity: 50,
        avgCost: 380,
        currentPrice: 435,
        marketValue: 21750,
        unrealizedPL: 14.5,
      },
      {
        ticker: "AAPL",
        name: "Apple Inc.",
        quantity: 75,
        avgCost: 170,
        currentPrice: 195,
        marketValue: 14625,
        unrealizedPL: 14.7,
      },
      {
        ticker: "MSFT",
        name: "Microsoft Corp.",
        quantity: 30,
        avgCost: 350,
        currentPrice: 440,
        marketValue: 13200,
        unrealizedPL: 25.7,
      },
      {
        ticker: "BND",
        name: "Vanguard Bond ETF",
        quantity: 60,
        avgCost: 79,
        currentPrice: 83.5,
        marketValue: 5010,
        unrealizedPL: 5.7,
      },
    ],
    dividends: {
      ytd: "$1,245",
      projected: "$1,680",
      yieldOnCost: "2.8%",
      monthlyData: [
        {
          month: "Jan",
          amount: 102,
          breakdown: [
            { ticker: "AAPL", amount: 45 },
            { ticker: "VOO", amount: 35 },
            { ticker: "MSFT", amount: 22 },
          ],
        },
        {
          month: "Feb",
          amount: 98,
          breakdown: [
            { ticker: "AAPL", amount: 42 },
            { ticker: "VOO", amount: 34 },
            { ticker: "MSFT", amount: 22 },
          ],
        },
        {
          month: "Mar",
          amount: 115,
          breakdown: [
            { ticker: "AAPL", amount: 48 },
            { ticker: "VOO", amount: 40 },
            { ticker: "MSFT", amount: 27 },
          ],
        },
        {
          month: "Apr",
          amount: 105,
          breakdown: [
            { ticker: "AAPL", amount: 46 },
            { ticker: "VOO", amount: 36 },
            { ticker: "MSFT", amount: 23 },
          ],
        },
        {
          month: "May",
          amount: 122,
          breakdown: [
            { ticker: "AAPL", amount: 52 },
            { ticker: "VOO", amount: 42 },
            { ticker: "MSFT", amount: 28 },
          ],
        },
        {
          month: "Jun",
          amount: 130,
          breakdown: [
            { ticker: "AAPL", amount: 55 },
            { ticker: "VOO", amount: 45 },
            { ticker: "MSFT", amount: 30 },
          ],
        },
      ],
    },
    recentTrades: [
      { date: "2025-01-20", action: "Buy", ticker: "MSFT", quantity: 5, price: 440 },
      { date: "2025-01-18", action: "Buy", ticker: "VOO", quantity: 10, price: 435 },
      { date: "2025-01-15", action: "Sell", ticker: "TSLA", quantity: 8, price: 310 },
      { date: "2025-01-10", action: "Buy", ticker: "AAPL", quantity: 15, price: 195 },
    ],
    followers_list: [
      { username: "Sarah M", handle: "@sarahinvests", avatar: "/woman-portrait.png" },
      { username: "Emma Chen", handle: "@emmabudgets", avatar: "/serene-asian-woman.png" },
    ],
    following_list: [
      { username: "Maya Finance", handle: "@mayatalks", avatar: "/woman-with-stylish-glasses.png" },
      { username: "Priya Shah", handle: "@priyasaves", avatar: "/serene-indian-woman.png" },
    ],
  },
  "@sarahinvests": {
    username: "Sarah M",
    handle: "@sarahinvests",
    avatar: "/woman-portrait.png",
    bio: "TFSA maxed out! 🎉 Sharing my journey to financial independence",
    portfolioValue: "$38,200",
    totalReturn: 12.3,
    followers: 892,
    following: 245,
    performanceData: [
      { period: "Daily", value: [100, 100.5, 101, 100.8, 101.5, 102, 101.8, 102.3] },
      { period: "Monthly", value: [100, 102, 104, 103, 106, 108, 110, 112.3] },
      { period: "YTD", value: [100, 103, 106, 105, 108, 110, 112, 112.3] },
      { period: "1Y", value: [100, 103, 106, 108, 110, 112, 112.3, 112.3] },
      { period: "5Y", value: [100, 115, 130, 140, 135, 145, 150, 155] },
    ],
    allocation: [
      { ticker: "AAPL", percentage: 22.5, color: "#ec4899" },
      { ticker: "VTI", percentage: 25, color: "#fbbf24" },
      { ticker: "VOO", percentage: 20, color: "#10b981" },
      { ticker: "BND", percentage: 10, color: "#3b82f6" },
      { ticker: "Cash", percentage: 12.5, color: "#6b7280" },
    ],
    holdings: [
      {
        ticker: "VTI",
        name: "Vanguard Total Market",
        quantity: 80,
        avgCost: 220,
        currentPrice: 275,
        marketValue: 22000,
        unrealizedPL: 25,
      },
      {
        ticker: "AAPL",
        name: "Apple Inc.",
        quantity: 40,
        avgCost: 165,
        currentPrice: 195,
        marketValue: 7800,
        unrealizedPL: 18.2,
      },
      {
        ticker: "VOO",
        name: "Vanguard S&P 500",
        quantity: 20,
        avgCost: 390,
        currentPrice: 435,
        marketValue: 8700,
        unrealizedPL: 11.5,
      },
    ],
    dividends: {
      ytd: "$890",
      projected: "$1,150",
      yieldOnCost: "2.5%",
      monthlyData: [
        {
          month: "Jan",
          amount: 80,
          breakdown: [
            { ticker: "AAPL", amount: 35 },
            { ticker: "VTI", amount: 35 },
            { ticker: "VOO", amount: 10 },
          ],
        },
        {
          month: "Feb",
          amount: 70,
          breakdown: [
            { ticker: "AAPL", amount: 30 },
            { ticker: "VTI", amount: 30 },
            { ticker: "VOO", amount: 10 },
          ],
        },
        {
          month: "Mar",
          amount: 75,
          breakdown: [
            { ticker: "AAPL", amount: 32.5 },
            { ticker: "VTI", amount: 32.5 },
            { ticker: "VOO", amount: 10 },
          ],
        },
        {
          month: "Apr",
          amount: 80,
          breakdown: [
            { ticker: "AAPL", amount: 35 },
            { ticker: "VTI", amount: 35 },
            { ticker: "VOO", amount: 10 },
          ],
        },
        {
          month: "May",
          amount: 85,
          breakdown: [
            { ticker: "AAPL", amount: 37.5 },
            { ticker: "VTI", amount: 37.5 },
            { ticker: "VOO", amount: 10 },
          ],
        },
        {
          month: "Jun",
          amount: 90,
          breakdown: [
            { ticker: "AAPL", amount: 40 },
            { ticker: "VTI", amount: 40 },
            { ticker: "VOO", amount: 10 },
          ],
        },
      ],
    },
    recentTrades: [
      { date: "2025-01-19", action: "Buy", ticker: "VTI", quantity: 15, price: 275 },
      { date: "2025-01-12", action: "Buy", ticker: "AAPL", quantity: 10, price: 195 },
    ],
    followers_list: [
      { username: "You", handle: "@yourusername", avatar: "/abstract-geometric-shapes.png" },
      { username: "Emma Chen", handle: "@emmabudgets", avatar: "/serene-asian-woman.png" },
    ],
    following_list: [{ username: "Maya Finance", handle: "@mayatalks", avatar: "/woman-with-stylish-glasses.png" }],
  },
  "@emmabudgets": {
    username: "Emma Chen",
    handle: "@emmabudgets",
    avatar: "/serene-asian-woman.png",
    bio: "Budget tracker extraordinaire 📊 | Making finance colorful and fun!",
    portfolioValue: "$45,600",
    totalReturn: 15.8,
    followers: 1245,
    following: 358,
    performanceData: [
      { period: "Daily", value: [100, 101.2, 100.8, 102, 102.5, 103, 102.8, 103.5] },
      { period: "Monthly", value: [100, 103, 106, 108, 110, 112, 114, 115.8] },
      { period: "YTD", value: [100, 104, 108, 110, 112, 114, 115, 115.8] },
      { period: "1Y", value: [100, 105, 110, 112, 114, 115, 115.8, 115.8] },
      { period: "5Y", value: [100, 118, 135, 145, 150, 160, 165, 170] },
    ],
    allocation: [
      { ticker: "MSFT", percentage: 27.5, color: "#ec4899" },
      { ticker: "VOO", percentage: 23.75, color: "#fbbf24" },
      { ticker: "NVDA", percentage: 21.25, color: "#10b981" },
      { ticker: "AAPL", percentage: 15, color: "#3b82f6" },
      { ticker: "Cash", percentage: 12.5, color: "#6b7280" },
    ],
    holdings: [
      {
        ticker: "MSFT",
        name: "Microsoft Corp.",
        quantity: 45,
        avgCost: 340,
        currentPrice: 440,
        marketValue: 19800,
        unrealizedPL: 29.4,
      },
      {
        ticker: "VOO",
        name: "Vanguard S&P 500",
        quantity: 35,
        avgCost: 385,
        currentPrice: 435,
        marketValue: 15225,
        unrealizedPL: 13,
      },
      {
        ticker: "NVDA",
        name: "NVIDIA Corp.",
        quantity: 12,
        avgCost: 650,
        currentPrice: 950,
        marketValue: 11400,
        unrealizedPL: 46.2,
      },
    ],
    dividends: {
      ytd: "$1,050",
      projected: "$1,400",
      yieldOnCost: "2.6%",
      monthlyData: [
        {
          month: "Jan",
          amount: 70,
          breakdown: [
            { ticker: "MSFT", amount: 30 },
            { ticker: "VOO", amount: 25 },
            { ticker: "NVDA", amount: 15 },
          ],
        },
        {
          month: "Feb",
          amount: 80,
          breakdown: [
            { ticker: "MSFT", amount: 35 },
            { ticker: "VOO", amount: 28 },
            { ticker: "NVDA", amount: 17 },
          ],
        },
        {
          month: "Mar",
          amount: 85,
          breakdown: [
            { ticker: "MSFT", amount: 37.5 },
            { ticker: "VOO", amount: 32.5 },
            { ticker: "NVDA", amount: 15 },
          ],
        },
        {
          month: "Apr",
          amount: 90,
          breakdown: [
            { ticker: "MSFT", amount: 40 },
            { ticker: "VOO", amount: 36 },
            { ticker: "NVDA", amount: 14 },
          ],
        },
        {
          month: "May",
          amount: 95,
          breakdown: [
            { ticker: "MSFT", amount: 42.5 },
            { ticker: "VOO", amount: 38.5 },
            { ticker: "NVDA", amount: 14 },
          ],
        },
        {
          month: "Jun",
          amount: 100,
          breakdown: [
            { ticker: "MSFT", amount: 45 },
            { ticker: "VOO", amount: 40 },
            { ticker: "NVDA", amount: 15 },
          ],
        },
      ],
    },
    recentTrades: [
      { date: "2025-01-21", action: "Buy", ticker: "NVDA", quantity: 2, price: 950 },
      { date: "2025-01-16", action: "Buy", ticker: "MSFT", quantity: 8, price: 440 },
    ],
    followers_list: [
      { username: "Sarah M", handle: "@sarahinvests", avatar: "/woman-portrait.png" },
      { username: "You", handle: "@yourusername", avatar: "/abstract-geometric-shapes.png" },
    ],
    following_list: [{ username: "Priya Shah", handle: "@priyasaves", avatar: "/serene-indian-woman.png" }],
  },
  "@mayatalks": {
    username: "Maya Finance",
    handle: "@mayatalks",
    avatar: "/woman-with-stylish-glasses.png",
    bio: "ETF educator 📚 | Simplifying investing for everyone",
    portfolioValue: "$68,900",
    totalReturn: 21.4,
    followers: 2340,
    following: 156,
    performanceData: [
      { period: "Daily", value: [100, 101.5, 102, 101.8, 103, 104, 103.5, 104.8] },
      { period: "Monthly", value: [100, 104, 108, 112, 115, 118, 120, 121.4] },
      { period: "YTD", value: [100, 106, 112, 115, 118, 120, 121, 121.4] },
      { period: "1Y", value: [100, 108, 115, 118, 120, 121, 121.4, 121.4] },
      { period: "5Y", value: [100, 125, 145, 160, 170, 180, 190, 195] },
    ],
    allocation: [
      { ticker: "VTI", percentage: 28, color: "#ec4899" },
      { ticker: "VOO", percentage: 22, color: "#fbbf24" },
      { ticker: "AAPL", percentage: 18, color: "#10b981" },
      { ticker: "BND", percentage: 10, color: "#3b82f6" },
      { ticker: "Cash", percentage: 12, color: "#6b7280" },
    ],
    holdings: [
      {
        ticker: "VTI",
        name: "Vanguard Total Market",
        quantity: 120,
        avgCost: 230,
        currentPrice: 275,
        marketValue: 33000,
        unrealizedPL: 19.6,
      },
      {
        ticker: "VOO",
        name: "Vanguard S&P 500",
        quantity: 50,
        avgCost: 375,
        currentPrice: 435,
        marketValue: 21750,
        unrealizedPL: 16,
      },
      {
        ticker: "AAPL",
        name: "Apple Inc.",
        quantity: 60,
        avgCost: 175,
        currentPrice: 195,
        marketValue: 11700,
        unrealizedPL: 11.4,
      },
    ],
    dividends: {
      ytd: "$1,580",
      projected: "$2,100",
      yieldOnCost: "3.1%",
      monthlyData: [
        {
          month: "Jan",
          amount: 100,
          breakdown: [
            { ticker: "VTI", amount: 40 },
            { ticker: "VOO", amount: 30 },
            { ticker: "AAPL", amount: 30 },
          ],
        },
        {
          month: "Feb",
          amount: 115,
          breakdown: [
            { ticker: "VTI", amount: 45 },
            { ticker: "VOO", amount: 35 },
            { ticker: "AAPL", amount: 35 },
          ],
        },
        {
          month: "Mar",
          amount: 125,
          breakdown: [
            { ticker: "VTI", amount: 50 },
            { ticker: "VOO", amount: 40 },
            { ticker: "AAPL", amount: 35 },
          ],
        },
        {
          month: "Apr",
          amount: 135,
          breakdown: [
            { ticker: "VTI", amount: 55 },
            { ticker: "VOO", amount: 45 },
            { ticker: "AAPL", amount: 35 },
          ],
        },
        {
          month: "May",
          amount: 145,
          breakdown: [
            { ticker: "VTI", amount: 60 },
            { ticker: "VOO", amount: 50 },
            { ticker: "AAPL", amount: 35 },
          ],
        },
        {
          month: "Jun",
          amount: 155,
          breakdown: [
            { ticker: "VTI", amount: 65 },
            { ticker: "VOO", amount: 55 },
            { ticker: "AAPL", amount: 35 },
          ],
        },
      ],
    },
    recentTrades: [
      { date: "2025-01-20", action: "Buy", ticker: "VTI", quantity: 20, price: 275 },
      { date: "2025-01-14", action: "Buy", ticker: "VOO", quantity: 10, price: 435 },
    ],
    followers_list: [
      { username: "You", handle: "@yourusername", avatar: "/abstract-geometric-shapes.png" },
      { username: "Sarah M", handle: "@sarahinvests", avatar: "/woman-portrait.png" },
    ],
    following_list: [{ username: "Emma Chen", handle: "@emmabudgets", avatar: "/serene-asian-woman.png" }],
  },
  "@priyasaves": {
    username: "Priya Shah",
    handle: "@priyasaves",
    avatar: "/serene-indian-woman.png",
    bio: "Saving and investing journey 💸 | First-time investor learning every day",
    portfolioValue: "$28,750",
    totalReturn: 8.2,
    followers: 456,
    following: 289,
    performanceData: [
      { period: "Daily", value: [100, 100.3, 100.8, 100.5, 101, 101.3, 101.5, 101.8] },
      { period: "Monthly", value: [100, 101, 102, 103, 105, 106, 107, 108.2] },
      { period: "YTD", value: [100, 102, 104, 105, 106, 107, 108, 108.2] },
      { period: "1Y", value: [100, 102, 104, 106, 107, 108, 108.2, 108.2] },
      { period: "5Y", value: [100, 110, 120, 125, 130, 135, 140, 145] },
    ],
    allocation: [
      { ticker: "VOO", percentage: 20, color: "#ec4899" },
      { ticker: "BND", percentage: 25, color: "#fbbf24" },
      { ticker: "AAPL", percentage: 15, color: "#10b981" },
      { ticker: "Cash", percentage: 20, color: "#3b82f6" },
      { ticker: "NVDA", percentage: 20, color: "#6b7280" },
    ],
    holdings: [
      {
        ticker: "VOO",
        name: "Vanguard S&P 500",
        quantity: 40,
        avgCost: 400,
        currentPrice: 435,
        marketValue: 17400,
        unrealizedPL: 8.75,
      },
      {
        ticker: "BND",
        name: "Vanguard Bond ETF",
        quantity: 80,
        avgCost: 80,
        currentPrice: 83.5,
        marketValue: 6680,
        unrealizedPL: 4.4,
      },
      {
        ticker: "AAPL",
        name: "Apple Inc.",
        quantity: 25,
        avgCost: 185,
        currentPrice: 195,
        marketValue: 4875,
        unrealizedPL: 5.4,
      },
    ],
    dividends: {
      ytd: "$520",
      projected: "$680",
      yieldOnCost: "2.2%",
      monthlyData: [
        {
          month: "Jan",
          amount: 35,
          breakdown: [
            { ticker: "VOO", amount: 15 },
            { ticker: "BND", amount: 10 },
            { ticker: "AAPL", amount: 10 },
          ],
        },
        {
          month: "Feb",
          amount: 40,
          breakdown: [
            { ticker: "VOO", amount: 16 },
            { ticker: "BND", amount: 12 },
            { ticker: "AAPL", amount: 12 },
          ],
        },
        {
          month: "Mar",
          amount: 42,
          breakdown: [
            { ticker: "VOO", amount: 16.5 },
            { ticker: "BND", amount: 12.5 },
            { ticker: "AAPL", amount: 13 },
          ],
        },
        {
          month: "Apr",
          amount: 45,
          breakdown: [
            { ticker: "VOO", amount: 17.5 },
            { ticker: "BND", amount: 13.5 },
            { ticker: "AAPL", amount: 14 },
          ],
        },
        {
          month: "May",
          amount: 48,
          breakdown: [
            { ticker: "VOO", amount: 18 },
            { ticker: "BND", amount: 14 },
            { ticker: "AAPL", amount: 16 },
          ],
        },
        {
          month: "Jun",
          amount: 50,
          breakdown: [
            { ticker: "VOO", amount: 19 },
            { ticker: "BND", amount: 15 },
            { ticker: "AAPL", amount: 16 },
          ],
        },
      ],
    },
    recentTrades: [
      { date: "2025-01-17", action: "Buy", ticker: "VOO", quantity: 5, price: 435 },
      { date: "2025-01-08", action: "Buy", ticker: "BND", quantity: 20, price: 83.5 },
    ],
    followers_list: [
      { username: "Emma Chen", handle: "@emmabudgets", avatar: "/serene-asian-woman.png" },
      { username: "You", handle: "@yourusername", avatar: "/abstract-geometric-shapes.png" },
    ],
    following_list: [
      { username: "Sarah M", handle: "@sarahinvests", avatar: "/woman-portrait.png" },
      { username: "Maya Finance", handle: "@mayatalks", avatar: "/woman-with-stylish-glasses.png" },
    ],
  },
}

export function ProfileTab({
  username = "You",
  onNavigateToProfile,
}: { username?: string; onNavigateToProfile?: (username: string) => void }) {
  const [activeTab, setActiveTab] = useState<"overview" | "followers" | "following">("overview")
  const [selectedPeriod, setSelectedPeriod] = useState("1Y")
  const [isFollowing, setIsFollowing] = useState(false)

  const profile = MOCK_USERS[username] || MOCK_USERS["You"] || MOCK_USERS["@yourusername"]

  const currentPerformanceData = profile?.performanceData?.find((p) => p.period === selectedPeriod)?.value || []

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header Section */}
      <Card className="p-6 border-pink-100 shadow-sm">
        <div className="flex flex-col md:flex-row gap-6">
          <Avatar className="w-24 h-24">
            <AvatarImage src={profile.avatar || "/placeholder.svg"} />
            <AvatarFallback>{profile.username[0]}</AvatarFallback>
          </Avatar>

          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900 mb-1">{profile.username}</h1>
            <p className="text-gray-600 mb-3">{profile.handle}</p>
            <p className="text-gray-700 mb-4">{profile.bio}</p>

            <div className="flex flex-wrap gap-6 mb-4">
              <div>
                <p className="text-sm text-gray-600">Portfolio Value</p>
                <p className="text-xl font-bold text-gray-900">{profile.portfolioValue}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Return</p>
                <div className="flex items-center gap-1">
                  {profile.totalReturn >= 0 ? (
                    <TrendingUp className="w-5 h-5 text-green-600" />
                  ) : (
                    <TrendingDown className="w-5 h-5 text-red-600" />
                  )}
                  <span className={`text-xl font-bold ${profile.totalReturn >= 0 ? "text-green-600" : "text-red-600"}`}>
                    {profile.totalReturn > 0 ? "+" : ""}
                    {profile.totalReturn}%
                  </span>
                </div>
              </div>
              <Button onClick={() => setActiveTab("followers")} className="border-pink-200 hover:bg-pink-50">
                <p className="text-sm text-gray-600">Followers</p>
                <p className="text-xl font-bold text-gray-900">{profile.followers}</p>
              </Button>
              <Button onClick={() => setActiveTab("following")} className="border-pink-200 hover:bg-pink-50">
                <p className="text-sm text-gray-600">Following</p>
                <p className="text-xl font-bold text-gray-900">{profile.following}</p>
              </Button>
            </div>

            <div className="flex items-center gap-4">
              <Button variant="outline" className="border-pink-300 text-pink-700 hover:bg-pink-50 bg-transparent">
                Edit Profile
              </Button>
              <Button
                variant="outline"
                className={`border-pink-300 text-pink-700 hover:bg-pink-50 bg-transparent ${
                  isFollowing ? "bg-pink-500 text-white" : ""
                }`}
                onClick={() => setIsFollowing(!isFollowing)}
              >
                {isFollowing ? <Check className="w-4 h-4" /> : <Users className="w-4 h-4" />}
                {isFollowing ? "Following" : "Follow"}
              </Button>
              <Button variant="outline" className="border-pink-300 text-pink-700 hover:bg-pink-50 bg-transparent">
                <Settings className="w-4 h-4" />
                Settings
              </Button>
              <Button variant="outline" className="border-pink-300 text-pink-700 hover:bg-pink-50 bg-transparent">
                <MoreVertical className="w-4 h-4" />
                More
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Followers / Following Lists */}
      {activeTab === "followers" && (
        <Card className="p-6 border-pink-100 shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-4">Followers</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {profile.followers_list.map((user) => (
              <div
                key={user.handle}
                onClick={() => onNavigateToProfile?.(user.handle)}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-pink-50 cursor-pointer transition-colors"
              >
                <Avatar className="w-10 h-10">
                  <AvatarImage src={user.avatar || "/placeholder.svg"} />
                  <AvatarFallback>{user.username[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-gray-900">{user.username}</p>
                  <p className="text-sm text-gray-600">{user.handle}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {activeTab === "following" && (
        <Card className="p-6 border-pink-100 shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-4">Following</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {profile.following_list.map((user) => (
              <div
                key={user.handle}
                onClick={() => onNavigateToProfile?.(user.handle)}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-pink-50 cursor-pointer transition-colors"
              >
                <Avatar className="w-10 h-10">
                  <AvatarImage src={user.avatar || "/placeholder.svg"} />
                  <AvatarFallback>{user.username[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-gray-900">{user.username}</p>
                  <p className="text-sm text-gray-600">{user.handle}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {activeTab === "overview" && (
        <>
          {/* Performance Overview */}
          <Card className="p-6 border-pink-100 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-4">Performance Overview</h3>

            <div className="flex gap-2 mb-6">
              {profile.performanceData.map((period) => (
                <Button
                  key={period.period}
                  variant={selectedPeriod === period.period ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedPeriod(period.period)}
                  className={
                    selectedPeriod === period.period
                      ? "bg-pink-500 hover:bg-pink-600 text-white"
                      : "border-pink-200 hover:bg-pink-50"
                  }
                >
                  {period.period}
                </Button>
              ))}
            </div>

            <div className="h-64 bg-pink-50 rounded-lg p-4 relative">
              <svg viewBox="0 0 800 240" className="w-full h-full">
                {/* Grid lines */}
                {[0, 1, 2, 3, 4].map((i) => (
                  <line key={i} x1="0" y1={i * 60} x2="800" y2={i * 60} stroke="#fce7f3" strokeWidth="1" />
                ))}

                {/* Line path */}
                <polyline
                  points={currentPerformanceData
                    .map((value, index) => {
                      const maxValue = Math.max(...currentPerformanceData)
                      const minValue = Math.min(...currentPerformanceData)
                      const range = maxValue - minValue || 1
                      const x = (index / (currentPerformanceData.length - 1)) * 800
                      const y = 240 - ((value - minValue) / range) * 200 - 20
                      return `${x},${y}`
                    })
                    .join(" ")}
                  fill="none"
                  stroke="#ec4899"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Data points */}
                {currentPerformanceData.map((value, index) => {
                  const maxValue = Math.max(...currentPerformanceData)
                  const minValue = Math.min(...currentPerformanceData)
                  const range = maxValue - minValue || 1
                  const x = (index / (currentPerformanceData.length - 1)) * 800
                  const y = 240 - ((value - minValue) / range) * 200 - 20
                  return (
                    <circle
                      key={index}
                      cx={x}
                      cy={y}
                      r="4"
                      fill="#ec4899"
                      className="hover:r-6 transition-all cursor-pointer"
                    />
                  )
                })}
              </svg>
            </div>

            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600">Current Return ({selectedPeriod})</p>
              <p className={`text-2xl font-bold ${profile.totalReturn >= 0 ? "text-green-600" : "text-red-600"}`}>
                {profile.totalReturn > 0 ? "+" : ""}
                {profile.totalReturn}%
              </p>
            </div>
          </Card>

          {/* Portfolio Allocation */}
          <Card className="p-6 border-pink-100 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-2">Portfolio Allocation</h3>
            <p className="text-sm text-gray-600 mb-4">Breakdown by individual holdings</p>
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="relative w-48 h-48">
                <svg viewBox="0 0 200 200" className="transform -rotate-90">
                  {
                    profile.allocation.reduce(
                      (acc, item, index) => {
                        const angle = (item.percentage / 100) * 360
                        const largeArcFlag = angle > 180 ? 1 : 0
                        const endAngle = acc.startAngle + angle
                        const x1 = 100 + 80 * Math.cos((Math.PI * acc.startAngle) / 180)
                        const y1 = 100 + 80 * Math.sin((Math.PI * acc.startAngle) / 180)
                        const x2 = 100 + 80 * Math.cos((Math.PI * endAngle) / 180)
                        const y2 = 100 + 80 * Math.sin((Math.PI * endAngle) / 180)

                        acc.paths.push(
                          <path
                            key={index}
                            d={`M 100 100 L ${x1} ${y1} A 80 80 0 ${largeArcFlag} 1 ${x2} ${y2} Z`}
                            fill={item.color}
                            className="hover:opacity-80 transition-opacity"
                          />,
                        )
                        acc.startAngle = endAngle
                        return acc
                      },
                      { startAngle: 0, paths: [] as React.ReactElement[] },
                    ).paths
                  }
                  <circle cx="100" cy="100" r="50" fill="white" />
                </svg>
              </div>
              <div className="flex-1 space-y-3">
                {profile.allocation.map((item) => (
                  <div key={item.ticker} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 rounded" style={{ backgroundColor: item.color }} />
                      <span className="text-gray-900 font-medium">{item.ticker}</span>
                    </div>
                    <span className="font-semibold text-gray-900">{item.percentage}%</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* Holdings Table */}
          <Card className="p-6 border-pink-100 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-4">Holdings</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-2 text-sm font-semibold text-gray-600">Ticker</th>
                    <th className="text-left py-3 px-2 text-sm font-semibold text-gray-600">Name</th>
                    <th className="text-right py-3 px-2 text-sm font-semibold text-gray-600">Quantity</th>
                    <th className="text-right py-3 px-2 text-sm font-semibold text-gray-600">Avg Cost</th>
                    <th className="text-right py-3 px-2 text-sm font-semibold text-gray-600">Current</th>
                    <th className="text-right py-3 px-2 text-sm font-semibold text-gray-600">Market Value</th>
                    <th className="text-right py-3 px-2 text-sm font-semibold text-gray-600">P/L %</th>
                  </tr>
                </thead>
                <tbody>
                  {profile.holdings.map((holding) => (
                    <tr key={holding.ticker} className="border-b border-gray-100 hover:bg-pink-50 transition-colors">
                      <td className="py-3 px-2 font-semibold text-gray-900">{holding.ticker}</td>
                      <td className="py-3 px-2 text-gray-700">{holding.name}</td>
                      <td className="py-3 px-2 text-right text-gray-700">{holding.quantity}</td>
                      <td className="py-3 px-2 text-right text-gray-700">${holding.avgCost}</td>
                      <td className="py-3 px-2 text-right text-gray-700">${holding.currentPrice}</td>
                      <td className="py-3 px-2 text-right font-semibold text-gray-900">
                        ${holding.marketValue.toLocaleString()}
                      </td>
                      <td
                        className={`py-3 px-2 text-right font-semibold ${holding.unrealizedPL >= 0 ? "text-green-600" : "text-red-600"}`}
                      >
                        {holding.unrealizedPL > 0 ? "+" : ""}
                        {holding.unrealizedPL}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Monthly Dividends */}
          <Card className="p-6 border-pink-100 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-4">Monthly Dividends</h3>

            <div className="grid grid-cols-3 gap-4 mb-6">
              <div>
                <p className="text-sm text-gray-600">YTD Total</p>
                <p className="text-xl font-bold text-gray-900">{profile.dividends.ytd}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Projected Annual</p>
                <p className="text-xl font-bold text-gray-900">{profile.dividends.projected}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Yield on Cost</p>
                <p className="text-xl font-bold text-gray-900">{profile.dividends.yieldOnCost}</p>
              </div>
            </div>

            <div className="h-64 bg-pink-50 rounded-lg p-6 relative">
              <svg viewBox="0 0 800 200" className="w-full h-full">
                {/* Grid lines */}
                {[0, 1, 2, 3, 4].map((i) => (
                  <line key={i} x1="0" y1={i * 50} x2="800" y2={i * 50} stroke="#fce7f3" strokeWidth="1" />
                ))}

                {/* Total dividends line */}
                <polyline
                  points={profile.dividends.monthlyData
                    .map((month, index) => {
                      const maxValue = Math.max(...profile.dividends.monthlyData.map((m) => m.amount))
                      const x = (index / (profile.dividends.monthlyData.length - 1)) * 800
                      const y = 180 - (month.amount / maxValue) * 160
                      return `${x},${y}`
                    })
                    .join(" ")}
                  fill="none"
                  stroke="#ec4899"
                  strokeWidth="3"
                  strokeLinecap="round"
                />

                {/* Individual ticker lines */}
                {["AAPL", "VOO", "MSFT"].map((ticker, tickerIndex) => {
                  const colors = ["#fbbf24", "#10b981", "#3b82f6"]
                  return (
                    <polyline
                      key={ticker}
                      points={profile.dividends.monthlyData
                        .map((month, index) => {
                          const maxValue = Math.max(...profile.dividends.monthlyData.map((m) => m.amount))
                          const tickerAmount = month.breakdown.find((b) => b.ticker === ticker)?.amount || 0
                          const x = (index / (profile.dividends.monthlyData.length - 1)) * 800
                          const y = 180 - (tickerAmount / maxValue) * 160
                          return `${x},${y}`
                        })
                        .join(" ")}
                      fill="none"
                      stroke={colors[tickerIndex]}
                      strokeWidth="2"
                      strokeLinecap="round"
                      opacity="0.7"
                    />
                  )
                })}
              </svg>
            </div>

            {/* Legend */}
            <div className="flex flex-wrap gap-4 mt-4 justify-center">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-pink-500" />
                <span className="text-sm text-gray-600">Total</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <span className="text-sm text-gray-600">AAPL</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span className="text-sm text-gray-600">VOO</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500" />
                <span className="text-sm text-gray-600">MSFT</span>
              </div>
            </div>
          </Card>

          {/* Recent Trades */}
          <Card className="p-6 border-pink-100 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-4">Recent Trades</h3>
            <div className="space-y-3">
              {profile.recentTrades.map((trade, index) => (
                <div key={index} className="flex items-center justify-between py-3 px-4 bg-pink-50 rounded-lg">
                  <div className="flex items-center gap-4">
                    <Badge
                      className={
                        trade.action === "Buy"
                          ? "bg-green-100 text-green-700 border-green-200"
                          : "bg-red-100 text-red-700 border-red-200"
                      }
                    >
                      {trade.action}
                    </Badge>
                    <span className="font-semibold text-gray-900">{trade.ticker}</span>
                    <span className="text-gray-600">×{trade.quantity}</span>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">${trade.price}</p>
                    <p className="text-sm text-gray-600">{trade.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </>
      )}
    </div>
  )
}
