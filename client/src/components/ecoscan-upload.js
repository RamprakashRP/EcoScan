"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { Upload, X } from "lucide-react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import AnalysisResult from "./AnalysisResult"

export default function EcoScanUpload() {
  const [imageUrl, setImageUrl] = useState(null)
  const [analysis, setAnalysis] = useState(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const fileInputRef = useRef(null)

  // Simulate progress increasement by 10 every second until analysis is loaded (max 90)
  useEffect(() => {
    let interval
    if (imageUrl && !analysis) {
      interval = setInterval(() => {
        setProgress((prev) => (prev < 90 ? prev + 10 : prev))
      }, 1000)
    } else if (analysis) {
      setProgress(100)
    }
    return () => clearInterval(interval)
  }, [imageUrl, analysis])

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = async (e) => {
    e.preventDefault()
    setIsDragging(false)

    // 1) Check if user dragged a sample image
    const sampleUrl = e.dataTransfer.getData("sample-url")
    if (sampleUrl) {
      try {
        const response = await fetch(sampleUrl)
        const blob = await response.blob()
        const fileName = sampleUrl.split("/").pop() || "sample.jpg"
        const file = new File([blob], fileName, { type: blob.type })
        await handleFile(file)
        return
      } catch (err) {
        console.error("Error fetching sample image:", err)
      }
    }

    // 2) Otherwise, check for an actual file
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0]
      if (file.type.startsWith("image/")) {
        await handleFile(file)
      } else {
        alert("Please upload an image file")
      }
    }
  }

  const handleFileChange = async (e) => {
    if (e.target.files && e.target.files[0]) {
      await handleFile(e.target.files[0])
    }
  }

  const handleFile = async (file) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      if (e.target?.result) {
        setImageUrl(e.target.result)
      }
    }
    reader.readAsDataURL(file)
    await uploadToCloudinary(file)
  }

  const uploadToCloudinary = async (file) => {
    setIsUploading(true)
    const data = new FormData()
    data.append("file", file)
    data.append("upload_preset", "ecoscan")

    try {
      const res = await fetch("https://api.cloudinary.com/v1_1/deodt78ww/upload", {
        method: "POST",
        body: data,
      })
      const json = await res.json()
      if (json.secure_url) {
        await sendUrlToBackend(json.secure_url)
      }
    } catch (err) {
      console.error("Cloudinary upload error:", err)
    } finally {
      setIsUploading(false)
    }
  }

  const sendUrlToBackend = async (url) => {
    try {
      const res = await fetch("http://localhost:5000/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image_url: url }),
      })

      const data = await res.json()
      let rawResult = data.result

      // ✅ Clean markdown code block if exists (e.g., ```json\n{...}\n```)
      const cleaned = rawResult
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim()

      const parsed = JSON.parse(cleaned)
      setAnalysis(parsed)
    } catch (err) {
      console.error("Error sending image URL to backend:", err)
    }
  }

  const handleButtonClick = () => {
    fileInputRef.current?.click()
  }

  const resetState = () => {
    setImageUrl(null)
    setAnalysis(null)
    setProgress(0)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <div className="min-h-screen bg-[#121212] text-white flex flex-col items-center justify-center p-4 sm:p-6">
      <main className="w-full pt-20">
        {analysis ? (
          <AnalysisResult result={analysis} onRetry={resetState} />
        ) : !imageUrl ? (
          <>
            {/* Drag & Drop Area */}
            <div 
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border-2 max-w-md mx-auto border-dashed rounded-lg p-8 flex flex-col items-center justify-center h-64 transition-colors ${
                isDragging ? "border-[#8BC34A] bg-[#1E2A1E]" : "border-[#2E7D32] bg-[#1A1A1A]"
              }`}
            >
              <Upload className="h-12 w-12 text-[#4CAF50] mb-4" />
              <p className="text-center mb-4 text-gray-300">Drag and drop your device image here</p>
              <p className="text-center text-sm text-gray-400 mb-4">or</p>
              <Button onClick={handleButtonClick} className="bg-[#2E7D32] hover:bg-[#1B5E20] text-white">
                Upload Image
              </Button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
                aria-label="Upload image"
              />
              {isUploading && <p className="mt-4 text-sm text-gray-400">Uploading...</p>}
            </div>

            {/* Sample Images (hidden on mobile) */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="hidden md:flex flex-col items-center mt-8"
            >
              <p className="text-gray-300 mb-4">Try these sample images:</p>
              <div className="flex items-center gap-8">
                <motion.img
                  src="/sample1.jpeg"
                  alt="Sample 1"
                  draggable="true"
                  onDragStart={(e) => {
                    e.dataTransfer.setData("sample-url", "/sample1.jpeg")
                  }}
                  className="w-32 h-32 object-cover cursor-move rounded-md border border-gray-600"
                  whileHover={{ scale: 1.05 }}
                />
                <motion.img
                  src="/sample2.jpg"
                  alt="Sample 2"
                  draggable="true"
                  onDragStart={(e) => {
                    e.dataTransfer.setData("sample-url", "/sample2.jpg")
                  }}
                  className="w-32 h-32 object-cover cursor-move rounded-md border border-gray-600"
                  whileHover={{ scale: 1.05 }}
                />
                <motion.img
                  src="/sample3.jpg"
                  alt="Sample 3"
                  draggable="true"
                  onDragStart={(e) => {
                    e.dataTransfer.setData("sample-url", "/sample3.jpg")
                  }}
                  className="w-32 h-32 object-cover cursor-move rounded-md border border-gray-600"
                  whileHover={{ scale: 1.05 }}
                />
              </div>
            </motion.div>
          </>
        ) : (
          <>
            <Card className="bg-[#1A1A1A] border max-w-md mx-auto border-[#2E7D32]">
              <CardContent className="p-4">
                <div className="flex justify-between items-center mb-3">
                  <h2 className="text-lg font-medium text-[#8BC34A]">Image Preview</h2>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={resetState}
                    aria-label="Remove image"
                    className="h-8 w-8 rounded-full text-gray-400 hover:text-white hover:bg-[#2E2E2E]"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
                <div className="relative w-full h-64 rounded-md overflow-hidden">
                  <Image src={imageUrl || "/placeholder.svg"} alt="Uploaded device" fill className="object-contain" />
                </div>
                <p className="text-xs text-gray-400 mt-3">
                  Your device image has been uploaded successfully. EcoScan will analyze it shortly.
                </p>
              </CardContent>
            </Card>

            {/* Dynamic Progress Bar below the preview card */}
            {!analysis && (
              <div className="w-full max-w-md mx-auto mt-4">
                <div className="relative h-2 w-full bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="absolute h-2 bg-green-500 rounded-full"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-400 mt-1 text-center">{progress}%</p>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  )
}
