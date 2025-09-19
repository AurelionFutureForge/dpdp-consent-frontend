
import React, { useState } from 'react';
import { FileText, Download, Eye, Trash2, Plus, Clock, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const DataRequests = () => {
  const [requestType, setRequestType] = useState('');

  const requests = [
    {
      id: 'REQ001',
      type: 'Data Access',
      organization: 'TechCorp Inc.',
      description: 'Request for all personal data collected',
      status: 'completed',
      requestDate: '2023-12-01',
      completedDate: '2023-12-08',
      estimatedDays: 7,
    },
    {
      id: 'REQ002',
      type: 'Data Correction',
      organization: 'SocialMedia Platform',
      description: 'Update incorrect email address',
      status: 'in_progress',
      requestDate: '2023-12-15',
      completedDate: null,
      estimatedDays: 5,
    },
    {
      id: 'REQ003',
      type: 'Data Deletion',
      organization: 'E-commerce Store',
      description: 'Delete all account data and history',
      status: 'pending',
      requestDate: '2023-12-20',
      completedDate: null,
      estimatedDays: 30,
    },
    {
      id: 'REQ004',
      type: 'Data Portability',
      organization: 'Cloud Storage Co.',
      description: 'Export all files and metadata',
      status: 'rejected',
      requestDate: '2023-11-25',
      completedDate: '2023-12-02',
      estimatedDays: 14,
    },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'in_progress':
        return <Clock className="h-4 w-4 text-blue-600" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'rejected':
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const requestTypes = [
    { value: 'access', label: 'Data Access', description: 'Request a copy of your personal data' },
    { value: 'correction', label: 'Data Correction', description: 'Request to update incorrect information' },
    { value: 'deletion', label: 'Data Deletion', description: 'Request to delete your personal data' },
    { value: 'portability', label: 'Data Portability', description: 'Request data in a portable format' },
    { value: 'restriction', label: 'Processing Restriction', description: 'Request to restrict data processing' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Data Requests</h1>
          <p className="text-gray-600 mt-1">
            Submit and track your data subject access requests
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Request
        </Button>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Submit New Request</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {requestTypes.map((type) => (
              <Card key={type.value} className="cursor-pointer hover:shadow-md transition-shadow border-2 hover:border-blue-200">
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    <FileText className="h-5 w-5 text-blue-600 mt-1" />
                    <div>
                      <h3 className="font-medium text-gray-900">{type.label}</h3>
                      <p className="text-sm text-gray-600 mt-1">{type.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Requests List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Your Requests</h2>
          <Select>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {requests.map((request) => (
          <Card key={request.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="font-semibold text-gray-900">#{request.id}</span>
                    <Badge className={getStatusColor(request.status)}>
                      <div className="flex items-center space-x-1">
                        {getStatusIcon(request.status)}
                        <span>{request.status.replace('_', ' ')}</span>
                      </div>
                    </Badge>
                  </div>

                  <h3 className="text-lg font-medium text-gray-900 mb-1">
                    {request.type} - {request.organization}
                  </h3>
                  <p className="text-gray-600 mb-3">{request.description}</p>

                  <div className="flex items-center space-x-6 text-sm text-gray-500">
                    <span>Requested: {request.requestDate}</span>
                    {request.completedDate ? (
                      <span>Completed: {request.completedDate}</span>
                    ) : (
                      <span>Est. completion: {request.estimatedDays} days</span>
                    )}
                  </div>
                </div>

                <div className="flex space-x-2 ml-4">
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-2" />
                    View
                  </Button>
                  {request.status === 'completed' && (
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  )}
                  {request.status === 'pending' && (
                    <Button variant="destructive" size="sm">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default DataRequests;
