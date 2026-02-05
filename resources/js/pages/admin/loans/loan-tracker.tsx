import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type LoanTracker, type User } from '@/types';
import { Head, router } from '@inertiajs/react';
import { Trash2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Loan Tracker',
        href: route('admin.loan-tracker'),
    },
];

interface LoanTrackerProps {
    auth: { user: User };
    officers: User[];
    trackers: LoanTracker[];
}

export default function LoanTracker({ auth, trackers, officers }: LoanTrackerProps) {
    const [trackersState, setTrackersState] = useState<{ officer: string; description: string }[]>(
        trackers.length
            ? trackers.map((t) => ({
                  officer: (t.user?.encrypted_id as string) || '',
                  description: t.description || '',
              }))
            : [{ officer: '', description: '' }],
    );

    const [submitting, setSubmitting] = useState(false);

    const addTracker = () => {
        setTrackersState([...trackersState, { officer: '', description: '' }]);
    };

    const updateOfficer = (index: number, value: string) => {
        const copy = [...trackersState];
        copy[index].officer = value;
        setTrackersState(copy);
    };

    const updateDescription = (index: number, value: string) => {
        const copy = [...trackersState];
        copy[index].description = value;
        setTrackersState(copy);
    };

    const saveTrackers = () => {
        const hasEmpty = trackersState.some((tracker) => !tracker.officer || !tracker.description.trim());

        if (hasEmpty) {
            
            toast('Incomplete Data', {
                description: 'Please fill in both Officer and Description for all trackers.',
                action: {
                    label: 'Close',
                    onClick: () => console.log(''),
                },
            });
            return;
        }

        setSubmitting(true);
        router.post(
            route('admin.loan-tracker.store-or-update'),
            { trackers: trackersState },
            {
                onSuccess: () => {
                    toast('Updated', {
                        description: 'Loan Tracker has been updated successfully.',
                        action: {
                            label: 'Close',
                            onClick: () => console.log(''),
                        },
                    });
                    setSubmitting(false);
                },
                onError: () => {
                    setSubmitting(false);
                },
            },
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs} auth={auth}>
            <Head title="Loan Tracker" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex flex-col gap-1">
                    <Label className="text-sm font-bold text-gray-500">Loan Tracker</Label>
                </div>

                <div className="flex flex-col gap-3">
                    {trackersState.map((tracker, index) => (
                        <>
                            <div key={index} className="grid grid-cols-1 gap-4 lg:grid-cols-[6fr_6fr_1fr]">
                                {/* Officer Select */}
                                <div className="flex items-center gap-3">
                                    <div className="text-[13px] font-bold">{index + 1}</div>
                                    <Select value={tracker.officer} onValueChange={(val) => updateOfficer(index, val)}>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select Officer" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {officers.map((officer) => (
                                                <SelectItem
                                                    key={officer.encrypted_id as string}
                                                    value={officer.encrypted_id as string}
                                                    className="text-left"
                                                >
                                                    {officer.name}{' '}
                                                    <Badge variant="outline" className="text-[11px]">
                                                        {officer.specialAccount}
                                                    </Badge>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Description Input */}
                                <Input
                                    placeholder="Description"
                                    value={tracker.description}
                                    onChange={(e) => updateDescription(index, e.target.value)}
                                    className="flex-1"
                                />

                                {/* Remove Button */}
                                <Button
                                    type="button"
                                    variant="secondary"
                                    onClick={() => {
                                        const copy = [...trackersState];
                                        copy.splice(index, 1);
                                        setTrackersState(copy);
                                    }}
                                    className="mb-5 h-10 px-3 lg:mb-0"
                                >
                                    <Trash2 className="text-red-600" />
                                </Button>
                            </div>
                        </>
                    ))}

                    {/* Add + Save buttons */}
                    <div className="flex items-center justify-start gap-3 pt-2">
                        <Button type="button" size="sm" variant="secondary" className="text-[12px]" onClick={addTracker}>
                            + Add
                        </Button>

                        <Button type="button" size="sm" className="text-[12px]" onClick={saveTrackers} disabled={submitting}>
                            {submitting ? 'Saving...' : 'Save & Update'}
                        </Button>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
