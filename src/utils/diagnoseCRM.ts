import { supabase } from '@/integrations/supabase/client';

// Simple diagnostic to check table structure
export const diagnoseCRMTables = async () => {
  console.log('🔍 Diagnosing CRM tables...');
  
  try {
    // Test basic table queries
    console.log('📊 Testing companies table...');
    const { data: companies, error: companiesError } = await supabase
      .from('companies')
      .select('*')
      .limit(1);
    
    if (companiesError) {
      console.error('❌ Companies error:', companiesError);
    } else {
      console.log('✅ Companies OK, sample:', companies?.[0]);
      console.log('📋 Companies columns:', Object.keys(companies?.[0] || {}));
    }

    console.log('📊 Testing policies table...');
    const { data: policies, error: policiesError } = await supabase
      .from('policies')
      .select('*')
      .limit(1);
    
    if (policiesError) {
      console.error('❌ Policies error:', policiesError);
    } else {
      console.log('✅ Policies OK, sample:', policies?.[0]);
      console.log('📋 Policies columns:', Object.keys(policies?.[0] || {}));
    }

    console.log('📊 Testing claims table...');
    const { data: claims, error: claimsError } = await supabase
      .from('claims')
      .select('*')
      .limit(1);
    
    if (claimsError) {
      console.error('❌ Claims error:', claimsError);
    } else {
      console.log('✅ Claims OK, sample:', claims?.[0]);
      console.log('📋 Claims columns:', Object.keys(claims?.[0] || {}));
    }

    console.log('📊 Testing employees table...');
    const { data: employees, error: employeesError } = await supabase
      .from('employees')
      .select('*')
      .limit(1);
    
    if (employeesError) {
      console.error('❌ Employees error:', employeesError);
    } else {
      console.log('✅ Employees OK, sample:', employees?.[0]);
      console.log('📋 Employees columns:', Object.keys(employees?.[0] || {}));
    }

    // Test specific column queries
    console.log('🔍 Testing specific column queries...');
    
    const { data: testPolicies, error: testPoliciesError } = await supabase
      .from('policies')
      .select('company_id, premium, created_at, status')
      .limit(1);
    
    if (testPoliciesError) {
      console.error('❌ Policies column error:', testPoliciesError);
    } else {
      console.log('✅ Policies columns OK');
    }

    const { data: testClaims, error: testClaimsError } = await supabase
      .from('claims')
      .select('employee_id, amount, created_at, status')
      .limit(1);
    
    if (testClaimsError) {
      console.error('❌ Claims column error:', testClaimsError);
    } else {
      console.log('✅ Claims columns OK');
    }

  } catch (error) {
    console.error('❌ General error:', error);
  }
};

// Run this function in browser console to diagnose
// diagnoseCRMTables();
