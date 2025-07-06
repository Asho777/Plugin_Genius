import { supabase } from '../lib/supabase'

export const createStorageBucket = async () => {
  try {
    console.log('Checking if user-content bucket exists...')
    
    // First, try to get the bucket to see if it exists
    const { data: buckets, error: listError } = await supabase.storage.listBuckets()
    
    if (listError) {
      console.error('Error listing buckets:', listError)
      throw listError
    }
    
    console.log('Existing buckets:', buckets)
    
    // Check if user-content bucket already exists
    const existingBucket = buckets?.find(bucket => bucket.id === 'user-content')
    
    if (existingBucket) {
      console.log('user-content bucket already exists')
      return true
    }
    
    console.log('Creating user-content bucket...')
    
    // Create the bucket
    const { data, error } = await supabase.storage.createBucket('user-content', {
      public: true,
      allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
      fileSizeLimit: 10485760 // 10MB
    })
    
    if (error) {
      console.error('Error creating bucket:', error)
      throw error
    }
    
    console.log('Bucket created successfully:', data)
    return true
    
  } catch (error) {
    console.error('Error in createStorageBucket:', error)
    return false
  }
}
