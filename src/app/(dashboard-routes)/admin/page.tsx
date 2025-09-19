
import React, { useState } from 'react';
import { Users, Shield, FileText, AlertTriangle, BarChart3, Settings, Download, Eye } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import StatsCard from '@/components/StatsCard';

const AdminDashboard = () => {
  const [selectedTimeRange, setSelectedTimeRange] = useState('30d');

  const auditLogs = [
    {
      id: 'LOG001',
      timestamp: '2023-12-20 14:30:15',
      userId: 'user123',
      action: 'CONSENT_GRANTED',
      details: 'Marketing consent granted to TechCorp Inc.',
      ipAddress: '192.168.1.100',
      status: 'success',
    },
    {
      id: 'LOG002',
      timestamp: '2023-12-20 13:45:22',
      userId: 'user456',
      action: 'DATA_REQUEST',
      details: 'Data access request submitted',
      ipAddress: '10.0.0.50',
      status: 'pending',
    },
    {
      id: 'LOG003',
      timestamp: '2023-12-20 12:15:08',
      userId: 'user789',
      action: 'CONSENT_WITHDRAWN',
      details: 'Analytics consent withdrawn from DataCorp',
      ipAddress: '172.16.0.25',
      status: 'success',
    },
    {
      id: 'LOG004',
      timestamp: '2023-12-20 11:20:33',
      userId: 'user101',
      action: 'PRIVACY_POLICY_VIEWED',
      details: 'Privacy policy accessed',
      ipAddress: '192.168.2.15',
      status: 'info',
    },
  ];

  const organizations = [
    {
      id: 'ORG001',
      name: 'TechCorp Inc.',
      totalUsers: 1250,
      activeConsents: 980,
      dataRequests: 23,
      complianceScore: 95,
      lastActivity: '2023-12-20',
    },
    {
      id: 'ORG002',
      name: 'DataFlow Ltd.',
      totalUsers: 850,
      activeConsents: 720,
      dataRequests: 12,
      complianceScore: 87,
      lastActivity: '2023-12-19',
    },
    {
      id: 'ORG003',
      name: 'Analytics Pro',
      totalUsers: 2100,
      activeConsents: 1800,
      dataRequests: 45,
      complianceScore: 92,
      lastActivity: '2023-12-20',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      case 'info':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getComplianceColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-1">
            System administration and compliance monitoring
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          <Button>
            <Settings className="h-4 w-4 mr-2" />
            System Settings
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Users"
          value="4,200"
          description="Registered users"
          icon={Users}
          trend={{ value: 8, isPositive: true }}
        />
        <StatsCard
          title="Active Consents"
          value="3,500"
          description="Currently active"
          icon={Shield}
          trend={{ value: 5, isPositive: true }}
        />
        <StatsCard
          title="Data Requests"
          value="80"
          description="This month"
          icon={FileText}
          trend={{ value: 12, isPositive: false }}
        />
        <StatsCard
          title="Compliance Issues"
          value="3"
          description="Requiring attention"
          icon={AlertTriangle}
          trend={{ value: 25, isPositive: false }}
        />
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="organizations">Organizations</TabsTrigger>
          <TabsTrigger value="audit-logs">Audit Logs</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2" />
                  System Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Consent Requests</span>
                    <span className="font-medium">245 today</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Data Access Requests</span>
                    <span className="font-medium">18 today</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Policy Updates</span>
                    <span className="font-medium">5 this week</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Compliance Checks</span>
                    <span className="font-medium">All passed</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Alerts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-yellow-800">
                        Data Retention Policy Update Required
                      </p>
                      <p className="text-xs text-yellow-700">
                        3 organizations need updated retention policies
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <FileText className="h-4 w-4 text-blue-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-blue-800">
                        Quarterly Compliance Report Due
                      </p>
                      <p className="text-xs text-blue-700">
                        Generate and submit by January 31st
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="organizations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Organization Management</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Organization</TableHead>
                    <TableHead>Total Users</TableHead>
                    <TableHead>Active Consents</TableHead>
                    <TableHead>Data Requests</TableHead>
                    <TableHead>Compliance Score</TableHead>
                    <TableHead>Last Activity</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {organizations.map((org) => (
                    <TableRow key={org.id}>
                      <TableCell className="font-medium">{org.name}</TableCell>
                      <TableCell>{org.totalUsers.toLocaleString()}</TableCell>
                      <TableCell>{org.activeConsents.toLocaleString()}</TableCell>
                      <TableCell>{org.dataRequests}</TableCell>
                      <TableCell>
                        <span className={`font-medium ${getComplianceColor(org.complianceScore)}`}>
                          {org.complianceScore}%
                        </span>
                      </TableCell>
                      <TableCell>{org.lastActivity}</TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audit-logs" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Audit Trail</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>User ID</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Details</TableHead>
                    <TableHead>IP Address</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {auditLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="font-mono text-sm">{log.timestamp}</TableCell>
                      <TableCell>{log.userId}</TableCell>
                      <TableCell>
                        <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                          {log.action}
                        </code>
                      </TableCell>
                      <TableCell>{log.details}</TableCell>
                      <TableCell className="font-mono text-sm">{log.ipAddress}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(log.status)}>
                          {log.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>DPDP Compliance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">98%</div>
                  <p className="text-sm text-gray-600">Compliance Score</p>
                  <Button variant="outline" size="sm" className="mt-3">
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Data Retention</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">45</div>
                  <p className="text-sm text-gray-600">Policies Active</p>
                  <Button variant="outline" size="sm" className="mt-3">
                    Manage Policies
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Security Audits</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-2">12</div>
                  <p className="text-sm text-gray-600">This Quarter</p>
                  <Button variant="outline" size="sm" className="mt-3">
                    Schedule Audit
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
