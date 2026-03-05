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

  return (
    <main className="max-w-2xl mx-auto px-4 sm:px-8 py-10">
      <Link to={`/category/${situation.category}`}
        className="inline-flex items-center gap-1.5 text-xs font-mono text-cyber-muted hover:text-cyber-green mb-8 transition-colors fade-up">
        <ArrowLeft className="w-3.5 h-3.5" /> ../{category?.name ?? 'back'}
      </Link>

      {/* Header */}
      <div className="mb-8 fade-up-d1">
        <p className="font-mono text-xs text-cyber-green mb-3">// situation_selected</p>
        <div className="flex items-center gap-3 mb-3">
          <span className="text-4xl">{situation.emoji}</span>
          <h1 className="font-display font-bold text-xl sm:text-2xl text-cyber-text tracking-wide leading-tight">
            {situation.title}
          </h1>
        </div>
        {situation.books.length > 0 && (
          <p className="font-mono text-xs text-cyber-muted">
            <span className="text-cyber-green">// </span>
            {situation.books.length} recommendation{situation.books.length !== 1 ? 's' : ''} found
          </p>
        )}
        <div className="mt-4 h-px w-full" style={{ background: 'rgba(37,211,102,0.2)' }} />
      </div>

      {/* Books */}
      {situation.books.length > 0 ? (
        <section className="space-y-4 fade-up-d2">
          {situation.books.map(book => (
            <BookCard key={book.id} book={book} situationId={situation.id} />
          ))}
        </section>
      ) : (
        <div className="text-center py-16 rounded fade-up-d2"
          style={{ border: '1px solid rgba(37,211,102,0.15)' }}>
          <Clock className="w-10 h-10 mx-auto text-cyber-muted mb-4" />
          <p className="font-mono text-cyber-green text-xs mb-2">// coming_soon</p>
          <p className="text-cyber-muted text-sm max-w-sm mx-auto">
            We're curating books for this situation. Check back soon.
          </p>
          <Link to="/" className="btn-cyber inline-flex items-center gap-2 mt-6 px-5 py-2.5 rounded text-sm font-mono">
            explore_other_situations()
          </Link>
        </div>
      )}

      {/* Related */}
      {related.length > 0 && (
        <section className="mt-10 fade-up-d3">
          <p className="section-label font-mono text-xs text-cyber-muted uppercase tracking-widest mb-4">
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
