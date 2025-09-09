import type { ReactNode } from 'react';
import './globals.css';

export const metadata = {
  title: 'Zatrust Quickstart',
  description: 'Modular, testable Next.js starter',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="site-header">
          <a className="brand" href="/">Zatrust</a>
          <nav className="site-nav">
            <a className="nav-link" href="/login">Login</a>
            <a className="nav-link" href="/dashboard">Dashboard</a>
          </nav>
        </header>
        <main className="site-main">{children}</main>
      </body>
    </html>
  );
}
