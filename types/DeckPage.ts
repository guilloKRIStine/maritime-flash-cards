import { Deck } from './Deck';

export type DeckPage = {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalCount: number;
  hasPrevious: boolean;
  hasNext: boolean;
  items: Deck[];
};
