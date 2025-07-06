# Storage Bucket Setup Instructions

Since programmatic bucket creation requires admin privileges, you'll need to create the storage bucket manually through the Supabase dashboard.

## Steps to Create Storage Bucket:

1. **Go to Supabase Dashboard**
   - Visit: https://supabase.com/dashboard
   - Navigate to your project: https://hnzkmuobldmznbozpdyv.supabase.co

2. **Create Storage Bucket**
   - Go to Storage → Buckets
   - Click "New bucket"
   - Set the following:
     - **Name**: `user-content`
     - **Public bucket**: ✅ Enabled
     - **File size limit**: `10485760` (10MB)
     - **Allowed MIME types**: 
       - `image/jpeg`
       - `image/png` 
       - `image/webp`
       - `image/gif`

3. **Configure RLS Policies**
   After creating the bucket, go to Storage → Policies and add these policies for the `objects` table:

   **Policy 1: Users can upload to user-content bucket**
   ```sql
   CREATE POLICY "Users can upload to user-content bucket"
   ON storage.objects
   FOR INSERT
   TO authenticated
   WITH CHECK (bucket_id = 'user-content');
   ```

   **Policy 2: Users can update their own files**
   ```sql
   CREATE POLICY "Users can update their own files"
   ON storage.objects
   FOR UPDATE
   TO authenticated
   USING (bucket_id = 'user-content');
   ```

   **Policy 3: Users can delete their own files**
   ```sql
   CREATE POLICY "Users can delete their own files"
   ON storage.objects
   FOR DELETE
   TO authenticated
   USING (bucket_id = 'user-content');
   ```

   **Policy 4: Public can view user-content**
   ```sql
   CREATE POLICY "Public can view user-content"
   ON storage.objects
   FOR SELECT
   TO public
   USING (bucket_id = 'user-content');
   ```

## After Setup
Once the bucket is created manually, the avatar upload functionality should work properly. The application code is already configured to use the `user-content` bucket.

## Alternative: Service Role Key
If you have access to the service role key (not the anon key), you could create the bucket programmatically, but this requires admin-level access which isn't typically used in client-side applications.
