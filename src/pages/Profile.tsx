
import React, { useState } from 'react';
import SideNav from '@/components/SideNav';
import DashboardHeader from '@/components/DashboardHeader';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { mockShopProfile, firestore } from '@/lib/firebase';
import { toast } from 'sonner';
import { Camera, Upload, User } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const Profile = () => {
  const [profile, setProfile] = useState(mockShopProfile);
  const [isLoading, setIsLoading] = useState(false);
  
  // Handle form changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };
  
  const handleShopTypeChange = (value: string) => {
    setProfile({ ...profile, shopType: value as typeof profile.shopType });
  };
  
  const handlePickupAvailableChange = (checked: boolean) => {
    setProfile({ ...profile, pickupAvailable: checked });
  };
  
  // Update profile
  const handleUpdateProfile = async () => {
    setIsLoading(true);
    
    try {
      await firestore.updateShopProfile(profile.id, profile);
      toast.success('Shop profile updated successfully');
    } catch (error) {
      toast.error('Failed to update shop profile');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle file uploads
  const handleFileUpload = (type: 'logo' | 'banner') => {
    // In a real app, you would implement file uploads to Firebase Storage
    toast.info(`File upload for ${type} would happen here`);
  };
  
  return (
    <div className="dashboard-layout">
      <SideNav className="dashboard-sidebar" />
      
      <DashboardHeader title="Shop Profile" />
      
      <main className="dashboard-main p-6 overflow-y-auto bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <Tabs defaultValue="profile" className="animate-fade-in">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="profile">Shop Profile</TabsTrigger>
              <TabsTrigger value="security">Security & Settings</TabsTrigger>
            </TabsList>
            
            <TabsContent value="profile" className="mt-6 space-y-6">
              {/* Shop Banner & Logo */}
              <Card>
                <CardHeader>
                  <CardTitle>Shop Appearance</CardTitle>
                  <CardDescription>
                    Customize how your shop appears to customers
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Banner */}
                  <div>
                    <Label className="mb-2 block">Shop Banner</Label>
                    <div 
                      className="h-40 w-full rounded-lg overflow-hidden bg-gray-100 relative mb-4 group"
                      style={{
                        backgroundImage: profile.bannerUrl ? `url(${profile.bannerUrl})` : 'none',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                      }}
                    >
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <Button 
                          variant="secondary" 
                          onClick={() => handleFileUpload('banner')}
                          className="gap-2"
                        >
                          <Upload className="h-4 w-4" />
                          Upload Banner
                        </Button>
                      </div>
                      {!profile.bannerUrl && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <p className="text-gray-500">No banner uploaded</p>
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Recommended size: 1200 × 300 pixels
                    </p>
                  </div>
                  
                  {/* Logo */}
                  <div>
                    <Label className="mb-2 block">Shop Logo</Label>
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-24 w-24 border-2 border-picknpay-purple relative group">
                        <AvatarImage src={profile.logoUrl} alt={profile.name} />
                        <AvatarFallback className="bg-picknpay-purple-light text-picknpay-purple text-2xl">
                          {profile.name.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 rounded-full transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleFileUpload('logo')}
                            className="h-10 w-10 rounded-full bg-white/80 text-picknpay-purple hover:bg-white"
                          >
                            <Camera className="h-5 w-5" />
                          </Button>
                        </div>
                      </Avatar>
                      <div>
                        <p className="font-medium mb-1">Shop Logo</p>
                        <p className="text-sm text-muted-foreground mb-2">
                          Square image, at least 400×400 pixels
                        </p>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleFileUpload('logo')}
                          className="gap-1"
                        >
                          <Upload className="h-4 w-4" />
                          Upload
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Shop Details */}
              <Card>
                <CardHeader>
                  <CardTitle>Shop Details</CardTitle>
                  <CardDescription>
                    Update your shop information
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Shop Name</Label>
                      <Input 
                        id="name" 
                        name="name"
                        value={profile.name}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="ownerName">Owner Name</Label>
                      <Input 
                        id="ownerName" 
                        name="ownerName"
                        value={profile.ownerName}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input 
                        id="email" 
                        name="email"
                        type="email"
                        value={profile.email}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input 
                        id="phone" 
                        name="phone"
                        value={profile.phone}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="shopType">Shop Type</Label>
                      <Select 
                        value={profile.shopType} 
                        onValueChange={handleShopTypeChange}
                      >
                        <SelectTrigger id="shopType">
                          <SelectValue placeholder="Select shop type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Grocery">Grocery</SelectItem>
                          <SelectItem value="Vegetables">Vegetables</SelectItem>
                          <SelectItem value="Medical">Medical</SelectItem>
                          <SelectItem value="All Items">All Items</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="pinCode">PIN Code</Label>
                      <Input 
                        id="pinCode" 
                        name="pinCode"
                        value={profile.pinCode}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="address">Full Address</Label>
                    <Textarea 
                      id="address" 
                      name="address"
                      value={profile.address || ''}
                      onChange={handleInputChange}
                      placeholder="Enter your complete shop address"
                      rows={2}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="description">Shop Description</Label>
                    <Textarea 
                      id="description" 
                      name="description"
                      value={profile.description || ''}
                      onChange={handleInputChange}
                      placeholder="Tell customers about your shop"
                      rows={4}
                    />
                  </div>
                  
                  <div className="flex items-center space-x-2 pt-2">
                    <Switch 
                      id="pickup" 
                      checked={profile.pickupAvailable}
                      onCheckedChange={handlePickupAvailableChange}
                    />
                    <Label htmlFor="pickup">Store Pickup Available</Label>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    onClick={handleUpdateProfile}
                    disabled={isLoading}
                    className="bg-picknpay-purple hover:bg-picknpay-purple-dark ml-auto"
                  >
                    {isLoading ? 'Saving...' : 'Save Changes'}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="security" className="mt-6 space-y-6">
              {/* Password Change */}
              <Card>
                <CardHeader>
                  <CardTitle>Change Password</CardTitle>
                  <CardDescription>
                    Update your password to keep your account secure
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <Input 
                      id="currentPassword" 
                      type="password" 
                      placeholder="••••••••"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input 
                      id="newPassword" 
                      type="password" 
                      placeholder="••••••••"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <Input 
                      id="confirmPassword" 
                      type="password" 
                      placeholder="••••••••"
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    className="bg-picknpay-purple hover:bg-picknpay-purple-dark ml-auto"
                  >
                    Update Password
                  </Button>
                </CardFooter>
              </Card>
              
              {/* Account Settings */}
              <Card>
                <CardHeader>
                  <CardTitle>Account Settings</CardTitle>
                  <CardDescription>
                    Manage your account preferences
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive email notifications for new orders
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Push Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive push notifications for order updates
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Two-Factor Authentication</Label>
                      <p className="text-sm text-muted-foreground">
                        Add an extra layer of security to your account
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      Setup
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              {/* Data Export */}
              <Card>
                <CardHeader>
                  <CardTitle>Data & Privacy</CardTitle>
                  <CardDescription>
                    Manage your data and privacy settings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Export Shop Data</Label>
                      <p className="text-sm text-muted-foreground">
                        Download a copy of your shop data
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      Export
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-red-500">Delete Account</Label>
                      <p className="text-sm text-muted-foreground">
                        Permanently delete your account and data
                      </p>
                    </div>
                    <Button variant="destructive" size="sm">
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Profile;
