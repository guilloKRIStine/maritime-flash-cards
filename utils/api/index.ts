import CardsRepository from './CardsRepository';
import DecksRepository from './DecksRepository';
import UserRepository from './UserRepository';

export default {
  cards: new CardsRepository(),
  decks: new DecksRepository(),
  user: new UserRepository(),
};
