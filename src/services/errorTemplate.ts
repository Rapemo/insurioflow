// Quick update script for remaining services
// This adds friendly error handling to all service files

import { supabase } from '@/integrations/supabase/client';
import { getFriendlyErrorMessage } from '@/utils/errorHandler';

// Template for service updates:
/*
if (error) {
  console.error('Error [operation]:', error);
  return { data: null, error: getFriendlyErrorMessage(error) };
}

} catch (error) {
  console.error('Unexpected error [operation]:', error);
  return { data: null, error: getFriendlyErrorMessage(error) };
}
*/

// Services that need updates:
// - quoteService.ts (partially done)
// - benefitService.ts (already done)
// - countryService.ts (already done)
// - claimService.ts (already done)
// - policyService.ts (partially done)

export const serviceErrorTemplate = {
  getError: (operation: string) => ({
    supabaseError: `if (error) {
  console.error('Error ${operation}:', error);
  return { data: null, error: getFriendlyErrorMessage(error) };
}`,
    catchError: `} catch (error) {
  console.error('Unexpected error ${operation}:', error);
  return { data: null, error: getFriendlyErrorMessage(error) };
}`
  })
};
