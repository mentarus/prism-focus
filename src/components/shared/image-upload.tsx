'use client'

import { useState, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Upload, X } from 'lucide-react'

interface ImageUploadProps {
  currentImageUrl?: string
  onImageUploaded: (url: string) => void
  fallbackText?: string
  type?: 'avatar' | 'logo'
}

export function ImageUpload({
  currentImageUrl,
  onImageUploaded,
  fallbackText = 'U',
  type = 'avatar'
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentImageUrl || null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const supabase = createClient()

  const uploadImage = async (file: File) => {
    try {
      setUploading(true)

      // Get current user
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      // Create file path
      const fileExt = file.name.split('.').pop()
      const fileName = `${user.id}/${type}-${Date.now()}.${fileExt}`

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false,
        })

      if (uploadError) throw uploadError

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from('avatars').getPublicUrl(fileName)

      setPreviewUrl(publicUrl)
      onImageUploaded(publicUrl)
    } catch (error: any) {
      console.error('Error uploading image:', error)
      alert('Error uploading image: ' + error.message)
    } finally {
      setUploading(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file')
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image must be less than 5MB')
      return
    }

    uploadImage(file)
  }

  const handleRemove = () => {
    setPreviewUrl(null)
    onImageUploaded('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="flex items-center gap-4">
      {type === 'avatar' ? (
        <Avatar className="h-24 w-24">
          <AvatarImage src={previewUrl || ''} />
          <AvatarFallback className="text-2xl">{fallbackText}</AvatarFallback>
        </Avatar>
      ) : (
        <div className="flex h-24 w-24 items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50">
          {previewUrl ? (
            <img src={previewUrl} alt="Logo" className="h-full w-full rounded-lg object-cover" />
          ) : (
            <span className="text-3xl font-bold text-gray-400">{fallbackText}</span>
          )}
        </div>
      )}

      <div className="flex flex-col gap-2">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
        >
          <Upload className="mr-2 h-4 w-4" />
          {uploading ? 'Uploading...' : previewUrl ? 'Change' : 'Upload'}
        </Button>
        {previewUrl && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleRemove}
          >
            <X className="mr-2 h-4 w-4" />
            Remove
          </Button>
        )}
        <p className="text-xs text-gray-500">Max 5MB, JPG or PNG</p>
      </div>
    </div>
  )
}
