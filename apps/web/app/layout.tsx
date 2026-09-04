// app/layout.tsx
import './globals.css';
import { ThemeProvider } from './providers/ThemeProvider';
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

        <QueryProvider>
          <Bootloader>
            <ThemeProvider>
              {children}
            </ThemeProvider>
          </Bootloader>
        </QueryProvider>
      </body>
    </html>
  );
}