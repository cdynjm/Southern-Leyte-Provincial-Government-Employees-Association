import FormattedDate from '@/components/formatted-date';
import Pagination from '@/components/pagination';
import { SkeletonCard } from '@/components/skeleton-card';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SkeletonDelay } from '@/components/ui/skeleton-delay';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Employees, type Offices, type Paginated, type User } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { EraserIcon, Eye, EyeOff, LoaderCircle, PencilIcon, SearchIcon, Trash2Icon } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Employees',
        href: route('admin.employees'),
    },
];
interface EmployeesProps {
    auth: {
        user: User;
    };
    employees: Paginated<Employees>;
    employeesWithSpecialAccount: Employees[];
    search: string;
    office: string;
    type: string;
    offices: Offices[];
}

export default function Offices({ auth, employees, employeesWithSpecialAccount, offices, search, office, type }: EmployeesProps) {
    const [showPassword, setShowPassword] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

    const searchEmployeeForm = useForm({
        office: office || '',
        search: search || '',
        type: type || '',
    });

    const clearEmployeeForm = useForm({
        search: '',
        office: '',
        type: '',
    });

    const searchEmployee = () => {
        searchEmployeeForm.post(route('admin.employees.search'));
    };

    const clearSearch = () => {
        clearEmployeeForm.post(route('admin.employees.clear-search'), {
            onSuccess: () => {
                searchEmployeeForm.setData('search', '');
                searchEmployeeForm.setData('office', '');
                searchEmployeeForm.setData('type', '');
            },
        });
    };

    const createForm = useForm({
        name: '',
        employeeID: '',
        position: '',
        office: '',
        contactNumber: '',
        startDate: '',
        endDate: '',
        birthDate: '',
        employmentType: '',
        email: '',
        password: '',
        specialAccount: '',
    });

    const addEmployee = () => {
        const { name, employeeID, position, office, startDate, birthDate, employmentType, email, password, specialAccount } = createForm.data;

        if (!name || !employeeID || !position || !office || !startDate || !birthDate || !employmentType || !email || !password || !specialAccount) {
            toast('Opss, Error', {
                description: 'Please fill in required fields before submitting.',
            });
            return;
        }

        createForm.post(route('admin.employee.store'), {
            onSuccess: () => {
                toast('Created', {
                    description: 'Employee has been added successfully.',
                    action: {
                        label: 'Close',
                        onClick: () => console.log(''),
                    },
                });
                createForm.reset();
                setOpenDialog(false);
            },
            onError: () => {
                toast('Opss, sorry but ...', {
                    description: 'Username is already taken',
                });
            },
        });
    };

    const updateForm = useForm({
        encrypted_id: '',
        name: '',
        employeeID: '',
        position: '',
        office: '',
        contactNumber: '',
        startDate: '',
        endDate: '',
        birthDate: '',
        employmentType: '',
        email: '',
        password: '',
        specialAccount: '',
    });

    const editEmployee = (employee: Employees) => {
        updateForm.setData({
            encrypted_id: String(employee.encrypted_id),
            name: String(employee.name),
            employeeID: String(employee.employeeID),
            position: String(employee.position),
            office: String(employee.officeEncrypted_id),
            contactNumber: employee.contactNumber == null ? '' : String(employee.contactNumber),
            startDate: String(employee.startDate),
            endDate: String(employee.endDate),
            birthDate: String(employee.birthDate),
            employmentType: String(employee.employmentType),
            email: String(employee.email),
            password: '',
            specialAccount: String(employee.specialAccount),
        });
        setOpenEditDialog(true);
    };

    const updateEmployee = () => {
        const { name, employeeID, position, office, startDate, birthDate, employmentType, email, specialAccount } = updateForm.data;

        if (!name || !employeeID || !position || !office || !startDate || !birthDate || !employmentType || !email || !specialAccount) {
            toast('Opss, Error', {
                description: 'Please fill in required fields before submitting.',
            });
            return;
        }

        updateForm.put(route('admin.employee.update'), {
            onSuccess: () => {
                toast('Updated', {
                    description: 'Employee has been updated successfully.',
                    action: {
                        label: 'Close',
                        onClick: () => console.log(''),
                    },
                });
                updateForm.reset();
                setOpenEditDialog(false);
            },
            onError: () => {
                toast('Opss, sorry but ...', {
                    description: 'Username is already taken',
                });
            },
        });
    };

    const deleteForm = useForm({
        encrypted_id: '',
    });

    const deleteEmployee = (encrypted_id: string) => {
        deleteForm.setData({ encrypted_id: String(encrypted_id) });
        setOpenDeleteDialog(true);
    };

    const removeEmployee = () => {
        deleteForm.delete(route('admin.employee.destroy'), {
            onSuccess: () => {
                toast('Deleted', {
                    description: 'Employee was deleted successfully.',
                    action: {
                        label: 'Close',
                        onClick: () => console.log(''),
                    },
                });
                setOpenDeleteDialog(false);
            },
            onError: () => {
                toast('Failed', {
                    description: 'Unable to delete employee. Please try again.',
                    action: {
                        label: 'Close',
                        onClick: () => console.log(''),
                    },
                });
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs} auth={auth}>
            <Head title="Employees" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <SkeletonDelay skeleton={<SkeletonCard />}>
                    <div className="flex items-center justify-between">
                        <div className="flex flex-col gap-1">
                            <Label className="text-sm font-bold text-gray-500">List of Employees</Label>
                        </div>

                        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                            <DialogTrigger asChild>
                                <Button size="sm" className="text-[12px]">
                                    + Add
                                </Button>
                            </DialogTrigger>

                            <DialogContent className="sm:max-w-[800px]">
                                <DialogHeader>
                                    <DialogTitle>Add New Employee</DialogTitle>
                                    <DialogDescription>Fill in the details below to add a new employee.</DialogDescription>
                                </DialogHeader>

                                <div className="grid grid-cols-1 gap-4 py-4 sm:grid-cols-2">
                                    <div className="">
                                        <div className="mb-4 flex flex-col gap-2">
                                            <Label>Name</Label>
                                            <Input
                                                value={createForm.data.name}
                                                onChange={(e) => createForm.setData('name', e.target.value)}
                                                placeholder="Enter Full Name"
                                                required
                                            />
                                        </div>
                                        <div className="mb-4 flex flex-col gap-2">
                                            <Label>Employee ID</Label>
                                            <Input
                                                value={createForm.data.employeeID}
                                                onChange={(e) => createForm.setData('employeeID', e.target.value)}
                                                placeholder="Enter Employee ID"
                                                required
                                            />
                                        </div>
                                        <div className="mb-4 flex flex-col gap-2">
                                            <Label>Position</Label>
                                            <Input
                                                value={createForm.data.position}
                                                onChange={(e) => createForm.setData('position', e.target.value)}
                                                placeholder="Enter Position"
                                                required
                                            />
                                        </div>
                                        <div className="mb-4 flex flex-col gap-2">
                                            <Label>Office Name</Label>

                                            <Select value={createForm.data.office} onValueChange={(value) => createForm.setData('office', value)}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select office" />
                                                </SelectTrigger>

                                                <SelectContent>
                                                    {offices.map((office) => (
                                                        <SelectItem key={office.encrypted_id} value={office.encrypted_id}>
                                                            {office.officeName}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="mb-4 flex flex-col gap-2">
                                            <Label>Contact Number</Label>
                                            <Input
                                                value={createForm.data.contactNumber}
                                                onChange={(e) => createForm.setData('contactNumber', e.target.value)}
                                                placeholder="Enter Contact Number"
                                                required
                                            />
                                        </div>

                                        <div className="mb-4 flex flex-col gap-2">
                                            <Label>Birth Date</Label>
                                            <Input
                                                value={createForm.data.birthDate}
                                                type="date"
                                                onChange={(e) => createForm.setData('birthDate', e.target.value)}
                                                placeholder="Enter Birth Date"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="">
                                        <div className="mb-4 flex flex-col gap-2">
                                            <Label>Start Date</Label>
                                            <Input
                                                value={createForm.data.startDate}
                                                type="date"
                                                onChange={(e) => createForm.setData('startDate', e.target.value)}
                                                placeholder="Enter Start Date"
                                                required
                                            />
                                        </div>
                                        <div className="mb-4 flex flex-col gap-2">
                                            <Label>End Date</Label>
                                            <Input
                                                value={createForm.data.endDate}
                                                type="date"
                                                onChange={(e) => createForm.setData('endDate', e.target.value)}
                                                placeholder="Enter End Date"
                                            />
                                        </div>
                                        <div className="mb-4 flex flex-col gap-2">
                                            <Label>Employment Type</Label>

                                            <Select
                                                value={createForm.data.employmentType}
                                                onValueChange={(value) => createForm.setData('employmentType', value)}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select employment type" />
                                                </SelectTrigger>

                                                <SelectContent>
                                                    <SelectItem value="regular">Regular</SelectItem>
                                                    <SelectItem value="job order">Job Order</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="mb-4 flex flex-col gap-2">
                                            <Label>Username</Label>
                                            <Input
                                                value={createForm.data.email}
                                                onChange={(e) => createForm.setData('email', e.target.value)}
                                                placeholder="Enter Username"
                                                required
                                            />
                                        </div>
                                        <div className="mb-4 flex flex-col gap-2">
                                            <Label>Password</Label>
                                            <div className="relative">
                                                <Input
                                                    value={createForm.data.password}
                                                    type={showPassword ? 'text' : 'password'}
                                                    onChange={(e) => createForm.setData('password', e.target.value)}
                                                    placeholder="Create Password"
                                                    required
                                                />

                                                <button
                                                    type="button"
                                                    className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
                                                    onClick={() => setShowPassword((prev) => !prev)}
                                                    tabIndex={-1}
                                                >
                                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                                </button>
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-2 pt-2">
                                            <Label className="font-medium">Special Account?</Label>

                                            <RadioGroup
                                                value={createForm.data.specialAccount}
                                                onValueChange={(value) => createForm.setData('specialAccount', value)}
                                                className="flex flex-col gap-2"
                                            >
                                                {/* No / None Option */}
                                                <div className="flex items-center gap-2">
                                                    <RadioGroupItem value="No" id="special-account-none" />
                                                    <Label htmlFor="special-account-none" className="cursor-pointer">
                                                        No
                                                    </Label>
                                                </div>

                                                {/* If Yes label */}
                                                <div className="ml-6 text-sm text-gray-500">If Yes, specify type:</div>

                                                {/* Yes options */}
                                                <div className="ml-6 flex items-center gap-4">
                                                    <div className="flex items-center gap-2">
                                                        <RadioGroupItem value="Loan Encoder" id="special-account-loan-encoder" />
                                                        <Label htmlFor="special-account-loan-encoder" className="cursor-pointer">
                                                            Loan Encoder
                                                        </Label>
                                                    </div>

                                                    <div className="flex items-center gap-2">
                                                        <RadioGroupItem value="Loan Officer" id="special-account-loan-officer" />
                                                        <Label htmlFor="special-account-loan-officer" className="cursor-pointer">
                                                            Loan Officer
                                                        </Label>
                                                    </div>
                                                </div>
                                            </RadioGroup>
                                        </div>
                                    </div>
                                </div>

                                <DialogFooter>
                                    <DialogClose asChild>
                                        <Button variant="outline">Cancel</Button>
                                    </DialogClose>

                                    <Button onClick={addEmployee} disabled={createForm.processing}>
                                        {createForm.processing ? 'Saving...' : 'Save'}
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>

                        <Dialog open={openEditDialog} onOpenChange={setOpenEditDialog}>
                            <DialogContent className="sm:max-w-[800px]">
                                <DialogHeader>
                                    <DialogTitle>Edit Employee</DialogTitle>
                                    <DialogDescription>Update the employee details below.</DialogDescription>
                                </DialogHeader>

                                <div className="grid grid-cols-1 gap-4 py-4 sm:grid-cols-2">
                                    <div className="">
                                        <div className="mb-4 flex flex-col gap-2">
                                            <Label>Name</Label>
                                            <Input
                                                value={updateForm.data.name}
                                                onChange={(e) => updateForm.setData('name', e.target.value)}
                                                placeholder="Update Full Name"
                                                required
                                            />
                                        </div>
                                        <div className="mb-4 flex flex-col gap-2">
                                            <Label>Employee ID</Label>
                                            <Input
                                                value={updateForm.data.employeeID}
                                                onChange={(e) => updateForm.setData('employeeID', e.target.value)}
                                                placeholder="Update Employee ID"
                                                required
                                            />
                                        </div>
                                        <div className="mb-4 flex flex-col gap-2">
                                            <Label>Position</Label>
                                            <Input
                                                value={updateForm.data.position}
                                                onChange={(e) => updateForm.setData('position', e.target.value)}
                                                placeholder="Update Position"
                                                required
                                            />
                                        </div>
                                        <div className="mb-4 flex flex-col gap-2">
                                            <Label>Office Name</Label>

                                            <Select value={updateForm.data.office} onValueChange={(value) => updateForm.setData('office', value)}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select office" />
                                                </SelectTrigger>

                                                <SelectContent>
                                                    {offices.map((office) => (
                                                        <SelectItem key={office.encrypted_id} value={office.encrypted_id}>
                                                            {office.officeName}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="mb-4 flex flex-col gap-2">
                                            <Label>Contact Number</Label>
                                            <Input
                                                value={updateForm.data.contactNumber}
                                                onChange={(e) => updateForm.setData('contactNumber', e.target.value)}
                                                placeholder="Update Contact Number"
                                                required
                                            />
                                        </div>
                                        <div className="mb-4 flex flex-col gap-2">
                                            <Label>Birth Date</Label>
                                            <Input
                                                value={updateForm.data.birthDate}
                                                type="date"
                                                onChange={(e) => updateForm.setData('birthDate', e.target.value)}
                                                placeholder="Update Birth Date"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="">
                                        <div className="mb-4 flex flex-col gap-2">
                                            <Label>Start Date</Label>
                                            <Input
                                                value={updateForm.data.startDate}
                                                type="date"
                                                onChange={(e) => updateForm.setData('startDate', e.target.value)}
                                                placeholder="Update Start Date"
                                                required
                                            />
                                        </div>
                                        <div className="mb-4 flex flex-col gap-2">
                                            <Label>End Date</Label>
                                            <Input
                                                value={updateForm.data.endDate}
                                                type="date"
                                                onChange={(e) => updateForm.setData('endDate', e.target.value)}
                                                placeholder="Update End Date"
                                            />
                                        </div>
                                        <div className="mb-4 flex flex-col gap-2">
                                            <Label>Employment Type</Label>

                                            <Select
                                                value={updateForm.data.employmentType}
                                                onValueChange={(value) => updateForm.setData('employmentType', value)}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select employment type" />
                                                </SelectTrigger>

                                                <SelectContent>
                                                    <SelectItem value="regular">Regular</SelectItem>
                                                    <SelectItem value="job order">Job Order</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="mb-4 flex flex-col gap-2">
                                            <Label>Username</Label>
                                            <Input
                                                value={updateForm.data.email}
                                                onChange={(e) => updateForm.setData('email', e.target.value)}
                                                placeholder="Update Username"
                                                required
                                            />
                                        </div>
                                        <div className="mb-4 flex flex-col gap-2">
                                            <Label>Password</Label>
                                            <div className="relative">
                                                <Input
                                                    value={updateForm.data.password}
                                                    type={showPassword ? 'text' : 'password'}
                                                    onChange={(e) => updateForm.setData('password', e.target.value)}
                                                    placeholder="Update Password"
                                                />

                                                <button
                                                    type="button"
                                                    className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
                                                    onClick={() => setShowPassword((prev) => !prev)}
                                                    tabIndex={-1}
                                                >
                                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                                </button>
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-2 pt-2">
                                            <Label className="font-medium">Special Account?</Label>

                                            <RadioGroup
                                                value={updateForm.data.specialAccount}
                                                onValueChange={(value) => updateForm.setData('specialAccount', value)}
                                                className="flex flex-col gap-2"
                                            >
                                                {/* No / None Option */}
                                                <div className="flex items-center gap-2">
                                                    <RadioGroupItem value="No" id="special-account-none" />
                                                    <Label htmlFor="special-account-none" className="cursor-pointer">
                                                        No
                                                    </Label>
                                                </div>

                                                {/* If Yes label */}
                                                <div className="ml-6 text-sm text-gray-500">If Yes, specify type:</div>

                                                {/* Yes options */}
                                                <div className="ml-6 flex items-center gap-4">
                                                    <div className="flex items-center gap-2">
                                                        <RadioGroupItem value="Loan Encoder" id="special-account-loan-encoder" />
                                                        <Label htmlFor="special-account-loan-encoder" className="cursor-pointer">
                                                            Loan Encoder
                                                        </Label>
                                                    </div>

                                                    <div className="flex items-center gap-2">
                                                        <RadioGroupItem value="Loan Officer" id="special-account-loan-officer" />
                                                        <Label htmlFor="special-account-loan-officer" className="cursor-pointer">
                                                            Loan Officer
                                                        </Label>
                                                    </div>
                                                </div>
                                            </RadioGroup>
                                        </div>
                                    </div>
                                </div>

                                <DialogFooter>
                                    <DialogClose asChild>
                                        <Button variant="outline">Cancel</Button>
                                    </DialogClose>

                                    <Button onClick={updateEmployee} disabled={updateForm.processing}>
                                        {updateForm.processing ? 'Saving...' : 'Save'}
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>

                        <Dialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
                            <DialogContent className="sm:max-w-lg">
                                <DialogHeader>
                                    <DialogTitle>Delete Employee</DialogTitle>
                                    <DialogDescription>
                                        Are you sure you want to delete this employee? This action cannot be undone.
                                    </DialogDescription>
                                </DialogHeader>

                                <DialogFooter>
                                    <DialogClose asChild>
                                        <Button variant="outline">Cancel</Button>
                                    </DialogClose>

                                    <Button variant="destructive" onClick={removeEmployee} disabled={deleteForm.processing}>
                                        {deleteForm.processing ? 'Deleting...' : 'Delete'}
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>

                    <div className="grid grid-cols-1 items-center gap-3 sm:grid-cols-3">
                        <div className="flex items-center gap-2">
                            <Button
                                size="icon"
                                variant="secondary"
                                onClick={clearSearch}
                                disabled={searchEmployeeForm.processing}
                                className={!search && !office && !type ? 'hidden' : 'text-red-600'}
                            >
                                {clearEmployeeForm.processing ? (
                                    <LoaderCircle className="h-4 w-4 animate-spin" />
                                ) : (
                                    <EraserIcon className="h-4 w-4" />
                                )}
                            </Button>
                            <Select value={searchEmployeeForm.data.office} onValueChange={(value) => searchEmployeeForm.setData('office', value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="All Offices" />
                                </SelectTrigger>

                                <SelectContent>
                                    {offices.map((office) => (
                                        <SelectItem key={office.encrypted_id} value={office.encrypted_id}>
                                            {office.officeName}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Select value={searchEmployeeForm.data.type} onValueChange={(value) => searchEmployeeForm.setData('type', value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="All Types" />
                                </SelectTrigger>

                                <SelectContent>
                                    <SelectItem value="job order">Job Order</SelectItem>
                                    <SelectItem value="regular">Regular</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex items-center gap-2">
                            <Input
                                type="text"
                                placeholder="Search employees..."
                                onChange={(e) => searchEmployeeForm.setData('search', e.target.value)}
                                value={searchEmployeeForm.data.search}
                                className="flex-1"
                            />

                            <Button size="icon" onClick={searchEmployee} disabled={searchEmployeeForm.processing} className="">
                                {searchEmployeeForm.processing ? (
                                    <LoaderCircle className="h-4 w-4 animate-spin" />
                                ) : (
                                    <SearchIcon className="h-4 w-4" />
                                )}
                            </Button>
                        </div>
                    </div>

                    <Table>
                        <TableHeader>
                            <TableRow className="">
                                <TableHead className="w-[50px] text-center">#</TableHead>
                                <TableHead className="text-start text-nowrap">Name</TableHead>
                                <TableHead className="text-center text-nowrap">Office</TableHead>
                                <TableHead className="text-center text-nowrap">Age</TableHead>
                                <TableHead className="text-center text-nowrap">Start & End</TableHead>
                                <TableHead className="text-center text-nowrap">Type</TableHead>
                                <TableHead className="w-[200px] text-center text-nowrap">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {employees.data.length === 0 && employeesWithSpecialAccount.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={10} className="text-center text-[13px] text-gray-500">
                                        No Data Found
                                    </TableCell>
                                </TableRow>
                            ) : (
                                <>
                                    {/* 🔒 Pinned Accounts */}
                                    {employeesWithSpecialAccount.map((emp) => (
                                        <TableRow key={emp.encrypted_id} className="bg-yellow-50">
                                            <TableCell className="py-[6px] text-center font-semibold">📌</TableCell>

                                            <TableCell className="py-[6px] text-nowrap">
                                                <div className="flex items-center gap-2 font-semibold">
                                                    <div className="font-bold">{emp.name}</div>
                                                    <span className="rounded bg-green-200 px-2 py-[1px] text-[10px]">{emp.specialAccount}</span>
                                                </div>
                                                <small>{emp.employeeID} | <span className='text-gray-500'>{emp.position}</span></small>
                                            </TableCell>

                                            <TableCell className="py-[6px] text-center text-nowrap">{emp.office?.officeName}</TableCell>

                                            <TableCell className="py-[6px] text-center font-bold text-nowrap">
                                                {emp.birthDate ? <FormattedDate date={emp.birthDate} variant="age" /> : '-'}
                                            </TableCell>

                                            <TableCell className="py-[6px] text-center text-nowrap">
                                                <FormattedDate date={emp.startDate} variant="date" /> <span className="mx-2">|</span>
                                                {emp.endDate ? <FormattedDate date={emp.endDate} variant="date" /> : '-'}
                                            </TableCell>

                                            <TableCell className="py-[6px] text-center text-nowrap">
                                                {emp.employmentType === 'regular' ? 'Regular' : 'Job Order'}
                                            </TableCell>

                                            <TableCell className="py-[6px]">
                                                <div className="flex items-center justify-center gap-2">
                                                    <Button variant="secondary" size="icon" onClick={() => editEmployee(emp)}>
                                                        <PencilIcon className="text-gray-600" />
                                                    </Button>
                                                    <Button variant="secondary" size="icon" onClick={() => deleteEmployee(emp.encrypted_id)}>
                                                        <Trash2Icon className="text-red-600" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}

                                    {/* 👥 Normal Accounts */}
                                    {employees.data.map((emp, index) => (
                                        <TableRow key={emp.encrypted_id}>
                                            <TableCell className="py-[6px] text-center">
                                                {index + 1 + (employees.current_page - 1) * employees.per_page}
                                            </TableCell>

                                            <TableCell className="py-[6px] text-nowrap">
                                                <div className="font-bold">{emp.name}</div>
                                                <small>{emp.employeeID} | <span className='text-gray-500'>{emp.position}</span></small>
                                            </TableCell>

                                            <TableCell className="py-[6px] text-center text-nowrap">{emp.office?.officeName}</TableCell>

                                            <TableCell className="py-[6px] text-center font-bold text-nowrap">
                                                {emp.birthDate ? <FormattedDate date={emp.birthDate} variant="age" /> : '-'}
                                            </TableCell>

                                            <TableCell className="py-[6px] text-center text-nowrap">
                                                <FormattedDate date={emp.startDate} variant="date" /> <span className="mx-2">|</span>
                                                {emp.endDate ? <FormattedDate date={emp.endDate} variant="date" /> : '-'}
                                            </TableCell>

                                            <TableCell className="py-[6px] text-center text-nowrap">
                                                {emp.employmentType === 'regular' ? 'Regular' : 'Job Order'}
                                            </TableCell>

                                            <TableCell className="py-[6px]">
                                                <div className="flex items-center justify-center gap-2">
                                                    <Button variant="secondary" size="icon" onClick={() => editEmployee(emp)}>
                                                        <PencilIcon className="text-gray-600" />
                                                    </Button>
                                                    <Button variant="secondary" size="icon" onClick={() => deleteEmployee(emp.encrypted_id)}>
                                                        <Trash2Icon className="text-red-600" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </>
                            )}
                        </TableBody>
                    </Table>
                    <Pagination links={employees.links} />
                </SkeletonDelay>
            </div>
        </AppLayout>
    );
}
