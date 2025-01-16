import { useState, useEffect } from 'react'
import { ArrowRight, Copy, Check } from 'lucide-react'
import { Message } from 'ai'
import { motion } from 'framer-motion'

interface ChatInterfaceProps {
  messages: Message[]
  input: string
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void
  setIsModalOpen: (isOpen: boolean) => void
}

export default function ChatInterface({ messages, input, handleInputChange, handleSubmit, setIsModalOpen }: ChatInterfaceProps) {
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null)

  useEffect(() => {
    if (copiedMessageId) {
      const timer = setTimeout(() => setCopiedMessageId(null), 2000)
      return () => clearTimeout(timer)
    }
  }, [copiedMessageId])

  const copyToClipboard = (text: string, messageId: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedMessageId(messageId)
    })
  }

  // Hardcoded response
  const hardcodedResponse: Message = {
    id: 'hardcoded-response',
    role: 'assistant',
    content: "Great question! As an AI fitness assistant, I'd be happy to help. Based on your goal of improving overall fitness, I recommend a balanced approach that includes both cardiovascular exercise and strength training. Here's a simple weekly plan to get you started:\n\n1. Cardio: Aim for 150 minutes of moderate-intensity cardio per week. This could be 30 minutes, 5 days a week of activities like brisk walking, cycling, or swimming.\n\n2. Strength Training: Include 2-3 strength training sessions per week, focusing on major muscle groups. Start with bodyweight exercises like push-ups, squats, and lunges, then progress to using weights as you get stronger.\n\n3. Flexibility: Don't forget to stretch! Include 5-10 minutes of stretching after each workout to improve flexibility and reduce the risk of injury.\n\n4. Rest: Allow for 1-2 rest days per week to give your body time to recover and prevent burnout.\n\nRemember to start slowly and gradually increase the intensity and duration of your workouts. It's also crucial to maintain a balanced diet to support your fitness goals. If you have any specific health concerns or conditions, please consult with a healthcare professional before starting a new exercise regimen.\n\nDo you have any questions about this plan or would you like more details on any specific aspect?"
  }

  // Add hardcoded response to messages
  const allMessages = [...messages, hardcodedResponse]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 pt-28"
    >
      <div className="h-full flex flex-col max-w-3xl mx-auto">
        <div className="flex-1 overflow-y-auto px-4">
          <div className="space-y-4 pb-4">
            {allMessages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                } w-full`}
              >
                <div className="relative group">
                  <div
                    className={`p-4 rounded-lg inline-block ${
                      message.role === 'user' 
                        ? 'bg-blue-100' 
                        : 'bg-gray-100'
                    }`}
                  >
                    <p className="text-gray-900">{message.content}</p>
                  </div>
                  <button
                    onClick={() => copyToClipboard(message.content, message.id)}
                    className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 p-2 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    aria-label="Copy message"
                  >
                    {copiedMessageId === message.id ? (
                      <Check className="w-5 h-5 text-green-500" />
                    ) : (
                      <Copy className="w-5 h-5 text-gray-500 group-hover:text-gray-700" />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="border-t bg-white p-4">
          <div className="max-w-3xl mx-auto flex items-center gap-2">
            <motion.button
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="p-2 bg-gray-100 rounded-full text-gray-600 hover:bg-gray-200 transition-colors duration-200"
              onClick={() => setIsModalOpen(true)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-5 h-5"
              >
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </motion.button>
            
            <form onSubmit={handleSubmit} className="flex-1 flex items-center gap-2">
              <input
                type="text"
                className="flex-1 p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={input}
                onChange={handleInputChange}
                placeholder="Type your message..."
              />
              <button
                type="submit"
                className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <ArrowRight className="w-5 h-5" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

