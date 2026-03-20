
import { Metadata } from 'next';
import Logout from '../../UI/form-elements/logout';
export const metadata: Metadata = {
    title: "Dashboard",
};
//(list queues)
export default function DashboardPage() {
    return (
        <div>
            <p>this is a dashboard page</p>
            <Logout />
        </div>
    );
}