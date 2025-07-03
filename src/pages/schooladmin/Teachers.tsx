
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Search } from 'lucide-react';

const Teachers: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState<any>(null);

  // Mock data for teachers in this school
  const [teachers, setTeachers] = useState([
    {
      id: 1,
      name: 'John Smith',
      email: 'john.smith@school.edu',
      subjects: ['Mathematics', 'Physics'],
      status: 'active',
      lastLogin: '2024-01-15 09:30',
      createdAt: '2024-01-01',
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      email: 'sarah.johnson@school.edu',
      subjects: ['English', 'Literature'],
      status: 'active',
      lastLogin: '2024-01-15 08:45',
      createdAt: '2024-01-02',
    },
    {
      id: 3,
      name: 'Mike Davis',
      email: 'mike.davis@school.edu',
      subjects: ['Science', 'Chemistry'],
      status: 'inactive',
      lastLogin: '2024-01-12 14:20',
      createdAt: '2024-01-03',
    },
  ]);

  const [newTeacher, setNewTeacher] = useState({
    name: '',
    email: '',
    subjects: '',
    password: '',
  });

  const filteredTeachers = teachers.filter(teacher =>
    teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.subjects.some(subject => subject.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleAddTeacher = () => {
    // Here you would make an API call to add the teacher
    const teacher = {
      id: teachers.length + 1,
      name: newTeacher.name,
      email: newTeacher.email,
      subjects: newTeacher.subjects.split(',').map(s => s.trim()),
      status: 'active',
      lastLogin: 'Never',
      createdAt: new Date().toISOString().split('T')[0],
    };
    
    setTeachers([...teachers, teacher]);
    setNewTeacher({ name: '', email: '', subjects: '', password: '' });
    setIsAddDialogOpen(false);
  };

  const handleEditTeacher = (teacher: any) => {
    setSelectedTeacher(teacher);
    setIsEditDialogOpen(true);
  };

  const handleDeleteTeacher = (id: number) => {
    if (confirm('Are you sure you want to delete this teacher?')) {
      setTeachers(teachers.filter(teacher => teacher.id !== id));
    }
  };

  const toggleTeacherStatus = (id: number) => {
    setTeachers(teachers.map(teacher => 
      teacher.id === id 
        ? { ...teacher, status: teacher.status === 'active' ? 'inactive' : 'active' }
        : teacher
    ));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Teachers Management</h1>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-green-600 hover:bg-green-700">
              <Plus className="w-4 h-4 mr-2" />
              Add Teacher
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Teacher</DialogTitle>
              <DialogDescription>
                Create a new teacher account for your school.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">Name</Label>
                <Input
                  id="name"
                  value={newTeacher.name}
                  onChange={(e) => setNewTeacher({...newTeacher, name: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={newTeacher.email}
                  onChange={(e) => setNewTeacher({...newTeacher, email: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="subjects" className="text-right">Subjects</Label>
                <Input
                  id="subjects"
                  placeholder="Math, Science, English"
                  value={newTeacher.subjects}
                  onChange={(e) => setNewTeacher({...newTeacher, subjects: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="password" className="text-right">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={newTeacher.password}
                  onChange={(e) => setNewTeacher({...newTeacher, password: e.target.value})}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={handleAddTeacher}>Add Teacher</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold">{teachers.length}</div>
            <p className="text-sm text-muted-foreground">Total Teachers</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-green-600">
              {teachers.filter(t => t.status === 'active').length}
            </div>
            <p className="text-sm text-muted-foreground">Active Teachers</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-red-600">
              {teachers.filter(t => t.status === 'inactive').length}
            </div>
            <p className="text-sm text-muted-foreground">Inactive Teachers</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search teachers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Teachers Table */}
      <Card>
        <CardHeader>
          <CardTitle>Teachers List</CardTitle>
          <CardDescription>
            Manage your school's teaching staff
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Subjects</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Login</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTeachers.map((teacher) => (
                <TableRow key={teacher.id}>
                  <TableCell className="font-medium">{teacher.name}</TableCell>
                  <TableCell>{teacher.email}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {teacher.subjects.map((subject, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {subject}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={teacher.status === 'active' ? 'default' : 'destructive'}
                      className="cursor-pointer"
                      onClick={() => toggleTeacherStatus(teacher.id)}
                    >
                      {teacher.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {teacher.lastLogin}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditTeacher(teacher)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteTeacher(teacher.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Teachers;
