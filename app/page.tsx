import Link from 'next/link';

const cards = [
  { href: '/learn', title: 'Learn', desc: 'Quizlet-style 10 question batches' },
  { href: '/scenario-learn', title: 'Scenario Learn', desc: 'Focused scenario-based CON 3990V learn-by-batch mode' },
  { href: '/exam', title: 'Exam Sprint', desc: 'Timed optional exam sets' },
  { href: '/flashcards', title: 'Flashcards', desc: 'Topic cards with reveal controls' },
  { href: '/bank', title: 'Question Bank', desc: 'Browse and bookmark by topic' },
  { href: '/bookmarks', title: 'Bookmarks', desc: 'Review your saved items' },
  { href: '/settings', title: 'Settings', desc: 'Reset and export local data' }
];

export default function HomePage() {
  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">Back2Basics Learn</h1>
      <p className="text-slate-300">No-login USAF contracting study companion.</p>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <Link key={card.href} href={{ pathname: card.href }} className="card transition hover:scale-[1.01] hover:border-brand">
            <h2 className="text-xl font-semibold">{card.title}</h2>
            <p className="text-slate-300">{card.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
