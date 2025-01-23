"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignInModal({ isOpen, onClose }) {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        
        e.preventDefault();
        try {
            const result = await signIn("credentials", {
                email,
                password,
                redirect: false,
            });

            if (result.error) {
                setError("Invalid credentials");
                return;
            }

            onClose();
        } catch (error) {
            setError("Something went wrong");
        }
    };

    const handleOverlayClick = (e) => {
        // Only close if the actual overlay was clicked, not its children
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        // Changed this div to handle the overlay click
        <div
            className="fixed inset-0 z-50 flex items-center justify-center"
            onClick={handleOverlayClick}
        >
            {/* Blur overlay */}
            <div className="absolute inset-0 backdrop-blur-xl bg-black/30" />

            {/* Sign-in box */}
            <div
                className="bg-[#171717] p-8 rounded-lg shadow-xl w-96 text-white relative z-10"
                onClick={(e) => e.stopPropagation()}
            >
                <h1 className="text-2xl font-bold mb-6 text-center">Sign In</h1>

                {error && (
                    <p className="text-red-500 text-sm mb-4">{error}</p>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="mt-1 block w-full rounded-md border border-gray-600 px-3 py-2 bg-[#232323] text-white"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="mt-1 block w-full rounded-md border border-gray-600 px-3 py-2 bg-[#232323] text-white"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
                    >
                        Sign In
                    </button>
                </form>

                <div className="mt-4">
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-600" />
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-[#171717] text-gray-400">Or continue with</span>
                        </div>
                    </div>

                    <button
                        onClick={() => signIn("google", { callbackUrl: '/' })}
                        className="mt-4 w-full flex items-center justify-center gap-2 bg-[#232323] border border-gray-600 rounded-md px-4 py-2 text-white hover:bg-[#2a2a2a]"
                    >
                        <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
                        Sign in with Google
                    </button>
                </div>
            </div>
        </div>
    );
}
