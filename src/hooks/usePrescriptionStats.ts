
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface PrescriptionStats {
  totalPrescriptions: number;
  pendingPrescriptions: number;
  approvedPrescriptions: number;
  rejectedPrescriptions: number;
  recentPrescriptions: number;
}

export const usePrescriptionStats = () => {
  return useQuery({
    queryKey: ['prescription-stats'],
    queryFn: async (): Promise<PrescriptionStats> => {
      // Get total count
      const { count: totalCount, error: totalError } = await supabase
        .from('prescriptions')
        .select('*', { count: 'exact', head: true });
      
      if (totalError) throw totalError;
      
      // Get pending count
      const { count: pendingCount, error: pendingError } = await supabase
        .from('prescriptions')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending');
      
      if (pendingError) throw pendingError;
      
      // Get approved count
      const { count: approvedCount, error: approvedError } = await supabase
        .from('prescriptions')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'approved');
      
      if (approvedError) throw approvedError;
      
      // Get rejected count
      const { count: rejectedCount, error: rejectedError } = await supabase
        .from('prescriptions')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'rejected');
      
      if (rejectedError) throw rejectedError;
      
      // Get recent count (last 24 hours)
      const oneDayAgo = new Date();
      oneDayAgo.setDate(oneDayAgo.getDate() - 1);
      
      const { count: recentCount, error: recentError } = await supabase
        .from('prescriptions')
        .select('*', { count: 'exact', head: true })
        .gte('uploaded_at', oneDayAgo.toISOString());
      
      if (recentError) throw recentError;
      
      return {
        totalPrescriptions: totalCount || 0,
        pendingPrescriptions: pendingCount || 0,
        approvedPrescriptions: approvedCount || 0,
        rejectedPrescriptions: rejectedCount || 0,
        recentPrescriptions: recentCount || 0,
      };
    },
  });
};
