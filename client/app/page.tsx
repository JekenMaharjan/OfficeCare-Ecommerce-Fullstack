"use client"

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useRouter } from "next/navigation";

const page = () => {
    const router = useRouter();

    const routeToRegister = () => {
        router.push('/register');
    };

    const routeToSignin = () => {
        router.push('/signin');
    };

    return (
        <div className="flex flex-col h-screen w-screen bg-gradient-to-br from-blue-500 to-purple-500 justify-center items-center p-4">
            <div className="flex flex-col gap-8 sm:gap-10 bg-black/40 backdrop-blur-lg p-8 sm:p-12 md:p-16 rounded-3xl shadow-2xl items-center text-center transition-all duration-500 hover:scale-105">

                {/* Logo */}
                <Image
                    src="/OfficeCareLogo.png"
                    alt="OfficeCare Logo"
                    width={150}
                    height={150}
                    className="sm:w-40 sm:h-40 w-32 h-32"
                    loading="eager"
                />

                {/* Heading */}
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-blue-400 tracking-wide">
                    WELCOME TO OFFICE CARE
                </h1>

                {/* Subheading */}
                <p className="text-gray-200 text-md max-w-md">
                    Your one-stop shop for office supplies and equipment. Quality products, fast delivery, and seamless shopping experience.
                </p>

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 mt-4">
                    <Button
                        onClick={routeToSignin}
                        className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-xl shadow-lg transform transition hover:scale-105 duration-300"
                    >
                        Sign In
                    </Button>

                    <Button
                        onClick={routeToRegister}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-xl shadow-lg transform transition hover:scale-105 duration-300"
                    >
                        Register
                    </Button>
                </div>

            </div>
        </div>
    );
};

export default page;