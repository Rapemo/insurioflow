import { supabase } from '@/integrations/supabase/client';

// Production URL configuration
export const PRODUCTION_URL = 'https://your-production-domain.com'; // Replace with your actual production URL
export const DEVELOPMENT_URL = 'http://localhost:3001';

// Get current environment URL
export const getCurrentUrl = () => {
  if (import.meta.env.PROD) {
    return PRODUCTION_URL;
  }
  return DEVELOPMENT_URL;
};

// Configure Supabase auth settings
export const configureSupabaseAuth = async () => {
  const siteUrl = getCurrentUrl();
  
  // Update site URL for email templates
  try {
    const { error } = await supabase.auth.updateUser({
      data: {
        site_url: siteUrl,
      }
    });
    
    if (error) {
      console.error('Error updating site URL:', error);
    } else {
      console.log('Site URL updated to:', siteUrl);
    }
  } catch (err) {
    console.error('Failed to update site URL:', err);
  }
};

// Email confirmation redirect URL
export const getConfirmationRedirectUrl = () => {
  return `${getCurrentUrl()}/confirm-email`;
};

// Password reset redirect URL  
export const getPasswordResetRedirectUrl = () => {
  return `${getCurrentUrl()}/reset-password`;
};
