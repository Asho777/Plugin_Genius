import React, { useState, useEffect } from 'react'
import { FiUser } from 'react-icons/fi'

interface AvatarImageProps {
  src?: string | null
  alt?: string
  fallbackText?: string
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

const AvatarImage: React.FC<AvatarImageProps> = ({ 
  src, 
  alt = 'Avatar', 
  fallbackText = 'U',
  className = '',
  size = 'md'
}) => {
  const [imageError, setImageError] = useState(false)
  const [imageSrc, setImageSrc] = useState<string | null>(null)

  useEffect(() => {
    if (!src) {
      setImageSrc(null)
      setImageError(false)
      return
    }

    // Reset error state when src changes
    setImageError(false)
    
    // Validate URL format
    if (src.includes('user-c') && !src.includes('user-content')) {
      console.warn('Detected malformed avatar URL:', src)
      setImageError(true)
      setImageSrc(null)
      return
    }
    
    // For Supabase storage URLs, we'll use a different approach
    if (src.includes('supabase.co/storage')) {
      console.log('Loading Supabase avatar image:', src)
      
      // Try to load the image with crossOrigin attribute
      const img = new Image()
      img.crossOrigin = 'anonymous'
      
      img.onload = () => {
        console.log('Avatar image loaded successfully:', src)
        setImageSrc(src)
        setImageError(false)
      }
      
      img.onerror = () => {
        console.warn('Failed to load avatar image with CORS:', src)
        // Try without CORS
        const imgNoCors = new Image()
        imgNoCors.onload = () => {
          console.log('Avatar image loaded without CORS:', src)
          setImageSrc(src)
          setImageError(false)
        }
        imgNoCors.onerror = () => {
          console.error('Failed to load avatar image completely:', src)
          setImageError(true)
          setImageSrc(null)
        }
        imgNoCors.src = src
      }
      
      img.src = src
    } else {
      // For other URLs, use directly
      console.log('Loading external avatar image:', src)
      setImageSrc(src)
    }
  }, [src])

  const sizeClasses = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-16 h-16 text-xl'
  }

  if (!imageSrc || imageError) {
    return (
      <div className={`avatar-placeholder ${sizeClasses[size]} ${className}`}>
        {fallbackText.charAt(0).toUpperCase()}
      </div>
    )
  }

  return (
    <img 
      src={imageSrc}
      alt={alt}
      className={`avatar-image ${sizeClasses[size]} ${className}`}
      onError={() => {
        console.error('Avatar image failed to load in img element:', imageSrc)
        setImageError(true)
        setImageSrc(null)
      }}
      loading="lazy"
    />
  )
}

export default AvatarImage
