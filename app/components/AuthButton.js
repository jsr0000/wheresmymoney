"use client";

import { signOut, useSession } from "next-auth/react";
import { useState } from "react";
import SignInModal from "./SignInModal";

export default function AuthButton() {
    const { data: session } = useSession();
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            <div className="absolute top-5 right-10 z-40">
                {session ? (
                    <div className="flex items-center gap-4">
                        <span className="text-white">Welcome, {session.user?.name}</span>
                        <button
                            onClick={() => signOut()}
                            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                        >
                            Sign Out
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                    >
                        Sign In
                    </button>
                )}
            </div>

            <SignInModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </>
    );
} 