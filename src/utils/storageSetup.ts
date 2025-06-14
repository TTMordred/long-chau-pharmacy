
import { supabase } from '@/integrations/supabase/client';

export const ensureStorageBucketExists = async () => {
  try {
    // Check if prescriptions bucket exists
    const { data: buckets, error } = await supabase.storage.listBuckets();
    
    if (error) {
      console.error('Error listing buckets:', error);
      return false;
    }

    const prescriptionsBucket = buckets.find(bucket => bucket.id === 'prescriptions');
    
    if (!prescriptionsBucket) {
      console.warn('Prescriptions bucket does not exist. Please create it in Supabase Dashboard.');
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error checking storage setup:', error);
    return false;
  }
};

export const testStoragePermissions = async (userId: string) => {
  try {
    // Test upload permission by uploading a small test file
    const testContent = new Blob(['test'], { type: 'text/plain' });
    const testPath = `${userId}/test-${Date.now()}.txt`;
    
    const { error: uploadError } = await supabase.storage
      .from('prescriptions')
      .upload(testPath, testContent);

    if (uploadError) {
      console.error('Storage upload test failed:', uploadError);
      return false;
    }

    // Clean up test file
    await supabase.storage
      .from('prescriptions')
      .remove([testPath]);

    return true;
  } catch (error) {
    console.error('Error testing storage permissions:', error);
    return false;
  }
};
