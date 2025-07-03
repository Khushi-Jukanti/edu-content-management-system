
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Search, Filter } from 'lucide-react';

const UserActions: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState('all');
  const [userFilter, setUserFilter] = useState('all');

  // Mock user actions data for this school
  const userActions = [
    {
      id: 1,
      user: 'John Smith',
      userRole: 'teacher',
      action: 'login',
      details: 'Logged into system',
      timestamp: '2024-01-15 09:30:15',
      ipAddress: '192.168.1.100',
    },
    {
      id: 2,
      user: 'Sarah Johnson',
      userRole: 'teacher',
      action: 'video_play',
      details: 'Started video: Mathematics Class 1',
      timestamp: '2024-01-15 09:15:22',
      ipAddress: '192.168.1.101',
    },
    {
      id: 3,
      user: 'Mike Davis',
      userRole: 'teacher',
      action: 'video_complete',
      details: 'Completed video: Science Basics',
      timestamp: '2024-01-15 08:45:33',
      ipAddress: '192.168.1.102',
    },
    {
      id: 4,
      user: 'John Smith',
      userRole: 'teacher',
      action: 'logout',
      details: 'Logged out of system',
      timestamp: '2024-01-14 17:30:45',
      ipAddress: '192.168.1.100',
    },
    {
      id: 5,
      user: 'School Admin',
      userRole: 'schooladmin',
      action: 'user_create',
      details: 'Created new teacher: Emma Wilson',
      timestamp: '2024-01-14 14:20:10',
      ipAddress: '192.168.1.99',
    },
  ];

  const filteredActions = userActions.filter(action => {
    const matchesSearch = action.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         action.details.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesActionFilter = actionFilter === 'all' || action.action === actionFilter;
    const matchesUserFilter = userFilter === 'all' || action.userRole === userFilter;
    
    return matchesSearch && matchesActionFilter && matchesUserFilter;
  });

  const getActionBadgeColor = (action: string) => {
    switch (action) {
      case 'login':
        return 'bg-green-100 text-green-800';
      case 'logout':
        return 'bg-red-100 text-red-800';
      case 'video_play':
        return 'bg-blue-100 text-blue-800';
      case 'video_complete':
        return 'bg-purple-100 text-purple-800';
      case 'user_create':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'login':
        return '🔓';
      case 'logout':
        return '🔒';
      case 'video_play':
        return '▶️';
      case 'video_complete':
        return '✅';
      case 'user_create':
        return '👤';
      default:
        return '📋';
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">User Actions</h1>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold">{userActions.length}</div>
            <p className="text-sm text-muted-foreground">Total Actions</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-green-600">
              {userActions.filter(a => a.action === 'login').length}
            </div>
            <p className="text-sm text-muted-foreground">Login Actions</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-blue-600">
              {userActions.filter(a => a.action.includes('video')).length}
            </div>
            <p className="text-sm text-muted-foreground">Video Actions</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-purple-600">
              {userActions.filter(a => a.action === 'user_create').length}
            </div>
            <p className="text-sm text-muted-foreground">User Management</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search actions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Select value={actionFilter} onValueChange={setActionFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by action" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Actions</SelectItem>
                <SelectItem value="login">Login</SelectItem>
                <SelectItem value="logout">Logout</SelectItem>
                <SelectItem value="video_play">Video Play</SelectItem>
                <SelectItem value="video_complete">Video Complete</SelectItem>
                <SelectItem value="user_create">User Create</SelectItem>
              </SelectContent>
            </Select>
            <Select value={userFilter} onValueChange={setUserFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by user role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Users</SelectItem>
                <SelectItem value="teacher">Teachers</SelectItem>
                <SelectItem value="schooladmin">School Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Actions Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent User Actions</CardTitle>
          <CardDescription>
            Track all user activities in your school
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Details</TableHead>
                <TableHead>Timestamp</TableHead>
                <TableHead>IP Address</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredActions.map((action) => (
                <TableRow key={action.id}>
                  <TableCell className="font-medium">{action.user}</TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {action.userRole}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">{getActionIcon(action.action)}</span>
                      <Badge className={getActionBadgeColor(action.action)}>
                        {action.action.replace('_', ' ')}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell className="max-w-md truncate">
                    {action.details}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {action.timestamp}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {action.ipAddress}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserActions;
