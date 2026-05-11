import AppShell from '@/components/AppShell';
import './globals.css';

export const metadata = {
  title: 'HostelPro - Corporate Hostel Management System',
  description: 'Admin panel for managing corporate hostel properties, bookings, payments, and staff.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <AppShell>
          {children}
        </AppShell>
      </body>
    </html>
  );
}
