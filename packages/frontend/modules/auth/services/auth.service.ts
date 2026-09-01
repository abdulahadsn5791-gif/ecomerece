import { BaseService } from '@ecomerece/frontend';
import type { AuthAdapter } from '@ecomerece/frontend/services/auth';
import type { reasonType, UserResponseReadModel } from '@ecomerece/shared';
import { storageAdapter } from '@ecomerece/frontend/storage';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
const CACHE_KEY = 'auth_user_profile';

export class AuthService extends BaseService {
  constructor(private readonly adapter: AuthAdapter) {
    super('auth-service');
  }

  // ─── Container Getters ──────────────────────────────────────────────

  private get userContainer() {
    return this.getContainer<UserResponseReadModel>('userProfile', {
      autoError: true,
      autoSuccess: true,
    });
  }

  private get loginContainer() {
    return this.getContainer('loginForm', {
      autoError: true,
      autoSuccess: false,
    });
  }

  private get signUpContainer() {
    return this.getContainer('signUpForm', {
      autoError: true,
      autoSuccess: true,
    });
  }

  // ─── Core Sync & Cache Logic ────────────────────────────────────────

  public async syncUser(forceRefresh = false): Promise<UserResponseReadModel | null> {
    const container = this.userContainer;

    // 1. Memory store check
    let user = container.getState().data;

    // 2. Storage cache check if memory is empty
    if (!user) {
      user = await storageAdapter.getItem<UserResponseReadModel>(CACHE_KEY);
      if (user) container.setData(user);
    }

    // 3. Return cache immediately (unless forced refresh)
    if (user && !forceRefresh) {
      return user;
    }

    // 4. Fetch fresh user from backend
    try {
      await this.adapter.ensureReady();
      if (!this.adapter.isSignedIn() || (await this.adapter.isExpired())) {
        await this.signOut();
        return null;
      }

      container.setLoading(true);

      const token = await this.getToken();

      // Log in to backend session
      await this.post('loginForm', `${API_URL}/users/login`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Fetch user profile
      const freshUser = await this.get<UserResponseReadModel>(
        'userProfile',
        `${API_URL}/users/me`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Save to localStorage
      await storageAdapter.setItem(CACHE_KEY, freshUser);
      return freshUser;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Auth sync failed';
      container.setError(message);
      return null;
    } finally {
      container.setLoading(false);
    }
  }

  // ─── Actions ────────────────────────────────────────────────────────

  public async signInWithGoogle(): Promise<void> {
    await this.adapter.ensureReady();
    await this.adapter.signInWithGoogle();
    await this.syncUser(true);
  }

  public async submitSignUp(): Promise<void> {
    const token = await this.getToken();
    const user = this.adapter.getClerkUser();
    if (!user) throw new Error('User not signed in');

    await this.post('signUpForm', `${API_URL}/${user.id}/signup`, {}, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  public async deleteAccount(reason: reasonType): Promise<void> {
    const token = await this.getToken();
    await this.request('DELETE', `${API_URL}/users/soft/me`, 'userProfile', { reason }, {
      headers: { Authorization: `Bearer ${token}` },
    });
    await this.signOut();
  }

  public async signOut(): Promise<void> {
    await this.adapter.ensureReady().catch(() => { });
    await this.adapter.signOut().catch(() => { });
    await storageAdapter.removeItem(CACHE_KEY);

    // Reset all container states on sign-out
    this.userContainer.reset();
    this.loginContainer.reset();
    this.signUpContainer.reset();
  }

  public async isSignedIn(): Promise<boolean> {
    await this.adapter.ensureReady();
    return this.adapter.isSignedIn();
  }

  // ─── Helper ─────────────────────────────────────────────────────────

  private async getToken(): Promise<string> {
    await this.adapter.ensureReady();
    const token = await this.adapter.getToken();
    if (!token) throw new Error('No authentication token available');
    return token;
  }
}