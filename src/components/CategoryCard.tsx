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
    <Link
      to={`/category/${category.id}`}
      className="cyber-card group block rounded overflow-hidden"
    >
      {/* Gradient accent bar */}
      <div
        className="h-1 w-full"
        style={{ background: category.gradient }}
      />

      <div className="p-5">
        {/* Emoji + name */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{category.emoji}</span>
            <h3 className="font-display font-bold text-cyber-text text-sm leading-snug">
              {category.name}
            </h3>
          </div>
          <ChevronRight className="w-4 h-4 text-cyber-dim group-hover:text-cyber-green group-hover:translate-x-0.5 transition-all mt-0.5 shrink-0" />
        </div>

        <p className="text-xs text-cyber-muted leading-relaxed mb-4">{category.description}</p>

        {/* Stats */}
        <div className="flex items-center gap-3 font-mono text-xs">
          <span className="text-cyber-dim">{situations.length} situations</span>
          <span className="text-cyber-border">|</span>
          <span className="text-cyber-green">{withBooks} ready</span>
        </div>
      </div>
    </Link>
  );
}
