import { type LoanAmortization } from '@/types';
import BorrowersComponent from '../components/borrowers-component';
import { User, Paginated } from '@/types';

interface LoanOfficerProps {
    auth: {
        user: User;
    };
     borrowers: Paginated<LoanAmortization>;
}

export default function LoanOfficer({ borrowers, auth }: LoanOfficerProps) {
    return <BorrowersComponent borrowers={borrowers} auth={auth} />;
}
