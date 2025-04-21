
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const Chapters: React.FC = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Chapters</h1>
      <Card>
        <CardHeader>
          <CardTitle>Chapters Management</CardTitle>
          <CardDescription>
            Manage chapter information connected to subjects
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>
            This page will follow the same pattern as the Courses page to provide CRUD operations for chapters.
            Connect to your backend API at http://localhost:3000/api/chapters.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Chapters;
