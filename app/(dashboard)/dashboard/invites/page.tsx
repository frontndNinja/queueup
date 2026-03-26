import { getMyPendingInvites } from "@/actions/invites";
import InviteCard from "@/app/UI/invites/invite-card";
export default async function InvitesPage() {
    const invites = await getMyPendingInvites();

    console.log(invites);
    return (
        invites.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full p-4 px-10">
                <h1 className="sm:text-lg-p1 mt-8 mb-8 self-start">No invites</h1>
            </div>
        ) : (
            <div className="flex flex-col items-center justify-center h-full p-4 px-10">
                <h1 className="sm:text-lg-p1 mt-8 mb-8 self-start">Invites</h1>
                <InviteCard invites={invites} />
            </div>
        )
    );
}