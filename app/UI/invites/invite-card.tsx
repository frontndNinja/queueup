"use client";

import { useRouter } from "next/navigation";
import { acceptInvite, declineInvite } from "@/actions/invites";
import Button from "../base/button";
import type { getMyPendingInvites } from "@/actions/invites";

type Invite = Awaited<ReturnType<typeof getMyPendingInvites>>[number];

export default function InviteCard({ invites }: { invites: Invite[]; }) {
    const router = useRouter();

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
            {invites.map((invite) => (
                <div key={invite.id} className="rounded-md border border-border p-3 grow">
                    <div className="flex flex-col items-center gap-2">
                        <h3 className="text-lg font-medium">{invite.queue.name}</h3>
                        <p className="text-sm text-muted-foreground">{invite.queue.description}</p>
                        <div className="flex gap-2">
                            <Button text="Accept" icon="CheckIcon" action={async () => {
                                await acceptInvite(invite.id);
                                router.refresh();
                            }} />
                            <Button text="Decline" icon="XIcon" action={async () => {
                                await declineInvite(invite.id);
                                router.refresh();
                            }} />
                        </div>

                        <span className="text-sm text-muted-foreground">
                            Invited by: {invite.invitedBy.name ?? invite.invitedBy.email ?? "Unknown"}
                        </span>
                    </div>
                </div>
            ))}
        </div>
    );
}