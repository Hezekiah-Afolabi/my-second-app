import { CATEGORIES } from '../data/categories';
import CategoryCard from '../components/CategoryCard';

export default function Home() {
  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-8 py-16">

      {/* Hero */}
      <div className="mb-16">
        <p className="font-mono text-xs text-cyber-green mb-4 tracking-widest fade-up">
          // book_recommendations.exe
        </p>

        <h1 className="font-display font-black leading-tight mb-6 fade-up-d1">
          <span className="block text-3xl sm:text-5xl text-cyber-text mb-1">
            What are you going
          </span>
          <span className="block text-3xl sm:text-5xl gradient-text glitch">
            through right now?
          </span>
        </h1>

        <p className="text-cyber-muted text-sm sm:text-base max-w-lg leading-relaxed fade-up-d2">
          Personalised book recommendations for your exact life situation —
          curated with Nigerian availability and prices in Naira.
        </p>

        {/* Terminal prompt */}
        <div className="mt-8 flex items-center gap-2 font-mono text-xs text-cyber-muted fade-up-d3">
          <span className="text-cyber-green">›</span>
          <span>select a category to begin</span>
          <span className="inline-block w-2 h-4 bg-cyber-green cursor-blink ml-1" />
        </div>
      </div>

      {/* Categories */}
      <section className="fade-up-d4">
        <p className="section-label font-mono text-xs text-cyber-muted tracking-widest uppercase mb-5">
          categories
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {CATEGORIES.map(cat => (
            <CategoryCard key={cat.id} category={cat} />
          ))}
        </div>
      </section>

      {/* Footer */}
      <div className="mt-20 pt-6" style={{ borderTop: '1px solid rgba(37,211,102,0.1)' }}>
        <p className="font-mono text-xs text-cyber-muted">
          <span className="text-cyber-green">// </span>
          book data is human-curated &bull; prices are estimates &bull; check stores for current rates
        </p>
      </div>

    </main>
  );
}
