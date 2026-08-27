"use client";

import dynamic from 'next/dynamic';

const AuthPageContent = dynamic(
    () => import('./AuthPageContent'),
    { ssr: false }
);

export default function AuthPage() {
    return <AuthPageContent />;
}