
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Eye, Edit, Trash2 } from 'lucide-react';

interface ConsentCardProps {
  id: string;
  organization: string;
  purpose: string;
  status: 'active' | 'expired' | 'withdrawn';
  grantedDate: string;
  expiryDate?: string;
  dataTypes: string[];
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onWithdraw: (id: string) => void;
}

const ConsentCard: React.FC<ConsentCardProps> = ({
  id,
  organization,
  purpose,
  status,
  grantedDate,
  expiryDate,
  dataTypes,
  onView,
  onEdit,
  onWithdraw,
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'expired':
        return 'bg-red-100 text-red-800';
      case 'withdrawn':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg font-semibold text-gray-900">
              {organization}
            </CardTitle>
            <p className="text-sm text-gray-600 mt-1">{purpose}</p>
          </div>
          <Badge className={getStatusColor(status)}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="space-y-3">
          <div className="flex items-center text-sm text-gray-600">
            <Clock className="h-4 w-4 mr-2" />
            <span>Granted: {grantedDate}</span>
            {expiryDate && (
              <span className="ml-4">Expires: {expiryDate}</span>
            )}
          </div>
          
          <div>
            <p className="text-xs font-medium text-gray-700 mb-2">Data Types:</p>
            <div className="flex flex-wrap gap-1">
              {dataTypes.map((type, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {type}
                </Badge>
              ))}
            </div>
          </div>
          
          <div className="flex space-x-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onView(id)}
              className="flex-1"
            >
              <Eye className="h-4 w-4 mr-2" />
              View
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(id)}
              className="flex-1"
              disabled={status !== 'active'}
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => onWithdraw(id)}
              className="flex-1"
              disabled={status !== 'active'}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Withdraw
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ConsentCard;
