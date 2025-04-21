
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';

const API_URL = 'http://localhost:7000/api';

interface SubjectType {
  _id: string;
  id: string;
  name: string;
  icon: string;
  color: string;
  description: string;
  class: string; // class id as string
}

const Subjects: React.FC = () => {
  const [subjects, setSubjects] = useState<SubjectType[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ id: '', name: '', icon: '', color: '', description: '', class: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState('');

  useEffect(() => {
    fetchSubjects();
    fetchClasses();
  }, []);

  const fetchSubjects = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/subjects`);
      setSubjects(response.data);
    } catch {
      toast.error('Failed to fetch subjects');
    } finally {
      setLoading(false);
    }
  };

  const fetchClasses = async () => {
    try {
      const response = await axios.get(`${API_URL}/classes`);
      setClasses(response.data);
    } catch {}
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData({ id: '', name: '', icon: '', color: '', description: '', class: '' });
    setIsEditing(false);
    setCurrentId('');
  };

  const handleSubmit = async (e: React.FormEvent, close: () => void) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await axios.put(`${API_URL}/subjects/${currentId}`, formData);
        toast.success('Subject updated');
      } else {
        await axios.post(`${API_URL}/subjects`, formData);
        toast.success('Subject created');
      }
      fetchSubjects();
      resetForm();
      close();
    } catch {
      toast.error('Failed to save subject');
    }
  };

  const handleEdit = (subject: SubjectType) => {
    setFormData({
      id: subject.id,
      name: subject.name,
      icon: subject.icon,
      color: subject.color,
      description: subject.description,
      class: subject.class,
    });
    setIsEditing(true);
    setCurrentId(subject.id);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this subject?')) return;
    try {
      await axios.delete(`${API_URL}/subjects/${id}`);
      fetchSubjects();
      toast.success('Subject deleted');
    } catch {
      toast.error('Failed to delete subject');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Subjects</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>Add Subject</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{isEditing ? 'Edit Subject' : 'Add Subject'}</DialogTitle>
              <DialogDescription>{isEditing ? 'Update details' : 'Enter subject details'}</DialogDescription>
            </DialogHeader>
            <form onSubmit={e => {
              const closeButton = document.querySelector('[data-dialog-close]') as HTMLElement;
              handleSubmit(e, () => closeButton?.click());
            }}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="id" className="text-right">ID</Label>
                  <Input id="id" name="id" value={formData.id} onChange={handleChange} className="col-span-3" required readOnly={isEditing} />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">Name</Label>
                  <Input id="name" name="name" value={formData.name} onChange={handleChange} className="col-span-3" required />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="icon" className="text-right">Icon</Label>
                  <Input id="icon" name="icon" value={formData.icon} onChange={handleChange} className="col-span-3" required />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="color" className="text-right">Color</Label>
                  <Input id="color" name="color" value={formData.color} onChange={handleChange} className="col-span-3" required />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="description" className="text-right">Description</Label>
                  <Input id="description" name="description" value={formData.description} onChange={handleChange} className="col-span-3" required />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="class" className="text-right">Class</Label>
                  <select id="class" name="class" value={formData.class} onChange={handleChange} className="col-span-3 border rounded-md min-h-[40px] px-3" required>
                    <option value="">Select a class</option>
                    {classes.map(c => <option value={c._id} key={c._id}>{c.name}</option>)}
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
      {loading ? (
        <div className="flex justify-center py-8"><div className="w-10 h-10 border-4 border-primary border-solid rounded-full border-t-transparent animate-spin"></div></div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {subjects.length ? (
            subjects.map(subject => (
              <Card key={subject._id} className="overflow-hidden">
                <CardHeader>
                  <CardTitle>{subject.name}</CardTitle>
                  <CardDescription>{subject.id}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-sm"><strong>Icon:</strong> {subject.icon}</div>
                  <div className="text-sm"><strong>Color:</strong> {subject.color}</div>
                  <div className="text-sm"><strong>Description:</strong> {subject.description}</div>
                  <div className="text-sm"><strong>Class ID:</strong> {subject.class}</div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" onClick={() => handleEdit(subject)}>Edit</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Edit Subject</DialogTitle>
                        <DialogDescription>Update subject details</DialogDescription>
                      </DialogHeader>
                      <form onSubmit={e => {
                        const closeButton = document.querySelector('[data-dialog-close]') as HTMLElement;
                        handleSubmit(e, () => closeButton?.click());
                      }}>
                        <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="id" className="text-right">ID</Label>
                            <Input id="id" name="id" value={formData.id} className="col-span-3" readOnly />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">Name</Label>
                            <Input id="name" name="name" value={formData.name} onChange={handleChange} className="col-span-3" required />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="icon" className="text-right">Icon</Label>
                            <Input id="icon" name="icon" value={formData.icon} onChange={handleChange} className="col-span-3" required />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="color" className="text-right">Color</Label>
                            <Input id="color" name="color" value={formData.color} onChange={handleChange} className="col-span-3" required />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="description" className="text-right">Description</Label>
                            <Input id="description" name="description" value={formData.description} onChange={handleChange} className="col-span-3" required />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="class" className="text-right">Class</Label>
                            <select id="class" name="class" value={formData.class} onChange={handleChange} className="col-span-3 border rounded-md min-h-[40px] px-3" required>
                              <option value="">Select a class</option>
                              {classes.map(c => <option value={c._id} key={c._id}>{c.name}</option>)}
                            </select>
                          </div>
                        </div>
                        <DialogFooter>
                          <Button type="submit">Update</Button>
                        </DialogFooter>
                      </form>
                    </DialogContent>
                  </Dialog>
                  <Button variant="destructive" onClick={() => handleDelete(subject.id)}>Delete</Button>
                </CardFooter>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center py-8">
              <p className="text-lg text-gray-500">No subjects found</p>
              <p className="text-sm text-gray-400">Create your first subject to get started</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Subjects;

