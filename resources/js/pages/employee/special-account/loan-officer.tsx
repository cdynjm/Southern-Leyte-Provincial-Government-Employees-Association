import FormattedDate from '@/components/formatted-date';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { type LoanAmortization } from '@/types';
import { Link, useForm } from '@inertiajs/react';
import { CircleMinus, EyeIcon, Send } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
interface LoanOfficerProps {
    borrowers: LoanAmortization[];
}

export default function LoanOfficer({ borrowers }: LoanOfficerProps) {
    const [openForwardLoanDialog, setOpenForwardLoanDialog] = useState(false);

    const forwardLoanForm = useForm({
        encrypted_id: '',
    });

    const confirmForwardingLoan = (encrypted_id: string) => {
        forwardLoanForm.setData({ encrypted_id: String(encrypted_id) });
        setOpenForwardLoanDialog(true);
    };

    const forwardLoan = () => {
        forwardLoanForm.patch(route('employee.forward-loan'), {
            onSuccess: () => {
                toast('Deleted', {
                    description: 'Transaction has been processed successfully.',
                    action: {
                        label: 'Close',
                        onClick: () => console.log(''),
                    },
                });
                setOpenForwardLoanDialog(false);
            },
            onError: (errors) => {
                toast('Failed', {
                    description: errors?.forwarding || 'Something went wrong.',
                });
            },
        });
    };

    return (
        <>
            <Dialog open={openForwardLoanDialog} onOpenChange={setOpenForwardLoanDialog}>
                <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Done Processing?</DialogTitle>
                        <DialogDescription>Are you sure you want to confirm this transaction?</DialogDescription>
                    </DialogHeader>

                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>

                        <Button variant="default" onClick={forwardLoan} disabled={forwardLoanForm.processing}>
                            {forwardLoanForm.processing ? 'Processing...' : 'Yes'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            <Label className="text-uppercase mb-2 flex items-center gap-2 text-sm font-bold text-gray-500">
                <CircleMinus className="text-red-500" />
                <span>Loans to be processed</span> |{' '}
                <span className="text-[12px] font-normal">(Loans that are pending and to be forwarded/approved.)</span>
            </Label>

            <Table>
                <TableHeader>
                    <TableRow className="">
                        <TableHead className="w-[50px] text-center">#</TableHead>
                        <TableHead className="text-start text-nowrap">Name</TableHead>
                        <TableHead className="text-center text-nowrap">Amount Borrowed</TableHead>
                        <TableHead className="text-center text-nowrap">Net Proceeds</TableHead>
                        <TableHead className="text-center text-nowrap">Date Applied</TableHead>
                        <TableHead className="text-center text-nowrap">Payment Status</TableHead>
                        <TableHead className="text-center text-nowrap">Status</TableHead>
                        <TableHead className="w-[200px] text-center text-nowrap">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {borrowers.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={10} className="text-center text-[13px] text-gray-500">
                                No pending loans found.
                            </TableCell>
                        </TableRow>
                    ) : (
                        <>
                            {borrowers.map((bor, index) => (
                                <TableRow key={bor.encrypted_id}>
                                    <TableCell className="py-[6px] text-center">{index + 1}</TableCell>

                                    <TableCell className="py-[6px] text-nowrap">
                                        <div className="font-bold">{bor.user?.name}</div>
                                        <small>
                                            {bor.user?.employeeID} | <span className="text-gray-500">{bor.user?.position}</span>
                                        </small>
                                    </TableCell>

                                    <TableCell className="py-[6px] text-center text-nowrap">
                                        <div className="font-bold">
                                            ₱
                                            {Number(bor.borrowed).toLocaleString('en-PH', {
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2,
                                            })}
                                        </div>{' '}
                                        <small>
                                            with a{' '}
                                            <span className="font-bold text-green-600">
                                                {Number(bor.rateInMonth) % 1 === 0 ? Number(bor.rateInMonth) : Number(bor.rateInMonth)}%
                                            </span>{' '}
                                            rate in month for <span className="font-bold">{bor.periodInMonths}</span> month/s
                                        </small>
                                    </TableCell>

                                    <TableCell className="py-[6px] text-center font-bold text-nowrap text-blue-600">
                                        ₱
                                        {Number(bor.netProceeds).toLocaleString('en-PH', {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2,
                                        })}
                                    </TableCell>

                                    <TableCell className="py-[6px] text-center text-[13px] font-normal text-nowrap">
                                        <FormattedDate date={bor.dateApplied} variant="date" />
                                    </TableCell>

                                    <TableCell className="py-[6px] text-center font-bold text-nowrap">
                                          <Badge variant={bor.paymentStatus === 'unpaid' ? "destructive" : "default"}>{bor.paymentStatus}</Badge>
                                    </TableCell>

                                    <TableCell className="py-[6px] text-center font-bold text-nowrap">
                                          <Badge variant={bor.status === 'pending' ? "destructive" : "default"}>{bor.status}</Badge>
                                    </TableCell>

                                    <TableCell className="py-[6px]">
                                        <div className="flex items-center justify-center gap-2">
                                            <Link href={route('employee.view-employee-loan', { encrypted_id: bor.encrypted_id })}>
                                                <Button variant="secondary" size="sm" className="text-[13px]">
                                                    <EyeIcon />
                                                </Button>
                                            </Link>

                                            <Button
                                                variant="secondary"
                                                size="sm"
                                                className="text-[13px]"
                                                disabled={forwardLoanForm.processing}
                                                onClick={() => confirmForwardingLoan(bor.encrypted_id)}
                                            >
                                                <Send />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </>
                    )}
                </TableBody>
            </Table>
        </>
    );
}
