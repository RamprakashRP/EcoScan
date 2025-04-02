"use client"

import { useState } from "react"
import {
  Recycle,
  PenToolIcon as Tool,
  AlertTriangle,
  Info,
  Smartphone,
  Wrench,
  RefreshCw,
  Trash2,
  Brain,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import EcowasteRecyclers from "./EcoWasteRecyclers" // adjust path as needed

export default function AnalysisResult({ result, onRetry }) {
  if (!result)
    return <div className="text-white">No analysis available. Please upload an image first.</div>

  // Map backend result to a structure matching the design
  const deviceData = {
    name: result.device_info.name,
    type: result.device_info.type,
    scores: {
      repairability: Number(result.eco_score.repairability),
      recyclability: Number(result.eco_score.recyclability),
      toxicity: Number(result.eco_score.toxicity),
      resaleValue: Number(result.eco_score.resale_value),
    },
    environmentalImpact: result.eco_score.environmental_impact,
    composition: result.components, // assumed each object has { name, percentage }
    highlights: [],
    suggestions: {
      repair: `${result.recommendations.repair ? "Yes" : "No"} — ${result.recommendations.repair_notes}`,
      reuse: `${result.recommendations.reuse ? "Yes" : "No"} — ${result.recommendations.reuse_notes}`,
      recycle: `${result.recommendations.recycle ? "Yes" : "No"} — ${result.recommendations.recycle_notes}`,
    },
    toxicComponents: result.toxic_components.map((tox) => ({
      name: tox.name,
      level: tox.risk_level,
      location: tox.found_in,
    })),
    disposalGuidelines: [
      { title: "Battery", description: result.disposal_guidelines.battery },
      { title: "Plastic", description: result.disposal_guidelines.plastic },
      { title: "General", description: result.disposal_guidelines.general },
    ],
    summary: result.ai_summary,
  }

  // Generate highlights based on thresholds
  if (deviceData.scores.recyclability >= 80) {
    deviceData.highlights.push({
      icon: <Recycle className="h-5 w-5 text-green-400" />,
      text: "High Recyclability",
    })
  }
  if (deviceData.scores.repairability >= 70) {
    deviceData.highlights.push({
      icon: <Tool className="h-5 w-5 text-green-400" />,
      text: "Repair-Friendly",
    })
  }
  // Always include Smart Suggestions highlight
  deviceData.highlights.push({
    icon: <Info className="h-5 w-5 text-green-400" />,
    text: "Smart Suggestions",
  })

  const getScoreColor = (score) => {
    if (score >= 70) return "bg-green-500"
    if (score >= 50) return "bg-yellow-500"
    return "bg-red-500"
  }

  // State for nearby recyclers
  const [recyclers, setRecyclers] = useState([])
  const [showRecyclers, setShowRecyclers] = useState(false)
  const [loadingRecyclers, setLoadingRecyclers] = useState(false)

  const handleNearbyRecyclers = () => {
    // Toggle dropdown if already visible
    if (showRecyclers) {
      setShowRecyclers(false)
      return
    }
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser")
      return
    }
    setLoadingRecyclers(true)
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords
        // Call backend endpoint for nearby recyclers
        fetch("http://localhost:5000/api/nearby_recyclers", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ latitude, longitude }),
        })
          .then((res) => res.json())
          .then((data) => {
            setRecyclers(data.recyclers)
            setShowRecyclers(true)
          })
          .catch((err) => {
            console.error("Error fetching recyclers:", err)
            alert("Failed to fetch nearby recyclers.")
          })
          .finally(() => setLoadingRecyclers(false))
      },
      (error) => {
        console.error("Error getting geolocation:", error)
        alert("Unable to retrieve your location.")
        setLoadingRecyclers(false)
      }
    )
  }

  return (
    <main className="min-h-screen p-4 md:p-8 dark">
      <div className="max-w-5xl mx-auto">
        {/* Device Info Section */}
        <Card className="mb-6 border-none bg-slate-800 shadow-lg">
          <CardHeader className="bg-slate-800 border-b border-slate-700 pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-green-900/50 p-2 rounded-full">
                  <Smartphone className="h-6 w-6 text-green-400" />
                </div>
                <div>
                  <CardTitle className="text-xl font-bold text-white">{deviceData.name}</CardTitle>
                  <Badge variant="outline" className="bg-slate-700 text-slate-200 border-none mt-1">
                    {deviceData.type}
                  </Badge>
                </div>
              </div>
              <div className="flex gap-2">
                {deviceData.highlights.map((highlight, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="flex items-center gap-1 py-1.5 bg-green-900/50 text-green-300 border border-green-800"
                  >
                    {highlight.icon}
                    {highlight.text}
                  </Badge>
                ))}
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="mb-6">
              <h3 className="text-sm font-medium text-slate-400 mb-2">Environmental Impact</h3>
              <p className="text-slate-300">{deviceData.environmentalImpact}</p>
            </div>

            {/* Eco Scores */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-white mb-4">Eco Score</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-slate-300">Repairability</span>
                    <span className="text-sm font-medium text-slate-300">{deviceData.scores.repairability}%</span>
                  </div>
                  <Progress
                    value={deviceData.scores.repairability}
                    className="h-2"
                    indicatorClassName={getScoreColor(deviceData.scores.repairability)}
                  />
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-slate-300">Recyclability</span>
                    <span className="text-sm font-medium text-slate-300">{deviceData.scores.recyclability}%</span>
                  </div>
                  <Progress
                    value={deviceData.scores.recyclability}
                    className="h-2"
                    indicatorClassName={getScoreColor(deviceData.scores.recyclability)}
                  />
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-slate-300">Toxicity</span>
                    <span className="text-sm font-medium text-slate-300">{deviceData.scores.toxicity}%</span>
                  </div>
                  <Progress
                    value={deviceData.scores.toxicity}
                    className="h-2"
                    indicatorClassName={getScoreColor(deviceData.scores.toxicity)}
                  />
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-slate-300">Resale Value</span>
                    <span className="text-sm font-medium text-slate-300">{deviceData.scores.resaleValue}%</span>
                  </div>
                  <Progress
                    value={deviceData.scores.resaleValue}
                    className="h-2"
                    indicatorClassName={getScoreColor(deviceData.scores.resaleValue)}
                  />
                </div>
              </div>
            </div>

            {/* Composition */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-white mb-4">Composition</h3>
              <div className="space-y-3">
                {deviceData.composition.map((item, index) => (
                  <div key={index} className="flex items-center">
                    <div className="w-1/3 text-sm text-slate-300">{item.name}</div>
                    <div className="w-2/3 flex items-center gap-2">
                      <div className="flex-1 bg-slate-700 rounded-full h-2.5">
                        <div className="bg-green-500 h-2.5 rounded-full" style={{ width: `${item.percentage}%` }}></div>
                      </div>
                      <span className="text-xs text-slate-400 w-8">{item.percentage}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Smart Suggestions */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-white mb-4">Smart Suggestions</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-slate-700/50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Wrench className="h-5 w-5 text-green-400" />
                    <h4 className="text-sm font-medium text-white">Repair</h4>
                  </div>
                  <p className="text-sm text-slate-300">{deviceData.suggestions.repair}</p>
                </div>
                <div className="bg-slate-700/50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <RefreshCw className="h-5 w-5 text-green-400" />
                    <h4 className="text-sm font-medium text-white">Reuse</h4>
                  </div>
                  <p className="text-sm text-slate-300">{deviceData.suggestions.reuse}</p>
                </div>
                <div className="bg-slate-700/50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Recycle className="h-5 w-5 text-green-400" />
                    <h4 className="text-sm font-medium text-white">Recycle</h4>
                  </div>
                  <p className="text-sm text-slate-300">{deviceData.suggestions.recycle}</p>
                </div>
              </div>
            </div>

            {/* Toxic Components */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle className="h-5 w-5 text-amber-400" />
                <h3 className="text-lg font-semibold text-white">Toxic Components</h3>
              </div>
              <div className="space-y-4">
                {deviceData.toxicComponents.map((component, index) => (
                  <div key={index} className="border-l-4 border-amber-500 pl-3 py-1 bg-slate-700/30 rounded-r-lg">
                    <h4 className="text-sm font-medium text-white">{component.name}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs font-medium bg-amber-900/50 text-amber-300 px-2 py-0.5 rounded-full border border-amber-800/50">
                        {component.level}
                      </span>
                      <span className="text-xs text-slate-400">{component.location}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Disposal Guidelines */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <Trash2 className="h-5 w-5 text-red-400" />
                <h3 className="text-lg font-semibold text-white">Disposal Guidelines</h3>
              </div>
              <Accordion type="single" collapsible className="w-full">
                {deviceData.disposalGuidelines.map((guideline, index) => (
                  <AccordionItem key={index} value={`item-${index}`} className="border-slate-700">
                    <AccordionTrigger className="text-sm font-medium text-slate-200 hover:text-white">
                      {guideline.title}
                    </AccordionTrigger>
                    <AccordionContent className="text-sm text-slate-300">
                      {guideline.description}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>

            {/* AI Summary */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <Brain className="h-5 w-5 text-purple-400" />
                <h3 className="text-lg font-semibold text-white">AI Summary</h3>
              </div>
              <div className="bg-slate-700/30 p-4 rounded-lg border border-slate-700">
                <p className="text-slate-300 leading-relaxed">{deviceData.summary}</p>
              </div>
            </div>

            {/* Nearby Recyclers Button & Dropdown */}
            <div className="mb-8">
              <Button
                onClick={handleNearbyRecyclers}
                className="bg-gradient-to-r from-green-600 to-green-400 hover:from-green-700 hover:to-green-500 text-white py-2 px-6 rounded-lg shadow-lg"
              >
                Nearby Recyclers
              </Button>
              {showRecyclers && (
                <div className="mt-4">
                  {loadingRecyclers ? (
                    <p className="text-slate-400">Loading...</p>
                  ) : (
                    <EcowasteRecyclers recyclersData={recyclers} />
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Try Another Button */}
        <div className="mt-8 text-center">
          <Button
            onClick={onRetry}
            className="bg-gradient-to-r from-gray-700 to-gray-500 hover:from-gray-800 hover:to-gray-600 text-white py-2 px-6 rounded-lg shadow-lg"
          >
            Try Another
          </Button>
        </div>
      </div>
    </main>
  )
}
