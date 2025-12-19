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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Employees, type User } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { Eye, EyeOff, PencilIcon, Trash2Icon } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Employees',
        href: route('admin.employees')
    },
];
interface EmployeesProps {
    auth: {
        user: User;
    };
    employees: Employees[];
}

export default function Employees({ auth, employees }: EmployeesProps) {
    const [showPassword, setShowPassword] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

    const createForm = useForm({
        name: '',
        position: '',
        email: '',
        password: '',
    });

    const addEmployee = () => {
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
        position: '',
        email: '',
        password: '',
    });

    const editEmployee = (employee: Employees) => {
        updateForm.setData({
            encrypted_id: String(employee.encrypted_id),
            name: String(employee.name),
            position: String(employee.position),
            email: String(employee.email),
            password: ''
        });
        setOpenEditDialog(true);
    };

    const updateEmployee = () => {
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
        encrypted_id: ''
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

                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Add New Employee</DialogTitle>
                                <DialogDescription>Fill in the details below to add a new employee.</DialogDescription>
                            </DialogHeader>

                            <div className="grid gap-4 py-4">
                                <div className="flex flex-col gap-2">
                                    <Label>Name</Label>
                                    <Input
                                        value={createForm.data.name}
                                        onChange={(e) => createForm.setData('name', e.target.value)}
                                        placeholder="Enter Full Name"
                                        required
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <Label>Position</Label>
                                    <Input
                                        value={createForm.data.position}
                                        onChange={(e) => createForm.setData('position', e.target.value)}
                                        placeholder="Enter Position"
                                        required
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <Label>Username</Label>
                                    <Input
                                        value={createForm.data.email}
                                        onChange={(e) => createForm.setData('email', e.target.value)}
                                        placeholder="Enter Username"
                                        required
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
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
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Edit Employee</DialogTitle>
                                <DialogDescription>Update the employee details below.</DialogDescription>
                            </DialogHeader>

                            <div className="grid gap-4 py-4">
                                <div className="flex flex-col gap-2">
                                    <Label>Name</Label>
                                    <Input
                                        value={updateForm.data.name}
                                        onChange={(e) => updateForm.setData('name', e.target.value)}
                                        placeholder="Update Full Name"
                                        required
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <Label>Position</Label>
                                    <Input
                                        value={updateForm.data.position}
                                        onChange={(e) => updateForm.setData('position', e.target.value)}
                                        placeholder="Update Position"
                                        required
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <Label>Username</Label>
                                    <Input
                                        value={updateForm.data.email}
                                        onChange={(e) => updateForm.setData('email', e.target.value)}
                                        placeholder="Update Username"
                                        required
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
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
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Delete Employee</DialogTitle>
                                <DialogDescription>Are you sure you want to delete this employee? This action cannot be undone.</DialogDescription>
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
                <Table>
                    <TableHeader>
                        <TableRow className="">
                            <TableHead className="w-[50px] text-center">#</TableHead>
                            <TableHead className="text-start text-nowrap">Name</TableHead>
                            <TableHead className="text-center text-nowrap">Position</TableHead>
                            <TableHead className="w-[200px] text-center text-nowrap">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {employees.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center text-[13px] text-gray-500">
                                    No Data Found
                                </TableCell>
                            </TableRow>
                        ) : (
                            employees.map((emp, index) => (
                                <TableRow key={emp.encrypted_id}>
                                    <TableCell className="py-[6px] text-center">{index + 1}</TableCell>
                                    <TableCell className="py-[6px] text-nowrap">{emp.name}</TableCell>
                                    <TableCell className="py-[6px] text-center text-nowrap">{emp.position}</TableCell>
                                    <TableCell className='py-[6px]'>
                                        <div className="flex items-center gap-2 ">
                                            <Button variant="outline" className="text-[11px]" size="icon" onClick={() => editEmployee(emp)}>
                                                <PencilIcon />
                                            </Button>
                                            <Button variant="destructive" className="text-[11px]" size="icon" onClick={() => deleteEmployee(emp.encrypted_id)}>
                                                <Trash2Icon />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </AppLayout>
    );
}
