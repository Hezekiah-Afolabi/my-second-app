import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import type { CategoryInfo } from '../types';
import { getSituationsByCategory } from '../data/situations';

interface CategoryCardProps {
  category: CategoryInfo;
}

export default function CategoryCard({ category }: CategoryCardProps) {
  const situations = getSituationsByCategory(category.id);
  const withBooks = situations.filter(s => s.books.length > 0).length;

  return (
    <Link to={`/category/${category.id}`} className="cyber-card group block rounded">
      {/* Gradient accent bar */}
      <div className="h-0.5 w-full rounded-t" style={{ background: category.gradient }} />

      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{category.emoji}</span>
            <h3 className="font-display font-bold text-cyber-text text-sm leading-snug tracking-wide">
              {category.name}
            </h3>
          </div>
          <ChevronRight className="w-4 h-4 text-cyber-muted group-hover:text-cyber-green group-hover:translate-x-1 transition-all mt-0.5 shrink-0" />
        </div>

        <p className="text-xs text-cyber-muted leading-relaxed mb-4">{category.description}</p>

        <div className="flex items-center gap-3 font-mono text-xs">
          <span className="text-cyber-muted">{situations.length} situations</span>
          <span style={{ color: 'rgba(37,211,102,0.3)' }}>|</span>
          <span className="text-cyber-green">{withBooks} ready</span>
        </div>
      </div>
    </Link>
  );
}
