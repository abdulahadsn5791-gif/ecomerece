// app/layout.tsx
import { ClerkProvider } from '@clerk/nextjs';
import './globals.css';
import { Providers } from './Providers';
import { ThemeProvider } from './providers/ThemeProvider';
import { AppLoader } from './providers/AppLoader';
import { QueryProvider } from './providers/QueryProvider';
import Bootloader from './providers/Bootloader';



export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased dark:bg-slate-950 dark:text-slate-100">
        <ClerkProvider publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}>
          <QueryProvider>
            <Bootloader>
              <ThemeProvider>
                {children}
              </ThemeProvider>
            </Bootloader>
          </QueryProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}