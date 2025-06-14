
import { Users, FileText, MessageSquare, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { usePrescriptions } from '@/hooks/usePrescriptions';
import { useCMSPages, useBlogPosts } from '@/hooks/useCMS';

const CMSStats = () => {
  const { data: prescriptions } = usePrescriptions();
  const { data: cmsPages } = useCMSPages();
  const { data: blogPosts } = useBlogPosts();

  const pendingPrescriptions = prescriptions?.filter(p => p.status === 'pending').length || 0;
  const approvedPrescriptions = prescriptions?.filter(p => p.status === 'approved').length || 0;
  const totalPages = cmsPages?.length || 0;
  const totalBlogPosts = blogPosts?.length || 0;

  const stats = [
    {
      title: "Pending Prescriptions",
      value: pendingPrescriptions,
      icon: Users,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
    },
    {
      title: "Approved Prescriptions",
      value: approvedPrescriptions,
      icon: TrendingUp,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "CMS Pages",
      value: totalPages,
      icon: FileText,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Blog Posts",
      value: totalBlogPosts,
      icon: MessageSquare,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <div className={`p-2 rounded-full ${stat.bgColor}`}>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default CMSStats;
