import { type User } from '@/types';

interface LoanOfficerProps {
    auth: {
        user: User;
    };
}

export default function LoanOfficer({ auth }: LoanOfficerProps) {
    return (
        <div>
           {auth.user.name}
        </div>
    );
}