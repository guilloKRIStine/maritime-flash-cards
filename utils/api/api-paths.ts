const baseUrl = 'https://localhost:5001';

const apiPath = `${baseUrl}/api/v1`;

export const apiPaths = {
  auth: {
    login: `${apiPath}/auth/login`,
    register: `${apiPath}/auth/register`,
    isAuth: `${apiPath}/auth/is-auth`,
  },
  users: {
    byId: (id: string) => `${apiPath}/users/${id}`,
    byUserName: (userName: string) => `${apiPath}/users/${userName}`,
    updateUserName: `${apiPath}/users/update-username`,
    updatePassword: `${apiPath}/users/update-password`,
  },
  decks: {
    default: `${apiPath}/decks`,
    my: `${apiPath}/decks/my`,
    byId: (id: string) => `${apiPath}/decks/${id}`,
    updateImage: (id: string) => `${apiPath}/decks/${id}/update-image`,
    updateTags: (id: string) => `${apiPath}/decks/${id}/update-tags`,
  },
  cards: {
    default: (deckId: string) => `${apiPath}/decks/${deckId}/cards`,
    byId: (deckId: string, cardId: string) =>
      `${apiPath}/decks/${deckId}/cards/${cardId}`,
    updateImage: (deckId: string, cardId: string) =>
      `${apiPath}/decks/${deckId}/cards/${cardId}/update-image`,
  },
};
