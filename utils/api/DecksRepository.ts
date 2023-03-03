import { Deck } from '~/types/Deck';
import { DeckPage } from '~/types/DeckPage';
import api from '.';
import DeckPatcher from './DeckPatcher';
import UserRepository from './UserRepository';
import { apiPaths } from './api-paths';

export default class DecksRepository {
  private _pages = new Map<string, DeckPage>();
  private _myDecks = new Map<string, Deck>();

  private _nextUpdatePagesDate = Date.now();
  private _nextUpdateMyDecksDate = Date.now();

  private _subscriptions: { id: number; callback: () => void }[] = [];
  private _nextSubscriptionId: number = 0;

  async getDeck(id: string) {
    const deck = this._myDecks.get(id);
    if (deck) {
      return deck;
    }
    const response = await fetch(apiPaths.decks.byId(id));
    if (response.status === 200) {
      return (await response.json()) as Deck;
    }
    return undefined;
  }

  async getDecksPage(
    pageNumber: number,
    pageSize: number,
    otherQueryParams: string = ''
  ) {
    const mapKey = `?pageNumber=${pageNumber}&pageSize=${pageSize}&${otherQueryParams}`;

    if (Date.now() > this._nextUpdatePagesDate) {
      this._nextUpdatePagesDate = Date.now() + 1000 * 60 * 2;
      this._pages.clear();
    }

    if (this._pages.has(mapKey)) {
      return this._pages.get(mapKey);
    }

    const response = await fetch(apiPaths.decks.default + mapKey);

    if (response.status === 200) {
      const page = (await response.json()) as DeckPage;
      this._pages.set(mapKey, page);
      return page;
    }
    return undefined;
  }

  async getMyDecks() {
    if (Date.now() > this._nextUpdateMyDecksDate) {
      this._nextUpdateMyDecksDate = Date.now() + 1000 * 60 * 4;
      this._myDecks.clear();
    }

    if (this._myDecks.size > 0) {
      const decks: Deck[] = [];
      this._myDecks.forEach((d) => decks.push(d));
      return decks;
    }

    const body = {};
    UserRepository.addAuthorizationHeader(body);
    const response = await fetch(apiPaths.decks.my, body);

    if (response.status === 200) {
      const decks = (await response.json()) as Deck[];
      decks.forEach((d) => this._myDecks.set(d.id, d));
      return decks;
    }
    return [];
  }

  async addDeck(deck: Deck, img?: File) {
    const formData = new FormData();
    formData.append('name', deck.name);
    formData.append('description', deck.description);
    deck.tags.forEach((tag) => formData.append('tags[]', tag));
    if (img) {
      formData.append('image', img, img.name);
    }
    const data = {
      method: 'POST',
      body: formData,
    };
    UserRepository.addAuthorizationHeader(data);
    const response = await fetch(apiPaths.decks.default, data);
    if (response.status === 201) {
      const newDeck = (await response.json()) as Deck;
      if (this._myDecks.size !== 0) {
        this._myDecks.set(newDeck.id, newDeck);
      }
      const user = api.user.getUser();
      if (user) {
        api.user.updateLocalUser({
          ...user,
          deckIds: [...user.deckIds, newDeck.id],
        });
      }
      this._notifySubscribers();
    }
  }

  async updateDeck(deck: Deck, img?: File) {
    const oldDeck = await this.getDeck(deck.id);
    if (!oldDeck) {
      return;
    }

    if (this._myDecks.size !== 0) {
      this._myDecks.set(deck.id, deck);
    }
    this._notifySubscribers();

    await this._updateDeck(deck, oldDeck);
    await this._updateDeckTags(deck, oldDeck);
    await this._updateDeckImage(deck, oldDeck, img);
  }

  async removeDeck(deckId: string) {
    const user = api.user.getUser();
    if (user) {
      api.user.updateLocalUser({
        ...user,
        deckIds: user.deckIds.filter((i) => i !== deckId),
      });
    }
    this._myDecks.delete(deckId);
    this._notifySubscribers();

    const body = {
      method: 'DELETE',
    };
    UserRepository.addAuthorizationHeader(body);
    await fetch(apiPaths.decks.byId(deckId), body);
  }

  resetLocalRepository() {
    this._pages.clear();
    this._myDecks.clear();
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
    this._pages.clear();
    this._subscriptions.forEach((s) => s.callback());
  }

  private async _updateDeck(deck: Deck, oldDeck: Deck) {
    const patchBuilder = new DeckPatcher();
    if (oldDeck.name !== deck.name) {
      patchBuilder.patchName(deck.name);
    }
    if (oldDeck.description !== deck.description) {
      patchBuilder.patchDescription(deck.description);
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
    const response = await fetch(apiPaths.decks.byId(deck.id), body);
    return response.status === 204;
  }

  private async _updateDeckTags(deck: Deck, oldDeck: Deck) {
    if (oldDeck.tags === deck.tags) {
      return false;
    }
    const body: RequestInit = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json-patch+json',
      },
      body: JSON.stringify(deck.tags),
    };
    UserRepository.addAuthorizationHeader(body);
    const response = await fetch(apiPaths.decks.updateTags(deck.id), body);
    return response.status === 204;
  }

  private async _updateDeckImage(deck: Deck, oldDeck: Deck, img?: File) {
    if (!img || oldDeck.imagePath === deck.imagePath) {
      return false;
    }
    const formData = new FormData();
    formData.append('image', img, img.name);
    const body = {
      method: 'POST',
      body: formData,
    };
    UserRepository.addAuthorizationHeader(body);
    const response = await fetch(apiPaths.decks.updateImage(deck.id), body);
    return response.status === 204;
  }
}
