export type Deck = {
  id: string;
  authorId: string;
  name: string;
  description: string;
  imagePath: string;
  tags: string[];
  cardsCount: number;
  cardsCountStudied: Record<string, number>;
};

export const createEmptyDeck = (): Deck => {
  return {
    id: '',
    authorId: '',
    name: '',
    description: '',
    imagePath: '',
    tags: [],
    cardsCount: 0,
    cardsCountStudied: {},
  };
};
