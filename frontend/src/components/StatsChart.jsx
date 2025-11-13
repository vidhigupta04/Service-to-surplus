import React from 'react'

export default function StatsChart({ data, type = 'bar' }) {
  // Simple bar chart component
  // In a real app, you might use a charting library like Chart.js or Recharts
  
  const maxValue = Math.max(...data.map(item => item.value))
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h3 className="text-lg font-semibold mb-4">Donation Statistics</h3>
      <div className="space-y-3">
        {data.map((item, index) => (
          <div key={index} className="flex items-center">
            <div className="w-32 text-sm text-gray-600">{item.label}</div>
            <div className="flex-1 ml-4">
              <div className="flex justify-between text-sm mb-1">
                <span>{item.value}</span>
                <span className="text-gray-500">
                  {Math.round((item.value / maxValue) * 100)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(item.value / maxValue) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}