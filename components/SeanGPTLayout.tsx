'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useChat } from 'ai/react'
import PersonalInfoModal from './PersonalInfoModal'
import ChatInterface from './ChatInterface'
import { ArrowRight } from 'lucide-react'

export default function SeanGPTLayout() {
  const [personalInfo, setPersonalInfo] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isChatStarted, setIsChatStarted] = useState(false)
  const { messages, input, handleInputChange, handleSubmit: handleChatSubmit } = useChat({
    api: '/api/chat',
    body: {
      personalInfo,
    },
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
              className="text-lg md:text-2xl font-semibold mb-8 text-gray-700 text-center"
            >
              TL;DR I put 10+ years of fitness knowledge into an LLM for you to chat with 🤩 Interested in creating your own GPT for your niche expertise? <a href="mailto:seancorcoran45@gmail.com" className="text-blue-600 hover:underline">Hit me up</a> :)
            </motion.h2>

            <p className="leading-relaxed text-center">
                *<i>This is in development & I've barely put any of my knowledge into it so it's quite literally a ChatGPT wrapper atm.</i>*
              </p>

            <div className="space-y-6 text-gray-600 mb-8">
              <p className="leading-relaxed">
                This is an experiential project built by <a href="https://www.seancorc.com/" target="_blank" className="text-blue-600 hover:underline">Sean</a>, 
                with the goal of helping people learn from others' expertise and share their expertise. 
                I've invested hours (this is a lie I haven't done this yet) giving this LLM 10+ years worth of knowledge in endurance training, lifting, & nutrition. 
                If you'd like your own GPT for your special expertise, please reach out <a href="mailto:seancorcoran45@gmail.com" className="text-blue-600 hover:underline">here</a>. Everyone's an expert in something! Share it with the world :)
              </p>
            </div>

            <div className="mb-8">
              <h3 className="text-sm font-semibold mb-2 text-gray-500">
                Tailor SeanGPT's guidance by sharing a bit about yourself
              </h3>
              <textarea
                className="w-full h-32 p-4 bg-white text-gray-900 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 ease-in-out"
                placeholder="My current state is… My desired state is… My problem is…"
                value={personalInfo}
                onChange={(e) => setPersonalInfo(e.target.value)}
              />
            </div>

            <div className="mb-8">
              <h3 className="text-sm font-semibold mb-2 text-gray-500">
                Or jump right in with your fitness questions
              </h3>
              <form onSubmit={handleSubmit} className="flex items-center gap-2">
                <input
                  type="text"
                  className="flex-1 p-4 bg-white text-gray-900 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 ease-in-out"
                  placeholder="Your fitness question"
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
            <motion.h2 
              className="text-lg md:text-2xl font-semibold mb-8 text-gray-700 text-center"
            >
              Some Fair Questions:
            </motion.h2>
              <p className="leading-relaxed">
                <i>How is this any different than ChatGPT?</i> Imagine the person that if you had as a personal mentor, could be pivotal to your advancement in some way (health, career, etc.). 
                This could be a coach, celeberity, whoever. The odds you are able to get that person as a mentor are pretty low - but if this person had their own GPT that they dumped all their niche, 
                special expertise into & that GPT was a genuinely good proxy for that person (at least in certain domains) - that’d be a whole lot better than nothing at least right? Idk, we’ll see lol but that’s my thesis
              </p>
              <p className="leading-relaxed">
                <i>Why value any of my knowledge on fitness?</i> I've run 10+ marathons with a fastest avg. pace of 6:54, completed Ironman Arizona (140.6 miles), 
                finished a 50 mile ultramarathon, my fastest 5k is 17:35 (5:35 min/mile), and I bench over 315 lbs. My annual bloodwork shows good overall health as well. 
                 If you don't think my expertise will help you, nudge whoever does have the knowledge you need to reach out 
                 to me & I can make them their own GPT! (email: <a href="mailto:seancorcoran45@gmail.com" className="text-blue-600 hover:underline">seancorcoran45@gmail.com</a>)
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {isChatStarted && (
        <ChatInterface 
          messages={messages}
          input={input}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
          setIsModalOpen={setIsModalOpen}
        />
      )}

      <PersonalInfoModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        personalInfo={personalInfo}
        onSave={setPersonalInfo}
      />
    </div>
  )
}

