"use client"

import { useState, useRef } from "react"
import Image from "next/image"
import { Upload, X, Leaf } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function EcoScanUpload() {
  const [image, setImage] = useState(null)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef(null)

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0]
      if (file.type.startsWith("image/")) {
        handleFile(file)
      } else {
        alert("Please upload an image file")
      }
    }
  }

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0])
    }
  }

  const handleFile = (file) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      if (e.target?.result) {
        setImage(e.target.result)
      }
    }
    reader.readAsDataURL(file)
  }

  const handleButtonClick = () => {
    fileInputRef.current?.click()
  }

  const removeImage = () => {
    setImage(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <div className="min-h-screen bg-[#121212] text-white flex flex-col items-center justify-center p-4 sm:p-6">
      <header className="w-full max-w-md flex items-center justify-center mb-8">
        <div className="flex items-center gap-2">
          <Leaf className="h-6 w-6 text-[#4CAF50]" />
          <h1 className="text-2xl font-bold text-[#4CAF50]">EcoScan</h1>
        </div>
        <p className="text-sm text-[#8BC34A] ml-2">Empowering Sustainable E-Waste Solutions</p>
      </header>

      <main className="w-full max-w-md">
        {!image ? (
          <div
            className={`border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center h-64 transition-colors ${
              isDragging ? "border-[#8BC34A] bg-[#1E2A1E]" : "border-[#2E7D32] bg-[#1A1A1A]"
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
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
          </div>
        ) : (
          <Card className="bg-[#1A1A1A] border border-[#2E7D32]">
            <CardContent className="p-4">
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-lg font-medium text-[#8BC34A]">Image Preview</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={removeImage}
                  aria-label="Remove image"
                  className="h-8 w-8 rounded-full text-gray-400 hover:text-white hover:bg-[#2E2E2E]"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <div className="relative w-full h-64 rounded-md overflow-hidden">
                <Image src={image || "/placeholder.svg"} alt="Uploaded device" fill className="object-contain" />
              </div>
              <p className="text-xs text-gray-400 mt-3">
                Your device image has been uploaded successfully. The EcoScan system will analyze it shortly.
              </p>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}
