import { useState, useEffect } from 'react'
import { ArrowRight, Copy, Check } from 'lucide-react'
import { Message } from 'ai'
import { motion } from 'framer-motion'
import ReactMarkdown from 'react-markdown'

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

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 pt-28"
    >
      <div className="h-full flex flex-col max-w-3xl mx-auto">
        <div className="flex-1 overflow-y-auto px-4">
          <div className="space-y-4 pb-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                } w-full`}
              >
                <div className="relative group max-w-2xl ">
                  <div
                    className={`p-4 rounded-lg inline-block ${
                      message.role === 'user' 
                        ? 'bg-blue-100' 
                        : 'bg-gray-100'
                    }`}
                  >
                    <div className="prose prose-sm max-w-none text-gray-900">
                      {message.role == 'user' ? message.content : <ReactMarkdown>{message.content}</ReactMarkdown>}
                    </div>
                    {message?.toolInvocations?.[0] && (
                      <span className="italic font-light">
                        {'calling tool: ' + message?.toolInvocations?.[0].toolName}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => copyToClipboard(message.content, message.id)}
                    className={`absolute -bottom-8 transform p-2 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 z-10 ${
                      message.role === 'user' ? 'right-1 translate-x-1/2' : 'left-1 -translate-x-1/2'
                    }`}
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

