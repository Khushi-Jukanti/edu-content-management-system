
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const Classes: React.FC = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Classes</h1>
      <Card>
        <CardHeader>
          <CardTitle>Classes Management</CardTitle>
          <CardDescription>
            Manage class information connected to courses
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>
            This page will follow the same pattern as the Courses page to provide CRUD operations for classes.
            Connect to your backend API at http://localhost:3000/api/classes.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Classes;
