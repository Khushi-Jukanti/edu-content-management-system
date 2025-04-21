
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';

const API_URL = 'http://localhost:7000/api';

interface ChapterType {
  _id: string;
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  subject: string;
}

const Chapters: React.FC = () => {
  const [chapters, setChapters] = useState<ChapterType[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ id: '', name: '', description: '', thumbnail: '', subject: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState('');

  useEffect(() => {
    fetchChapters();
    fetchSubjects();
  }, []);

  const fetchChapters = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/chapters`);
      setChapters(response.data);
    } catch {
      toast.error('Failed to fetch chapters');
    } finally {
      setLoading(false);
    }
  };

  const fetchSubjects = async () => {
    try {
      const response = await axios.get(`${API_URL}/subjects`);
      setSubjects(response.data);
    } catch {}
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData({ id: '', name: '', description: '', thumbnail: '', subject: '' });
    setIsEditing(false);
    setCurrentId('');
  };

  const handleSubmit = async (e: React.FormEvent, close: () => void) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await axios.put(`${API_URL}/chapters/${currentId}`, formData);
        toast.success('Chapter updated');
      } else {
        await axios.post(`${API_URL}/chapters`, formData);
        toast.success('Chapter created');
      }
      fetchChapters();
      resetForm();
      close();
    } catch {
      toast.error('Failed to save chapter');
    }
  };

  const handleEdit = (chapter: ChapterType) => {
    setFormData({
      id: chapter.id,
      name: chapter.name,
      description: chapter.description,
      thumbnail: chapter.thumbnail,
      subject: chapter.subject,
    });
    setIsEditing(true);
    setCurrentId(chapter.id);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this chapter?')) return;
    try {
      await axios.delete(`${API_URL}/chapters/${id}`);
      fetchChapters();
      toast.success('Chapter deleted');
    } catch {
      toast.error('Failed to delete chapter');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Chapters</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>Add Chapter</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{isEditing ? 'Edit Chapter' : 'Add Chapter'}</DialogTitle>
              <DialogDescription>{isEditing ? 'Update details' : 'Enter chapter details'}</DialogDescription>
            </DialogHeader>
            <form onSubmit={e => {
              const closeButton = document.querySelector('[data-dialog-close]') as HTMLElement;
              handleSubmit(e, () => closeButton?.click());
            }}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="id" className="text-right">ID</Label>
                  <Input id="id" name="id" value={formData.id} onChange={handleChange} className="col-span-3" required readOnly={isEditing}/>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">Name</Label>
                  <Input id="name" name="name" value={formData.name} onChange={handleChange} className="col-span-3" required />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="description" className="text-right">Description</Label>
                  <Input id="description" name="description" value={formData.description} onChange={handleChange} className="col-span-3" required />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="thumbnail" className="text-right">Thumbnail</Label>
                  <Input id="thumbnail" name="thumbnail" value={formData.thumbnail} onChange={handleChange} className="col-span-3" required />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="subject" className="text-right">Subject</Label>
                  <select id="subject" name="subject" value={formData.subject} onChange={handleChange} className="col-span-3 border rounded-md min-h-[40px] px-3" required>
                    <option value="">Select a subject</option>
                    {subjects.map(s => <option value={s._id} key={s._id}>{s.name}</option>)}
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
          {chapters.length ? (
            chapters.map(chapter => (
              <Card key={chapter._id} className="overflow-hidden">
                <CardHeader>
                  <CardTitle>{chapter.name}</CardTitle>
                  <CardDescription>{chapter.id}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-sm"><strong>Description:</strong> {chapter.description}</div>
                  <div className="text-sm"><strong>Thumbnail:</strong> {chapter.thumbnail}</div>
                  <div className="text-sm"><strong>Subject ID:</strong> {chapter.subject}</div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" onClick={() => handleEdit(chapter)}>Edit</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Edit Chapter</DialogTitle>
                        <DialogDescription>Update chapter details</DialogDescription>
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
                            <Label htmlFor="description" className="text-right">Description</Label>
                            <Input id="description" name="description" value={formData.description} onChange={handleChange} className="col-span-3" required />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="thumbnail" className="text-right">Thumbnail</Label>
                            <Input id="thumbnail" name="thumbnail" value={formData.thumbnail} onChange={handleChange} className="col-span-3" required />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="subject" className="text-right">Subject</Label>
                            <select id="subject" name="subject" value={formData.subject} onChange={handleChange} className="col-span-3 border rounded-md min-h-[40px] px-3" required>
                              <option value="">Select a subject</option>
                              {subjects.map(s => <option value={s._id} key={s._id}>{s.name}</option>)}
                            </select>
                          </div>
                        </div>
                        <DialogFooter>
                          <Button type="submit">Update</Button>
                        </DialogFooter>
                      </form>
                    </DialogContent>
                  </Dialog>
                  <Button variant="destructive" onClick={() => handleDelete(chapter.id)}>Delete</Button>
                </CardFooter>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center py-8">
              <p className="text-lg text-gray-500">No chapters found</p>
              <p className="text-sm text-gray-400">Create your first chapter to get started</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Chapters;
