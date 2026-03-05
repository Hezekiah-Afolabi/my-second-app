export interface Book {
  id: string;
  title: string;
  author: string;
  coverColor: string;
  matchReason: string;
  keyTakeaways: string[];
  readingTime: string;
  difficulty: 'Easy' | 'Medium' | 'Challenging';
  bookType: 'Practical' | 'Inspirational' | 'Academic' | 'Memoir';
  nigerianAvailability: boolean;
  whereToFind: string[];
  priceRange: string;
  rating: number;
  reviewSnippet: string;
  description: string;
}

export interface Situation {
  id: string;
  title: string;
  category: CategoryId;
  emoji: string;
  books: Book[];
  relatedSituations: string[];
}

export type CategoryId =
  | 'skills-learning'
  | 'career-business'
  | 'relationships'
  | 'mental-health'
  | 'personal-growth'
  | 'spiritual-faith';

export interface CategoryInfo {
  id: CategoryId;
  name: string;
  emoji: string;
  description: string;
  gradient: string;
  bgClass: string;
  textClass: string;
  borderClass: string;
}

export type ReadingStatus = 'want-to-read' | 'reading' | 'finished';

export interface ReadingListEntry {
  bookId: string;
  situationId: string;
  bookTitle: string;
  bookAuthor: string;
  coverColor: string;
  status: ReadingStatus;
  notes: string;
  addedDate: string;
  startedDate?: string;
  finishedDate?: string;
}
