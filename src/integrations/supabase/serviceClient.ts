// Service client for admin operations using service role key
import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import type { Database } from './types';

// Service role key should be stored securely - for development we'll use it directly
// In production, this should be handled by a backend service
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

// Create service client for admin operations
export const serviceClient = SUPABASE_SERVICE_ROLE_KEY 
  ? createSupabaseClient<Database>(
      SUPABASE_URL,
      SUPABASE_SERVICE_ROLE_KEY,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )
  : null;

// Fallback: Use regular client with admin bypass for development
export const createServiceClient = () => {
  if (serviceClient) {
    return serviceClient;
  }
  
  // For development without service key, we'll use a workaround
  // This is NOT recommended for production
  console.warn('Service role key not found. Using client-side admin operations (development only)');
  return null;
};
