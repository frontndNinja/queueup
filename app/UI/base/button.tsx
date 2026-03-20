"use client";
import { useRouter } from "next/navigation";
export default function Button({
    text,
    action,
    goTo,
}: {
    text: string;
    action?: () => void;
    goTo?: string;
}) {
    const router = useRouter();
    const handleClick = () => {
        if (goTo) {
            router.push(goTo);
            return;
        }
        if (action) {
            action();
        }
    };
    return (
        <button
            onClick={handleClick}
            className="flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
            {text}
        </button>
    );
}
