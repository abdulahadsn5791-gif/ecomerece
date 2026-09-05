import Aside from "@/components/aside/Aside";
import Footer from "@/components/footer/Footer";
import Navbar from "@/components/navbar/NavBar";
import BgProvider from "../providers/BgProvider";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <BgProvider>
            <Navbar />
            <div className="max-w-7xl h-screen bg-inheri mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="grid grid-cols-1 bg-inheri lg:grid-cols-4 gap-8">

                    <div className=""><Aside /></div>
                    {children}
                </div>
            </div>
            <Footer />
        </BgProvider>
    );
}


