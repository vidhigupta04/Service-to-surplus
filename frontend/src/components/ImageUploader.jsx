import React, { useState } from 'react'
import { Upload, X } from 'lucide-react'

export default function ImageUploader({ onImageUpload }) {
  const [image, setImage] = useState(null)
  const [isDragging, setIsDragging] = useState(false)

  const handleFileSelect = (file) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const imageUrl = e.target.result
        setImage(imageUrl)
        onImageUpload(imageUrl)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    handleFileSelect(file)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleFileInput = (e) => {
    const file = e.target.files[0]
    handleFileSelect(file)
  }

  const removeImage = () => {
    setImage(null)
    onImageUpload('')
  }

  return (
    <div className="space-y-4">
      {!image ? (
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            isDragging 
              ? 'border-primary-400 bg-primary-50' 
              : 'border-gray-300 hover:border-primary-400'
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <Upload className="mx-auto h-12 w-12 text-gray-400" />
          <div className="mt-4">
            <label htmlFor="file-upload" className="cursor-pointer">
              <span className="text-primary-600 hover:text-primary-500 font-medium">
                Upload a file
              </span>
              <span className="text-gray-600"> or drag and drop</span>
            </label>
            <input
              id="file-upload"
              name="file-upload"
              type="file"
              className="sr-only"
              accept="image/*"
              onChange={handleFileInput}
            />
            <p className="text-xs text-gray-500 mt-2">
              PNG, JPG, GIF up to 10MB
            </p>
          </div>
        </div>
      ) : (
        <div className="relative inline-block">
          <img
            src={image}
            alt="Uploaded food"
            className="h-48 w-48 object-cover rounded-lg shadow-md"
          />
          <button
            type="button"
            onClick={removeImage}
            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  )
}