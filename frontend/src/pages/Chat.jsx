import React, { useState, useRef, useEffect } from 'react'
import { Send, User, Clock } from 'lucide-react'

export default function Chat() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm interested in your food donation. When can we collect it?",
      sender: 'ngo',
      timestamp: new Date(Date.now() - 3600000)
    },
    {
      id: 2,
      text: "Hi! The food is available for pickup anytime today between 2 PM to 6 PM.",
      sender: 'donor',
      timestamp: new Date(Date.now() - 3500000)
    },
    {
      id: 3,
      text: "Great! We'll send someone at 3 PM. Could you share the exact address?",
      sender: 'ngo',
      timestamp: new Date(Date.now() - 3400000)
    }
  ])
  const [newMessage, setNewMessage] = useState('')
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = (e) => {
    e.preventDefault()
    if (!newMessage.trim()) return

    const message = {
      id: messages.length + 1,
      text: newMessage,
      sender: 'ngo', // In real app, this would be current user's role
      timestamp: new Date()
    }

    setMessages([...messages, message])
    setNewMessage('')
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="bg-white shadow-lg rounded-lg h-[600px] flex flex-col">
        {/* Chat Header */}
        <div className="border-b border-gray-200 px-6 py-4">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
              <User className="h-6 w-6 text-primary-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">Community Kitchen NGO</h3>
              <p className="text-sm text-gray-500">Online - Usually replies within 1 hour</p>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'ngo' ? 'justify-start' : 'justify-end'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  message.sender === 'ngo'
                    ? 'bg-gray-100 text-gray-900'
                    : 'bg-primary-600 text-white'
                }`}
              >
                <p>{message.text}</p>
                <div className={`text-xs mt-1 ${
                  message.sender === 'ngo' ? 'text-gray-500' : 'text-primary-200'
                }`}>
                  <Clock className="inline h-3 w-3 mr-1" />
                  {message.timestamp.toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <div className="border-t border-gray-200 px-6 py-4">
          <form onSubmit={handleSend} className="flex space-x-4">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
            <button
              type="submit"
              className="bg-primary-600 text-white rounded-lg px-4 py-2 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 flex items-center"
            >
              <Send className="h-4 w-4 mr-2" />
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}