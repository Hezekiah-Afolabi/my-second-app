import { CATEGORIES } from '../data/categories';
import CategoryCard from '../components/CategoryCard';

export default function Home() {
  return (
    <main className="max-w-5xl mx-auto px-4 py-10 animate-fade-in">
      {/* Hero */}
      <div className="mb-12">
        <p className="font-mono text-xs text-cyber-green mb-3 tracking-widest">
          // book_recommendations.exe
        </p>
        <h1 className="font-display text-3xl sm:text-5xl font-bold leading-tight mb-4">
          <span className="text-cyber-text">What are you going</span>
          <br />
          <span className="text-cyber-green text-glow">through right now?</span>
        </h1>
        <p className="text-cyber-muted text-sm sm:text-base max-w-lg leading-relaxed">
          Get book recommendations for your exact life situation —
          curated with Nigerian availability and prices in Naira.
        </p>

        {/* Decorative terminal line */}
        <div className="mt-6 flex items-center gap-2 font-mono text-xs text-cyber-dim">
          <span className="text-cyber-green">›</span>
          <span>select a category to begin</span>
          <span className="inline-block w-1.5 h-3.5 bg-cyber-green animate-pulse ml-1" />
        </div>
      </div>

      {/* Category grid */}
      <section>
        <p className="section-label font-mono text-xs text-cyber-muted tracking-widest uppercase mb-4">
          categories
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {CATEGORIES.map(cat => (
            <CategoryCard key={cat.id} category={cat} />
          ))}
        </div>
      </section>

      {/* Footer */}
      <div className="mt-16 border-t border-cyber-border pt-6">
        <p className="font-mono text-xs text-cyber-dim">
          <span className="text-cyber-green">// </span>
          book data is human-curated &bull; prices are estimates &bull; check stores for current rates
        </p>
      </div>
    </main>
  );
}
