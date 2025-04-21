
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';

const API_URL = 'http://localhost:7000/api';

interface TopicType {
  _id: string;
  id: string;
  name: string;
  description: string;
  chapter: string;
}

const Topics: React.FC = () => {
  const [topics, setTopics] = useState<TopicType[]>([]);
  const [chapters, setChapters] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ id: '', name: '', description: '', chapter: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState('');

  useEffect(() => {
    fetchTopics();
    fetchChapters();
  }, []);

  const fetchTopics = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/topics`);
      setTopics(response.data);
    } catch {
      toast.error('Failed to fetch topics');
    } finally {
      setLoading(false);
    }
  };

  const fetchChapters = async () => {
    try {
      const response = await axios.get(`${API_URL}/chapters`);
      setChapters(response.data);
    } catch {}
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData({ id: '', name: '', description: '', chapter: '' });
    setIsEditing(false);
    setCurrentId('');
  };

  const handleSubmit = async (e: React.FormEvent, close: () => void) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await axios.put(`${API_URL}/topics/${currentId}`, formData);
        toast.success('Topic updated');
      } else {
        await axios.post(`${API_URL}/topics`, formData);
        toast.success('Topic created');
      }
      fetchTopics();
      resetForm();
      close();
    } catch {
      toast.error('Failed to save topic');
    }
  };

  const handleEdit = (topic: TopicType) => {
    setFormData({
      id: topic.id,
      name: topic.name,
      description: topic.description,
      chapter: topic.chapter,
    });
    setIsEditing(true);
    setCurrentId(topic.id);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this topic?')) return;
    try {
      await axios.delete(`${API_URL}/topics/${id}`);
      fetchTopics();
      toast.success('Topic deleted');
    } catch {
      toast.error('Failed to delete topic');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Topics</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>Add Topic</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{isEditing ? 'Edit Topic' : 'Add Topic'}</DialogTitle>
              <DialogDescription>{isEditing ? 'Update details' : 'Enter topic details'}</DialogDescription>
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
                  <Label htmlFor="description" className="text-right">Description</Label>
                  <Input id="description" name="description" value={formData.description} onChange={handleChange} className="col-span-3" required />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="chapter" className="text-right">Chapter</Label>
                  <select id="chapter" name="chapter" value={formData.chapter} onChange={handleChange} className="col-span-3 border rounded-md min-h-[40px] px-3" required>
                    <option value="">Select a chapter</option>
                    {chapters.map(c => <option value={c._id} key={c._id}>{c.name}</option>)}
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
          {topics.length ? (
            topics.map(topic => (
              <Card key={topic._id} className="overflow-hidden">
                <CardHeader>
                  <CardTitle>{topic.name}</CardTitle>
                  <CardDescription>{topic.id}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-sm"><strong>Description:</strong> {topic.description}</div>
                  <div className="text-sm"><strong>Chapter ID:</strong> {topic.chapter}</div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" onClick={() => handleEdit(topic)}>Edit</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Edit Topic</DialogTitle>
                        <DialogDescription>Update topic details</DialogDescription>
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
                            <Label htmlFor="chapter" className="text-right">Chapter</Label>
                            <select id="chapter" name="chapter" value={formData.chapter} onChange={handleChange} className="col-span-3 border rounded-md min-h-[40px] px-3" required>
                              <option value="">Select a chapter</option>
                              {chapters.map(c => <option value={c._id} key={c._id}>{c.name}</option>)}
                            </select>
                          </div>
                        </div>
                        <DialogFooter>
                          <Button type="submit">Update</Button>
                        </DialogFooter>
                      </form>
                    </DialogContent>
                  </Dialog>
                  <Button variant="destructive" onClick={() => handleDelete(topic.id)}>Delete</Button>
                </CardFooter>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center py-8">
              <p className="text-lg text-gray-500">No topics found</p>
              <p className="text-sm text-gray-400">Create your first topic to get started</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Topics;
