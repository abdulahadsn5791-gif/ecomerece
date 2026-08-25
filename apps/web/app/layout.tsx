import { ClerkProvider } from "@clerk/nextjs";
import './globals.css'
import Navbar from "@/components/navbar/NavBar";
import Footer from "@/components/footer/Footer";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>{children}</body>
      </html>
    </ClerkProvider>
  );
}