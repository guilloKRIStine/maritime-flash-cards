export type Card = {
  id: string;
  question: string;
  answer: string;
  imagePath?: string;
  timeToRepeat: Record<string, Date>;
};

export const createEmptyCard = (): Card => {
  return {
    id: '',
    question: '',
    answer: '',
    timeToRepeat: {},
  };
};
