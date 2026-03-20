
import { Metadata } from 'next';
import SignOutButton from '@/app/UI/form-elements/signout-button';
import Link from 'next/link';

export const metadata: Metadata = {
    title: "Dashboard",
};
//(list all queues the user is a member of)
//TODO: Get items from the database (use API)

//Hent ind fra apii med et tmdbId. Dette skal findes fra en liste af tilføjede serier/film
export default function DashboardPage() {

    //! NEXT: Vis alle queues der brugeren er medlem af, kun med navn, posters/navn i en karrusel for hver queue
    return (
        <div className="min-h-screen min-w-screen">
            <nav className="flex items-center justify-center gap-4 p-4">
                <SignOutButton />
            </nav>
            <main className="bg-gray-50 w-full h-full flex gap-4 flex-col p-4">
                <p>this is a dashboard page</p>
                <Link href="/dashboard/queue/92378e0d9029wiu">Go to test queue 1</Link>
                <Link href="/dashboard/queue/92378e0d9we9wiu">Go to test queue 2</Link>
                <Link href="/dashboard/queue/9237834d9029wiu">Go to test queue 3</Link>
            </main>
        </div>
    );
}