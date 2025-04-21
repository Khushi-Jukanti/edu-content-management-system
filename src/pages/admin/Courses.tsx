
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
import { toast } from 'sonner';

// Base API URL - replace with your actual API URL
const API_URL = 'http://localhost:3000/api';

// Course type
interface Course {
  _id: string;
  id: string;
  name: string;
  description: string;
}

const Courses: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    description: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState('');

  // Fetch courses on component mount
  useEffect(() => {
    fetchCourses();
  }, []);

  // Fetch all courses
  const fetchCourses = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/courses`);
      setCourses(response.data);
    } catch (error) {
      console.error('Error fetching courses:', error);
      toast.error('Failed to fetch courses');
    } finally {
      setLoading(false);
    }
  };

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Reset form
  const resetForm = () => {
    setFormData({ id: '', name: '', description: '' });
    setIsEditing(false);
    setCurrentId('');
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent, close: () => void) => {
    e.preventDefault();
    
    try {
      if (isEditing) {
        await axios.put(`${API_URL}/courses/${currentId}`, formData);
        toast.success('Course updated successfully');
      } else {
        await axios.post(`${API_URL}/courses`, formData);
        toast.success('Course created successfully');
      }
      
      fetchCourses();
      resetForm();
      close();
    } catch (error) {
      console.error('Error saving course:', error);
      toast.error(isEditing ? 'Failed to update course' : 'Failed to create course');
    }
  };

  // Edit course
  const handleEdit = (course: Course) => {
    setFormData({
      id: course.id,
      name: course.name,
      description: course.description || '',
    });
    setIsEditing(true);
    setCurrentId(course.id);
  };

  // Delete course
  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this course?')) return;
    
    try {
      await axios.delete(`${API_URL}/courses/${id}`);
      fetchCourses();
      toast.success('Course deleted successfully');
    } catch (error) {
      console.error('Error deleting course:', error);
      toast.error('Failed to delete course');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Courses</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>Add Course</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{isEditing ? 'Edit Course' : 'Add Course'}</DialogTitle>
              <DialogDescription>
                {isEditing
                  ? 'Update the course details below'
                  : 'Enter the details for the new course'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={(e) => {
              const closeButton = document.querySelector('[data-dialog-close]') as HTMLElement;
              handleSubmit(e, () => closeButton?.click());
            }}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="id" className="text-right">
                    ID
                  </Label>
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
                  <Label htmlFor="name" className="text-right">
                    Name
                  </Label>
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
                  <Label htmlFor="description" className="text-right">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className="col-span-3"
                  />
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
        <div className="flex justify-center py-8">
          <div className="w-10 h-10 border-4 border-primary border-solid rounded-full border-t-transparent animate-spin"></div>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {courses.length > 0 ? (
            courses.map((course) => (
              <Card key={course._id} className="overflow-hidden">
                <CardHeader>
                  <CardTitle>{course.name}</CardTitle>
                  <CardDescription>{course.id}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">{course.description || 'No description'}</p>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" onClick={() => handleEdit(course)}>
                        Edit
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Edit Course</DialogTitle>
                        <DialogDescription>
                          Update the course details below
                        </DialogDescription>
                      </DialogHeader>
                      <form onSubmit={(e) => {
                        const closeButton = document.querySelector('[data-dialog-close]') as HTMLElement;
                        handleSubmit(e, () => closeButton?.click());
                      }}>
                        <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="id" className="text-right">
                              ID
                            </Label>
                            <Input
                              id="id"
                              name="id"
                              value={formData.id}
                              className="col-span-3"
                              readOnly
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">
                              Name
                            </Label>
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
                            <Label htmlFor="description" className="text-right">
                              Description
                            </Label>
                            <Textarea
                              id="description"
                              name="description"
                              value={formData.description}
                              onChange={handleChange}
                              className="col-span-3"
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button type="submit">Update</Button>
                        </DialogFooter>
                      </form>
                    </DialogContent>
                  </Dialog>
                  <Button 
                    variant="destructive" 
                    onClick={() => handleDelete(course.id)}
                  >
                    Delete
                  </Button>
                </CardFooter>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center py-8">
              <p className="text-lg text-gray-500">No courses found</p>
              <p className="text-sm text-gray-400">Create your first course to get started</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Courses;
