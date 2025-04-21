
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';

const API_URL = 'http://localhost:7000/api';

interface VideoType {
  _id: string;
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  duration: string;
  hlsFolderPath: string;
  manifestFile: string;
  topic: string;
}

const Videos: React.FC = () => {
  const [videos, setVideos] = useState<VideoType[]>([]);
  const [topics, setTopics] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ id: '', title: '', description: '', thumbnail: '', duration: '', topic: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState('');

  useEffect(() => {
    fetchVideos();
    fetchTopics();
  }, []);

  const fetchVideos = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/videos`);
      setVideos(response.data);
    } catch {
      toast.error('Failed to fetch videos');
    } finally {
      setLoading(false);
    }
  };

  const fetchTopics = async () => {
    try {
      const response = await axios.get(`${API_URL}/topics`);
      setTopics(response.data);
    } catch {}
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData({ id: '', title: '', description: '', thumbnail: '', duration: '', topic: '' });
    setIsEditing(false);
    setCurrentId('');
  };

  const handleSubmit = async (e: React.FormEvent, close: () => void) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await axios.put(`${API_URL}/videos/${currentId}`, formData);
        toast.success('Video updated');
      } else {
        await axios.post(`${API_URL}/videos`, formData);
        toast.success('Video created');
      }
      fetchVideos();
      resetForm();
      close();
    } catch {
      toast.error('Failed to save video');
    }
  };

  const handleEdit = (video: VideoType) => {
    setFormData({
      id: video.id,
      title: video.title,
      description: video.description,
      thumbnail: video.thumbnail,
      duration: video.duration,
      topic: video.topic,
    });
    setIsEditing(true);
    setCurrentId(video.id);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this video?')) return;
    try {
      await axios.delete(`${API_URL}/videos/${id}`);
      fetchVideos();
      toast.success('Video deleted');
    } catch {
      toast.error('Failed to delete video');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Videos</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>Add Video</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{isEditing ? 'Edit Video' : 'Add Video'}</DialogTitle>
              <DialogDescription>{isEditing ? 'Update details' : 'Enter video details'}</DialogDescription>
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
                  <Label htmlFor="title" className="text-right">Title</Label>
                  <Input id="title" name="title" value={formData.title} onChange={handleChange} className="col-span-3" required />
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
                  <Label htmlFor="duration" className="text-right">Duration</Label>
                  <Input id="duration" name="duration" value={formData.duration} onChange={handleChange} className="col-span-3" required />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="topic" className="text-right">Topic</Label>
                  <select id="topic" name="topic" value={formData.topic} onChange={handleChange} className="col-span-3 border rounded-md min-h-[40px] px-3" required>
                    <option value="">Select a topic</option>
                    {topics.map(t => <option value={t._id} key={t._id}>{t.name}</option>)}
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
          {videos.length ? (
            videos.map(video => (
              <Card key={video._id} className="overflow-hidden">
                <CardHeader>
                  <CardTitle>{video.title}</CardTitle>
                  <CardDescription>{video.id}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-sm"><strong>Description:</strong> {video.description}</div>
                  <div className="text-sm"><strong>Thumbnail:</strong> {video.thumbnail}</div>
                  <div className="text-sm"><strong>Duration:</strong> {video.duration}</div>
                  <div className="text-sm"><strong>Topic ID:</strong> {video.topic}</div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" onClick={() => handleEdit(video)}>Edit</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Edit Video</DialogTitle>
                        <DialogDescription>Update video details</DialogDescription>
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
                            <Label htmlFor="title" className="text-right">Title</Label>
                            <Input id="title" name="title" value={formData.title} onChange={handleChange} className="col-span-3" required />
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
                            <Label htmlFor="duration" className="text-right">Duration</Label>
                            <Input id="duration" name="duration" value={formData.duration} onChange={handleChange} className="col-span-3" required />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="topic" className="text-right">Topic</Label>
                            <select id="topic" name="topic" value={formData.topic} onChange={handleChange} className="col-span-3 border rounded-md min-h-[40px] px-3" required>
                              <option value="">Select a topic</option>
                              {topics.map(t => <option value={t._id} key={t._id}>{t.name}</option>)}
                            </select>
                          </div>
                        </div>
                        <DialogFooter>
                          <Button type="submit">Update</Button>
                        </DialogFooter>
                      </form>
                    </DialogContent>
                  </Dialog>
                  <Button variant="destructive" onClick={() => handleDelete(video.id)}>Delete</Button>
                </CardFooter>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center py-8">
              <p className="text-lg text-gray-500">No videos found</p>
              <p className="text-sm text-gray-400">Create your first video to get started</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Videos;
