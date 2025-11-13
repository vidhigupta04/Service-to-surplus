import React from 'react'

export default function QRDisplay({ data, title }) {
  // In a real app, you would generate QR code using a library like qrcode.react
  // For now, we'll use a placeholder
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(data)}`

  return (
    <div className="text-center">
      <div className="bg-white p-4 rounded-lg inline-block">
        <img
          src={qrCodeUrl}
          alt={`QR Code for ${title}`}
          className="w-48 h-48 mx-auto"
        />
      </div>
      <p className="mt-4 text-sm text-gray-600">
        Scan this QR code to verify collection
      </p>
    </div>
  )
}