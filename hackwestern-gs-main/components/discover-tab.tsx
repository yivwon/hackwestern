"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Search, TrendingUp, TrendingDown, Heart, X } from "lucide-react"

interface Asset {
  id: number
  ticker: string
  name: string
  type: "Stock" | "ETF"
  healthScore: number
  yearReturn: number
  volatility: "Low" | "Medium" | "High"
  riskLevel: "Low" | "Medium" | "High"
  description: string
  priceData: number[]
  sector: string
  dividendYield: string
  marketCap: string
}

const MOCK_ASSETS: Asset[] = [
  {
    id: 1,
    ticker: "AAPL",
    name: "Apple Inc.",
    type: "Stock",
    healthScore: 82,
    yearReturn: 24.0,
    volatility: "Medium",
    riskLevel: "Medium",
    description:
      "Apple is a large-cap technology company known for the iPhone, Mac, and services ecosystem. Suitable for long-term investors seeking growth.",
    priceData: [150, 155, 160, 158, 165, 170, 175, 180, 178, 185, 190, 195],
    sector: "Technology",
    dividendYield: "0.5%",
    marketCap: "Large Cap",
  },
  {
    id: 2,
    ticker: "VOO",
    name: "Vanguard S&P 500 ETF",
    type: "ETF",
    healthScore: 90,
    yearReturn: 12.0,
    volatility: "Low",
    riskLevel: "Low",
    description:
      "Tracks the S&P 500 index, providing exposure to 500 of the largest U.S. companies. Ideal for long-term, diversified growth with low fees.",
    priceData: [380, 385, 390, 395, 400, 405, 410, 415, 420, 425, 430, 435],
    sector: "Diversified",
    dividendYield: "1.5%",
    marketCap: "Large Cap",
  },
  {
    id: 3,
    ticker: "TSLA",
    name: "Tesla, Inc.",
    type: "Stock",
    healthScore: 65,
    yearReturn: 8.0,
    volatility: "High",
    riskLevel: "High",
    description:
      "Tesla designs, develops, manufactures, and sells electric vehicles and energy storage systems. High growth potential but significant volatility.",
    priceData: [200, 220, 240, 210, 250, 230, 270, 260, 280, 300, 290, 310],
    sector: "Automotive",
    dividendYield: "N/A",
    marketCap: "Large Cap",
  },
  {
    id: 4,
    ticker: "VTI",
    name: "Vanguard Total Stock Market ETF",
    type: "ETF",
    healthScore: 94,
    yearReturn: 13.5,
    volatility: "Low",
    riskLevel: "Low",
    description:
      "Provides exposure to the entire U.S. stock market, including small-, mid-, and large-cap stocks. Excellent diversification at a low cost.",
    priceData: [220, 225, 230, 235, 240, 245, 250, 255, 260, 265, 270, 275],
    sector: "Diversified",
    dividendYield: "1.4%",
    marketCap: "All Cap",
  },
  {
    id: 5,
    ticker: "MSFT",
    name: "Microsoft Corporation",
    type: "Stock",
    healthScore: 88,
    yearReturn: 32.5,
    volatility: "Medium",
    riskLevel: "Medium",
    description:
      "Microsoft develops software, services, devices, and solutions. Strong cloud computing business (Azure) drives consistent growth.",
    priceData: [340, 350, 360, 370, 380, 375, 390, 400, 410, 420, 430, 440],
    sector: "Technology",
    dividendYield: "0.8%",
    marketCap: "Large Cap",
  },
  {
    id: 6,
    ticker: "ARKK",
    name: "ARK Innovation ETF",
    type: "ETF",
    healthScore: 45,
    yearReturn: -3.0,
    volatility: "High",
    riskLevel: "High",
    description:
      "Actively managed ETF focused on disruptive innovation in technology and healthcare. High risk, high reward potential.",
    priceData: [80, 75, 70, 68, 72, 70, 68, 65, 70, 72, 75, 78],
    sector: "Innovation",
    dividendYield: "N/A",
    marketCap: "Mixed Cap",
  },
  {
    id: 7,
    ticker: "BND",
    name: "Vanguard Total Bond Market ETF",
    type: "ETF",
    healthScore: 78,
    yearReturn: 3.2,
    volatility: "Low",
    riskLevel: "Low",
    description:
      "Provides broad exposure to U.S. investment-grade bonds. Lower returns but also lower risk, ideal for portfolio stability.",
    priceData: [78, 78.5, 79, 79.5, 80, 80.5, 81, 81.5, 82, 82.5, 83, 83.5],
    sector: "Fixed Income",
    dividendYield: "3.5%",
    marketCap: "N/A",
  },
  {
    id: 8,
    ticker: "NVDA",
    name: "NVIDIA Corporation",
    type: "Stock",
    healthScore: 76,
    yearReturn: 118.9,
    volatility: "High",
    riskLevel: "High",
    description:
      "NVIDIA designs GPUs and system-on-chip units for gaming, professional visualization, data centers, and automotive markets. AI boom driver.",
    priceData: [400, 450, 500, 550, 600, 650, 700, 750, 800, 850, 900, 950],
    sector: "Technology",
    dividendYield: "0.04%",
    marketCap: "Large Cap",
  },
]

