import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface PersonalInfoModalProps {
  isOpen: boolean
  onClose: () => void
  personalInfo: string
  onSave: (info: string) => void
}

export default function PersonalInfoModal({ isOpen, onClose, personalInfo, onSave }: PersonalInfoModalProps) {
  const [editedInfo, setEditedInfo] = useState(personalInfo)
  const [hasChanges, setHasChanges] = useState(false)

  useEffect(() => {
    setEditedInfo(personalInfo)
    setHasChanges(false)
  }, [personalInfo, isOpen])

  const handleSave = () => {
    onSave(editedInfo)
    onClose()
  }

  const handleCancel = () => {
    if (hasChanges) {
      if (confirm('Are you sure you want to discard changes?')) {
        onClose()
      }
    } else {
      onClose()
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
        >
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            className="bg-white rounded-lg p-6 w-full max-w-md"
          >
            <h2 className="text-2xl font-bold mb-4">Edit Personal Info</h2>
            <textarea
              className="w-full h-40 p-2 border border-gray-300 rounded-md mb-4"
              value={editedInfo}
              onChange={(e) => {
                setEditedInfo(e.target.value)
                setHasChanges(e.target.value !== personalInfo)
              }}
            />
            <div className="flex justify-end space-x-2">
              <button
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors duration-200"
                onClick={handleCancel}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-200"
                onClick={handleSave}
              >
                Save Changes
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

