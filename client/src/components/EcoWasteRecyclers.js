"use client"

import { useState } from "react"
import { Leaf, MapPin, Star, ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function EcowasteRecyclers({ recyclersData }) {
  // Use dynamic recyclers data passed in via props
  const [sortBy, setSortBy] = useState("distance")
  const [searchQuery, setSearchQuery] = useState("")

  // Filter and sort based on user input
  const filteredRecyclers = recyclersData
    .filter(
      (recycler) =>
        recycler.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        recycler.address.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "distance") return parseFloat(a.distance) - parseFloat(b.distance)
      if (sortBy === "rating") return parseFloat(b.rating) - parseFloat(a.rating)
      return 0
    })

  return (
    <div className="min-h-screen bg-[#0f172a] text-white">
      {/* Header with leaf pattern background */}
      <div className="relative bg-gradient-to-r from-[#0f172a] to-[#1a2e44] py-8 px-4 md:px-8">
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <div className="h-full w-full"></div>
        </div>
        <div className="relative z-10 max-w-6xl mx-auto">
          <div className="flex items-center gap-3">
            <Leaf className="h-8 w-8 text-emerald-400" />
            <h1 className="text-3xl font-bold tracking-tight">Nearby Ecowaste Recyclers</h1>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-6xl mx-auto px-4 py-8 md:px-8">
        

        <div className="space-y-4">
          {filteredRecyclers.map((recycler) => (
            <div
              key={recycler.id}
              className="flex gap-4 p-4 rounded-lg bg-[#1a2e44]/50 border border-[#3b8264]/20 hover:border-[#3b8264]/40 transition-all group"
            >
              <div className="h-20 w-20 rounded-md overflow-hidden flex-shrink-0 bg-[#0f172a]/50">
                <img
                  src={recycler.thumbnail || recycler.image || "/placeholder.svg"}
                  alt={recycler.name}
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="flex-1 min-w-0">
                {/* The recycler name is now clickable */}
                <a
                  href={recycler.maps_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-lg font-semibold text-white group-hover:text-emerald-400 transition-colors line-clamp-1"
                >
                  {recycler.name}
                </a>
                <p className="text-gray-400 text-sm mt-1 line-clamp-2 md:line-clamp-3">{recycler.address}</p>
                <div className="flex items-center gap-4 mt-2">
                  <div className="flex items-center text-sm">
                    <Star
                      className={`h-4 w-4 mr-1 ${
                        recycler.rating > 0 ? "text-emerald-400 fill-emerald-400" : "text-gray-500"
                      }`}
                    />
                    <span className={recycler.rating > 0 ? "text-gray-300" : "text-gray-500"}>
                      {recycler.rating > 0 ? parseFloat(recycler.rating).toFixed(1) : "No ratings"}
                    </span>
                  </div>
                  <div className="flex items-center text-sm text-gray-400">
                    <MapPin className="h-4 w-4 mr-1 text-emerald-500" />
                    <span>{recycler.distance} km</span>
                  </div>
                </div>
              </div>

              <Button
                variant="ghost"
                size="icon"
                className="self-center text-gray-400 hover:text-emerald-400 hover:bg-[#3b8264]/10"
                onClick={() => window.open(recycler.maps_url, "_blank")}
              >
                <ArrowUpDown className="h-4 w-4" />
                <span className="sr-only">View details</span>
              </Button>
            </div>
          ))}
        </div>

        {filteredRecyclers.length === 0 && (
          <div className="text-center py-12">
            <Leaf className="h-12 w-12 mx-auto text-gray-500 mb-4" />
            <h3 className="text-xl font-medium text-gray-300">No recyclers found</h3>
            <p className="text-gray-400 mt-2">Try adjusting your search criteria</p>
          </div>
        )}

    
      </div>
    </div>
  )
}
