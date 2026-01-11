import { PostgrestError } from '@supabase/supabase-js';

export interface FriendlyError {
  title: string;
  message: string;
  type: 'error' | 'warning' | 'info';
  action?: string;
}

export const getFriendlyErrorMessage = (error: any): FriendlyError => {
  // Handle Supabase Auth errors first
  if (error?.message?.includes('Invalid login credentials')) {
    return {
      title: 'Invalid Login Credentials',
      message: 'The email or password you entered is incorrect.',
      type: 'error',
      action: 'Please check your email and password and try again. If you forgot your password, use the "Forgot Password" link.'
    };
  }

  if (error?.message?.includes('Email not confirmed')) {
    return {
      title: 'Email Not Verified',
      message: 'Please verify your email address before logging in.',
      type: 'warning',
      action: 'Check your inbox for the verification email. If you didn\'t receive it, click "Resend Verification".'
    };
  }

  if (error?.message?.includes('User already registered')) {
    return {
      title: 'Account Already Exists',
      message: 'An account with this email address is already registered.',
      type: 'warning',
      action: 'Try logging in instead, or use a different email address.'
    };
  }

  if (error?.message?.includes('Password should be at least')) {
    return {
      title: 'Password Too Short',
      message: 'Your password doesn\'t meet the minimum requirements.',
      type: 'warning',
      action: 'Please choose a password with at least 6 characters.'
    };
  }

  if (error?.message?.includes('Password should be different from the old password')) {
    return {
      title: 'Password Reused',
      message: 'Your new password must be different from your current password.',
      type: 'warning',
      action: 'Please choose a different password.'
    };
  }

  if (error?.message?.includes('Invalid email')) {
    return {
      title: 'Invalid Email Address',
      message: 'The email address you entered is not valid.',
      type: 'warning',
      action: 'Please enter a valid email address (e.g., user@example.com).'
    };
  }

  if (error?.message?.includes('Too many requests')) {
    return {
      title: 'Too Many Attempts',
      message: 'You\'ve made too many login attempts. Please wait before trying again.',
      type: 'warning',
      action: 'Wait a few minutes and try again, or reset your password if you\'ve forgotten it.'
    };
  }

  if (error?.message?.includes('Signup disabled')) {
    return {
      title: 'Registration Disabled',
      message: 'New user registration is currently disabled.',
      type: 'error',
      action: 'Please contact your administrator to create an account.'
    };
  }

  if (error?.message?.includes('Email rate limit exceeded')) {
    return {
      title: 'Too Many Emails Sent',
      message: 'We\'ve sent too many emails to this address recently.',
      type: 'warning',
      action: 'Please wait a few minutes before requesting another email.'
    };
  }

  if (error?.message?.includes('Token has expired or is invalid')) {
    return {
      title: 'Link Expired',
      message: 'The password reset or email verification link has expired.',
      type: 'error',
      action: 'Please request a new password reset or verification email.'
    };
  }

  if (error?.message?.includes('Refresh token not found')) {
    return {
      title: 'Session Expired',
      message: 'Your session has expired. Please log in again.',
      type: 'warning',
      action: 'Please log in again to continue.'
    };
  }

  // Handle Supabase database errors
  if (error?.code) {
    switch (error.code) {
      case 'PGRST204':
        return {
          title: 'Database Schema Issue',
          message: 'The database table structure doesn\'t match what we expected. This might be due to a recent database update.',
          type: 'error',
          action: 'Please check if all required database tables exist and have the correct columns.'
        };
      
      case 'PGRST205':
        return {
          title: 'Table Not Found',
          message: `The table '${error.hint?.match(/'public\.(\w+)'/)?.[1] || 'unknown'}' doesn't exist in the database.`,
          type: 'error',
          action: 'Please create the missing tables using the Table Creator tool on the dashboard.'
        };
      
      case '23505':
        return {
          title: 'Duplicate Entry',
          message: 'A record with this information already exists.',
          type: 'warning',
          action: 'Please check if this client already exists or use different information.'
        };
      
      case '23514':
        return {
          title: 'Invalid Data',
          message: 'Some of the information provided is not valid.',
          type: 'error',
          action: 'Please check all required fields and try again.'
        };
      
      case '42501':
        return {
          title: 'Permission Denied',
          message: 'You don\'t have permission to perform this action.',
          type: 'error',
          action: 'Please check your account permissions or contact your administrator.'
        };
      
      case 'PGRST301':
        return {
          title: 'Connection Error',
          message: 'Unable to connect to the database.',
          type: 'error',
          action: 'Please check your internet connection and try again.'
        };
      
      case '23503':
        return {
          title: 'Reference Error',
          message: 'The data you\'re trying to reference doesn\'t exist.',
          type: 'error',
          action: 'Please make sure all related records exist before creating this one.'
        };
      
      case '42P17':
        return {
          title: 'Database Policy Error',
          message: 'There\'s an issue with the database access policies.',
          type: 'error',
          action: 'Please contact your administrator to fix the database policies.'
        };
      
      default:
        return {
          title: 'Database Error',
          message: `A database error occurred: ${error.message || 'Unknown error'}`,
          type: 'error',
          action: 'Please try again. If the problem persists, contact support.'
        };
    }
  }

  // Handle network errors
  if (error?.message?.includes('fetch') || error?.message?.includes('network')) {
    return {
      title: 'Network Error',
      message: 'Unable to connect to the server. Please check your internet connection.',
      type: 'error',
      action: 'Check your connection and try again.'
    };
  }

  // Handle validation errors
  if (error?.message?.includes('validation') || error?.message?.includes('required')) {
    return {
      title: 'Validation Error',
      message: 'Please fill in all required fields correctly.',
      type: 'warning',
      action: 'Check the highlighted fields and try again.'
    };
  }

  // Handle timeout errors
  if (error?.message?.includes('timeout')) {
    return {
      title: 'Request Timeout',
      message: 'The request took too long to complete.',
      type: 'warning',
      action: 'Please try again. If this continues, the server might be busy.'
    };
  }

  // Generic error
  return {
    title: 'Unexpected Error',
    message: error?.message || 'Something went wrong. Please try again.',
    type: 'error',
    action: 'If the problem continues, please contact support.'
  };
};

