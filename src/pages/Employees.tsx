import { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { DataTable } from '@/components/ui/data-table';
import { StatusBadge, getStatusType } from '@/components/ui/status-badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { mockEmployees, mockCompanies, formatCurrency, formatDate } from '@/data/mockData';
import { Employee } from '@/types/insurance';
import { Search, Filter, Download, RefreshCw, Users, Upload, Plus } from 'lucide-react';
import {
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

const columns = [
  {
    key: 'name',
    header: 'Employee',
    render: (employee: Employee) => (
      <div className="flex items-center gap-3">
        <Avatar className="h-9 w-9">
          <AvatarFallback className="text-xs bg-primary/10 text-primary">
            {employee.firstName[0]}
            {employee.lastName[0]}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="font-medium text-foreground">
            {employee.firstName} {employee.lastName}
          </p>
          <p className="text-xs text-muted-foreground">{employee.email}</p>
        </div>
      </div>
    ),
  },
  {
    key: 'company',
    header: 'Company',
    render: (employee: Employee) => {
      const company = mockCompanies.find((c) => c.id === employee.companyId);
      return <span>{company?.name || '—'}</span>;
    },
  },
  {
    key: 'department',
    header: 'Department',
    render: (employee: Employee) => (
      <span className="inline-flex items-center px-2 py-1 rounded-md bg-secondary text-xs font-medium">
        {employee.department}
      </span>
    ),
  },
  {
    key: 'jobTitle',
    header: 'Job Title',
  },
  {
    key: 'salary',
    header: 'Salary',
    render: (employee: Employee) => (
      <span className="font-medium">{formatCurrency(employee.salary)}</span>
    ),
  },
  {
    key: 'dependents',
    header: 'Dependents',
    render: (employee: Employee) => (
      <span className="text-center">{employee.dependents}</span>
    ),
  },
  {
    key: 'hireDate',
    header: 'Hire Date',
    render: (employee: Employee) => (
      <span className="text-muted-foreground">{formatDate(employee.hireDate)}</span>
    ),
  },
  {
    key: 'status',
    header: 'Status',
    render: (employee: Employee) => (
      <StatusBadge
        status={getStatusType(employee.status)}
        label={employee.status.charAt(0).toUpperCase() + employee.status.slice(1).replace('_', ' ')}
      />
    ),
  },
];

const Employees = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [companyFilter, setCompanyFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isAddEmployeeOpen, setIsAddEmployeeOpen] = useState(false);
  const [employees, setEmployees] = useState<Employee[]>(mockEmployees);
  const { toast } = useToast();
  
  const [newEmployee, setNewEmployee] = useState({
    firstName: '',
    lastName: '',
    email: '',
    companyId: '',
    department: '',
    jobTitle: '',
    salary: 0,
    dependents: 0,
    hireDate: '',
    status: 'active' as const
  });

  const filteredEmployees = employees.filter((employee) => {
    const matchesSearch =
      `${employee.firstName} ${employee.lastName}`
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCompany =
      companyFilter === 'all' || employee.companyId === companyFilter;
    const matchesStatus = statusFilter === 'all' || employee.status === statusFilter;
    return matchesSearch && matchesCompany && matchesStatus;
  });

  const handleAddEmployee = () => {
    if (!newEmployee.firstName.trim() || !newEmployee.lastName.trim() || !newEmployee.email.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const employee: Employee = {
      id: `EMP-${Date.now()}`,
      ...newEmployee,
      hireDate: newEmployee.hireDate || new Date().toISOString().split('T')[0]
    };

    setEmployees([employee, ...employees]);
    setNewEmployee({
      firstName: '',
      lastName: '',
      email: '',
      companyId: '',
      department: '',
      jobTitle: '',
      salary: 0,
      dependents: 0,
      hireDate: '',
      status: 'active'
    });
    setIsAddEmployeeOpen(false);
    toast({
      title: "Success",
      description: "Employee added successfully"
    });
  };

  return (
    <AppLayout title="Employees" subtitle="View and manage employee census data">
      <div className="space-y-6 animate-fade-in">
        {/* Summary Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="stat-card">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-primary/10 p-3">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{employees.length}</p>
                <p className="text-sm text-muted-foreground">Total Employees</p>
              </div>
            </div>
          </div>
          <div className="stat-card">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-success/10 p-3">
                <Users className="h-6 w-6 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {employees.filter((e) => e.status === 'active').length}
                </p>
                <p className="text-sm text-muted-foreground">Active</p>
              </div>
            </div>
          </div>
          <div className="stat-card">
            <div>
              <p className="text-2xl font-bold text-foreground">
                {formatCurrency(
                  employees.reduce((sum, e) => sum + e.salary, 0) / employees.length
                )}
              </p>
              <p className="text-sm text-muted-foreground">Avg Salary</p>
            </div>
          </div>
          <div className="stat-card">
            <div>
              <p className="text-2xl font-bold text-foreground">
                {employees.reduce((sum, e) => sum + e.dependents, 0)}
              </p>
              <p className="text-sm text-muted-foreground">Total Dependents</p>
            </div>
          </div>
        </div>

        {/* Header Actions */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-1 items-center gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search employees..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={companyFilter} onValueChange={setCompanyFilter}>
              <SelectTrigger className="w-44">
                <SelectValue placeholder="Company" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Companies</SelectItem>
                {mockCompanies.map((company) => (
                  <SelectItem key={company.id} value={company.id}>
                    {company.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="terminated">Terminated</SelectItem>
                <SelectItem value="on_leave">On Leave</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Sync WorkPay
            </Button>
            <Button variant="outline" size="sm">
              <Upload className="h-4 w-4 mr-2" />
              Import
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button size="sm" onClick={() => setIsAddEmployeeOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Employee
            </Button>
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
          <DataTable
            data={filteredEmployees}
            columns={columns}
            onRowClick={(employee) => console.log('View employee:', employee.id)}
          />
        </div>

        {/* Summary Footer */}
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <p>Showing {filteredEmployees.length} of {employees.length} employees</p>
          <p>Last synced: 2 hours ago</p>
        </div>

        {/* Add Employee Dialog */}
        <Dialog open={isAddEmployeeOpen} onOpenChange={setIsAddEmployeeOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add New Employee</DialogTitle>
              <DialogDescription>
                Add a new employee to the system
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={newEmployee.firstName}
                    onChange={(e) => setNewEmployee({...newEmployee, firstName: e.target.value})}
                    placeholder="Enter first name"
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={newEmployee.lastName}
                    onChange={(e) => setNewEmployee({...newEmployee, lastName: e.target.value})}
                    placeholder="Enter last name"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={newEmployee.email}
                  onChange={(e) => setNewEmployee({...newEmployee, email: e.target.value})}
                  placeholder="Enter email address"
                />
              </div>
              <div>
                <Label htmlFor="company">Company</Label>
                <Select
                  value={newEmployee.companyId}
                  onValueChange={(value) => setNewEmployee({...newEmployee, companyId: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select company" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockCompanies.map((company) => (
                      <SelectItem key={company.id} value={company.id}>
                        {company.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="department">Department</Label>
                  <Input
                    id="department"
                    value={newEmployee.department}
                    onChange={(e) => setNewEmployee({...newEmployee, department: e.target.value})}
                    placeholder="Enter department"
                  />
                </div>
                <div>
                  <Label htmlFor="jobTitle">Job Title</Label>
                  <Input
                    id="jobTitle"
                    value={newEmployee.jobTitle}
                    onChange={(e) => setNewEmployee({...newEmployee, jobTitle: e.target.value})}
                    placeholder="Enter job title"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="salary">Salary</Label>
                  <Input
                    id="salary"
                    type="number"
                    value={newEmployee.salary}
                    onChange={(e) => setNewEmployee({...newEmployee, salary: parseFloat(e.target.value) || 0})}
                    placeholder="Enter salary"
                  />
                </div>
                <div>
                  <Label htmlFor="dependents">Dependents</Label>
                  <Input
                    id="dependents"
                    type="number"
                    value={newEmployee.dependents}
                    onChange={(e) => setNewEmployee({...newEmployee, dependents: parseInt(e.target.value) || 0})}
                    placeholder="Number of dependents"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="hireDate">Hire Date</Label>
                <Input
                  id="hireDate"
                  type="date"
                  value={newEmployee.hireDate}
                  onChange={(e) => setNewEmployee({...newEmployee, hireDate: e.target.value})}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsAddEmployeeOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleAddEmployee}
                disabled={!newEmployee.firstName.trim() || !newEmployee.lastName.trim() || !newEmployee.email.trim()}
              >
                Add Employee
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
};

export default Employees;
