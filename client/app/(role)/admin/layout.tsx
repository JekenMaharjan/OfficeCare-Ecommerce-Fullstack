import Navbar from "@/components/admin/Navbar";
import Footer from "@/components/layout/Footer";
import { Toaster } from "@/components/ui/sonner";

export default function CustomerLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen max-w-screen flex flex-col overflow-hidden">
            <Toaster position="bottom-right" richColors />
            <Navbar />
            <main className="flex flex-1 justify-center overflow-auto bg-gradient-to-br from-blue-500 to-purple-500 p-10">{children}</main>
            <Footer />
        </div>
    );
}