export const getSuccessMessage = (action: string): FriendlyError => {
  return {
    title: 'Success!',
    message: `${action} completed successfully.`,
    type: 'info'
  };
};

// Error types for different operations
export const ErrorTypes = {
  CLIENT_CREATION: 'client_creation',
  CLIENT_UPDATE: 'client_update',
  USER_CREATION: 'user_creation',
  DATABASE_CONNECTION: 'database_connection',
  TABLE_CREATION: 'table_creation',
  AUTHENTICATION: 'authentication'
} as const;

export type ErrorType = typeof ErrorTypes[keyof typeof ErrorTypes];

export const getOperationSpecificError = (error: any, operation: ErrorType): FriendlyError => {
  const baseError = getFriendlyErrorMessage(error);
  
  // Add operation-specific context
  switch (operation) {
    case ErrorTypes.CLIENT_CREATION:
      return {
        ...baseError,
        title: 'Client Creation Failed',
        message: baseError.message || 'Unable to create new client.',
        action: baseError.action || 'Please check all required fields and try again.'
      };
    
    case ErrorTypes.CLIENT_UPDATE:
      return {
        ...baseError,
        title: 'Client Update Failed',
        message: baseError.message || 'Unable to update client information.',
        action: baseError.action || 'Please check your changes and try again.'
      };
    
    case ErrorTypes.USER_CREATION:
      return {
        ...baseError,
        title: 'User Creation Failed',
        message: baseError.message || 'Unable to create new user.',
        action: baseError.action || 'Please check all required fields and try again.'
      };
    
    case ErrorTypes.DATABASE_CONNECTION:
      return {
        ...baseError,
        title: 'Database Connection Issue',
        message: baseError.message || 'Unable to connect to database.',
        action: baseError.action || 'Please check if database is accessible and try again.'
      };
    
    case ErrorTypes.TABLE_CREATION:
      return {
        ...baseError,
        title: 'Table Creation Failed',
        message: baseError.message || 'Unable to create database tables.',
        action: baseError.action || 'Please check your database permissions and try again.'
      };
    
    case ErrorTypes.AUTHENTICATION:
      return {
        ...baseError,
        title: 'Authentication Error',
        message: baseError.message || 'Unable to authenticate with database.',
        action: baseError.action || 'Please check your login credentials and try again.'
      };
    
    default:
      return baseError;
  }
};