export function DiscoverTab() {
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [typeFilter, setTypeFilter] = useState<"All" | "Stock" | "ETF">("All")
  const [riskFilter, setRiskFilter] = useState<"All" | "Low" | "Medium" | "High">("All")
  const [currentSwipeIndex, setCurrentSwipeIndex] = useState(0)
  const [watchlist, setWatchlist] = useState<string[]>([])
  const [showToast, setShowToast] = useState(false)

  const filteredAssets = MOCK_ASSETS.filter((asset) => {
    const matchesSearch =
      asset.ticker.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = typeFilter === "All" || asset.type === typeFilter
    const matchesRisk = riskFilter === "All" || asset.riskLevel === riskFilter
    return matchesSearch && matchesType && matchesRisk
  })

  const getHealthColor = (score: number) => {
    if (score >= 70) return "bg-green-100 text-green-700 border-green-200"
    if (score >= 40) return "bg-yellow-100 text-yellow-700 border-yellow-200"
    return "bg-red-100 text-red-700 border-red-200"
  }

  const getHealthLabel = (score: number) => {
    if (score >= 70) return "Healthy"
    if (score >= 40) return "Moderate"
    return "Risky"
  }

  const handleSkip = () => {
    if (currentSwipeIndex < MOCK_ASSETS.length - 1) {
      setCurrentSwipeIndex(currentSwipeIndex + 1)
    } else {
      setCurrentSwipeIndex(0) // Loop back to start
    }
  }

  const handleAddToWatchlist = (ticker: string) => {
    if (!watchlist.includes(ticker)) {
      setWatchlist([...watchlist, ticker])
      setShowToast(true)
      setTimeout(() => setShowToast(false), 2000)
    }
  }

  const removeFromWatchlist = (ticker: string) => {
    setWatchlist(watchlist.filter((t) => t !== ticker))
  }

  if (selectedAsset) {
    return (
      <div className="max-w-4xl mx-auto">
        <Button variant="ghost" onClick={() => setSelectedAsset(null)} className="mb-4 hover:bg-pink-50">
          <X className="w-4 h-4 mr-2" />
          Close
        </Button>

        <Card className="p-6 border-pink-100 shadow-sm">
          <div className="flex items-start justify-between mb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-3xl font-bold text-gray-900">{selectedAsset.ticker}</h2>
                <Badge className="bg-pink-100 text-pink-700 border-pink-200">{selectedAsset.type}</Badge>
              </div>
              <p className="text-lg text-gray-600">{selectedAsset.name}</p>
            </div>
            <div className={`px-4 py-2 rounded-full border ${getHealthColor(selectedAsset.healthScore)}`}>
              <div className="text-center">
                <div className="text-2xl font-bold">{selectedAsset.healthScore}</div>
                <div className="text-xs">{getHealthLabel(selectedAsset.healthScore)}</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-pink-50 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-1">1-Year Return</p>
              <div className="flex items-center gap-2">
                {selectedAsset.yearReturn >= 0 ? (
                  <TrendingUp className="w-5 h-5 text-green-600" />
                ) : (
                  <TrendingDown className="w-5 h-5 text-red-600" />
                )}
                <span
                  className={`text-xl font-bold ${selectedAsset.yearReturn >= 0 ? "text-green-600" : "text-red-600"}`}
                >
                  {selectedAsset.yearReturn > 0 ? "+" : ""}
                  {selectedAsset.yearReturn}%
                </span>
              </div>
            </div>
            <div className="bg-pink-50 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-1">Volatility</p>
              <p className="text-xl font-bold text-gray-900">{selectedAsset.volatility}</p>
            </div>
            <div className="bg-pink-50 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-1">Risk Level</p>
              <p className="text-xl font-bold text-gray-900">{selectedAsset.riskLevel}</p>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-3">Price History (12 Months)</h3>
            <div className="h-48 bg-pink-50 rounded-lg p-4 flex items-end gap-2">
              {selectedAsset.priceData.map((price, index) => {
                const maxPrice = Math.max(...selectedAsset.priceData)
                const height = (price / maxPrice) * 100
                return (
                  <div
                    key={index}
                    className="flex-1 bg-pink-400 rounded-t transition-all hover:opacity-80"
                    style={{ height: `${height}%` }}
                    title={`$${price}`}
                  />
                )
              })}
            </div>
          </div>

          <div className="bg-pink-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-3">About</h3>
            <p className="text-sm text-gray-700 mb-3">{selectedAsset.description}</p>
            <p className="text-sm text-gray-600">
              The healthiness score is based on factors like diversification, historical volatility, long-term
              performance trends, and overall risk profile. Scores above 70 indicate strong fundamentals and lower risk,
              while scores below 40 suggest higher volatility and risk.
            </p>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Discover Stocks & ETFs</h2>
          <p className="text-gray-600 mt-1">Explore assets and build your watchlist</p>
        </div>
      </div>

      <Card className="p-6 border-pink-100 shadow-sm">
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search stocks or ETFs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 border-pink-200 focus:border-pink-400"
              />
            </div>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as "All" | "Stock" | "ETF")}
              className="px-4 py-2 border border-pink-200 rounded-lg focus:outline-none focus:border-pink-400 bg-white"
            >
              <option value="All">All Types</option>
              <option value="Stock">Stocks</option>
              <option value="ETF">ETFs</option>
            </select>
            <select
              value={riskFilter}
              onChange={(e) => setRiskFilter(e.target.value as "All" | "Low" | "Medium" | "High")}
              className="px-4 py-2 border border-pink-200 rounded-lg focus:outline-none focus:border-pink-400 bg-white"
            >
              <option value="All">All Risk Levels</option>
              <option value="Low">Low Risk</option>
              <option value="Medium">Medium Risk</option>
              <option value="High">High Risk</option>
            </select>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-pink-100">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Ticker</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Name</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Type</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Health Score</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">1Y Return</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Risk</th>
                </tr>
              </thead>
              <tbody>
                {filteredAssets.map((asset) => (
                  <tr
                    key={asset.ticker}
                    onClick={() => setSelectedAsset(asset)}
                    className="border-b border-gray-100 hover:bg-pink-50 cursor-pointer transition-colors"
                  >
                    <td className="py-3 px-4 font-semibold text-gray-900">{asset.ticker}</td>
                    <td className="py-3 px-4 text-gray-700">{asset.name}</td>
                    <td className="py-3 px-4">
                      <Badge className="bg-pink-100 text-pink-700 border-pink-200">{asset.type}</Badge>
                    </td>
                    <td className="py-3 px-4">
                      <div className={`inline-flex px-3 py-1 rounded-full border ${getHealthColor(asset.healthScore)}`}>
                        <span className="font-bold">{asset.healthScore}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className={`font-semibold ${asset.yearReturn >= 0 ? "text-green-600" : "text-red-600"}`}>
                        {asset.yearReturn > 0 ? "+" : ""}
                        {asset.yearReturn}%
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant="outline" className="border-gray-300">
                        {asset.riskLevel}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Card>

      <div>
        <h3 className="text-xl font-bold text-gray-900 mb-4">Swipe Through Stocks</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {MOCK_ASSETS.slice(0, 6).map((asset) => (
            <Card key={asset.ticker} className="border-pink-200 shadow-sm">
              <div className="p-5">
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-2xl font-bold text-gray-900">{asset.ticker}</h3>
                    <Badge className="bg-pink-100 text-pink-700 border-pink-200 text-xs">{asset.type}</Badge>
                  </div>
                  <p className="text-sm text-gray-700">{asset.name}</p>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge className="bg-pink-50 text-pink-700 border-pink-200 text-xs">Risk: {asset.riskLevel}</Badge>
                  <Badge className="bg-pink-50 text-pink-700 border-pink-200 text-xs">{asset.sector}</Badge>
                </div>

                <div className="mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">Health Score</span>
                    <div className={`px-3 py-1 rounded-full border text-sm ${getHealthColor(asset.healthScore)}`}>
                      <span className="font-bold">
                        {asset.healthScore}
                        <span className="text-xs">/100</span>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="h-20 bg-pink-50 rounded-lg p-2 flex items-end gap-1">
                    {asset.priceData.map((price, index) => {
                      const maxPrice = Math.max(...asset.priceData)
                      const height = (price / maxPrice) * 100
                      return (
                        <div
                          key={index}
                          className="flex-1 bg-pink-400 rounded-t"
                          style={{ height: `${height}%` }}
                          title={`$${price}`}
                        />
                      )
                    })}
                  </div>
                </div>

                <div className="bg-pink-50 rounded-lg p-3 mb-4">
                  <p className="text-xs text-gray-700 leading-relaxed line-clamp-3">{asset.description}</p>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 border-gray-300 hover:bg-gray-50 bg-transparent"
                    onClick={() => setSelectedAsset(asset)}
                  >
                    View Details
                  </Button>
                  <Button
                    size="sm"
                    className="flex-1 bg-pink-500 hover:bg-pink-600 text-white"
                    onClick={() => handleAddToWatchlist(asset.ticker)}
                  >
                    <Heart className="w-4 h-4 mr-1" />
                    Add to Watchlist
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {showToast && (
        <div className="fixed bottom-8 right-8 bg-pink-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-in slide-in-from-bottom">
          <Heart className="w-5 h-5 fill-current" />
          <span className="font-medium">Added to your watchlist!</span>
        </div>
      )}
    </div>
  )
}
