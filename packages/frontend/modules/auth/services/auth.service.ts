import { BaseService } from '../../../services/base.service';
import type { AuthAdapter } from '../../../services/auth';
import type { reasonType, UserResponseReadModel } from '@ecomerece/shared';

const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export class AuthService extends BaseService {
  private readonly adapter: AuthAdapter;

  constructor(adapter: AuthAdapter) {
    super('auth-service');
    this.adapter = adapter;
  }

  // ─── Container getters ──────────────────────────────
  private userContainer = () =>
    this.getContainer<UserResponseReadModel>('userProfile', {
      autoError: true,
      autoSuccess: true,
    });

  private loginContainer = () =>
    this.getContainer('loginForm', {
      autoError: true,
      autoSuccess: false,
    });

  private signUpContainer = () =>
    this.getContainer('signUpForm', {
      autoError: true,
      autoSuccess: true,
    });

  // ─── Public methods ─────────────────────────────────
  public async signInWithGoogle(): Promise<void> {
    await this.adapter.ensureReady();
    await this.adapter.signInWithGoogle();
    await this.syncUser();
  }

  private async submitLogin(): Promise<void> {
    await this.adapter.ensureReady();
    const token = await this.computeToken();
    await this.post('loginForm', `${apiUrl}/users/login`, {}, {
      headers: { Authorization: `Bearer ${token}` },
    });
    await this.fetchUserFromBackend();
    this.loginContainer().setSuccess('Login successful');

  }

  public async submitSignUp(): Promise<void> {
    await this.adapter.ensureReady();
    const token = await this.computeToken();
    const user = await this.computeClerkUser();
    await this.post('signUpForm', `${apiUrl}/${user.id}/signup`, {}, {
      headers: { Authorization: `Bearer ${token}` },
    });

  }

  public async deleteAccount(reason: reasonType): Promise<void> {
    await this.adapter.ensureReady();
    const token = await this.computeToken();
    await this.deleteWithBody(
      'userProfile',
      `${apiUrl}/users/soft/me`,
      { reason },
      { headers: { Authorization: `Bearer ${token}` } },
    );

    await this.signOut();
  }

  public async signOut(): Promise<void> {
    await this.adapter.ensureReady();
    await this.adapter.signOut();

    this.resetContainer('userProfile');
    this.resetContainer('loginForm');
    this.resetContainer('signUpForm');
    // If persistence is used, clear storage:
    // await this.clearStorage();
  }

  public async syncUser(): Promise<UserResponseReadModel | null> {
    const container = this.userContainer();
    container.setLoading(true);
    await this.adapter.ensureReady();
    const isSignedIn = this.adapter.isSignedIn();
    if (!isSignedIn) {
      container.reset();
      return null;
    }

    const expired = await this.adapter.isExpired();
    if (expired) {
      container.setError('Session expired');
      container.reset();
      return null;
    }

    const cached = container.getState().data;
    if (cached) {
      container.setData(cached);
      container.setLoading(false);
      return cached;
    }
    await this.submitLogin();
    const user = await this.fetchUserFromBackend();
    return user;
  }

  public async isSignedIn(): Promise<boolean> {
    await this.adapter.ensureReady();
    return this.adapter.isSignedIn();
  }

  private async computeClerkUser(): Promise<{ id: string; email: string; name: string }> {
    await this.adapter.ensureReady();
    const user = this.adapter.getClerkUser();
    if (!user) throw new Error('User not signed in');
    return user;
  }

  private async computeToken(): Promise<string> {
    await this.adapter.ensureReady();
    const token = await this.adapter.getToken();
    if (!token) throw new Error('No authentication token available');
    return token;
  }

  private async fetchUserFromBackend(): Promise<UserResponseReadModel> {
    await this.adapter.ensureReady();
    const token = await this.computeToken();
    return this.get('userProfile', `${apiUrl}/users/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }
}