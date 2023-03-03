import { Card } from '~/types/Card';
import { apiPaths } from './api-paths';
import UserRepository from './UserRepository';
import CardPatcher from './CardPatcher';

export default class CardsRepository {
  private _cards = new Map<string, Map<string, Card>>();

  private _nextUpdateCardsDates: Map<string, number> = new Map<
    string,
    number
  >();

  private _subscriptions: { id: number; callback: () => void }[] = [];
  private _nextSubscriptionId: number = 0;

  async getCardFromDeck(deckId: string, cardId: string) {
    const card = this._cards.get(deckId)?.get(cardId);
    if (card) {
      return card;
    }
    const response = await fetch(apiPaths.cards.byId(deckId, cardId));
    if (response.status === 200) {
      return (await response.json()) as Card;
    }
    return undefined;
  }

  async getCardsFromDeck(deckId: string) {
    if (
      !this._nextUpdateCardsDates.has(deckId) ||
      Date.now() > this._nextUpdateCardsDates.get(deckId)!
    ) {
      this._nextUpdateCardsDates.set(deckId, Date.now() + 1000 * 60 * 4);
      this._cards.delete(deckId);
    }

    if (this._cards.has(deckId)) {
      const cards: Card[] = [];
      this._cards.get(deckId)!.forEach((card) => cards.push(card));
      return cards;
    }

    const response = await fetch(apiPaths.cards.default(deckId));
    if (response.status === 200) {
      const cards = (await response.json()) as Card[];
      const mapCards = new Map<string, Card>();
      cards.forEach((c) => mapCards.set(c.id, c));
      this._cards.set(deckId, mapCards);
      return cards;
    }
    return [];
  }

  async sendAnswerToCard(deckId: string, cardId: string, isRight: boolean) {
    const body = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(isRight),
    };
    UserRepository.addAuthorizationHeader(body);
    const response = await fetch(apiPaths.cards.byId(deckId, cardId), body);
    if (response.status === 200 && this._cards.has(deckId)) {
      const card = (await response.json()) as Card;
      this._cards.get(deckId)!.set(card.id, card);
    }
  }

  async addCardInDeck(deckId: string, card: Card, img?: File) {
    const formData = new FormData();
    formData.append('question', card.question);
    formData.append('answer', card.answer);
    if (img) {
      formData.append('image', img, img.name);
    }
    const body = {
      method: 'POST',
      body: formData,
    };
    UserRepository.addAuthorizationHeader(body);
    const response = await fetch(apiPaths.cards.default(deckId), body);
    if (response.status === 201 && this._cards.has(deckId)) {
      const newCard = (await response.json()) as Card;
      this._cards.get(deckId)!.set(newCard.id, newCard);
      this._notifySubscribers();
    }
  }

  async updateCardInDeck(deckId: string, card: Card, img?: File) {
    const oldCard = await this.getCardFromDeck(deckId, card.id);
    if (!oldCard) {
      return;
    }

    if (this._cards.has(deckId)) {
      this._cards.get(deckId)!.set(card.id, card);
      this._notifySubscribers();
    }

    await this._updateCard(deckId, card, oldCard);
    await this._updateCardImage(deckId, card, oldCard, img);
  }

  async removeCardFromDeck(deckId: string, cardId: string) {
    this._cards.get(deckId)?.delete(cardId);
    this._notifySubscribers();

    const body = { method: 'DELETE' };
    UserRepository.addAuthorizationHeader(body);
    await fetch(apiPaths.cards.byId(deckId, cardId), body);
  }

  resetLocalRepository() {
    this._cards.clear();
    this._nextUpdateCardsDates.clear();
  }

  containsDeck(deckId: string) {
    return (
      this._nextUpdateCardsDates.has(deckId) &&
      Date.now() < this._nextUpdateCardsDates.get(deckId)!
    );
  }

  subscribe(callback: () => void) {
    this._subscriptions.push({ id: this._nextSubscriptionId++, callback });
    return this._nextSubscriptionId - 1;
  }

  unsubscribe(subscriptionId: number) {
    const subscriptions = this._subscriptions.filter(
      (e) => e.id !== subscriptionId
    );
    if (this._subscriptions.length === subscriptions.length) {
      throw new Error(`Invalid subscription ID - ${subscriptionId}`);
    }
    this._subscriptions = subscriptions;
  }

  private _notifySubscribers() {
    this._subscriptions.forEach((s) => s.callback());
  }

  private async _updateCard(deckId: string, card: Card, oldCard: Card) {
    const patchBuilder = new CardPatcher();
    if (oldCard.answer !== card.answer) {
      patchBuilder.patchAnswer(card.answer);
    }
    if (oldCard.question !== card.question) {
      patchBuilder.patchQuestion(card.question);
    }
    const data = patchBuilder.build();
    if (data.length === 0) {
      return false;
    }
    const body: RequestInit = {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json-patch+json',
      },
      body: JSON.stringify(data),
    };
    UserRepository.addAuthorizationHeader(body);
    const response = await fetch(apiPaths.cards.byId(deckId, card.id), body);
    return response.status === 204;
  }

  private async _updateCardImage(
    deckId: string,
    card: Card,
    oldCard: Card,
    img?: File
  ) {
    if (!img || oldCard.imagePath === card.imagePath) {
      return false;
    }
    const formData = new FormData();
    formData.append('image', img, img.name);
    const body = {
      method: 'POST',
      body: formData,
    };
    UserRepository.addAuthorizationHeader(body);
    const response = await fetch(
      apiPaths.cards.updateImage(deckId, card.id),
      body
    );
    return response.status === 204;
  }
}
