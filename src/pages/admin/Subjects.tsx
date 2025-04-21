
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const Subjects: React.FC = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Subjects</h1>
      <Card>
        <CardHeader>
          <CardTitle>Subjects Management</CardTitle>
          <CardDescription>
            Manage subject information connected to classes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>
            This page will follow the same pattern as the Courses page to provide CRUD operations for subjects.
            Connect to your backend API at http://localhost:3000/api/subjects.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Subjects;
