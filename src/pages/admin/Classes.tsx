
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';

const API_URL = 'http://localhost:7000/api';

interface ClassType {
  _id: string;
  id: string;
  name: string;
  course: string; // course id as string
}

const Classes: React.FC = () => {
  const [classes, setClasses] = useState<ClassType[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ id: '', name: '', course: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState('');

  useEffect(() => {
    fetchClasses();
    fetchCourses();
  }, []);

  const fetchClasses = async () => {
    setLoading(true);
    try {
      // Fetch all classes (need to support filter if you want per course)
      const response = await axios.get(`${API_URL}/classes`);
      setClasses(response.data);
    } catch (error) {
      toast.error('Failed to fetch classes');
    } finally {
      setLoading(false);
    }
  };

  const fetchCourses = async () => {
    try {
      const response = await axios.get(`${API_URL}/courses`);
      setCourses(response.data);
    } catch {}
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData({ id: '', name: '', course: '' });
    setIsEditing(false);
    setCurrentId('');
  };

  const handleSubmit = async (e: React.FormEvent, close: () => void) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await axios.put(`${API_URL}/classes/${currentId}`, formData);
        toast.success('Class updated');
      } else {
        await axios.post(`${API_URL}/classes`, formData);
        toast.success('Class created');
      }
      fetchClasses();
      resetForm();
      close();
    } catch {
      toast.error('Failed to save class');
    }
  };

  const handleEdit = (classObj: ClassType) => {
    setFormData({
      id: classObj.id,
      name: classObj.name,
      course: classObj.course,
    });
    setIsEditing(true);
    setCurrentId(classObj.id);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this class?')) return;
    try {
      await axios.delete(`${API_URL}/classes/${id}`);
      fetchClasses();
      toast.success('Class deleted');
    } catch {
      toast.error('Failed to delete class');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Classes</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>Add Class</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{isEditing ? 'Edit Class' : 'Add Class'}</DialogTitle>
              <DialogDescription>
                {isEditing ? 'Update class details' : 'Enter details for new class'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={e => {
              const closeButton = document.querySelector('[data-dialog-close]') as HTMLElement;
              handleSubmit(e, () => closeButton?.click());
            }}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="id" className="text-right">ID</Label>
                  <Input
                    id="id"
                    name="id"
                    value={formData.id}
                    onChange={handleChange}
                    className="col-span-3"
                    required
                    readOnly={isEditing}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="course" className="text-right">Course</Label>
                  <select
                    id="course"
                    name="course"
                    value={formData.course}
                    onChange={handleChange}
                    className="col-span-3 border rounded-md min-h-[40px] px-3"
                    required
                  >
                    <option value="">Select a course</option>
                    {courses.map(c => (
                      <option value={c._id} key={c._id}>{c.name}</option>
                    ))}
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
          {classes.length ? (
            classes.map(cls => (
              <Card key={cls._id} className="overflow-hidden">
                <CardHeader>
                  <CardTitle>{cls.name}</CardTitle>
                  <CardDescription>{cls.id}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">
                    <strong>Course ID:</strong> {cls.course}
                  </p>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" onClick={() => handleEdit(cls)}>Edit</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Edit Class</DialogTitle>
                        <DialogDescription>Update class details</DialogDescription>
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
                            <Label htmlFor="course" className="text-right">Course</Label>
                            <select id="course" name="course" value={formData.course} onChange={handleChange} className="col-span-3 border rounded-md min-h-[40px] px-3" required>
                              <option value="">Select a course</option>
                              {courses.map(c => <option value={c._id} key={c._id}>{c.name}</option>)}
                            </select>
                          </div>
                        </div>
                        <DialogFooter>
                          <Button type="submit">Update</Button>
                        </DialogFooter>
                      </form>
                    </DialogContent>
                  </Dialog>
                  <Button variant="destructive" onClick={() => handleDelete(cls.id)}>Delete</Button>
                </CardFooter>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center py-8">
              <p className="text-lg text-gray-500">No classes found</p>
              <p className="text-sm text-gray-400">Create your first class to get started</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Classes;

