import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { mockUsers, mockBrands } from "@/data/mockData";
import { Users, Settings, Save, UserPlus } from "lucide-react";

const AdminConsole = () => {
  const [selectedUser, setSelectedUser] = useState<string>("");
  const [userBrandAssignments, setUserBrandAssignments] = useState<Record<string, string[]>>({
    'user-1': ['brand-a'],
    'admin-1': ['brand-a', 'brand-b']
  });

  const handleBrandToggle = (userId: string, brandId: string) => {
    setUserBrandAssignments(prev => ({
      ...prev,
      [userId]: prev[userId]?.includes(brandId)
        ? prev[userId].filter(id => id !== brandId)
        : [...(prev[userId] || []), brandId]
    }));
  };

  const saveAssignments = (userId: string) => {
    alert(`Saved brand assignments for user ${userId}`);
  };

  const getBrandName = (brandId: string) => {
    return mockBrands.find(b => b.id === brandId)?.name || brandId;
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Admin Console</h1>
          <p className="text-muted-foreground">Manage users and system configuration</p>
        </div>
      </div>

      {/* User Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            User Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Assigned Brands</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge variant={user.role === 'admin' ? 'destructive' : 'secondary'}>
                      {user.role.toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {(userBrandAssignments[user.id] || user.assignedBrands).map(brandId => (
                        <Badge key={brandId} variant="outline">
                          {getBrandName(brandId)}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => setSelectedUser(user.id)}
                        >
                          <Settings className="w-4 h-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Manage Brand Assignment - {user.name}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <p className="text-sm text-muted-foreground mb-3">
                              Select which brands this user can access and manage FAQs for:
                            </p>
                            <div className="space-y-3">
                              {mockBrands.map(brand => (
                                <div key={brand.id} className="flex items-start space-x-3">
                                  <Checkbox
                                    id={`${user.id}-${brand.id}`}
                                    checked={(userBrandAssignments[user.id] || user.assignedBrands).includes(brand.id)}
                                    onCheckedChange={() => handleBrandToggle(user.id, brand.id)}
                                  />
                                  <div className="flex-1">
                                    <label 
                                      htmlFor={`${user.id}-${brand.id}`}
                                      className="font-medium cursor-pointer"
                                    >
                                      {brand.name}
                                    </label>
                                    <p className="text-sm text-muted-foreground">
                                      Channels: {brand.channels.join(', ')}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                          <div className="flex justify-end gap-2">
                            <Button variant="outline">Cancel</Button>
                            <Button onClick={() => saveAssignments(user.id)} className="flex items-center gap-2">
                              <Save className="w-4 h-4" />
                              Save Assignment
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Brand Configuration */}
      <Card>
        <CardHeader>
          <CardTitle>Brand Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Brand Name</TableHead>
                <TableHead>Available Channels</TableHead>
                <TableHead>Active FAQs</TableHead>
                <TableHead>Assigned Users</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockBrands.map((brand) => {
                const assignedUsers = mockUsers.filter(user => 
                  (userBrandAssignments[user.id] || user.assignedBrands).includes(brand.id)
                );
                return (
                  <TableRow key={brand.id}>
                    <TableCell className="font-medium">{brand.name}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {brand.channels.map(channel => (
                          <Badge key={channel} variant="secondary" className="text-xs">
                            {channel}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">3 FAQs</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {assignedUsers.map(user => (
                          <Badge key={user.id} variant="outline" className="text-xs">
                            {user.name}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        <Settings className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* System Settings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Publishing Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Auto-approve SIT publishes</p>
                <p className="text-sm text-muted-foreground">Automatically publish to SIT without approval</p>
              </div>
              <Checkbox defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Require PROD approval</p>
                <p className="text-sm text-muted-foreground">All PROD publishes require admin approval</p>
              </div>
              <Checkbox defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Enable duplicate detection</p>
                <p className="text-sm text-muted-foreground">Check for duplicates during FAQ creation</p>
              </div>
              <Checkbox defaultChecked />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Analytics Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="font-medium">Data retention period</label>
              <Select defaultValue="90">
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30">30 days</SelectItem>
                  <SelectItem value="90">90 days</SelectItem>
                  <SelectItem value="180">180 days</SelectItem>
                  <SelectItem value="365">1 year</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Query text masking</p>
                <p className="text-sm text-muted-foreground">Mask sensitive data in query logs</p>
              </div>
              <Checkbox defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Real-time analytics</p>
                <p className="text-sm text-muted-foreground">Enable real-time dashboard updates</p>
              </div>
              <Checkbox defaultChecked />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-4">
        <Button variant="outline">Export Users</Button>
        <Button className="flex items-center gap-2">
          <UserPlus className="w-4 h-4" />
          Add New User
        </Button>
      </div>
    </div>
  );
};

export default AdminConsole;