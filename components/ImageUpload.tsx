'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase/client'

interface ImageUploadProps {
  value: string
  onChange: (url: string) => void
  folder?: string
}

export default function ImageUpload({ value, onChange, folder = 'team' }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true)
      
      if (!e.target.files || e.target.files.length === 0) {
        throw new Error('You must select an image to upload.')
      }

      const file = e.target.files[0]
      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random()}.${fileExt}`
      const filePath = `${folder}/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase
        .storage
        .from('images')
        .getPublicUrl(filePath)

      onChange(publicUrl)
    } catch (error) {
      console.error('Error uploading image:', error)
      alert('Error uploading image')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div>
      {value && (
        <div className="mb-4">
          <img
            src={value}
            alt="Preview"
            className="h-32 w-32 object-cover rounded"
          />
        </div>
      )}
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {value ? 'Change Image' : 'Upload Image'}
      </label>
      <input
        type="file"
        accept="image/*"
        onChange={handleUpload}
        disabled={uploading}
        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
      />
    </div>
  )
}
