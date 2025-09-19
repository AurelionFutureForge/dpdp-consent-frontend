
import React from 'react';
import { Shield, Users, FileText, AlertTriangle, TrendingUp, Clock } from 'lucide-react';
import StatsCard from '@/components/StatsCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ContentLayout } from '@/components/admin-panel/content-layout';

const Dashboard = () => {
  const recentActivities = [
    {
      id: 1,
      action: 'Consent granted',
      organization: 'TechCorp Inc.',
      timestamp: '2 hours ago',
      status: 'success',
    },
    {
      id: 2,
      action: 'Data request submitted',
      organization: 'DataFlow Ltd.',
      timestamp: '4 hours ago',
      status: 'pending',
    },
    {
      id: 3,
      action: 'Consent withdrawn',
      organization: 'MarketPlace Co.',
      timestamp: '1 day ago',
      status: 'warning',
    },
    {
      id: 4,
      action: 'Consent expired',
      organization: 'Analytics Pro',
      timestamp: '2 days ago',
      status: 'error',
    },
  ];

  const upcomingExpiries = [
    {
      organization: 'SocialMedia Corp',
      purpose: 'Marketing Communications',
      expiryDate: '2024-01-15',
      daysLeft: 5,
    },
    {
      organization: 'E-commerce Plus',
      purpose: 'Analytics & Tracking',
      expiryDate: '2024-01-20',
      daysLeft: 10,
    },
    {
      organization: 'Cloud Services Ltd',
      purpose: 'Service Optimization',
      expiryDate: '2024-01-25',
      daysLeft: 15,
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'warning':
        return 'bg-orange-100 text-orange-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
<ContentLayout title="Consent Dashboard">
<div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Monitor your data privacy and consent management
          </p>
        </div>
        <Button>
          <Shield className="h-4 w-4 mr-2" />
          Grant New Consent
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Active Consents"
          value={24}
          description="Currently active"
          icon={Shield}
          trend={{ value: 12, isPositive: true }}
        />
        <StatsCard
          title="Organizations"
          value={8}
          description="Connected services"
          icon={Users}
          trend={{ value: 2, isPositive: true }}
        />
        <StatsCard
          title="Data Requests"
          value={3}
          description="Pending requests"
          icon={FileText}
          trend={{ value: 5, isPositive: false }}
        />
        <StatsCard
          title="Expiring Soon"
          value={2}
          description="Next 30 days"
          icon={AlertTriangle}
          trend={{ value: 1, isPositive: false }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="h-5 w-5 mr-2" />
              Recent Activities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-gray-900">
                        {activity.action}
                      </span>
                      <Badge className={getStatusColor(activity.status)}>
                        {activity.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      {activity.organization}
                    </p>
                  </div>
                  <span className="text-xs text-gray-500">
                    {activity.timestamp}
                  </span>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4">
              View All Activities
            </Button>
          </CardContent>
        </Card>

        {/* Upcoming Expiries */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="h-5 w-5 mr-2" />
              Upcoming Expiries
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingExpiries.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">
                      {item.organization}
                    </div>
                    <p className="text-sm text-gray-600">{item.purpose}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Expires: {item.expiryDate}
                    </p>
                  </div>
                  <div className="text-right">
                    <Badge
                      className={
                        item.daysLeft <= 7
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }
                    >
                      {item.daysLeft} days
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4">
              Manage Expiries
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
    </ContentLayout>
  );
};

export default Dashboard;
