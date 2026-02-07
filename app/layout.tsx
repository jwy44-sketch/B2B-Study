import './globals.css';
import Link from 'next/link';

export const metadata = {
  title: 'Back2Basics Learn',
  description: 'USAF contracting study app'
};

const links = ['/', '/learn', '/exam', '/flashcards', '/bank', '/bookmarks', '/settings'];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="sticky top-0 z-40 border-b border-slate-800 bg-slate-950/90 backdrop-blur">
          <nav className="mx-auto flex max-w-6xl gap-3 overflow-auto p-3 text-sm">
            {links.map((href) => (
              <Link key={href} href={href} className="rounded px-2 py-1 hover:bg-slate-800">
                {href === '/' ? 'home' : href.slice(1)}
              </Link>
            ))}
          </nav>
        </header>
        <main className="mx-auto max-w-6xl p-4">{children}</main>
      </body>
    </html>
  );
}
