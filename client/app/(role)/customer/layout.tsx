import Navbar from "@/components/customer/Navbar";
import Footer from "@/components/layout/Footer";
import { Toaster } from "@/components/ui/sonner";

export default function CustomerLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen max-w-screen flex flex-col overflow-hidden">
            <Toaster position="bottom-right" richColors />
            <Navbar />
            <main className="flex-1 overflow-auto bg-gradient-to-br from-blue-500 to-purple-500 flex p-10 justify-center w-screen">{children}</main>
            <Footer />
        </div>
    );
}
