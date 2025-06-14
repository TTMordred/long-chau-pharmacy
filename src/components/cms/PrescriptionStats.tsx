
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Activity,
  CalendarClock,
} from 'lucide-react';
import { usePrescriptionStats } from '@/hooks/usePrescriptionStats';
import { format } from 'date-fns';

const StatCard = ({ title, value, icon, color, bgColor }: { 
  title: string; 
  value: number; 
  icon: React.ReactNode; 
  color: string; 
  bgColor: string;
}) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <div className={`h-8 w-8 rounded-full ${bgColor} flex items-center justify-center`}>
        {icon}
      </div>
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
    </CardContent>
  </Card>
);

const PrescriptionStats = () => {
  const { data: stats, isLoading, error } = usePrescriptionStats();
  const [currentTime, setCurrentTime] = useState(new Date());
  
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute
    
    return () => clearInterval(timer);
  }, []);
  
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="h-4 w-24 bg-gray-200 animate-pulse rounded"></div>
              <div className="h-8 w-8 rounded-full bg-gray-200 animate-pulse"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 w-16 bg-gray-200 animate-pulse rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }
  
  if (error || !stats) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardHeader className="flex flex-row items-center pb-2">
          <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
          <CardTitle className="text-sm font-medium text-red-700">Failed to load statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-red-600">Please refresh and try again</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Prescription Statistics</h3>
        <div className="flex items-center text-sm text-muted-foreground">
          <CalendarClock className="h-4 w-4 mr-1" />
          <span>Last updated: {format(currentTime, 'MMMM d, yyyy h:mm a')}</span>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Prescriptions"
          value={stats.totalPrescriptions}
          icon={<FileText className="h-4 w-4 text-blue-600" />}
          color="text-blue-600"
          bgColor="bg-blue-100"
        />
        <StatCard
          title="Pending Review"
          value={stats.pendingPrescriptions}
          icon={<Clock className="h-4 w-4 text-amber-600" />}
          color="text-amber-600"
          bgColor="bg-amber-100"
        />
        <StatCard
          title="Approved"
          value={stats.approvedPrescriptions}
          icon={<CheckCircle className="h-4 w-4 text-green-600" />}
          color="text-green-600"
          bgColor="bg-green-100"
        />
        <StatCard
          title="Rejected"
          value={stats.rejectedPrescriptions}
          icon={<XCircle className="h-4 w-4 text-red-600" />}
          color="text-red-600"
          bgColor="bg-red-100"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recent Activity (24h)</CardTitle>
            <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
              <Activity className="h-4 w-4 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.recentPrescriptions}</div>
            <p className="text-xs text-muted-foreground pt-1">
              New prescriptions in the last 24 hours
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approval Rate</CardTitle>
            <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center">
              <CheckCircle className="h-4 w-4 text-emerald-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.totalPrescriptions > 0
                ? `${Math.round((stats.approvedPrescriptions / (stats.approvedPrescriptions + stats.rejectedPrescriptions || 1)) * 100)}%`
                : '0%'}
            </div>
            <div className="mt-2 h-2 w-full bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full"
                style={{
                  width: `${
                    stats.totalPrescriptions > 0
                      ? ((stats.approvedPrescriptions / (stats.approvedPrescriptions + stats.rejectedPrescriptions || 1)) * 100)
                      : 0
                  }%`
                }}
              ></div>
            </div>
            <p className="text-xs text-muted-foreground pt-1">
              Ratio of approved to rejected prescriptions
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PrescriptionStats;
