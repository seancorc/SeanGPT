'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useChat } from 'ai/react'
import ChatInterface from './ChatInterface'
import { ArrowRight } from 'lucide-react'

export default function SeanGPTLayout() {
  const [isChatStarted, setIsChatStarted] = useState(false)
  const { messages, input, handleInputChange, handleSubmit: handleChatSubmit } = useChat({
    api: '/api/chat',
    maxSteps: 3,
  })

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (input.trim()) {
      setIsChatStarted(true)
      handleChatSubmit(e)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="fixed top-0 inset-x-0 bg-white z-10">
        <div className="max-w-3xl mx-auto px-4">
          <motion.h1 
            className="text-5xl font-bold text-center bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 bg-clip-text text-transparent py-4"
            animate={isChatStarted ? { scale: 0.8 } : {}}
          >
            SeanGPT
          </motion.h1>

          <AnimatePresence>
            {isChatStarted && (
              <div>
                <motion.p 
                  className="text-center text-sm text-gray-600"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  Note: No data is being saved; this conversation will be lost when you leave this page
                </motion.p>
                <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                exit={{ scaleX: 0 }}
                className="h-px bg-gray-200"
                />
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence>
        {!isChatStarted && (
          <motion.div
            exit={{ opacity: 0, y: -20 }}
            className="max-w-3xl mx-auto px-4 pt-24"
          >
            <motion.h2 
              className="text-lg md:text-2xl font-semibold mb-4 text-gray-700 text-center"
            >
              Sean but ~AI~
            </motion.h2>
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg mb-6">
                <div className="flex flex-col items-center text-center">
                  <div className="min-w-0">
                    <p className="text-sm text-amber-800 font-medium">
                      ⚠️ Notice
                    </p>
                    <p className="mt-1 text-sm text-amber-700">
                      This is no longer being maintained and probably does not work anymore because the database provider retires the db after a period of low activity.
                    </p>
                  </div>
                </div>
              </div>

            <div className="space-y-6 text-gray-600 mb-8">
              <p className="text-center">
                Click <a href="https://www.seancorc.com/" target="_blank" className="text-blue-600 hover:underline">here</a> for more info on what Sean is.
                <br />
                You probably already know what AI is.
              </p>
            </div>

            <div className="mb-8">
              <form onSubmit={handleSubmit} className="flex items-center gap-2">
                <input
                  type="text"
                  className="flex-1 p-4 bg-white text-gray-900 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 ease-in-out"
                  placeholder="Ask SeanGPT a question"
                  value={input}
                  onChange={handleInputChange}
                />
                <button
                  type="submit"
                  className="p-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ease-in-out"
                >
                  <ArrowRight className="w-5 h-5" />
                </button>
              </form>
            </div>

            <div className="space-y-6 text-gray-600 mb-12">
              <p className="leading-relaxed">
                <i>Why?</i> To learn & because I'm curious to see how good of a proxy for me I can make this GPT (lowkey bars 🙂‍↕️). Maybe it'd be valuable for elite coaches & people that can demand a premium on their time too but that is yet to be seen.
              </p>

              <p className="leading-relaxed">
                <i>How is this any different than ChatGPT?</i> In short, SeanGPT has a bunch of data & training on me that ChatGPT doesn't. I've given SeanGPT access to a bunch of my own writing & a set of hand selected articles/content that reflect my thinking. I'm currently training it to
                talk like me. We'll see how far I can take it lol
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {isChatStarted && (
        <ChatInterface 
          messages={messages}
          input={input}
          loading={messages.length > 0 && !messages[messages.length - 1].content}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
        />
      )}
    </div>
  )
}

