import { ClerkProvider } from '@clerk/nextjs';
import './globals.css'
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <html lang="en">
      <body>
        <ClerkProvider publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}>
          {children}
        </ClerkProvider>
      </body>
    </html>
  );
}