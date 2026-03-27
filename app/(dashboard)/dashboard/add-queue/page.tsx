import { getAllUsers, getUser } from "@/actions/users";
import Breadcrumb from "@/app/UI/breadcrumb";
import AddQueueForm from "@/app/UI/form-elements/add-queue-form";
export default async function AddQueuePage() {

    const [allUsers, currentUser] = await Promise.all([getAllUsers(), getUser()]);
    const candidates = (allUsers ?? []).filter((u) => u.id !== currentUser?.id);

    return (
        <div>
            <Breadcrumb items={[{ label: "Dashboard", href: "/dashboard" }, { label: "Add queue", href: "/dashboard/queue/add-queue" }]} />
            <h1 className="text-lg-p1 py-4">Create Queue</h1>
            <AddQueueForm candidates={candidates} />
        </div>
    );
}