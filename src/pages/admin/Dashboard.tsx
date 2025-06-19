
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, PieChart, Pie, Cell, LineChart, Line, ResponsiveContainer } from 'recharts';

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

  // Chart data for status analysis
  const schoolStatusData = [
    { name: 'Active Schools', value: 10, color: '#22c55e' },
    { name: 'Inactive Schools', value: 2, color: '#ef4444' },
  ];

  const userStatusData = [
    { category: 'School Admins', active: 12, inactive: 3, total: 15 },
    { category: 'Teachers', active: 220, inactive: 20, total: 240 },
  ];

  const monthlyActivityData = [
    { month: 'Jan', logins: 450, newUsers: 12 },
    { month: 'Feb', logins: 520, newUsers: 18 },
    { month: 'Mar', logins: 480, newUsers: 15 },
    { month: 'Apr', logins: 610, newUsers: 22 },
    { month: 'May', logins: 590, newUsers: 19 },
    { month: 'Jun', logins: 670, newUsers: 25 },
  ];

  const videoEngagementData = [
    { subject: 'Math', completed: 85, inProgress: 12, notStarted: 3 },
    { subject: 'Science', completed: 78, inProgress: 18, notStarted: 4 },
    { subject: 'English', completed: 92, inProgress: 6, notStarted: 2 },
    { subject: 'Social Studies', completed: 71, inProgress: 22, notStarted: 7 },
  ];

  const chartConfig = {
    active: { label: 'Active', color: '#22c55e' },
    inactive: { label: 'Inactive', color: '#ef4444' },
    logins: { label: 'Logins', color: '#3b82f6' },
    newUsers: { label: 'New Users', color: '#8b5cf6' },
    completed: { label: 'Completed', color: '#22c55e' },
    inProgress: { label: 'In Progress', color: '#f59e0b' },
    notStarted: { label: 'Not Started', color: '#ef4444' },
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
        Admin Dashboard
      </h1>
      
      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <Link to={stat.path} key={stat.title}>
            <Card className="overflow-hidden transition-all hover:shadow-lg hover:scale-105 border-l-4 border-l-blue-500">
              <CardHeader className={`text-white ${stat.color} bg-gradient-to-r`}>
                <CardTitle className="text-lg">{stat.title}</CardTitle>
                <CardDescription className="text-white text-opacity-90">
                  Manage {stat.title.toLowerCase()}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="text-3xl font-bold text-gray-800">{stat.count}</div>
                <p className="text-sm text-gray-500">Total {stat.title.toLowerCase()}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* School Status Pie Chart */}
        <Card className="border-2 border-green-100 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50">
            <CardTitle className="text-green-800">School Status Distribution</CardTitle>
            <CardDescription>Active vs Inactive Schools</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <ChartContainer config={chartConfig} className="h-[300px]">
              <PieChart>
                <Pie
                  data={schoolStatusData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="value"
                  stroke="#fff"
                  strokeWidth={2}
                >
                  {schoolStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent />} />
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* User Status Bar Chart */}
        <Card className="border-2 border-blue-100 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50">
            <CardTitle className="text-blue-800">User Status Analysis</CardTitle>
            <CardDescription>Active vs Inactive Users by Role</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <ChartContainer config={chartConfig} className="h-[300px]">
              <BarChart data={userStatusData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
                <XAxis dataKey="category" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="active" fill="#22c55e" radius={[4, 4, 0, 0]} />
                <Bar dataKey="inactive" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Monthly Activity Line Chart */}
        <Card className="border-2 border-purple-100 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-purple-50 to-violet-50">
            <CardTitle className="text-purple-800">Monthly Activity Trends</CardTitle>
            <CardDescription>Logins and New User Registration</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <ChartContainer config={chartConfig} className="h-[300px]">
              <LineChart data={monthlyActivityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
                <XAxis dataKey="month" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line 
                  type="monotone" 
                  dataKey="logins" 
                  stroke="#3b82f6" 
                  strokeWidth={3}
                  dot={{ fill: '#3b82f6', strokeWidth: 2, r: 6 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="newUsers" 
                  stroke="#8b5cf6" 
                  strokeWidth={3}
                  dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 6 }}
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Video Engagement Stacked Bar Chart */}
        <Card className="border-2 border-orange-100 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-orange-50 to-amber-50">
            <CardTitle className="text-orange-800">Video Engagement by Subject</CardTitle>
            <CardDescription>Completion Status Breakdown</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <ChartContainer config={chartConfig} className="h-[300px]">
              <BarChart data={videoEngagementData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
                <XAxis dataKey="subject" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="completed" stackId="a" fill="#22c55e" radius={[0, 0, 4, 4]} />
                <Bar dataKey="inProgress" stackId="a" fill="#f59e0b" />
                <Bar dataKey="notStarted" stackId="a" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-gradient-to-br from-green-400 to-green-600 text-white shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100">Total Active Users</p>
                <p className="text-3xl font-bold">232</p>
              </div>
              <div className="text-green-200 text-4xl">👥</div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-400 to-blue-600 text-white shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100">System Uptime</p>
                <p className="text-3xl font-bold">99.9%</p>
              </div>
              <div className="text-blue-200 text-4xl">⚡</div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-400 to-purple-600 text-white shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100">Videos Watched Today</p>
                <p className="text-3xl font-bold">1,247</p>
              </div>
              <div className="text-purple-200 text-4xl">📹</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
