
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Filter, RefreshCw, Eye } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

const API_URL = 'http://localhost:7000/api';

interface UserAction {
  _id: string;
  userId: string;
  userName: string;
  userRole: string;
  schoolId: string;
  schoolName: string;
  actionType: string;
  actionDetails: string;
  ipAddress: string;
  userAgent: string;
  timestamp: string;
  duration?: number;
}

interface ActionFilters {
  startDate: string;
  endDate: string;
  userRole: string;
  actionType: string;
  schoolId: string;
}

const UserActions: React.FC = () => {
  const [actions, setActions] = useState<UserAction[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<ActionFilters>({
    startDate: '',
    endDate: '',
    userRole: '',
    actionType: '',
    schoolId: ''
  });
  const [schools, setSchools] = useState<any[]>([]);
  const [selectedAction, setSelectedAction] = useState<UserAction | null>(null);

  const actionTypes = [
    'login', 'logout', 'create_user', 'update_user', 'delete_user', 
    'video_play', 'video_pause', 'video_complete', 'dashboard_access',
    'bulk_upload', 'user_access_granted', 'user_access_revoked'
  ];

  const userRoles = ['superadmin', 'schooladmin', 'teacher'];

  useEffect(() => {
    fetchActions();
    fetchSchools();
  }, []);

  const fetchActions = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
      
      const response = await axios.get(`${API_URL}/user-actions?${params.toString()}`);
      setActions(response.data);
    } catch (error) {
      toast.error('Failed to fetch user actions');
    } finally {
      setLoading(false);
    }
  };

  const fetchSchools = async () => {
    try {
      const response = await axios.get(`${API_URL}/schools`);
      setSchools(response.data);
    } catch {}
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const resetFilters = () => {
    setFilters({
      startDate: '',
      endDate: '',
      userRole: '',
      actionType: '',
      schoolId: ''
    });
  };

  const applyFilters = () => {
    fetchActions();
  };

  const getActionTypeColor = (actionType: string) => {
    const colors: { [key: string]: string } = {
      'login': 'bg-green-100 text-green-800',
      'logout': 'bg-red-100 text-red-800',
      'create_user': 'bg-blue-100 text-blue-800',
      'update_user': 'bg-yellow-100 text-yellow-800',
      'delete_user': 'bg-red-100 text-red-800',
      'video_play': 'bg-purple-100 text-purple-800',
      'video_pause': 'bg-orange-100 text-orange-800',
      'video_complete': 'bg-green-100 text-green-800',
      'dashboard_access': 'bg-gray-100 text-gray-800',
      'bulk_upload': 'bg-indigo-100 text-indigo-800',
      'user_access_granted': 'bg-green-100 text-green-800',
      'user_access_revoked': 'bg-red-100 text-red-800'
    };
    return colors[actionType] || 'bg-gray-100 text-gray-800';
  };

  const getRoleColor = (role: string) => {
    const colors: { [key: string]: string } = {
      'superadmin': 'bg-red-100 text-red-800',
      'schooladmin': 'bg-blue-100 text-blue-800',
      'teacher': 'bg-green-100 text-green-800'
    };
    return colors[role] || 'bg-gray-100 text-gray-800';
  };

  const formatDuration = (duration?: number) => {
    if (!duration) return 'N/A';
    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;
    return `${minutes}m ${seconds}s`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">User Actions</h1>
        <Button onClick={fetchActions} variant="outline">
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
          <CardDescription>Filter user actions by various criteria</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div>
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                name="startDate"
                type="date"
                value={filters.startDate}
                onChange={handleFilterChange}
              />
            </div>
            <div>
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                name="endDate"
                type="date"
                value={filters.endDate}
                onChange={handleFilterChange}
              />
            </div>
            <div>
              <Label htmlFor="userRole">User Role</Label>
              <select
                id="userRole"
                name="userRole"
                value={filters.userRole}
                onChange={handleFilterChange}
                className="w-full border rounded-md px-3 py-2"
              >
                <option value="">All Roles</option>
                {userRoles.map(role => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor="actionType">Action Type</Label>
              <select
                id="actionType"
                name="actionType"
                value={filters.actionType}
                onChange={handleFilterChange}
                className="w-full border rounded-md px-3 py-2"
              >
                <option value="">All Actions</option>
                {actionTypes.map(type => (
                  <option key={type} value={type}>{type.replace('_', ' ')}</option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor="schoolId">School</Label>
              <select
                id="schoolId"
                name="schoolId"
                value={filters.schoolId}
                onChange={handleFilterChange}
                className="w-full border rounded-md px-3 py-2"
              >
                <option value="">All Schools</option>
                {schools.map(school => (
                  <option key={school._id} value={school._id}>{school.name}</option>
                ))}
              </select>
            </div>
            <div className="flex items-end gap-2">
              <Button onClick={applyFilters}>Apply</Button>
              <Button onClick={resetFilters} variant="outline">Reset</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions Table */}
      <Card>
        <CardHeader>
          <CardTitle>User Actions ({actions.length})</CardTitle>
          <CardDescription>Complete log of all user activities</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="w-10 h-10 border-4 border-primary border-solid rounded-full border-t-transparent animate-spin"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>School</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Details</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>IP Address</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {actions.length ? (
                    actions.map(action => (
                      <TableRow key={action._id}>
                        <TableCell className="font-mono text-sm">
                          {new Date(action.timestamp).toLocaleString()}
                        </TableCell>
                        <TableCell className="font-medium">
                          {action.userName}
                        </TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded text-xs ${getRoleColor(action.userRole)}`}>
                            {action.userRole}
                          </span>
                        </TableCell>
                        <TableCell className="text-sm">
                          {action.schoolName || 'N/A'}
                        </TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded text-xs ${getActionTypeColor(action.actionType)}`}>
                            {action.actionType.replace('_', ' ')}
                          </span>
                        </TableCell>
                        <TableCell className="max-w-xs truncate text-sm">
                          {action.actionDetails}
                        </TableCell>
                        <TableCell className="text-sm">
                          {formatDuration(action.duration)}
                        </TableCell>
                        <TableCell className="font-mono text-sm">
                          {action.ipAddress}
                        </TableCell>
                        <TableCell>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => setSelectedAction(action)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>Action Details</DialogTitle>
                                <DialogDescription>
                                  Complete information about this user action
                                </DialogDescription>
                              </DialogHeader>
                              {selectedAction && (
                                <div className="space-y-4">
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <Label className="font-semibold">User</Label>
                                      <p>{selectedAction.userName}</p>
                                    </div>
                                    <div>
                                      <Label className="font-semibold">Role</Label>
                                      <p>{selectedAction.userRole}</p>
                                    </div>
                                    <div>
                                      <Label className="font-semibold">School</Label>
                                      <p>{selectedAction.schoolName || 'N/A'}</p>
                                    </div>
                                    <div>
                                      <Label className="font-semibold">Action Type</Label>
                                      <p>{selectedAction.actionType.replace('_', ' ')}</p>
                                    </div>
                                    <div>
                                      <Label className="font-semibold">Timestamp</Label>
                                      <p>{new Date(selectedAction.timestamp).toLocaleString()}</p>
                                    </div>
                                    <div>
                                      <Label className="font-semibold">IP Address</Label>
                                      <p>{selectedAction.ipAddress}</p>
                                    </div>
                                  </div>
                                  <div>
                                    <Label className="font-semibold">Action Details</Label>
                                    <p className="bg-gray-50 p-3 rounded-md text-sm">{selectedAction.actionDetails}</p>
                                  </div>
                                  <div>
                                    <Label className="font-semibold">User Agent</Label>
                                    <p className="bg-gray-50 p-3 rounded-md text-sm break-all">{selectedAction.userAgent}</p>
                                  </div>
                                  {selectedAction.duration && (
                                    <div>
                                      <Label className="font-semibold">Duration</Label>
                                      <p>{formatDuration(selectedAction.duration)}</p>
                                    </div>
                                  )}
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center py-8">
                        <p className="text-lg text-gray-500">No user actions found</p>
                        <p className="text-sm text-gray-400">Actions will appear here as users interact with the system</p>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default UserActions;
