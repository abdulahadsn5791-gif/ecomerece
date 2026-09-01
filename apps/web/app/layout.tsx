
import { ClerkProvider } from '@clerk/nextjs';
import './globals.css'
import { GlobalLoader, ToastContainer } from '@ecomerece/frontend';
import { Providers } from './Providers';
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <html lang="en">
      <body>

        <ClerkProvider publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}>
          <Providers>
            {children}
          </Providers>
        </ClerkProvider>
      </body>
    </html>
  );
}