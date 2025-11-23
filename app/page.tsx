"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { HomeTab } from "@/components/home-tab"
import { LearnTab } from "@/components/learn-tab"
import { DiscoverTab } from "@/components/discover-tab"
import { ProfileTab } from "@/components/profile-tab" // Import ProfileTab

export default function Page() {
  const [activeTab, setActiveTab] = useState<"home" | "learn" | "discover" | "profile">("home") // Added profile tab
  const [profileHandle, setProfileHandle] = useState<string>("@yourusername") // Track which profile to show

  const handleNavigateToProfile = (handle: string) => {
    setProfileHandle(handle)
    setActiveTab("profile")
  }

  const handleTabChange = (tab: "home" | "learn" | "discover" | "profile") => {
    if (tab === "profile") {
      setProfileHandle("@yourusername")
    }
    setActiveTab(tab)
  }

  return (
    <div className="min-h-screen bg-white">
      <Header activeTab={activeTab} setActiveTab={handleTabChange} />
      <main className="container mx-auto px-4 py-6 max-w-6xl">
        {activeTab === "home" && <HomeTab onNavigateToProfile={handleNavigateToProfile} />}
        {activeTab === "learn" && <LearnTab />}
        {activeTab === "discover" && <DiscoverTab />}
        {activeTab === "profile" && (
          <ProfileTab profileHandle={profileHandle} onNavigateToProfile={handleNavigateToProfile} />
        )}
      </main>
    </div>
  )
}
