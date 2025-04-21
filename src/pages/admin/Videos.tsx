
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const Videos: React.FC = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Videos</h1>
      <Card>
        <CardHeader>
          <CardTitle>Videos Management</CardTitle>
          <CardDescription>
            Manage video content connected to topics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>
            This page will follow the same pattern as the Courses page to provide CRUD operations for videos.
            Connect to your backend API at http://localhost:3000/api/videos.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Videos;
