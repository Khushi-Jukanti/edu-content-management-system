
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Upload } from 'lucide-react';

const API_URL = 'http://localhost:7000/api';

interface SchoolAdmin {
  _id: string;
  id: string;
  name: string;
  email: string;
  phone: string;
  schoolId: string;
  status: string;
  createdAt: string;
}

interface School {
  _id: string;
  id: string;
  name: string;
}

const SchoolAdmins: React.FC = () => {
  const [admins, setAdmins] = useState<SchoolAdmin[]>([]);
  const [schools, setSchools] = useState<School[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    id: '', name: '', email: '', phone: '', password: '', schoolId: '', status: 'active'
  });
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState('');
  const [bulkFile, setBulkFile] = useState<File | null>(null);

  useEffect(() => {
    fetchAdmins();
    fetchSchools();
  }, []);

  const fetchAdmins = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/school-admins`);
      setAdmins(response.data);
    } catch (error) {
      toast.error('Failed to fetch school admins');
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData({ id: '', name: '', email: '', phone: '', password: '', schoolId: '', status: 'active' });
    setIsEditing(false);
    setCurrentId('');
  };

  const handleSubmit = async (e: React.FormEvent, close: () => void) => {
    e.preventDefault();
    try {
      if (isEditing) {
        const { password, ...updateData } = formData;
        await axios.put(`${API_URL}/school-admins/${currentId}`, updateData);
        toast.success('School admin updated');
      } else {
        await axios.post(`${API_URL}/school-admins`, formData);
        toast.success('School admin created');
      }
      fetchAdmins();
      resetForm();
      close();
    } catch {
      toast.error('Failed to save school admin');
    }
  };

  const handleEdit = (admin: SchoolAdmin) => {
    setFormData({
      id: admin.id,
      name: admin.name,
      email: admin.email,
      phone: admin.phone,
      password: '',
      schoolId: admin.schoolId,
      status: admin.status,
    });
    setIsEditing(true);
    setCurrentId(admin.id);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this school admin?')) return;
    try {
      await axios.delete(`${API_URL}/school-admins/${id}`);
      fetchAdmins();
      toast.success('School admin deleted');
    } catch {
      toast.error('Failed to delete school admin');
    }
  };

  const handleBulkUpload = async () => {
    if (!bulkFile) {
      toast.error('Please select a file');
      return;
    }
    
    const formData = new FormData();
    formData.append('file', bulkFile);
    
    try {
      await axios.post(`${API_URL}/school-admins/bulk-upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.success('School admins uploaded successfully');
      fetchAdmins();
      setBulkFile(null);
    } catch {
      toast.error('Failed to upload school admins');
    }
  };

  const getSchoolName = (schoolId: string) => {
    const school = schools.find(s => s._id === schoolId || s.id === schoolId);
    return school ? school.name : schoolId;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">School Admins</h1>
        <div className="flex gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Upload className="mr-2 h-4 w-4" />
                Bulk Upload
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Bulk Upload School Admins</DialogTitle>
                <DialogDescription>
                  Upload an Excel file to create multiple school admins at once
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <Input
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={(e) => setBulkFile(e.target.files?.[0] || null)}
                />
                <DialogFooter>
                  <Button onClick={handleBulkUpload}>Upload</Button>
                </DialogFooter>
              </div>
            </DialogContent>
          </Dialog>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>Add School Admin</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>{isEditing ? 'Edit School Admin' : 'Add School Admin'}</DialogTitle>
                <DialogDescription>
                  {isEditing ? 'Update school admin details' : 'Enter details for new school admin'}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={e => {
                const closeButton = document.querySelector('[data-dialog-close]') as HTMLElement;
                handleSubmit(e, () => closeButton?.click());
              }}>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="id" className="text-right">Admin ID</Label>
                    <Input id="id" name="id" value={formData.id} onChange={handleChange} className="col-span-3" required readOnly={isEditing} />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">Name</Label>
                    <Input id="name" name="name" value={formData.name} onChange={handleChange} className="col-span-3" required />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="email" className="text-right">Email</Label>
                    <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} className="col-span-3" required />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="phone" className="text-right">Phone</Label>
                    <Input id="phone" name="phone" value={formData.phone} onChange={handleChange} className="col-span-3" required />
                  </div>
                  {!isEditing && (
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="password" className="text-right">Password</Label>
                      <Input id="password" name="password" type="password" value={formData.password} onChange={handleChange} className="col-span-3" required />
                    </div>
                  )}
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="schoolId" className="text-right">School</Label>
                    <select id="schoolId" name="schoolId" value={formData.schoolId} onChange={handleChange} className="col-span-3 border rounded-md min-h-[40px] px-3" required>
                      <option value="">Select a school</option>
                      {schools.map(school => (
                        <option value={school._id} key={school._id}>{school.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="status" className="text-right">Status</Label>
                    <select id="status" name="status" value={formData.status} onChange={handleChange} className="col-span-3 border rounded-md min-h-[40px] px-3" required>
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">{isEditing ? 'Update' : 'Create'}</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="w-10 h-10 border-4 border-primary border-solid rounded-full border-t-transparent animate-spin"></div>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {admins.length ? (
            admins.map(admin => (
              <Card key={admin._id} className="overflow-hidden">
                <CardHeader>
                  <CardTitle>{admin.name}</CardTitle>
                  <CardDescription>{admin.id}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <p><strong>Email:</strong> {admin.email}</p>
                    <p><strong>Phone:</strong> {admin.phone}</p>
                    <p><strong>School:</strong> {getSchoolName(admin.schoolId)}</p>
                    <p><strong>Status:</strong> <span className={`px-2 py-1 rounded text-xs ${admin.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{admin.status}</span></p>
                    <p><strong>Created:</strong> {new Date(admin.createdAt).toLocaleDateString()}</p>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" onClick={() => handleEdit(admin)}>Edit</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Edit School Admin</DialogTitle>
                        <DialogDescription>Update school admin details</DialogDescription>
                      </DialogHeader>
                      <form onSubmit={e => {
                        const closeButton = document.querySelector('[data-dialog-close]') as HTMLElement;
                        handleSubmit(e, () => closeButton?.click());
                      }}>
                        <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="id" className="text-right">Admin ID</Label>
                            <Input id="id" name="id" value={formData.id} className="col-span-3" readOnly />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">Name</Label>
                            <Input id="name" name="name" value={formData.name} onChange={handleChange} className="col-span-3" required />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="email" className="text-right">Email</Label>
                            <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} className="col-span-3" required />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="phone" className="text-right">Phone</Label>
                            <Input id="phone" name="phone" value={formData.phone} onChange={handleChange} className="col-span-3" required />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="schoolId" className="text-right">School</Label>
                            <select id="schoolId" name="schoolId" value={formData.schoolId} onChange={handleChange} className="col-span-3 border rounded-md min-h-[40px] px-3" required>
                              <option value="">Select a school</option>
                              {schools.map(school => (
                                <option value={school._id} key={school._id}>{school.name}</option>
                              ))}
                            </select>
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="status" className="text-right">Status</Label>
                            <select id="status" name="status" value={formData.status} onChange={handleChange} className="col-span-3 border rounded-md min-h-[40px] px-3" required>
                              <option value="active">Active</option>
                              <option value="inactive">Inactive</option>
                            </select>
                          </div>
                        </div>
                        <DialogFooter>
                          <Button type="submit">Update</Button>
                        </DialogFooter>
                      </form>
                    </DialogContent>
                  </Dialog>
                  <Button variant="destructive" onClick={() => handleDelete(admin.id)}>Delete</Button>
                </CardFooter>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center py-8">
              <p className="text-lg text-gray-500">No school admins found</p>
              <p className="text-sm text-gray-400">Create your first school admin to get started</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SchoolAdmins;
