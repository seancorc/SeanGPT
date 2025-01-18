'use client'

import { useState } from 'react'
import { Upload } from 'lucide-react'
import { insertContentSchema } from '@/lib/db/schema/content'

interface UploadedFile {
  name: string
  size: number
}

export default function ContentUpload() {
  const [content, setContent] = useState('')
  const [files, setFiles] = useState<UploadedFile[]>([])
  const [isUploading, setIsUploading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsUploading(true)

    try {
      // Validate the content
      const validatedData = insertContentSchema.parse({ text_data: content });

      // Send API request
      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(validatedData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Upload successful:', result);
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setIsUploading(false);
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return

    const newFiles = Array.from(e.target.files).map(file => ({
      name: file.name,
      size: file.size
    }))
    setFiles(prev => [...prev, ...newFiles])
  }

  const removeFile = (fileName: string) => {
    setFiles(files.filter(file => file.name !== fileName))
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Upload Content</h1>
        <p className="mt-2 text-sm text-gray-600">
          Add your fitness content through text or file uploads
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label 
            htmlFor="content" 
            className="block text-sm font-medium text-gray-700"
          >
            Text Content
          </label>
          <textarea
            id="content"
            rows={6}
            className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-4 focus:border-blue-500 focus:ring-blue-500"
            placeholder="Enter your fitness content, guidelines, or expertise..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>

        <div>
          <label 
            htmlFor="file-upload" 
            className="block text-sm font-medium text-gray-700"
          >
            File Upload
          </label>
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
            <div className="space-y-2 text-center">
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <div className="flex text-sm text-gray-600">
                <label
                  htmlFor="file-upload"
                  className="relative cursor-pointer rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                >
                  <span>Upload files</span>
                  <input
                    id="file-upload"
                    type="file"
                    className="sr-only"
                    multiple
                    onChange={handleFileChange}
                  />
                </label>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs text-gray-500">
                PDF, DOC, TXT up to 10MB each
              </p>
            </div>
          </div>
        </div>

        {files.length > 0 && (
          <div className="mt-4">
            <h4 className="text-sm font-medium text-gray-700">Selected Files:</h4>
            <ul className="mt-2 divide-y divide-gray-200">
              {files.map((file) => (
                <li 
                  key={file.name}
                  className="py-2 flex justify-between items-center"
                >
                  <div className="flex items-center">
                    <span className="text-sm text-gray-900">{file.name}</span>
                    <span className="ml-2 text-xs text-gray-500">
                      ({(file.size / 1024 / 1024).toFixed(2)} MB)
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFile(file.name)}
                    className="text-sm text-red-600 hover:text-red-800"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isUploading}
            className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isUploading ? 'Uploading...' : 'Upload Content'}
          </button>
        </div>
      </form>
    </div>
  )
}
  