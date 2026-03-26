import { prisma } from "@/lib/prisma";
import { getUser, getAllUsers } from "@/actions/users";
import EditQueueForm from "@/app/UI/form-elements/edit-queue-form";
import Breadcrumb from "@/app/UI/breadcrumb";


export default async function EditQueuePage({
    params,
}: {
    params: Promise<{ queueId: string; }>;
}) {
    const { queueId } = await params;

    const [currentUser, allUsers, queue] = await Promise.all([
        getUser(),
        getAllUsers(),
        prisma.queue.findUnique({
            where: { id: queueId },
            include: {
                members: {
                    include: {
                        user: {
                            select: { id: true, name: true, email: true },
                        },
                    },
                },
                invites: {
                    where: { status: "PENDING" },
                    include: {
                        invitedUser: { select: { id: true, name: true, email: true } },
                    },
                },
            },
        }),
    ]);

    if (!currentUser || !queue) {
        return <div className="p-4">Queue not found or access denied.</div>;
    }

    const isMember = queue.members.some((m) => m.userId === currentUser.id);
    const isOwner = queue.ownerId === currentUser.id;

    if (!isMember && !isOwner) {
        return <div className="p-4">Queue not found or access denied.</div>;
    }

    const currentMemberIds = new Set(queue.members.map((m) => m.userId));
    const pendingInviteIds = new Set(queue.invites.map((i) => i.invitedUserId));

    const candidates = (allUsers ?? []).filter((u) => {
        if (!u?.id) return false;
        if (u.id === currentUser.id) return false;
        if (currentMemberIds.has(u.id)) return false;
        if (pendingInviteIds.has(u.id)) return false;
        return true;
    });

    const members = queue.members.map((m) => ({
        userId: m.userId,
        role: m.role,
        name: m.user.name,
        email: m.user.email,
    }));

    const pendingInvites = queue.invites.map((i) => ({
        id: i.id,
        invitedUserId: i.invitedUserId,
        name: i.invitedUser.name,
        email: i.invitedUser.email,
    }));

    return (
        <div>
            <Breadcrumb items={[{ label: "Dashboard", href: "/dashboard" }, { label: queue.name, href: "/dashboard/queue/" + queueId }, { label: "Edit", href: "/dashboard/queue/" + queueId + "/edit-queue" }]} />

            <h1 className="sm:text-lg-p1 py-4">Edit {queue.name}</h1>
            <EditQueueForm
                queueId={queue.id}
                initialName={queue.name}
                initialDescription={queue.description ?? ""}
                isOwner={isOwner}
                currentUserId={currentUser.id}
                members={members}
                pendingInvites={pendingInvites}
                candidates={candidates}
            />
        </div>
    );
}