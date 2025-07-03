
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

const SchoolAdminDashboard: React.FC = () => {
  // Mock data for school admin (would come from API based on school)
  const schoolStats = [
    { title: 'Total Teachers', count: 15, color: 'bg-blue-500' },
    { title: 'Active Teachers', count: 13, color: 'bg-green-500' },
    { title: 'Total Classes', count: 8, color: 'bg-purple-500' },
    { title: 'Total Subjects', count: 12, color: 'bg-orange-500' },
    { title: 'Total Videos', count: 145, color: 'bg-red-500' },
    { title: 'Active Sessions', count: 7, color: 'bg-cyan-500' },
  ];

  // Chart data for teacher status
  const teacherStatusData = [
    { name: 'Active Teachers', value: 13, color: '#22c55e' },
    { name: 'Inactive Teachers', value: 2, color: '#ef4444' },
  ];

  const weeklyActivityData = [
    { day: 'Mon', logins: 12, videos: 45 },
    { day: 'Tue', logins: 15, videos: 52 },
    { day: 'Wed', logins: 10, videos: 38 },
    { day: 'Thu', logins: 18, videos: 61 },
    { day: 'Fri', logins: 14, videos: 49 },
    { day: 'Sat', logins: 8, videos: 28 },
    { day: 'Sun', logins: 6, videos: 22 },
  ];

  const subjectEngagementData = [
    { subject: 'Math', completed: 85, inProgress: 12, notStarted: 3 },
    { subject: 'Science', completed: 78, inProgress: 18, notStarted: 4 },
    { subject: 'English', completed: 92, inProgress: 6, notStarted: 2 },
    { subject: 'Social Studies', completed: 71, inProgress: 22, notStarted: 7 },
  ];

  const chartConfig = {
    active: { label: 'Active', color: '#22c55e' },
    inactive: { label: 'Inactive', color: '#ef4444' },
    logins: { label: 'Logins', color: '#3b82f6' },
    videos: { label: 'Videos Watched', color: '#8b5cf6' },
    completed: { label: 'Completed', color: '#22c55e' },
    inProgress: { label: 'In Progress', color: '#f59e0b' },
    notStarted: { label: 'Not Started', color: '#ef4444' },
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
        School Dashboard
      </h1>
      
      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {schoolStats.map((stat) => (
          <Card key={stat.title} className="overflow-hidden transition-all hover:shadow-lg hover:scale-105 border-l-4 border-l-green-500">
            <CardHeader className={`text-white ${stat.color} bg-gradient-to-r`}>
              <CardTitle className="text-lg">{stat.title}</CardTitle>
              <CardDescription className="text-white text-opacity-90">
                Your school's {stat.title.toLowerCase()}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-gray-800">{stat.count}</div>
              <p className="text-sm text-gray-500">Current count</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Teacher Status Pie Chart */}
        <Card className="border-2 border-green-100 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50">
            <CardTitle className="text-green-800">Teacher Status</CardTitle>
            <CardDescription>Active vs Inactive Teachers</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <ChartContainer config={chartConfig} className="h-[300px]">
              <PieChart>
                <Pie
                  data={teacherStatusData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="value"
                  stroke="#fff"
                  strokeWidth={2}
                >
                  {teacherStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent />} />
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Weekly Activity Chart */}
        <Card className="border-2 border-blue-100 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50">
            <CardTitle className="text-blue-800">Weekly Activity</CardTitle>
            <CardDescription>Teacher Logins and Video Usage</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <ChartContainer config={chartConfig} className="h-[300px]">
              <LineChart data={weeklyActivityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
                <XAxis dataKey="day" stroke="#64748b" />
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
                  dataKey="videos" 
                  stroke="#8b5cf6" 
                  strokeWidth={3}
                  dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 6 }}
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Subject Engagement Chart */}
        <Card className="border-2 border-purple-100 shadow-lg md:col-span-2">
          <CardHeader className="bg-gradient-to-r from-purple-50 to-violet-50">
            <CardTitle className="text-purple-800">Subject Engagement</CardTitle>
            <CardDescription>Video Completion Status by Subject</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <ChartContainer config={chartConfig} className="h-[300px]">
              <BarChart data={subjectEngagementData}>
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
                <p className="text-green-100">Active Users Today</p>
                <p className="text-3xl font-bold">12</p>
              </div>
              <div className="text-green-200 text-4xl">👥</div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-400 to-blue-600 text-white shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100">Videos Watched Today</p>
                <p className="text-3xl font-bold">287</p>
              </div>
              <div className="text-blue-200 text-4xl">📹</div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-400 to-purple-600 text-white shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100">Completion Rate</p>
                <p className="text-3xl font-bold">84%</p>
              </div>
              <div className="text-purple-200 text-4xl">📊</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SchoolAdminDashboard;
