
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

interface School {
  _id: string;
  id: string;
  name: string;
  address: string;
  contactEmail: string;
  contactPhone: string;
  principalName: string;
  status: string;
}

const Schools: React.FC = () => {
  const [schools, setSchools] = useState<School[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    id: '', name: '', address: '', contactEmail: '', contactPhone: '', principalName: '', status: 'active'
  });
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState('');
  const [bulkFile, setBulkFile] = useState<File | null>(null);

  useEffect(() => {
    fetchSchools();
  }, []);

  const fetchSchools = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/schools`);
      setSchools(response.data);
    } catch (error) {
      toast.error('Failed to fetch schools');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData({ id: '', name: '', address: '', contactEmail: '', contactPhone: '', principalName: '', status: 'active' });
    setIsEditing(false);
    setCurrentId('');
  };

  const handleSubmit = async (e: React.FormEvent, close: () => void) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await axios.put(`${API_URL}/schools/${currentId}`, formData);
        toast.success('School updated');
      } else {
        await axios.post(`${API_URL}/schools`, formData);
        toast.success('School created');
      }
      fetchSchools();
      resetForm();
      close();
    } catch {
      toast.error('Failed to save school');
    }
  };

  const handleEdit = (school: School) => {
    setFormData({
      id: school.id,
      name: school.name,
      address: school.address,
      contactEmail: school.contactEmail,
      contactPhone: school.contactPhone,
      principalName: school.principalName,
      status: school.status,
    });
    setIsEditing(true);
    setCurrentId(school.id);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this school?')) return;
    try {
      await axios.delete(`${API_URL}/schools/${id}`);
      fetchSchools();
      toast.success('School deleted');
    } catch {
      toast.error('Failed to delete school');
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
      await axios.post(`${API_URL}/schools/bulk-upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.success('Schools uploaded successfully');
      fetchSchools();
      setBulkFile(null);
    } catch {
      toast.error('Failed to upload schools');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Schools</h1>
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
                <DialogTitle>Bulk Upload Schools</DialogTitle>
                <DialogDescription>
                  Upload an Excel file to create multiple schools at once
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
              <Button onClick={resetForm}>Add School</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>{isEditing ? 'Edit School' : 'Add School'}</DialogTitle>
                <DialogDescription>
                  {isEditing ? 'Update school details' : 'Enter details for new school'}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={e => {
                const closeButton = document.querySelector('[data-dialog-close]') as HTMLElement;
                handleSubmit(e, () => closeButton?.click());
              }}>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="id" className="text-right">School ID</Label>
                    <Input id="id" name="id" value={formData.id} onChange={handleChange} className="col-span-3" required readOnly={isEditing} />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">Name</Label>
                    <Input id="name" name="name" value={formData.name} onChange={handleChange} className="col-span-3" required />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="address" className="text-right">Address</Label>
                    <Input id="address" name="address" value={formData.address} onChange={handleChange} className="col-span-3" required />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="contactEmail" className="text-right">Email</Label>
                    <Input id="contactEmail" name="contactEmail" type="email" value={formData.contactEmail} onChange={handleChange} className="col-span-3" required />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="contactPhone" className="text-right">Phone</Label>
                    <Input id="contactPhone" name="contactPhone" value={formData.contactPhone} onChange={handleChange} className="col-span-3" required />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="principalName" className="text-right">Principal</Label>
                    <Input id="principalName" name="principalName" value={formData.principalName} onChange={handleChange} className="col-span-3" required />
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
          {schools.length ? (
            schools.map(school => (
              <Card key={school._id} className="overflow-hidden">
                <CardHeader>
                  <CardTitle>{school.name}</CardTitle>
                  <CardDescription>{school.id}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <p><strong>Address:</strong> {school.address}</p>
                    <p><strong>Email:</strong> {school.contactEmail}</p>
                    <p><strong>Phone:</strong> {school.contactPhone}</p>
                    <p><strong>Principal:</strong> {school.principalName}</p>
                    <p><strong>Status:</strong> <span className={`px-2 py-1 rounded text-xs ${school.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{school.status}</span></p>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" onClick={() => handleEdit(school)}>Edit</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Edit School</DialogTitle>
                        <DialogDescription>Update school details</DialogDescription>
                      </DialogHeader>
                      <form onSubmit={e => {
                        const closeButton = document.querySelector('[data-dialog-close]') as HTMLElement;
                        handleSubmit(e, () => closeButton?.click());
                      }}>
                        <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="id" className="text-right">School ID</Label>
                            <Input id="id" name="id" value={formData.id} className="col-span-3" readOnly />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">Name</Label>
                            <Input id="name" name="name" value={formData.name} onChange={handleChange} className="col-span-3" required />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="address" className="text-right">Address</Label>
                            <Input id="address" name="address" value={formData.address} onChange={handleChange} className="col-span-3" required />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="contactEmail" className="text-right">Email</Label>
                            <Input id="contactEmail" name="contactEmail" type="email" value={formData.contactEmail} onChange={handleChange} className="col-span-3" required />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="contactPhone" className="text-right">Phone</Label>
                            <Input id="contactPhone" name="contactPhone" value={formData.contactPhone} onChange={handleChange} className="col-span-3" required />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="principalName" className="text-right">Principal</Label>
                            <Input id="principalName" name="principalName" value={formData.principalName} onChange={handleChange} className="col-span-3" required />
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
                  <Button variant="destructive" onClick={() => handleDelete(school.id)}>Delete</Button>
                </CardFooter>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center py-8">
              <p className="text-lg text-gray-500">No schools found</p>
              <p className="text-sm text-gray-400">Create your first school to get started</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Schools;
