
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Upload, Filter } from 'lucide-react';

const API_URL = 'http://localhost:7000/api';

interface Teacher {
  _id: string;
  id: string;
  name: string;
  email: string;
  phone: string;
  schoolId: string;
  subjects: string[];
  status: string;
  createdAt: string;
}

interface School {
  _id: string;
  id: string;
  name: string;
}

const Teachers: React.FC = () => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [schools, setSchools] = useState<School[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    id: '', name: '', email: '', phone: '', password: '', schoolId: '', subjects: '', status: 'active'
  });
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState('');
  const [bulkFile, setBulkFile] = useState<File | null>(null);
  const [filterSchool, setFilterSchool] = useState('');

  useEffect(() => {
    fetchTeachers();
    fetchSchools();
  }, []);

  const fetchTeachers = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/teachers`);
      setTeachers(response.data);
    } catch (error) {
      toast.error('Failed to fetch teachers');
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
    setFormData({ id: '', name: '', email: '', phone: '', password: '', schoolId: '', subjects: '', status: 'active' });
    setIsEditing(false);
    setCurrentId('');
  };

  const handleSubmit = async (e: React.FormEvent, close: () => void) => {
    e.preventDefault();
    try {
      const submitData = {
        ...formData,
        subjects: formData.subjects.split(',').map(s => s.trim()).filter(s => s)
      };
      
      if (isEditing) {
        const { password, ...updateData } = submitData;
        await axios.put(`${API_URL}/teachers/${currentId}`, updateData);
        toast.success('Teacher updated');
      } else {
        await axios.post(`${API_URL}/teachers`, submitData);
        toast.success('Teacher created');
      }
      fetchTeachers();
      resetForm();
      close();
    } catch {
      toast.error('Failed to save teacher');
    }
  };

  const handleEdit = (teacher: Teacher) => {
    setFormData({
      id: teacher.id,
      name: teacher.name,
      email: teacher.email,
      phone: teacher.phone,
      password: '',
      schoolId: teacher.schoolId,
      subjects: teacher.subjects.join(', '),
      status: teacher.status,
    });
    setIsEditing(true);
    setCurrentId(teacher.id);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this teacher?')) return;
    try {
      await axios.delete(`${API_URL}/teachers/${id}`);
      fetchTeachers();
      toast.success('Teacher deleted');
    } catch {
      toast.error('Failed to delete teacher');
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
      await axios.post(`${API_URL}/teachers/bulk-upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.success('Teachers uploaded successfully');
      fetchTeachers();
      setBulkFile(null);
    } catch {
      toast.error('Failed to upload teachers');
    }
  };

  const getSchoolName = (schoolId: string) => {
    const school = schools.find(s => s._id === schoolId || s.id === schoolId);
    return school ? school.name : schoolId;
  };

  const filteredTeachers = filterSchool 
    ? teachers.filter(teacher => teacher.schoolId === filterSchool)
    : teachers;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Teachers</h1>
        <div className="flex gap-2">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            <select 
              value={filterSchool} 
              onChange={(e) => setFilterSchool(e.target.value)}
              className="border rounded-md px-3 py-2"
            >
              <option value="">All Schools</option>
              {schools.map(school => (
                <option value={school._id} key={school._id}>{school.name}</option>
              ))}
            </select>
          </div>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Upload className="mr-2 h-4 w-4" />
                Bulk Upload
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Bulk Upload Teachers</DialogTitle>
                <DialogDescription>
                  Upload an Excel file to create multiple teachers at once
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
              <Button onClick={resetForm}>Add Teacher</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>{isEditing ? 'Edit Teacher' : 'Add Teacher'}</DialogTitle>
                <DialogDescription>
                  {isEditing ? 'Update teacher details' : 'Enter details for new teacher'}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={e => {
                const closeButton = document.querySelector('[data-dialog-close]') as HTMLElement;
                handleSubmit(e, () => closeButton?.click());
              }}>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="id" className="text-right">Teacher ID</Label>
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
                    <Label htmlFor="subjects" className="text-right">Subjects</Label>
                    <Input id="subjects" name="subjects" value={formData.subjects} onChange={handleChange} className="col-span-3" placeholder="Math, Science, English (comma separated)" required />
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
          {filteredTeachers.length ? (
            filteredTeachers.map(teacher => (
              <Card key={teacher._id} className="overflow-hidden">
                <CardHeader>
                  <CardTitle>{teacher.name}</CardTitle>
                  <CardDescription>{teacher.id}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <p><strong>Email:</strong> {teacher.email}</p>
                    <p><strong>Phone:</strong> {teacher.phone}</p>
                    <p><strong>School:</strong> {getSchoolName(teacher.schoolId)}</p>
                    <p><strong>Subjects:</strong> {teacher.subjects.join(', ')}</p>
                    <p><strong>Status:</strong> <span className={`px-2 py-1 rounded text-xs ${teacher.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{teacher.status}</span></p>
                    <p><strong>Created:</strong> {new Date(teacher.createdAt).toLocaleDateString()}</p>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" onClick={() => handleEdit(teacher)}>Edit</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Edit Teacher</DialogTitle>
                        <DialogDescription>Update teacher details</DialogDescription>
                      </DialogHeader>
                      <form onSubmit={e => {
                        const closeButton = document.querySelector('[data-dialog-close]') as HTMLElement;
                        handleSubmit(e, () => closeButton?.click());
                      }}>
                        <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="id" className="text-right">Teacher ID</Label>
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
                            <Label htmlFor="subjects" className="text-right">Subjects</Label>
                            <Input id="subjects" name="subjects" value={formData.subjects} onChange={handleChange} className="col-span-3" placeholder="Math, Science, English (comma separated)" required />
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
                  <Button variant="destructive" onClick={() => handleDelete(teacher.id)}>Delete</Button>
                </CardFooter>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center py-8">
              <p className="text-lg text-gray-500">No teachers found</p>
              <p className="text-sm text-gray-400">Create your first teacher to get started</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Teachers;
