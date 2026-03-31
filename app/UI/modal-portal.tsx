"use client";

import { createPortal } from "react-dom";
import { useSyncExternalStore } from "react";

function subscribe() {
    return () => { };
}

function getSnapshot() {
    return true; // client render
}

function getServerSnapshot() {
    return false; // server render
}

export default function ModalPortal({ children }: { children: React.ReactNode; }) {
    const mounted = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
    if (!mounted) return null;
    return createPortal(children, document.body);
}