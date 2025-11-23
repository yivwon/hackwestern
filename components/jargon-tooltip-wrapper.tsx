"use client"

import type React from "react"

import { useEffect, useState } from "react"

// Finance jargon terms list
const FINANCE_JARGON = [
  "etf",
  "etfs",
  "dividend",
  "dividends",
  "yield",
  "apy",
  "p/e",
  "price-to-earnings",
  "market cap",
  "liquidity",
  "volatility",
  "asset",
  "assets",
  "portfolio",
  "bond",
  "bonds",
  "equity",
  "equities",
  "leverage",
  "derivative",
  "derivatives",
  "index fund",
  "index funds",
  "mutual fund",
  "mutual funds",
  "capital gains",
  "tfsa",
  "rrsp",
  "margin",
  "stock",
  "stocks",
  "share",
  "shares",
  "ticker",
  "bull market",
  "bear market",
  "recession",
  "inflation",
  "deflation",
  "diversification",
  "allocation",
  "rebalancing",
  "expense ratio",
  "nasdaq",
  "dow jones",
  "s&p",
  "tsx",
  "ipo",
  "roi",
  "volatility index",
]

interface TooltipPosition {
  top: number
  left: number
}

export function JargonTooltipWrapper({ children }: { children: React.ReactNode }) {
  const [showTooltip, setShowTooltip] = useState(false)
  const [tooltipPosition, setTooltipPosition] = useState<TooltipPosition>({ top: 0, left: 0 })

  useEffect(() => {
    let hideTimeout: NodeJS.Timeout

    const handleSelection = () => {
      const selection = window.getSelection()

      if (!selection || selection.rangeCount === 0) {
        setShowTooltip(false)
        return
      }

      const selectedText = selection.toString().trim().toLowerCase()

      // Check if selected text is a finance jargon term
      if (selectedText && FINANCE_JARGON.includes(selectedText)) {
        const range = selection.getRangeAt(0)
        const rect = range.getBoundingClientRect()

        // Position tooltip above the selection
        setTooltipPosition({
          top: rect.top + window.scrollY - 50,
          left: rect.left + window.scrollX + rect.width / 2,
        })

        setShowTooltip(true)

        // Auto-hide after 4 seconds
        clearTimeout(hideTimeout)
        hideTimeout = setTimeout(() => {
          setShowTooltip(false)
        }, 4000)
      } else {
        setShowTooltip(false)
      }
    }

    const handleClickOutside = () => {
      setShowTooltip(false)
    }

    // Listen to mouseup and double-click events
    document.addEventListener("mouseup", handleSelection)
    document.addEventListener("dblclick", handleSelection)
    document.addEventListener("touchend", handleSelection)
    document.addEventListener("click", handleClickOutside)

    return () => {
      document.removeEventListener("mouseup", handleSelection)
      document.removeEventListener("dblclick", handleSelection)
      document.removeEventListener("touchend", handleSelection)
      document.removeEventListener("click", handleClickOutside)
      clearTimeout(hideTimeout)
    }
  }, [])

  return (
    <>
      {children}
      {showTooltip && (
        <div
          className="fixed z-[9999] px-3 py-2 text-sm font-medium text-pink-600 bg-white border border-pink-200 rounded-lg shadow-lg pointer-events-none animate-in fade-in duration-200"
          style={{
            top: `${tooltipPosition.top}px`,
            left: `${tooltipPosition.left}px`,
            transform: "translateX(-50%)",
          }}
        >
          <div className="flex items-center gap-1.5">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span>Gemini integration coming soon</span>
          </div>
          {/* Tooltip arrow */}
          <div
            className="absolute w-2 h-2 bg-white border-b border-r border-pink-200 transform rotate-45"
            style={{ bottom: "-5px", left: "50%", marginLeft: "-4px" }}
          />
        </div>
      )}
    </>
  )
}
