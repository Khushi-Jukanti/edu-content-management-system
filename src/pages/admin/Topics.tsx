
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const Topics: React.FC = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Topics</h1>
      <Card>
        <CardHeader>
          <CardTitle>Topics Management</CardTitle>
          <CardDescription>
            Manage topic information connected to chapters
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>
            This page will follow the same pattern as the Courses page to provide CRUD operations for topics.
            Connect to your backend API at http://localhost:3000/api/topics.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Topics;
