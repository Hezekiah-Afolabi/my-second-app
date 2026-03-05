import { Link, useParams, Navigate } from 'react-router-dom';
import { ArrowLeft, Clock } from 'lucide-react';
import { getSituationById } from '../data/situations';
import { CATEGORIES } from '../data/categories';
import BookCard from '../components/BookCard';
import SituationCard from '../components/SituationCard';

export default function SituationPage() {
  const { situationId } = useParams<{ situationId: string }>();
  const situation = getSituationById(situationId ?? '');

  if (!situation) return <Navigate to="/" replace />;

  const category = CATEGORIES.find(c => c.id === situation.category);
  const related = situation.relatedSituations
    .map(id => getSituationById(id))
    .filter(Boolean)
    .slice(0, 3) as NonNullable<ReturnType<typeof getSituationById>>[];

  const hasBooks = situation.books.length > 0;

  return (
    <main className="max-w-2xl mx-auto px-4 py-6 animate-fade-in">
      {/* Back */}
      <Link
        to={`/category/${situation.category}`}
        className="inline-flex items-center gap-1.5 text-xs font-mono text-cyber-dim hover:text-cyber-green mb-6 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        ../{category?.name ?? 'back'}
      </Link>

      {/* Header */}
      <div className="mb-8">
        <p className="font-mono text-xs text-cyber-green mb-2">// situation_selected</p>
        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl">{situation.emoji}</span>
          <h1 className="font-display text-xl sm:text-2xl font-bold text-cyber-text leading-tight">
            {situation.title}
          </h1>
        </div>
        {hasBooks && (
          <p className="font-mono text-xs text-cyber-muted mt-2">
            <span className="text-cyber-green">// </span>
            {situation.books.length} recommendation{situation.books.length !== 1 ? 's' : ''} found
          </p>
        )}
        <div className="mt-4 h-px w-full bg-cyber-border" />
      </div>

      {/* Books */}
      {hasBooks ? (
        <section className="space-y-4">
          {situation.books.map(book => (
            <BookCard key={book.id} book={book} situationId={situation.id} />
          ))}
        </section>
      ) : (
        <div className="text-center py-16 px-4 border border-cyber-border rounded">
          <Clock className="w-10 h-10 mx-auto text-cyber-dim mb-4" />
          <p className="font-mono text-cyber-green text-sm mb-1">// coming_soon</p>
          <p className="text-cyber-muted text-sm max-w-sm mx-auto">
            We are curating books for this situation. Check back soon or explore a ready category.
          </p>
          <Link
            to="/"
            className="btn-cyber inline-flex items-center gap-2 mt-6 px-5 py-2.5 rounded text-sm font-mono"
          >
            explore_other_situations()
          </Link>
        </div>
      )}

      {/* Related */}
      {related.length > 0 && (
        <section className="mt-10">
          <p className="section-label font-mono text-xs text-cyber-muted uppercase tracking-widest mb-3">
            related_situations
          </p>
          <div className="space-y-2">
            {related.map(s => <SituationCard key={s.id} situation={s} />)}
          </div>
        </section>
      )}
    </main>
  );
}
