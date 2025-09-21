'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { useToast } from '@/hooks/use-toast'
import { Camera, Upload, X, Check, Loader2 } from 'lucide-react'
import { useDropzone } from 'react-dropzone'
import { validateImageFile, formatFileSize } from '@/lib/utils'

interface Event {
  id: string
  title: string
  description: string | null
  date: string
  location: string | null
  isActive: boolean
}

interface UploadFile {
  file: File
  id: string
  preview: string
  progress: number
  status: 'pending' | 'uploading' | 'success' | 'error'
  error?: string
}

export default function GuestUploadPage() {
  const params = useParams()
  const { toast } = useToast()
  const [event, setEvent] = useState<Event | null>(null)
  const [guestName, setGuestName] = useState('')
  const [files, setFiles] = useState<UploadFile[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isUploading, setIsUploading] = useState(false)

  useEffect(() => {
    if (params.id) {
      fetchEvent()
    }
  }, [params.id])

  const fetchEvent = async () => {
    try {
      const response = await fetch(`/api/events/${params.id}/public`)
      if (response.ok) {
        const data = await response.json()
        setEvent(data.event)
      } else {
        toast({
          title: 'Error',
          description: 'Event not found or inactive',
          variant: 'destructive',
        })
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load event',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles: UploadFile[] = acceptedFiles.map(file => {
      const validation = validateImageFile(file)
      return {
        file,
        id: Math.random().toString(36).substr(2, 9),
        preview: URL.createObjectURL(file),
        progress: 0,
        status: validation.valid ? 'pending' : 'error',
        error: validation.error
      }
    })

    setFiles(prev => [...prev, ...newFiles])
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    maxSize: 10 * 1024 * 1024, // 10MB
    multiple: true
  })

  const removeFile = (id: string) => {
    setFiles(prev => {
      const file = prev.find(f => f.id === id)
      if (file) {
        URL.revokeObjectURL(file.preview)
      }
      return prev.filter(f => f.id !== id)
    })
  }

  const uploadFiles = async () => {
    if (!guestName.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter your name',
        variant: 'destructive',
      })
      return
    }

    const validFiles = files.filter(f => f.status === 'pending')
    if (validFiles.length === 0) {
      toast({
        title: 'Error',
        description: 'Please select at least one valid photo',
        variant: 'destructive',
      })
      return
    }

    setIsUploading(true)

    try {
      for (const uploadFile of validFiles) {
        // Update status to uploading
        setFiles(prev => prev.map(f => 
          f.id === uploadFile.id ? { ...f, status: 'uploading' as const } : f
        ))

        const formData = new FormData()
        formData.append('file', uploadFile.file)
        formData.append('guestName', guestName)
        formData.append('eventId', params.id as string)

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        })

        if (response.ok) {
          setFiles(prev => prev.map(f => 
            f.id === uploadFile.id ? { ...f, status: 'success' as const, progress: 100 } : f
          ))
        } else {
          const error = await response.text()
          setFiles(prev => prev.map(f => 
            f.id === uploadFile.id ? { 
              ...f, 
              status: 'error' as const, 
              error: error || 'Upload failed' 
            } : f
          ))
        }
      }

      const successCount = files.filter(f => f.status === 'success').length
      if (successCount > 0) {
        toast({
          title: 'Success!',
          description: `${successCount} photo(s) uploaded successfully`,
        })
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Upload failed. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsUploading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <Card className="w-full max-w-md text-center">
          <CardContent className="pt-6">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-red-100 rounded-full">
                <X className="h-8 w-8 text-red-600" />
              </div>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Event Not Found
            </h2>
            <p className="text-gray-600">
              This event doesn't exist or is no longer active.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-primary rounded-full">
              <Camera className="h-8 w-8 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {event.title}
          </h1>
          {event.description && (
            <p className="text-gray-600 mb-4">{event.description}</p>
          )}
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Upload Your Photos</CardTitle>
            <CardDescription>
              Share your memories from this special event
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Guest Name Input */}
            <div className="space-y-2">
              <Label htmlFor="guestName">Your Name *</Label>
              <Input
                id="guestName"
                type="text"
                placeholder="Enter your name"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                disabled={isUploading}
              />
            </div>

            {/* File Upload Area */}
            <div className="space-y-4">
              <Label>Select Photos *</Label>
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                  isDragActive
                    ? 'border-primary bg-primary/5'
                    : 'border-gray-300 hover:border-primary/50'
                } ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <input {...getInputProps()} disabled={isUploading} />
                <div className="flex flex-col items-center">
                  <Upload className="h-12 w-12 text-gray-400 mb-4" />
                  {isDragActive ? (
                    <p className="text-lg text-primary">Drop the files here...</p>
                  ) : (
                    <div>
                      <p className="text-lg text-gray-600 mb-2">
                        Drag & drop photos here, or click to select
                      </p>
                      <p className="text-sm text-gray-500">
                        Supports JPEG, PNG, WebP (max 10MB each)
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* File List */}
            {files.length > 0 && (
              <div className="space-y-3">
                <Label>Selected Photos ({files.length})</Label>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {files.map((file) => (
                    <div
                      key={file.id}
                      className="flex items-center space-x-3 p-3 border rounded-lg"
                    >
                      <img
                        src={file.preview}
                        alt="Preview"
                        className="w-12 h-12 object-cover rounded"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {file.file.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatFileSize(file.file.size)}
                        </p>
                        {file.status === 'uploading' && (
                          <Progress value={file.progress} className="mt-1" />
                        )}
                        {file.status === 'error' && (
                          <p className="text-xs text-red-600">{file.error}</p>
                        )}
                        {file.status === 'success' && (
                          <div className="flex items-center text-xs text-green-600">
                            <Check className="h-3 w-3 mr-1" />
                            Uploaded successfully
                          </div>
                        )}
                      </div>
                      {file.status !== 'uploading' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFile(file.id)}
                          disabled={isUploading}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Upload Button */}
            <Button
              onClick={uploadFiles}
              disabled={isUploading || files.length === 0 || !guestName.trim()}
              className="w-full"
              size="lg"
            >
              {isUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Photos
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-sm text-gray-600">
              <p className="mb-2">
                <strong>How it works:</strong>
              </p>
              <p>
                Enter your name, select your photos, and click upload. 
                Your photos will be added to the event gallery for everyone to enjoy!
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}





