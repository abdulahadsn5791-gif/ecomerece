import Footer from "@/components/footer/Footer";
import Navbar from "@/components/navbar/NavBar";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div>
            <Navbar />
            {children}
            <Footer />
        </div>
    );
}