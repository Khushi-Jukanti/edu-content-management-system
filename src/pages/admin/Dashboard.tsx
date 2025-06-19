
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const Dashboard: React.FC = () => {
  // Dashboard stats (these would typically come from an API)
  const stats = [
    { title: 'Schools', count: 12, path: '/admin/schools', color: 'bg-blue-500' },
    { title: 'School Admins', count: 15, path: '/admin/school-admins', color: 'bg-indigo-500' },
    { title: 'Teachers', count: 240, path: '/admin/teachers', color: 'bg-cyan-500' },
    { title: 'Courses', count: 8, path: '/admin/courses', color: 'bg-blue-500' },
    { title: 'Classes', count: 24, path: '/admin/classes', color: 'bg-green-500' },
    { title: 'Subjects', count: 42, path: '/admin/subjects', color: 'bg-orange-500' },
    { title: 'Chapters', count: 156, path: '/admin/chapters', color: 'bg-purple-500' },
    { title: 'Topics', count: 320, path: '/admin/topics', color: 'bg-pink-500' },
    { title: 'Videos', count: 560, path: '/admin/videos', color: 'bg-red-500' },
    { title: 'User Actions', count: 1250, path: '/admin/user-actions', color: 'bg-gray-500' },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <Link to={stat.path} key={stat.title}>
            <Card className="overflow-hidden transition-all hover:shadow-md">
              <CardHeader className={`text-white ${stat.color}`}>
                <CardTitle>{stat.title}</CardTitle>
                <CardDescription className="text-white text-opacity-90">
                  Manage {stat.title.toLowerCase()}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="text-3xl font-bold">{stat.count}</div>
                <p className="text-sm text-gray-500">Total {stat.title.toLowerCase()}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
