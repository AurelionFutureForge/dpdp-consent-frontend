
import React, { useState } from 'react';
import { Search, Filter, Plus, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ConsentCard from '@/components/ConsentCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const ConsentManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const consents = [
    {
      id: '1',
      organization: 'TechCorp Inc.',
      purpose: 'Email Marketing & Analytics',
      status: 'active' as const,
      grantedDate: '2023-12-01',
      expiryDate: '2024-12-01',
      dataTypes: ['Email', 'Name', 'Usage Data', 'Preferences'],
    },
    {
      id: '2',
      organization: 'SocialMedia Platform',
      purpose: 'Content Personalization',
      status: 'active' as const,
      grantedDate: '2023-11-15',
      expiryDate: '2024-11-15',
      dataTypes: ['Profile Info', 'Activity Data', 'Location'],
    },
    {
      id: '3',
      organization: 'E-commerce Store',
      purpose: 'Order Processing & Support',
      status: 'expired' as const,
      grantedDate: '2023-06-01',
      expiryDate: '2023-12-01',
      dataTypes: ['Contact Info', 'Purchase History', 'Payment Info'],
    },
    {
      id: '4',
      organization: 'Analytics Service',
      purpose: 'Website Analytics',
      status: 'withdrawn' as const,
      grantedDate: '2023-10-01',
      expiryDate: '2024-10-01',
      dataTypes: ['Usage Data', 'Device Info', 'IP Address'],
    },
    {
      id: '5',
      organization: 'Cloud Storage Co.',
      purpose: 'File Storage & Sync',
      status: 'active' as const,
      grantedDate: '2023-09-15',
      expiryDate: '2025-09-15',
      dataTypes: ['Files', 'Metadata', 'Access Logs'],
    },
    {
      id: '6',
      organization: 'Newsletter Service',
      purpose: 'Newsletter Subscription',
      status: 'active' as const,
      grantedDate: '2023-08-01',
      expiryDate: '2024-08-01',
      dataTypes: ['Email', 'Reading Preferences'],
    },
  ];

  const filteredConsents = consents.filter((consent) => {
    const matchesSearch = consent.organization
      .toLowerCase()
      .includes(searchTerm.toLowerCase()) ||
      consent.purpose.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || consent.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleView = (id: string) => {
    console.log('View consent:', id);
  };

  const handleEdit = (id: string) => {
    console.log('Edit consent:', id);
  };

  const handleWithdraw = (id: string) => {
    console.log('Withdraw consent:', id);
  };

  const statusCounts = {
    total: consents.length,
    active: consents.filter(c => c.status === 'active').length,
    expired: consents.filter(c => c.status === 'expired').length,
    withdrawn: consents.filter(c => c.status === 'withdrawn').length,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Consents</h1>
          <p className="text-gray-600 mt-1">
            Manage your data sharing permissions and privacy settings
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Grant New Consent
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Total</p>
                <p className="text-2xl font-bold text-gray-900">{statusCounts.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="h-3 w-3 bg-green-500 rounded-full"></div>
              <div>
                <p className="text-sm font-medium text-gray-600">Active</p>
                <p className="text-2xl font-bold text-green-600">{statusCounts.active}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="h-3 w-3 bg-red-500 rounded-full"></div>
              <div>
                <p className="text-sm font-medium text-gray-600">Expired</p>
                <p className="text-2xl font-bold text-red-600">{statusCounts.expired}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="h-3 w-3 bg-gray-500 rounded-full"></div>
              <div>
                <p className="text-sm font-medium text-gray-600">Withdrawn</p>
                <p className="text-2xl font-bold text-gray-600">{statusCounts.withdrawn}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search organizations or purposes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex space-x-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="expired">Expired</SelectItem>
                  <SelectItem value="withdrawn">Withdrawn</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Consent Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredConsents.map((consent) => (
          <ConsentCard
            key={consent.id}
            {...consent}
            onView={handleView}
            onEdit={handleEdit}
            onWithdraw={handleWithdraw}
          />
        ))}
      </div>

      {filteredConsents.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No consents found
            </h3>
            <p className="text-gray-600">
              No consents match your current search and filter criteria.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ConsentManagement;
