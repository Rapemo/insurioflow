import { PostgrestError } from '@supabase/supabase-js';

export interface FriendlyError {
  title: string;
  message: string;
  type: 'error' | 'warning' | 'info';
  action?: string;
}

export const getFriendlyErrorMessage = (error: any): FriendlyError => {
  // Handle Supabase errors
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
  if (error?.message?.includes('fetch')) {
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
        message: baseError.message || 'Unable to create the new client.',
        action: baseError.action || 'Please check all required fields and try again.'
      };
    
    case ErrorTypes.CLIENT_UPDATE:
      return {
        ...baseError,
        title: 'Client Update Failed',
        message: baseError.message || 'Unable to update the client information.',
        action: baseError.action || 'Please check your changes and try again.'
      };
    
    case ErrorTypes.DATABASE_CONNECTION:
      return {
        ...baseError,
        title: 'Database Connection Issue',
        message: baseError.message || 'Unable to connect to the database.',
        action: baseError.action || 'Please check if the database is accessible and try again.'
      };
    
    case ErrorTypes.TABLE_CREATION:
      return {
        ...baseError,
        title: 'Table Creation Failed',
        message: baseError.message || 'Unable to create the database tables.',
        action: baseError.action || 'Please check your database permissions and try again.'
      };
    
    case ErrorTypes.AUTHENTICATION:
      return {
        ...baseError,
        title: 'Authentication Error',
        message: baseError.message || 'Unable to authenticate with the database.',
        action: baseError.action || 'Please check your login credentials and try again.'
      };
    
    default:
      return baseError;
  }
};
