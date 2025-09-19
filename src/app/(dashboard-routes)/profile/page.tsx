
import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, Calendar, Shield, Edit, Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    address: '123 Main St, City, State 12345',
    dateOfBirth: '1990-01-15',
    joinDate: '2023-01-15',
  });

  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: false,
    emailVisibility: false,
    phoneVisibility: false,
    addressVisibility: false,
    activityTracking: true,
    analyticsOptIn: false,
    marketingEmails: true,
    dataRetention: 'standard',
  });

  const handleSave = () => {
    setIsEditing(false);
    console.log('Profile updated:', profileData);
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset any changes
  };

  const dataCategories = [
    { name: 'Personal Information', description: 'Name, email, phone, address', organizations: 12 },
    { name: 'Usage Data', description: 'App usage, preferences, activity logs', organizations: 8 },
    { name: 'Device Information', description: 'IP address, browser, device type', organizations: 15 },
    { name: 'Location Data', description: 'GPS coordinates, city, country', organizations: 5 },
    { name: 'Communication', description: 'Messages, emails, call logs', organizations: 3 },
    { name: 'Financial Data', description: 'Payment info, transaction history', organizations: 7 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
          <p className="text-gray-600 mt-1">
            Manage your personal information and privacy preferences
          </p>
        </div>
        {!isEditing ? (
          <Button onClick={() => setIsEditing(true)}>
            <Edit className="h-4 w-4 mr-2" />
            Edit Profile
          </Button>
        ) : (
          <div className="flex space-x-2">
            <Button onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
            <Button variant="outline" onClick={handleCancel}>
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Information */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="h-5 w-5 mr-2" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={profileData.firstName}
                    onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={profileData.lastName}
                    onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })}
                    disabled={!isEditing}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={profileData.email}
                  onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                  disabled={!isEditing}
                />
              </div>

              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={profileData.phone}
                  onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                  disabled={!isEditing}
                />
              </div>

              <div>
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={profileData.address}
                  onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                  disabled={!isEditing}
                />
              </div>

              <div>
                <Label htmlFor="dateOfBirth">Date of Birth</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={profileData.dateOfBirth}
                  onChange={(e) => setProfileData({ ...profileData, dateOfBirth: e.target.value })}
                  disabled={!isEditing}
                />
              </div>
            </CardContent>
          </Card>

          {/* Privacy Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                Privacy Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">Activity Tracking</h4>
                    <p className="text-sm text-gray-600">Allow tracking of your app usage</p>
                  </div>
                  <Switch
                    checked={privacySettings.activityTracking}
                    onCheckedChange={(checked) =>
                      setPrivacySettings({ ...privacySettings, activityTracking: checked })
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">Analytics Opt-in</h4>
                    <p className="text-sm text-gray-600">Help improve our services with usage analytics</p>
                  </div>
                  <Switch
                    checked={privacySettings.analyticsOptIn}
                    onCheckedChange={(checked) =>
                      setPrivacySettings({ ...privacySettings, analyticsOptIn: checked })
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">Marketing Emails</h4>
                    <p className="text-sm text-gray-600">Receive promotional emails and updates</p>
                  </div>
                  <Switch
                    checked={privacySettings.marketingEmails}
                    onCheckedChange={(checked) =>
                      setPrivacySettings({ ...privacySettings, marketingEmails: checked })
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Account Summary */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Account Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-3">
                <Calendar className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Member Since</p>
                  <p className="text-sm text-gray-600">{profileData.joinDate}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Shield className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Active Consents</p>
                  <p className="text-sm text-gray-600">24 organizations</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Email Verified</p>
                  <p className="text-sm text-green-600">Verified</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Data Categories */}
          <Card>
            <CardHeader>
              <CardTitle>Your Data Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {dataCategories.map((category, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">{category.name}</h4>
                      <p className="text-xs text-gray-600">{category.description}</p>
                    </div>
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      {category.organizations}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;
