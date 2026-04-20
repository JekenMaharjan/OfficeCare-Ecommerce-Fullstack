"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function HomePage() {
    const router = useRouter();

    return (
        <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-blue-500 to-purple-500 p-4">
            <div className="flex flex-col items-center gap-8 sm:gap-10 rounded-3xl bg-black/40 p-8 text-center shadow-2xl backdrop-blur-lg transition-transform duration-500 hover:scale-[1.02] sm:p-12 md:p-16">

                {/* Logo */}
                <Image
                    src="/OfficeCareLogo.png"
                    alt="OfficeCare Logo"
                    width={140}
                    height={140}
                    priority
                    className="h-28 w-28 sm:h-36 sm:w-36"
                />

                {/* Title */}
                <h1 className="text-2xl font-bold tracking-wide text-blue-400 sm:text-3xl md:text-4xl">
                    WELCOME TO OFFICE CARE
                </h1>

                {/* Description */}
                <p className="max-w-md text-sm text-gray-200 sm:text-base">
                    Your one-stop shop for office supplies and equipment. Quality products,
                    fast delivery, and a seamless shopping experience built for productivity.
                </p>

                {/* Buttons */}
                <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:gap-6">

                    <Button
                        onClick={() => router.push("/signin")}
                        className="rounded-xl bg-green-500 px-6 py-3 text-white shadow-lg transition hover:scale-105 hover:bg-green-600"
                    >
                        Sign In
                    </Button>

                    <Button
                        onClick={() => router.push("/register")}
                        className="rounded-xl bg-blue-500 px-6 py-3 text-white shadow-lg transition hover:scale-105 hover:bg-blue-600"
                    >
                        Register
                    </Button>

                </div>

            </div>
        </div>
    );
}