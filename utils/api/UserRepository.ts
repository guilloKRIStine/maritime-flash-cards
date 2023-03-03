import { User } from '~/types/User';
import { apiPaths } from './api-paths';
import { deleteCookie, getCookie, setCookie } from '~/utils/cookie-helpers';

type JwtPayload = {
  sub: string;
  unique_name: string;
  nbf: number;
  exp: number;
  iss: string;
};

export default class UserRepository {
  private static tokenCookieName = 'access_token';

  private _user: User | null = null;

  private _subscriptions: { id: number; callback: () => void }[] = [];
  private _nextSubscriptionId: number = 0;

  constructor() {
    const token = getCookie(UserRepository.tokenCookieName);
    if (!token) return;
    const jwtPayload = UserRepository.parseJwtPayload(token);
    this._updateUserInternal(jwtPayload.sub);
  }

  static addAuthorizationHeader(data: RequestInit) {
    const token = getCookie(UserRepository.tokenCookieName);
    if (token) {
      data.headers = {
        ...data.headers,
        Authorization: 'Bearer ' + token,
      };
      return true;
    }
    return false;
  }

  getUser() {
    return this._user;
  }

  isAuthenticated() {
    return !!getCookie(UserRepository.tokenCookieName);
  }

  async login(userName: string, password: string) {
    const formData = new FormData();
    formData.append('userName', userName);
    formData.append('password', password);
    const response = await fetch(apiPaths.auth.login, {
      method: 'POST',
      credentials: 'include',
      body: formData,
    });
    if (response.status === 200) {
      const respObj = await response.json();
      const payload = UserRepository.parseJwtPayload(respObj.accessToken);
      setCookie(
        UserRepository.tokenCookieName,
        respObj.accessToken,
        payload.exp - payload.nbf
      );
      await this._updateUserInternal(payload.sub);
      return true;
    }
    return false;
  }

  async register(userName: string, password: string, passwordConfirm: string) {
    const formData = new FormData();
    formData.append('userName', userName);
    formData.append('password', password);
    formData.append('passwordConfirm', passwordConfirm);
    const response = await fetch(apiPaths.auth.register, {
      method: 'POST',
      credentials: 'include',
      body: formData,
    });
    if (response.status === 200) {
      const respObj = await response.json();
      const payload = UserRepository.parseJwtPayload(respObj.accessToken);
      setCookie(
        UserRepository.tokenCookieName,
        respObj.accessToken,
        payload.exp - payload.nbf
      );
      await this._updateUserInternal(payload.sub);
      return true;
    }
    return false;
  }

  async updateUserName(userName: string) {
    if (!this._user || this._user.userName === userName) {
      return true;
    }
    const data = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json-patch+json',
      },
      body: JSON.stringify(userName),
    };
    UserRepository.addAuthorizationHeader(data);
    const response = await fetch(apiPaths.users.updateUserName, data);
    if (response.status === 204) {
      this.updateLocalUser({ ...this._user, userName });
      return true;
    }
    return false;
  }

  async updatePassword(
    oldPassword: string,
    newPassword: string,
    newPasswordConfirm: string
  ) {
    const formData = new FormData();
    formData.append('oldPassword', oldPassword);
    formData.append('newPassword', newPassword);
    formData.append('newPasswordConfirm', newPasswordConfirm);
    const body: RequestInit = {
      method: 'POST',
      body: formData,
    };
    UserRepository.addAuthorizationHeader(body);
    const response = await fetch(apiPaths.users.updatePassword, body);
    return response.status === 204;
  }

  logout() {
    deleteCookie(UserRepository.tokenCookieName);
    this.updateLocalUser(null);
  }

  updateLocalUser(user: User | null) {
    this._user = user;
    this._notifySubscribers();
  }

  subscribe(callback: () => void) {
    this._subscriptions.push({ id: this._nextSubscriptionId++, callback });
    return this._nextSubscriptionId - 1;
  }

  unsubscribe(subscriptionId: number | undefined) {
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

  private async _updateUserInternal(userId: string) {
    const response = await fetch(apiPaths.users.byId(userId));
    const user = (await response.json()) as User;
    this.updateLocalUser(user);
    return user;
  }

  private static parseJwtPayload(jwt: string): JwtPayload {
    const payloadInBase64 = jwt.split('.')[1];
    return JSON.parse(Buffer.from(payloadInBase64, 'base64').toString());
  }
}
