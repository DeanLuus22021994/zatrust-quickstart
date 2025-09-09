export const metadata = {
  title: 'Zatrust Quickstart',
  description: 'Modular, testable Next.js starter',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header style={{ padding: '1rem', borderBottom: '1px solid #eee' }}>
          <a href="/">Zatrust</a>
          <nav style={{ marginLeft: '1rem', display: 'inline-block' }}>
            <a href="/login" style={{ marginRight: '1rem' }}>Login</a>
            <a href="/dashboard">Dashboard</a>
          </nav>
        </header>
        <main style={{ padding: '2rem' }}>{children}</main>
      </body>
    </html>
  );
}
