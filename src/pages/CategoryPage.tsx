import { Link, useParams, Navigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { CATEGORIES } from '../data/categories';
import { getSituationsByCategory } from '../data/situations';
import SituationCard from '../components/SituationCard';

export default function CategoryPage() {
  const { categoryId } = useParams<{ categoryId: string }>();
  const category = CATEGORIES.find(c => c.id === categoryId);

  if (!category) return <Navigate to="/" replace />;

  const situations = getSituationsByCategory(category.id);
  const withBooks = situations.filter(s => s.books.length > 0);
  const comingSoon = situations.filter(s => s.books.length === 0);

  return (
    <main className="max-w-2xl mx-auto px-4 py-6 animate-fade-in">
      {/* Back */}
      <Link
        to="/"
        className="inline-flex items-center gap-1.5 text-xs font-mono text-cyber-dim hover:text-cyber-green mb-6 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        ../home
      </Link>

      {/* Header */}
      <div className="mb-8">
        <p className="font-mono text-xs text-cyber-green mb-2">// category</p>
        <div className="flex items-center gap-3 mb-2">
          <span className="text-4xl">{category.emoji}</span>
          <h1 className="font-display text-2xl font-bold text-cyber-text">{category.name}</h1>
        </div>
        <p className="text-cyber-muted text-sm mb-4">{category.description}</p>
        <div className="flex gap-4 font-mono text-xs">
          <span className="text-cyber-dim">{situations.length} situations</span>
          <span className="text-cyber-green">{withBooks.length} ready</span>
          <span className="text-cyber-dim">{comingSoon.length} coming_soon</span>
        </div>

        {/* Accent bar */}
        <div className="mt-4 h-px w-full" style={{ background: category.gradient }} />
      </div>

      {/* Ready situations */}
      {withBooks.length > 0 && (
        <section className="mb-6">
          <p className="section-label font-mono text-xs text-cyber-muted uppercase tracking-widest mb-3">
            ready
          </p>
          <div className="space-y-2">
            {withBooks.map(s => <SituationCard key={s.id} situation={s} />)}
          </div>
        </section>
      )}

      {/* Coming soon */}
      {comingSoon.length > 0 && (
        <section>
          <p className="section-label font-mono text-xs text-cyber-muted uppercase tracking-widest mb-3">
            coming_soon
          </p>
          <div className="space-y-2">
            {comingSoon.map(s => <SituationCard key={s.id} situation={s} />)}
          </div>
        </section>
      )}
    </main>
  );
}
